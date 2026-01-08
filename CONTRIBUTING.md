# Contributing to Create Techpix App

First off, thank you for considering contributing to Create Techpix App! It's people like you who make it such a great tool.

## How Can I Contribute?

### Reporting Bugs
- **Check for existing issues**: Before opening a new issue, please search the [issues tracker](https://github.com/Techpix-in/create-techpix-app/issues) to see if the problem has already been reported.
- **Provide a clear description**: Include steps to reproduce the bug, the expected behavior, and what actually happened.
- **System information**: Mention your Node.js version, OS, and any relevant logs.

### Feature Requests
- **Open an issue**: Use the issue tracker to suggest new features or enhancements.
- **Explain the "Why"**: Describe the use case and why this feature would be beneficial to the project.

### Pull Requests
1. **Fork the repository** and create your branch from `main`.
2. **Install dependencies**: Run `npm install`.
3. **Make your changes**: Ensure your code follows the project's style and patterns.
4. **Lint and Format**: Run `npx @biomejs/biome check --apply .` to ensure your code matches the project's standards.
5. **Test your changes**: Verify that your changes work as expected.
6. **Commit your changes**: Use [Conventional Commits](https://www.conventionalcommits.org/) for your commit messages.
7. **Submit the PR**: Provide a clear description of what your PR handles.

## Development Setup

To get started with local development:

```bash
# Clone the repository
git clone https://github.com/Techpix-in/create-techpix-app.git
cd create-techpix-app

# Install dependencies
npm install

# Run in development mode (watches for changes)
npm run dev

# Build the project
npm run build
```

## Coding Standards

- **TypeScript**: Use TypeScript for all logic. Ensure types are clearly defined.
- **Biome**: We use Biome for linting and formatting. Please ensure your editor is configured to use Biome or run the check command before submitting.
- **Consistency**: Follow the existing code style and architecture (e.g., helpers in `helpers/`, templates in `templates/`).
- **No JSDoc**: Avoid JSDoc comments unless explicitly necessary for complex logic. Use descriptive names instead.

## License
By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
