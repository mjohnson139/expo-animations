# GitHub CLI Usage Instructions

This document provides instructions for using the GitHub CLI (`gh`) to perform common tasks in this repository.

## Prerequisites
- Ensure you have the [GitHub CLI](https://cli.github.com/) installed.
- Authenticate with your GitHub account using:
  ```bash
  gh auth login
  ```

## Creating Issues
To create a new issue with a title and optional body:
```bash
gh issue create --title "Your issue title here" --body "Optional issue description."
```
Example:
```bash
gh issue create --title "Research creating issues with coding agent." --body "Investigate how to automate issue creation using the GitHub CLI."
```

## Checking Out Pull Requests
To check out a pull request locally:
```bash
gh pr checkout <pr-number>
```
Example:
```bash
gh pr checkout 42
```

## Listing Issues and Pull Requests
List open issues:
```bash
gh issue list
```
List open pull requests:
```bash
gh pr list
```

## Additional Resources
- [GitHub CLI Documentation](https://cli.github.com/manual/)

---
For more advanced usage, refer to the official documentation or run `gh help` in your terminal.
