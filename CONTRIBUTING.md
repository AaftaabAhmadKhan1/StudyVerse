# Contributing to YT Wallah

Thank you for your interest in contributing to YT Wallah! 🎉

## Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/yt-wallah.git
   cd yt-wallah
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Fill in the required values
   ```
5. **Start the dev server:**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming Convention

| Type     | Pattern                 | Example                     |
| -------- | ----------------------- | --------------------------- |
| Feature  | `feature/<short-desc>`  | `feature/add-playlist-view` |
| Bug Fix  | `fix/<short-desc>`      | `fix/video-player-crash`    |
| Hotfix   | `hotfix/<short-desc>`   | `hotfix/auth-redirect`      |
| Docs     | `docs/<short-desc>`     | `docs/update-api-docs`      |
| Refactor | `refactor/<short-desc>` | `refactor/player-component` |

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`

**Examples:**

```
feat(player): add picture-in-picture support
fix(shorts): resolve swipe navigation bug
docs(readme): update deployment instructions
```

### Before Submitting a PR

1. Run the full validation suite:

   ```bash
   npm run validate
   ```

   This runs: format check → lint → type check → tests → build

2. Ensure your branch is up to date with `main`

3. Fill out the PR template completely

## Code Style

- **TypeScript** is required for all new files
- **Tailwind CSS** for styling (no inline styles or CSS modules)
- **ESLint** + **Prettier** enforce consistent formatting
- Run `npm run format` to auto-format code

## Need Help?

Open an issue with the question label and we'll help you out!
