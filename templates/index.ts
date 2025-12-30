import { install } from "../helpers/install";
import { copy } from "../helpers/copy";

import os from "os";
import fs from "fs/promises";
import path from "path";
import { cyan, bold } from "picocolors";

import { GetTemplateFileArgs, InstallTemplateArgs } from "../types";

/**
 * Get the file path for a given file in a template, e.g. "next.config.js".
 */
export const getTemplateFile = ({
    template,
    mode,
    file,
}: GetTemplateFileArgs): string => {
    return path.join(__dirname, template, mode, file);
};


/**
 * Install a Next.js internal template to a given `root` directory.
 */
export const installTemplate = async ({
    appName,
    root,
    packageManager,
    isOnline,
    tailwind,
    eslint,
    srcDir,
    importAlias,
    apiClient,
    skipInstall,
}: InstallTemplateArgs) => {
    console.log(bold(`Using ${packageManager}.`));

    /**
     * Copy the base template files to the target directory.
     */
    console.log("\nInitializing project with base template\n");
    const templatePath = path.join(__dirname, "base");
    const copySource = ["**"];

    await copy(copySource, root, {
        parents: true,
        cwd: templatePath,
        rename(name) {
            switch (name) {
                case "gitignore": {
                    return `.${name}`;
                }
                case "README-template.md": {
                    return "README.md";
                }
                default: {
                    return name;
                }
            }
        },
    });

    // Base template already has the correct structure, no modifications needed
    // Base template already has package.json, just update the name
    const packageJsonPath = path.join(root, "package.json");
    const existingPackageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));

    existingPackageJson.name = appName;

    await fs.writeFile(
        packageJsonPath,
        JSON.stringify(existingPackageJson, null, 2) + os.EOL,
    );

    if (apiClient) {
        console.log(`\nConfiguring ${apiClient} with standard folder structure...`);
        const libDir = path.join(root, "src", "lib");
        const servicesDir = path.join(root, "src", "services");
        const hooksDir = path.join(root, "src", "hooks", "api");
        const providersDir = path.join(root, "src", "providers");

        await fs.mkdir(libDir, { recursive: true });
        await fs.mkdir(servicesDir, { recursive: true });

        const optionalTemplatesPath = path.join(__dirname, "optional", "api-clients");

        switch (apiClient) {
            case "axios": {
                // Client
                const clientContent = await fs.readFile(path.join(optionalTemplatesPath, "axios-setup.ts"), "utf8");
                await fs.writeFile(path.join(libDir, "api-client.ts"), clientContent);

                // Service Example
                const serviceContent = await fs.readFile(path.join(optionalTemplatesPath, "example-service.ts"), "utf8");
                await fs.writeFile(path.join(servicesDir, "user-service.ts"), serviceContent);

                existingPackageJson.dependencies["axios"] = "^1.7.0";
                break;
            }
            case "react-query": {
                // Base Client (needs axios for the example-service)
                const clientContent = await fs.readFile(path.join(optionalTemplatesPath, "axios-setup.ts"), "utf8");
                await fs.writeFile(path.join(libDir, "api-client.ts"), clientContent);

                // Provider
                await fs.mkdir(providersDir, { recursive: true });
                const providerContent = await fs.readFile(path.join(optionalTemplatesPath, "react-query-setup.tsx"), "utf8");
                await fs.writeFile(path.join(providersDir, "query-provider.tsx"), providerContent);

                // Service
                const serviceContent = await fs.readFile(path.join(optionalTemplatesPath, "example-service.ts"), "utf8");
                await fs.writeFile(path.join(servicesDir, "user-service.ts"), serviceContent);

                // Hooks
                await fs.mkdir(hooksDir, { recursive: true });
                const hookContent = await fs.readFile(path.join(optionalTemplatesPath, "example-hook.ts"), "utf8");
                await fs.writeFile(path.join(hooksDir, "use-users.ts"), hookContent);

                existingPackageJson.dependencies["axios"] = "^1.7.0";
                existingPackageJson.dependencies["@tanstack/react-query"] = "^5.0.0";
                existingPackageJson.dependencies["@tanstack/react-query-devtools"] = "^5.0.0";
                break;
            }
            case "graphql": {
                // Client
                const clientContent = await fs.readFile(path.join(optionalTemplatesPath, "graphql-setup.ts"), "utf8");
                await fs.writeFile(path.join(libDir, "apollo-client.ts"), clientContent);

                existingPackageJson.dependencies["@apollo/client"] = "^3.10.0";
                existingPackageJson.dependencies["graphql"] = "^16.8.0";
                break;
            }
        }

        // Save updated package.json with new dependencies
        await fs.writeFile(
            packageJsonPath,
            JSON.stringify(existingPackageJson, null, 2) + os.EOL,
        );
    }

    // Update docker compose image names to include the project name
    const composeTargets: Array<{ env: string; file: string }> = [
        { env: "development", file: path.join(root, "docker", "development", "compose.yaml") },
        { env: "production", file: path.join(root, "docker", "production", "compose.yaml") },
    ];

    await Promise.all(
        composeTargets.map(async ({ env, file }) => {
            try {
                const contents = await fs.readFile(file, "utf8");
                const updated = contents.replace(/^(\s*image:\s*).+$/m, `$1${appName}-${env}`);
                if (updated !== contents) {
                    await fs.writeFile(file, updated);
                }
            } catch {
                // If a compose file doesn't exist, skip silently
                // preserving the techpix as default
            }
        })
    );

    if (skipInstall) return;

    console.log("\nInstalling dependencies:");
    for (const dependency in existingPackageJson.dependencies)
        console.log(`- ${cyan(dependency)}`);

    if (existingPackageJson.devDependencies) {
        console.log("\nInstalling devDependencies:");
        for (const dependency in existingPackageJson.devDependencies)
            console.log(`- ${cyan(dependency)}`);
    }

    console.log();

    await install(packageManager, isOnline);
};

export * from "../types";