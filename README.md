<div align="center">
  <h1>Create Techpix App</h1>
<a href="https://www.npmjs.com/package/next"><img alt="NPM version" src="https://img.shields.io/npm/v/next.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://github.com/vercel/next.js/blob/canary/license.md"><img alt="License" src="https://img.shields.io/npm/l/next.svg?style=for-the-badge&labelColor=000000"></a>
</div>
<br/>
The easiest way to get started with Techpix projects is by using create-techpix-app. This CLI tool enables you to quickly scaffold a new application by cloning one of the pre-configured boilerplates from a curated list of templates designed to follow Techpix's code conventions and project architecture.

## Features

- **Next.js App Router (15+) with TypeScript**: Opinionated setup with `src/`, `app/`, and `layout`.
- **Tailwind CSS pre-configured**: `postcss.config.mjs`, `tailwind` plugins, and `globals.css` ready.
- **Shadcn/UI components included**: `button`, `badge`, `card`, `checkbox`, `dialog`, `input`, `label`, `pagination`, `radio-group`, `select`, `slider`, `switch`, `table`, `textarea`, and `sonner` toast wiring.
- **ESLint config and TS config**: Template ships with `eslint.config.mjs` and `tsconfig.json` aligned to Next.js.
- **Optional API Clients**: Pre-configured scaffolding for **Axios**, **React Query**, or **GraphQL**.
- **Project Rollback**: Robust failure handling that cleans up the workspace if app creation is interrupted.
- **Docker-first, multi-env setup**:
    - `docker/development`, `docker/production` with multi-stage Dockerfiles.
    - Per-env `compose.yaml` files.
    - **Image names auto-include project name** during scaffolding (e.g. `my-app-development`).
- **Next.js standalone output**: Production images leverage `.next/standalone` for smaller containers.
- **Ready-made routes and structure**: `auth/` route, `(main)/` group, example page and component folder.
- **Commit Quality Tooling**: Husky, lint-staged, and conventional commits via `commitlint.config.ts`.
- **Utilities and libs**: `lib/utils.ts` and shared UI primitives for rapid development.
- **Public assets**: Starter icons and images in `public/`.

## Project Structure

```text
my-app/
├─ docker/
│  ├─ development/
│  │  ├─ Dockerfile
│  │  └─ compose.yaml              # image: my-app-development
│  └─ production/
│     ├─ Dockerfile
│     └─ compose.yaml              # image: my-app-production
├─ public/
│  ├─ techpix.png
│  └─ ...
├─ src/
│  ├─ app/
│  │  ├─ (main)/
│  │  │  ├─ example_route/
│  │  │  │  ├─ _compnents/
│  │  │  │  │  └─ component.tsx
│  │  │  │  └─ page.tsx
│  │  │  └─ page.tsx
│  │  ├─ auth/
│  │  │  └─ page.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  └─ layout.tsx
│  ├─ components/
│  │  └─ ui/
│  │     ├─ badge.tsx
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ checkbox.tsx
│  │     ├─ dialog.tsx
│  │     ├─ input.tsx
│  │     ├─ label.tsx
│  │     ├─ pagination.tsx
│  │     ├─ radio-group.tsx
│  │     ├─ select.tsx
│  │     ├─ slider.tsx
│  │     ├─ sonner.tsx
│  │     ├─ switch.tsx
│  │     ├─ table.tsx
│  │     └─ textarea.tsx
│  └─ lib/
│     └─ utils.ts
├─ commitlint.config.ts
├─ components.json
├─ .eslintrc / eslint.config.mjs
├─ next.config.ts
├─ Makefile
├─ package.json
├─ postcss.config.mjs
└─ tsconfig.json
```

### Interactive

You can create a new project interactively by running:

```bash
npx create-techpix-app
# or
yarn create techpix-app
# or
pnpm create techpix-app
```

