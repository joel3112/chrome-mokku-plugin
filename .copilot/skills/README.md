# Copilot Skills

This folder contains reusable workflows and procedures for Copilot to automate common tasks in the Mokku project.

## Available Skills

### release.md
Automates the release process for new versions:
- Updates version in package.json and manifest files
- Builds the project
- Generates mokku.zip
- Creates a git commit with proper trailers

**Usage:** "Haz un release con la versión X.X.X"

---

Add new skills as markdown files in this folder following the same pattern as `release.md`.
