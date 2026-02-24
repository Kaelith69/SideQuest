# Contributing

Thank you for your interest in contributing to SideQuest! This guide explains the workflow, coding conventions, and review process.

---

## 🗂️ Project Layout Refresher

```
SideQuest/
├── index.html          # All UI — modify this for layout/HTML changes
├── firestore.rules     # Firestore security rules
├── js/
│   ├── firebase-config.js   # SDK init — do not commit live credentials
│   ├── app.js               # Auth state + view routing
│   ├── auth.js              # Login/signup/logout
│   ├── map.js               # MapLibre + geolocation + markers
│   ├── tasks.js             # Task CRUD + escrow + filter + ratings
│   └── ui.js                # Toast + Confirm utilities
├── styles/
│   ├── main.css             # Custom CSS (animations, markers, glass)
│   └── tailwind.css         # Tailwind output reference
└── wiki/                    # This documentation
```

---

## 🔀 Branch Naming

| Type | Pattern | Example |
|---|---|---|
| Feature | `feat/<short-desc>` | `feat/push-notifications` |
| Bug fix | `fix/<short-desc>` | `fix/wallet-race-condition` |
| Docs | `docs/<page-name>` | `docs/update-architecture` |
| Refactor | `refactor/<area>` | `refactor/tasks-module` |
| Chore | `chore/<task>` | `chore/update-maplibre-version` |

Branch off from `main`:

```bash
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
```

---

## ✍️ Commit Message Style

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

| Type | Use for |
|---|---|
| `feat` | A new user-visible feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Formatting, whitespace (no logic change) |
| `refactor` | Code restructuring (no feature/fix) |
| `perf` | Performance improvements |
| `chore` | Build, tooling, dependency updates |

**Examples:**

```bash
git commit -m "feat(tasks): add photo attachment support"
git commit -m "fix(wallet): prevent negative balance on concurrent claims"
git commit -m "docs(wiki): add privacy page"
```

---

## 💻 Coding Conventions

### JavaScript

- **ES Modules only** — use `import`/`export`, no `require()`.
- **`const` by default**, `let` when reassignment is needed, never `var`.
- **Async/await** over raw `.then()` chains for readability.
- **DOM queries at module scope** — query elements once and store in `const` at the top of the file.
- **Error handling** — all `async` event handlers must have a `try/catch` and call `showToast(error.message, 'error')`.
- **No `innerHTML` with user data** — always use `textContent` or typed DOM property setters.
- **One responsibility per module** — keep `map.js` about the map, `tasks.js` about task data, etc.

```javascript
// ✅ Good
const btn = document.getElementById('submit-btn');
btn.addEventListener('click', async () => {
    try {
        await doSomethingAsync();
        showToast('Done!', 'success');
    } catch (err) {
        showToast(err.message, 'error');
    }
});

// ❌ Avoid
document.getElementById('submit-btn').onclick = function() {
    doSomethingAsync().then(() => {
        document.getElementById('msg').innerHTML = userInput; // XSS risk
    });
};
```

### HTML & Tailwind CSS

- Use **Tailwind utility classes** for all new styling. Add custom CSS to `styles/main.css` only when Tailwind cannot achieve the effect.
- Follow the existing **mobile-first** breakpoint strategy: base styles for mobile, `md:` prefix for desktop overrides.
- Use **semantic HTML elements** (`<button>`, `<form>`, `<label>`, `<input>` with correct `type`).
- Every interactive element needs a **visible focus style** (Tailwind's `focus:ring-2` is sufficient).
- All new SVG graphics must have `role="img"` and an `aria-label`.

### Firestore Rules

- Any change to `firestore.rules` must be reviewed carefully.
- New rules should **deny by default** and only allow specific, documented operations.
- Always test new rules in the Firebase Emulator before deploying.

---

## 🧪 Testing

SideQuest has no automated test suite yet. The expected testing process is:

1. **Manual smoke test** — run through the core flow: sign up → post task → claim (second account) → complete → rate.
2. **Cross-browser check** — test in at least Chrome and Firefox.
3. **Mobile check** — test on a real device or in Chrome DevTools device simulation.
4. **Security rules check** — use the Firebase Emulator and the Rules Playground in the Firebase Console to verify rule changes.

If you are adding automated tests, the recommended stack is:
- **Unit tests:** [Vitest](https://vitest.dev/) or [Jest](https://jestjs.io/)
- **E2E tests:** [Playwright](https://playwright.dev/)
- **Firebase Emulator:** For Firestore and Auth integration tests

---

## 🔄 Pull Request Process

1. **Open an issue first** for significant changes — this avoids duplicate work and lets maintainers give early feedback.
2. **Fork** the repository and work on a branch.
3. **Keep PRs focused** — one feature or fix per PR; avoid mixing unrelated changes.
4. **Fill in the PR template** with:
   - What the change does
   - How to test it
   - Screenshots for UI changes
5. **Pass code review** — at least one approving review from a maintainer is required.
6. **Squash on merge** — the maintainer will squash commits to keep the main history clean.

### PR Title Format

```
feat: add push notifications for task status updates
fix: prevent wallet race condition on simultaneous claims
docs: add privacy wiki page
```

---

## 🐛 Reporting Bugs

Open a [GitHub Issue](https://github.com/Kaelith69/SideQuest/issues/new) and include:

- **Clear title:** What is wrong, not what you did (e.g. "Wallet balance not updated after task completion" not "Wallet broken")
- **Steps to reproduce:** Numbered, precise steps
- **Expected behaviour:** What should happen
- **Actual behaviour:** What actually happens
- **Environment:** Browser, OS, device type
- **Console errors:** Copy the full error from the browser Console (F12)
- **Screenshots:** If it's a visual issue

---

## 💡 Suggesting Features

Open a [GitHub Issue](https://github.com/Kaelith69/SideQuest/issues/new) with the label `enhancement` and describe:

1. The problem this feature solves
2. Your proposed solution
3. Any alternatives you considered
4. Potential impact on existing users

Check [Roadmap](Roadmap.md) first — the feature may already be planned.

---

## 📜 Licensing

By contributing, you agree that your contributions will be licensed under the **MIT License**, the same licence as the project. See [LICENSE](../LICENSE).

---

## 🙋 Getting Help

- Open a [Discussion](https://github.com/Kaelith69/SideQuest/discussions) for questions
- Comment on the relevant Issue or PR
- Check [Troubleshooting](Troubleshooting.md) and [Architecture](Architecture.md) for technical questions

---

[← Privacy](Privacy.md) | [Roadmap →](Roadmap.md)
