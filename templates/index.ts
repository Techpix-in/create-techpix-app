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