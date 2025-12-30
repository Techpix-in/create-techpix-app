/* eslint-disable import/no-extraneous-dependencies */
import { existsSync, mkdirSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { cyan, green, red } from "picocolors";
import type { PackageManager } from "./helpers/get-pkg-manager";
import { tryGitInit } from "./helpers/git";
import { isFolderEmpty } from "./helpers/is-folder-empty";
import { getOnline } from "./helpers/is-online";
import { isWriteable } from "./helpers/is-writeable";

import type { TemplateMode, TemplateType } from "./types";
import { installTemplate } from "./templates";
import { ProjectRollback } from "./helpers/rollback";

export async function createApp({
  appPath,
  packageManager,
  typescript,
  tailwind,
  eslint,
  app,
  srcDir,
  importAlias,
  skipInstall,
  empty,
  turbopack,
  disableGit,
  apiClient,
}: {
  appPath: string;
  packageManager: PackageManager;
  typescript: boolean;
  tailwind: boolean;
  eslint: boolean;
  app: boolean;
  srcDir: boolean;
  importAlias: string;
  skipInstall: boolean;
  empty: boolean;
  turbopack: boolean;
  disableGit?: boolean;
  apiClient: import("./types").ApiClientType;
}): Promise<void> {
  // Use base template from templates/base
  const mode: TemplateMode = "ts";
  const template: TemplateType = "app-tw";

  // No example handling - use base template only

  const root = resolve(appPath);

  if (!(await isWriteable(dirname(root)))) {
    console.error(
      "The application path is not writable, please check folder permissions and try again."
    );
    console.error("It is likely you do not have write permissions for this folder.");
    process.exit(1);
  }

  const appName = basename(root);
  const rollbackManager = new ProjectRollback();

  try {
    if (!existsSync(root)) {
      mkdirSync(root, { recursive: true });
      rollbackManager.trackDir(root);
    }

    if (!isFolderEmpty(root, appName)) {
      process.exit(1);
    }

    const useYarn = packageManager === "yarn";
    const isOnline = !useYarn || (await getOnline());
    const originalDirectory = process.cwd();

    console.log(`Creating a new Next.js app in ${green(root)}.`);
    console.log();

    process.chdir(root);

    await installTemplate({
      appName,
      root,
      template,
      mode,
      packageManager,
      isOnline,
      tailwind,
      eslint,
      biome: false,
      srcDir,
      importAlias,
      skipInstall,
      turbopack,
      rspack: false,
      apiClient,
    });

    if (disableGit) {
      console.log("Skipping git initialization.");
      console.log();
    } else if (tryGitInit(root)) {
      console.log("Initialized a git repository.");
      console.log();
    }

    let cdpath: string;
    if (resolve(originalDirectory, appName) === root) {
      cdpath = appName;
    } else {
      cdpath = appPath;
    }

    console.log(`${green("Success!")} Created ${appName} at ${appPath}`);
    console.log();
    console.log("Inside that directory, you can run several commands:");
    console.log();
    console.log(cyan(`  ${packageManager} ${useYarn ? "" : "run "}dev`));
    console.log("    Starts the development server.");
    console.log();
    console.log(cyan(`  ${packageManager} ${useYarn ? "" : "run "}build`));
    console.log("    Builds the app for production.");
    console.log();
    console.log(cyan(`  ${packageManager} start`));
    console.log("    Runs the built app in production mode.");
    console.log();
    console.log("We suggest that you begin by typing:");
    console.log();
    console.log(cyan("  cd"), cdpath);
    console.log(`  ${cyan(`${packageManager} ${useYarn ? "" : "run "}dev`)}`);
    console.log();
  } catch (error) {
    await rollbackManager.rollback();
    throw error;
  }
}
