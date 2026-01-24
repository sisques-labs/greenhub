# Release Management

This monorepo uses [Changesets](https://github.com/changesets/changesets) for managing independent versioning of API and Web applications.

## Overview

- **API** and **Web** have independent versions
- Each app can be released separately
- Git tags follow the pattern: `api/v1.0.0`, `web/v1.2.0`
- Changesets automate version bumping and changelog generation

## Workflow

### 1. Making Changes

When you make changes that should trigger a release:

```bash
# After making your changes, create a changeset
pnpm changeset
```

This will:
1. Ask which packages changed (select `api`, `web`, or both)
2. Ask for the type of change: `major`, `minor`, or `patch`
3. Ask for a summary of the changes

The changeset will be saved in `.changeset/` directory.

### 2. Commit the Changeset

```bash
git add .changeset/
git commit -m "feat(api): add new endpoint"
git push
```

### 3. Release Process

When you merge to `main`:

1. **Changesets Action** will create/update a PR titled "chore: version packages"
2. This PR will:
   - Bump versions in `package.json` files
   - Update `CHANGELOG.md` files
   - Consume the changeset files

3. **Merge the Version PR** to trigger the release:
   - Git tags will be created: `api/vX.X.X` and/or `web/vX.X.X`
   - Deployments will be triggered (if configured)

## Manual Release

If you need to manually create tags:

```bash
# Release API
pnpm release:api

# Release Web
pnpm release:web

# Or both
pnpm release:api && pnpm release:web
```

## Version Bump Types

- **Patch** (`1.0.0` → `1.0.1`): Bug fixes, minor changes
- **Minor** (`1.0.0` → `1.1.0`): New features, backward compatible
- **Major** (`1.0.0` → `2.0.0`): Breaking changes

## Example Workflow

```bash
# 1. Make changes to API
vim apps/api/src/...

# 2. Create changeset
pnpm changeset
# Select: api
# Type: minor
# Summary: "Add new user management endpoints"

# 3. Commit and push
git add .
git commit -m "feat(api): add user management endpoints"
git push

# 4. Merge to main
# GitHub Actions will create a version PR

# 5. Review and merge version PR
# Tags and deployments happen automatically
```

## Changesets CLI Commands

```bash
# Create a new changeset
pnpm changeset

# Preview what will be released
pnpm changeset status

# Apply version bumps locally (used by CI)
pnpm version

# Create git tags (used by CI)
pnpm release
```

## Configuration

Changesets configuration is in `.changeset/config.json`:

- `baseBranch`: Main branch for releases (currently `main`)
- `ignore`: Packages to ignore (currently `@repo/sdk`)
- `changelog`: Changelog generator

## Viewing Releases

All releases are tagged in Git:

```bash
# View all tags
git tag

# View API releases
git tag | grep "^api/"

# View Web releases
git tag | grep "^web/"

# View specific release
git show api/v1.0.0
```

## CI/CD Integration

The release workflow (`.github/workflows/release.yml`) handles:

1. **Release Job**: Creates/updates version PR
2. **Create Tags Job**: Creates git tags for each app
3. **Deploy Jobs**: Deploys API and Web (configure deployment steps)

## Troubleshooting

### Changeset not created

Make sure you're in the root directory:
```bash
cd /path/to/monorepo
pnpm changeset
```

### Tag already exists

If a tag already exists, the workflow will skip it. Delete the tag first if needed:
```bash
git tag -d api/v1.0.0
git push origin :refs/tags/api/v1.0.0
```

### Version PR not created

Check that:
- Changeset files exist in `.changeset/`
- You pushed to `main` branch
- GitHub Actions has permissions to create PRs

## Best Practices

1. **One changeset per feature/fix**: Create separate changesets for unrelated changes
2. **Descriptive summaries**: Write clear summaries for the changelog
3. **Review version PR**: Always review the version PR before merging
4. **Coordinate team releases**: Communicate with team before merging version PRs
5. **Test before release**: Ensure all tests pass before creating changesets
