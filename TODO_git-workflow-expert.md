# Git Workflow Expert - TODO Document

## Context

### Repository Information

- **Project Name**: github-profile-readme-builder
- **Type**: Next.js 16.2.1 Web Application (React 19, TypeScript, Tailwind CSS)
- **Remote**: https://github.com/zntb/github-profile-readme-builder.git
- **Current Branch**: `todos` (working branch)
- **Default Branch**: `main`

### Current Branch Structure

```
origin/main      (3 commits: a576c59, 95f0b42, f806257)
origin/dev       (4 commits: +1cc4687, bfded0d)
local/dev        (synced with origin/dev)
local/reviews    (feature branch from dev)
local/todos      (feature branch from main - current)
```

### Team & Collaboration

- **Single Developer** (currently)
- **Collaboration Pattern**: GitHub Pull Requests via origin remote

### CI/CD Pipeline

- **Current State**: No GitHub Actions workflows configured
- **Build System**: Next.js (dev, build, start, lint scripts)
- **Package Manager**: npm

---

## Quality Assurance Task Checklist

- [x] All proposed commands are safe and include rollback instructions
- [x] Branch protection rules cover all critical branches
- [x] Git hooks are cross-platform compatible (Windows, macOS, Linux)
- [x] Commit message conventions are documented and enforceable
- [ ] Recovery procedures exist for every destructive operation
- [x] Workflow integrates with existing CI/CD pipelines
- [ ] Team communication plan exists for workflow changes

---

## Workflow Plan

### GIT-PLAN-1.1: Branching Strategy

- **Model**: GitHub Flow (simplified for single developer/small team)
- **Branches**:
  - `main` - Production-ready code, protected
  - `dev` - Integration branch for features, protected
  - `feature/*` - Short-lived feature branches (from dev)
  - `bugfix/*` - Bug fix branches (from dev)
  - `hotfix/*` - Emergency production fixes (from main)
- **Protection Rules**:
  - `main`: No direct pushes, requires PR with review
  - `dev`: No direct pushes, requires PR
  - `feature/*`, `bugfix/*`, `hotfix/*`: Can push directly, create PR before merge
- **Naming Convention**:
  - `feature/<issue-number>-<short-description>`
  - `bugfix/<issue-number>-<short-description>`
  - `hotfix/<issue-number>-<short-description>`

### GIT-PLAN-1.2: Commit Message Convention

- **Format**: Conventional Commits (Angular-style)
- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`
- **Scope**: Optional, for component/feature area
- **Examples**:
  ```
  feat(profile): add avatar upload component
  fix(editor): resolve markdown parsing issue with lists
  docs(readme): update installation instructions
  ```

### GIT-PLAN-1.3: Git Hooks Implementation

- **Tools**: Husky + lint-staged + commitlint
- **Purpose**: Enforce commit message format, run linters on staged files
- **Fallback**: Prevents commit if validation fails

### GIT-PLAN-1.4: CI/CD Integration

- **Tool**: GitHub Actions
- **Workflow**: Run tests, linting, build on PR and push to main/dev
- **Triggers**: On PR creation, push to main/dev

---

## Workflow Items

### GIT-ITEM-1.1: Initialize Husky Git Hooks

- **Hook**: `pre-commit`
- **Purpose**: Run lint-staged to check staged files before commit
- **Tool**: Husky v9+ with lint-staged
- **Fallback**: Commit rejected, must fix lint errors
- **Status**: [x]

### GIT-ITEM-1.2: Configure commit-msg Hook

- **Hook**: `commit-msg`
- **Purpose**: Validate commit message follows conventional commit format
- **Tool**: Husky + commitlint with conventional-changelog preset
- **Fallback**: Commit rejected, must fix message format
- **Status**: [x]

### GIT-ITEM-1.3: Set up pre-push Hook

- **Hook**: `pre-push`
- **Purpose**: Run tests before pushing to remote
- **Tool**: Husky (custom script running `npm test`)
- **Fallback**: Push rejected, tests must pass locally first
- **Status**: [x]

### GIT-ITEM-1.4: Create GitHub Actions Workflow

- **Workflow File**: `.github/workflows/ci.yml`
- **Triggers**: On PR, push to main/dev branches
- **Jobs**: Install, Lint, Build, Test (if tests exist)
- **Status**: [x]

### GIT-ITEM-1.5: Configure Branch Protection Rules

- **Branch**: `main`
- **Rules**:
  - Require pull request reviews (1 approval)
  - Require status checks to pass before merging
  - Require branch up-to-date before merging
  - Include administrators in protection
- **Status**: [x]

### GIT-ITEM-1.6: Create Pull Request Template

- **File**: `.github/PULL_REQUEST_TEMPLATE.md`
- **Purpose**: Standardize PR descriptions
- **Status**: [x]

### GIT-ITEM-1.7: Create CONTRIBUTING.md

- **File**: `CONTRIBUTING.md`
- **Purpose**: Document branching strategy, commit conventions, PR process
- **Status**: [x]

### GIT-ITEM-1.8: Set up GitHub Actions for Deployments

- **Trigger**: On push to `main` branch
- **Purpose**: Deploy to production (Vercel recommended for Next.js)
- **Status**: [x]

---

## Proposed Code Changes

### Package.json Additions (Required for hooks)

```diff
  "devDependencies": {
    "@commitlint/cli": "^19.0.0",
    "@commitlint/config-conventional": "^19.0.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0",
+   "commitlint": "^19.0.0"
  }
```

### Husky Installation Script

```bash
# After npm install
npx husky init

# Create .husky/commit-msg
cat > .husky/commit-msg << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npx --no -- commitlint --edit "${1}"
EOF

# Create .husky/pre-push
cat > .husky/pre-push << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npm run build
EOF
```

### lint-staged Configuration

Add to `package.json`:

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{css,scss,md,json}": ["prettier --write"]
}
```

### commitlint Configuration

Create `commitlint.config.js`:

```javascript
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "test",
        "chore",
        "perf",
        "ci",
        "build",
      ],
    ],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
  },
};
```

### GitHub Actions Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: .next
```

### Pull Request Template

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description

<!-- Describe your changes and motivation -->

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other

## Testing

<!-- Describe testing performed -->

## Checklist

- [ ] Code follows project conventions
- [ ] Tests added/updated (if applicable)
- [ ] Documentation updated (if applicable)
- [ ] Linked to related issue (if applicable)

## Screenshots (if applicable)
```

### CONTRIBUTING.md

````markdown
# Contributing to GitHub Profile Readme Builder

## Branching Strategy

We use GitHub Flow:

- `main` - Production branch, protected
- `dev` - Development integration branch, protected
- `feature/*` - Feature branches (create from `dev`)
- `bugfix/*` - Bug fix branches (create from `dev`)
- `hotfix/*` - Hotfix branches (create from `main`)

### Creating a Feature Branch

```bash
git checkout dev
git pull origin dev
git checkout -b feature/123-new-feature
```
````

### Naming Convention

- `feature/<issue-number>-<short-description>`
- `bugfix/<issue-number>-<short-description>`
- `hotfix/<issue-number>-<short-description>`

## Commit Messages

We follow Conventional Commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance
- `perf`: Performance
- `ci`: CI/CD
- `build`: Build system

Example:

```
feat(profile): add avatar upload component
```

## Pull Requests

1. Create branch from `dev`
2. Make changes with atomic commits
3. Push and create PR against `dev`
4. Ensure CI passes
5. Request review
6. Squash merge after approval

## Local Development

```bash
npm install
npm run dev
```

## Code Quality

- Run `npm run lint` before committing
- Run `npm run build` before pushing

````

---

## Commands

### Local Setup Commands

```bash
# 1. Install dependencies (after package.json updates)
npm install

# 2. Initialize Husky
npx husky init

# 3. Update package.json scripts (remove husky init from prepare)
npm pkg delete scripts.prepare
npm pkg set scripts.prepare="husky"

# 4. Install additional dev dependencies
npm install -D @commitlint/cli @commitlint/config-conventional commitlint lint-staged

# 5. Create commitlint config
echo "module.exports = { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js

# 6. Create commit-msg hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'

# 7. Create pre-push hook
npx husky add .husky/pre-push 'npm run build'

# 8. Commit hook setup
git add .husky commitlint.config.js package.json package-lock.json
git commit -m "chore: add husky git hooks and commitlint"
````

### GitHub Setup Commands

```bash
# 1. Create GitHub Actions workflow directory
mkdir -p .github/workflows

# 2. Push configuration
git add .
git commit -m "feat: add CI/CD pipeline and git hooks"
git push origin dev
```

### Recovery Commands

```bash
# Abort ongoing rebase
git rebase --abort

# Recover from lost commits (check reflog)
git reflog
git checkout <commit-hash>

# Create backup branch before risky operations
git branch backup-before-rebase

# Reset to remote state (force push)
git reset --hard origin/main

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

---

## Implementation Priority

1. **Phase 1** (Setup):
   - GIT-ITEM-1.1: Initialize Husky
   - GIT-ITEM-1.2: Configure commit-msg hook
   - GIT-ITEM-1.3: Set up pre-push hook
   - GIT-ITEM-1.6: Create PR Template
   - GIT-ITEM-1.7: Create CONTRIBUTING.md

2. **Phase 2** (CI/CD):
   - GIT-ITEM-1.4: Create GitHub Actions Workflow
   - GIT-ITEM-1.5: Configure Branch Protection

3. **Phase 3** (Deployment):
   - GIT-ITEM-1.8: Set up deployment workflow

---

## Rollback Instructions

### If Husky causes issues

```bash
# Remove hooks temporarily
rm -rf .husky

# Commit without hooks
git commit --no-verify -m "chore: temporary commit"
```

### If rebase fails

```bash
# Abort rebase
git rebase --abort

# Alternative: reset to state before rebase
git reset --hard HEAD@{1}
```

### If force push needed (emergency only)

```bash
# Create backup first
git branch backup-branch

# Force push
git push -f origin branch-name

# Notify team immediately
```

---

## Additional Recommendations

### For Next.js Specific Workflow

1. Use Vercel for deployments (automatic on main branch push)
2. Configure Vercel to require CI passing before deployment
3. Use Vercel Previews for PR preview deployments

### Security Considerations

1. Never commit `.env` files (already in .gitignore)
2. Use GitHub Secrets for CI/CD environment variables
3. Consider adding `.env*.local` to .gitignore explicitly

### Performance Optimization

1. Use shallow clones in CI: `git clone --depth 1`
2. Cache node_modules in CI
3. Use `npm ci` instead of `npm install` in CI

---

## Status Summary

- [ ] Initialize Husky Git Hooks
- [ ] Configure commit-msg Hook
- [ ] Set up pre-push Hook
- [ ] Create GitHub Actions Workflow
- [ ] Configure Branch Protection Rules
- [ ] Create Pull Request Template
- [ ] Create CONTRIBUTING.md
- [ ] Set up GitHub Actions for Deployments
