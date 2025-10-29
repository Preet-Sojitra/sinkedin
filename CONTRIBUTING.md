# Contributing to Sinkedin

First off, thank you for considering contributing! It's people like you that make this project a great tool.

This document provides guidelines for contributing to the project. Please feel free to propose changes to this document in a pull request.

## Table of Contents

- [Contributing to Sinkedin](#contributing-to-sinkedin)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [Communication](#communication)
  - [How Can I Contribute?](#how-can-i-contribute)
    - [Reporting Bugs](#reporting-bugs)
    - [Suggesting Enhancements](#suggesting-enhancements)
  - [Development Workflow](#development-workflow)
    - [Branching Strategy](#branching-strategy)
    - [Commit Message Conventions](#commit-message-conventions)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](LINK_TO_YOUR_CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Communication

The best way to discuss features, ask questions, and connect with the team is through our official Discord server.

[![Join our Discord](https://img.shields.io/badge/join-5865F2?logo=discord&logoColor=white&label=Join%20our%20Discord)](https://discord.gg/jaD2upCxhB)

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please ensure the bug was not already reported by searching on GitHub under [Issues](https://github.com/Preet-Sojitra/sinkedin/issues). If you're unable to find an open issue addressing the problem, open a new one.

### Suggesting Enhancements

If you have an idea for an enhancement, please open an issue to discuss the feature before you begin working on it. This allows us to align on the approach and ensure it fits the project's roadmap.

## Development Workflow

Before you start, please make sure you have followed the [Local Development Setup instructions in our README.md](./README.md).

### Branching Strategy

We use a `staging`-based workflow. All development happens on feature branches which are then merged into `staging`. The `main` branch is reserved for production-ready code and is only updated by project maintainers.

1.  **Fork** the repository on GitHub.
2.  **Clone** your fork locally: `git clone https://github.com/your-username/your-repository.git`
3.  **Checkout the `staging` branch**: `git checkout staging`
4.  **Pull the latest changes**: `git pull upstream staging`
5.  **Create a feature branch**: `git checkout -b feat/your-descriptive-feature-name` (or `fix/your-bug-fix`)
6.  Make your changes and commit them.
7.  Push your branch to your fork: `git push origin feat/your-descriptive-feature-name`
8.  Open a pull request from your feature branch to the original repository's `staging` branch.

### Commit Message Conventions

We follow the **Conventional Commits** specification. This helps us generate automated changelogs and makes the commit history easy to read. Each commit message consists of a **header**, a **body**, and a **footer**.

The **header** has a special format that includes a **type**, a **scope** (optional), and a **subject**:

```
<type>(<scope>): <subject>
```

**Common types:**

- `feat`: A new feature
- `fix`: A bug fix
  -. `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

**Example Commits:**

```
feat(auth): add google oauth provider
fix(ui): correct button alignment on mobile
docs(readme): update setup instructions
chore(deps): upgrade nextjs to version 14.1.0
```
