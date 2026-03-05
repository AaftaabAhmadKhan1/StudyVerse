# 🌿 Git Branching Strategy

This project follows a simplified **Git Flow** branching model.

## Branch Types

| Branch      | Purpose                         | Created From | Merges Into        |
| ----------- | ------------------------------- | ------------ | ------------------ |
| `main`      | Production-ready code           | —            | —                  |
| `develop`   | Integration branch for features | `main`       | `main`             |
| `feature/*` | New features                    | `develop`    | `develop`          |
| `bugfix/*`  | Bug fixes                       | `develop`    | `develop`          |
| `hotfix/*`  | Urgent production fixes         | `main`       | `main` + `develop` |
| `release/*` | Release preparation             | `develop`    | `main` + `develop` |

## Workflow

```
main ────●──────────────────●──────── (production releases)
          \                /
develop ───●──●──●──●──●──● ──────── (integration)
              \     /
feature/xyz ───●──● ─────────────── (your work)
```

### 1. Starting a Feature

```bash
git checkout develop
git pull origin develop
git checkout -b feature/add-login-page
```

### 2. Working on the Feature

```bash
# Make changes, commit often with conventional commits
git add .
git commit -m "feat(auth): add login form component"
git commit -m "feat(auth): add form validation"
```

### 3. Finishing a Feature

```bash
git checkout develop
git merge feature/add-login-page
git branch -d feature/add-login-page
```

### 4. Creating a Release

```bash
git checkout develop
git checkout -b release/1.0.0
# Bump version, final testing
git checkout main
git merge release/1.0.0
git tag -a v1.0.0 -m "Release 1.0.0"
git checkout develop
git merge release/1.0.0
```

### 5. Hotfix (Urgent Production Fix)

```bash
git checkout main
git checkout -b hotfix/fix-crash
# Fix the issue
git checkout main
git merge hotfix/fix-crash
git tag -a v1.0.1 -m "Hotfix 1.0.1"
git checkout develop
git merge hotfix/fix-crash
```

## Commit Message Convention

Format: `<type>(<scope>): <subject>`

See `.gitmessage` in the project root for the full guide.

## Branch Naming Examples

- `feature/add-user-auth`
- `feature/style-finder-improvements`
- `bugfix/fix-weather-api-timeout`
- `hotfix/fix-production-crash`
- `release/2.0.0`
