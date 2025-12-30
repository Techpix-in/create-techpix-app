#!/usr/bin/env node
import { existsSync } from "node:fs";
import { basename, resolve } from "node:path";
/* eslint-disable import/no-extraneous-dependencies */
import { Command } from "commander";
import { bold, cyan, green, red, yellow } from "picocolors";
import prompts from "prompts";
import updateCheck from "update-check";
import { createApp } from "./create-app";
import type { PackageManager } from "./helpers/get-pkg-manager";
import { getPkgManager } from "./helpers/get-pkg-manager";
import { isFolderEmpty } from "./helpers/is-folder-empty";
import { validateNpmName } from "./helpers/validate-pkg";
import { ValidationError } from "./helpers/validation-error";
import packageJson from "./package.json";
import type { ApiClientType } from "./types";

let projectPath: string = "";

const handleSigTerm = () => process.exit(0);

process.on("SIGINT", handleSigTerm);
process.on("SIGTERM", handleSigTerm);

const _program = new Command(packageJson.name)
	.version(
		packageJson.version,
		"-v, --version",
		"Output the current version of create-techpix-app.",
	)
	.argument("[directory]")
	.usage("[directory]")
	.action((name) => {
		if (name) {
			projectPath = name;
		}
	})
	.parse(process.argv);

const packageManager: PackageManager = getPkgManager();

function checkNodeVersion() {
	const [major] = process.versions.node.split(".").map(Number);
	if (major < 18) {
		throw new ValidationError(
			`Node.js version ${process.versions.node} is not supported.`,
			"nodeVersion",
			"Please upgrade to Node.js 18 or higher.",
		);
	}
}

async function run(): Promise<void> {
	try {
		checkNodeVersion();
		if (typeof projectPath === "string") {
			projectPath = projectPath.trim();
		}

		if (!projectPath) {
			console.log(
				"\nPlease specify the project directory:\n" +
					`  ${cyan(packageJson.name)} ${green("<project-directory>")}\n` +
					"For example:\n" +
					`  ${cyan(packageJson.name)} ${green("my-techpix-app")}\n\n`,
			);
			process.exit(1);
		}

		const appPath = resolve(projectPath);
		const appName = basename(appPath);

		const validation = validateNpmName(appName);
		if (!validation.valid) {
			throw new ValidationError(
				`Invalid project name: ${appName}`,
				"projectName",
				validation.problems[0],
			);
		}

		if (existsSync(appPath) && !isFolderEmpty(appPath, appName)) {
			process.exit(1);
		}

		const res = await prompts({
			type: "select",
			name: "apiClient",
			message: "Which API client would you like to use?",
			choices: [
				{ title: "None", value: null },
				{ title: "Axios", value: "axios" },
				{ title: "React Query", value: "react-query" },
				{ title: "GraphQL (Apollo)", value: "graphql" },
			],
			initial: 0,
		});

		const apiClient: ApiClientType = res.apiClient;

		// Use base template with default settings
		await createApp({
			appPath,
			packageManager,
			tailwind: true,
			eslint: true,
			srcDir: true,
			importAlias: "@/*",
			skipInstall: false,
			turbopack: true,
			disableGit: false,
			apiClient,
		});
	} catch (error) {
		await exit(error);
	}
}

const update = updateCheck(packageJson).catch(() => null);

async function notifyUpdate(): Promise<void> {
	try {
		if ((await update)?.latest) {
			const global = {
				npm: "npm i -g",
				yarn: "yarn global add",
				pnpm: "pnpm add -g",
				bun: "bun add -g",
			};
			const updateMessage = `${global[packageManager]} create-techpix-app`;
			console.log(
				yellow(bold("A new version of `create-techpix-app` is available!")) +
					"\n" +
					"You can update by running: " +
					cyan(updateMessage) +
					"\n",
			);
		}
	} catch {
		// ignore error
	}
}

async function exit(reason: unknown) {
	console.log();
	if (reason instanceof ValidationError) {
		console.log(reason.format());
	} else if (
		reason &&
		typeof reason === "object" &&
		"command" in reason &&
		typeof (reason as { command: unknown }).command === "string"
	) {
		console.log(
			`  ${cyan((reason as { command: string }).command)} has failed.`,
		);
	} else {
		console.log(
			`${red("Unexpected error. Please report it as a bug:")}\n`,
			reason,
		);
	}
	console.log("\nAborting installation.");
	console.log();
	await notifyUpdate();
	process.exit(1);
}

run().then(notifyUpdate);
