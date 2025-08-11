# Contributing Guide

Thank you for contributing to the E-Commerce Chatbot project!

## Workflow Protocol (Mandatory)
This project follows the workflow defined in `execution_plan.md`:
- Initial state assessment before starting work
- Chain-linked progress tracking (reference prior tasks/issues)
- Real-time updates to docs, issues, and project board upon task completion
- Verification gates: tests, reviews, docs updates before closing tasks

## Issue Management
- Create issues using templates in `.github/ISSUE_TEMPLATE/`
- Link issues to milestones and project board columns
- Add labels for `type:*`, `priority:*`, and `component:*`

## Branching & Commits
- Default branch: `main`
- Use feature branches: `feat/<short-description>` or `fix/<short-description>`
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `ci:`

## Pull Requests
- Use the PR template `.github/pull_request_template.md`
- Link related issues with `Closes #<id>`
- Include verification evidence (tests, logs, screenshots)

## Testing
- Minimum 80% coverage target
- Place tests under `tests/` (unit, integration, system, e2e, performance)

## Code of Conduct
- Be respectful and constructive. Assume good intent.

## Security
- Do not commit secrets. Use `.env` (which is gitignored).

## Getting Started
- Python 3.11+, Node 18+
- Backend, frontend, CI, and infra will be added in Phase 1
