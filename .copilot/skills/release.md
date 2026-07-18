# Mokku Release Workflow

## Purpose
This document defines the release process for Mokku Chrome Extension. Use this when asked to release a new version.

## Release Process

### Prerequisites
- TypeScript compiles without errors: `pnpm tsc`
- Project builds successfully: `pnpm run build`
- All changes are committed to git

### Steps to Release Version `<VERSION>`

1. **Update version in package.json**
   - Replace current version with `<VERSION>` in the "version" field
   - Example: `"version": "4.5.1"`

2. **Update version in manifest files**
   - Update `dist/manifest.json` version field to `<VERSION>`
   - Update `public/manifest.json` version field to `<VERSION>`

3. **Build the project**
   - Run: `pnpm run build`

4. **Generate ZIP file**
   - Delete old: `rm mokku.zip`
   - Create new: `cd dist && zip -r ../mokku.zip . && cd ..`

5. **Stage and commit**
   - Stage files: `git add package.json dist/manifest.json public/manifest.json mokku.zip`
   - Commit with version as message: `git commit -m "<VERSION>" --trailer="Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"`

### Example: Release version 4.5.1

Current version: 4.5.0
New version: 4.5.1

1. Edit `package.json`: `"version": "4.5.0"` → `"version": "4.5.1"`
2. Edit `dist/manifest.json`: `"version": "4.5.0"` → `"version": "4.5.1"`
3. Edit `public/manifest.json`: `"version": "4.5.0"` → `"version": "4.5.1"`
4. Run `pnpm run build`
5. Run `cd dist && zip -r ../mokku.zip . && cd ..`
6. Run `git add package.json dist/manifest.json public/manifest.json mokku.zip`
7. Run `git commit -m "4.5.1" --trailer="Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"`

### Reference Commit
Commit e0cc7e24 shows the expected changes for a release:
- package.json version updated
- dist/manifest.json version updated
- public/manifest.json version updated
- mokku.zip regenerated

### Files Modified
- `package.json` (version field)
- `dist/manifest.json` (version field)
- `public/manifest.json` (version field)
- `mokku.zip` (binary, regenerated)

### Current Version
Check current version: `grep '"version"' package.json | head -1`
