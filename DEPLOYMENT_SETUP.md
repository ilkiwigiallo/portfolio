# Automatic Deployment & README Update Setup Documentation

This document describes the configuration implemented to automate deployment to Vercel and dynamic updates of the "News" section in the `README.md` file.

---

## 1. What Has Been Configured

### A. GitHub Action (`.github/workflows/deploy.yml`)
The "engine" that handles the automation. It triggers on every `push` to the `main` or `master` branches.
1. **Deploy**: Sends the code to Vercel using security tokens.
2. **README Update**: 
   - Extracts the message from the latest commit (e.g., `feat: add gallery`).
   - Searches for the `## 🆕 Novità` (or `## 🆕 News`) section in `README.md`.
   - Inserts the current date and the commit message.
   - Performs an automatic commit with the `[skip ci]` prefix.

### B. Loop Protection on Vercel ("Ignored Build Step")
To prevent Vercel from triggering a second deployment every time the bot updates the README, a custom rule has been set on Vercel (**Settings > Build & Development > Ignored Build Step**):
- **Command**: `git log -1 --pretty=%s | grep -q "\[skip ci\]" && exit 0 || exit 1`
- **How it works**: If the commit contains `[skip ci]`, Vercel ignores the deployment.

---

## 2. Requirements (GitHub Secrets)
To function, the GitHub repository must have these 3 Secrets configured:
1. `VERCEL_TOKEN`: Personal token generated on Vercel.
2. `VERCEL_ORG_ID`: Your Vercel account/team ID.
3. `VERCEL_PROJECT_ID`: The specific Vercel Project ID.

---

## 3. How to Modify Behavior

### Change Date or Message Format
Modify the `.github/workflows/deploy.yml` file in the `run` section of the `Update README with News` step.
- For the date: change `date +'%d/%m/%Y %H:%M'`.
- For the message: the value is contained in the `LAST_COMMIT_MSG` variable.

### Change the Number of News Items Shown
Currently, the code replaces the entire `## 🆕 Novità` section, keeping only the latest one. To maintain a longer history, you would need to modify the `sed` script in the `.yml` file.

---

## 4. How to Restore (Revert)

If you want to go back to the previous state:
1. **Remove Automation**: Delete the `.github/workflows/deploy.yml` file.
2. **Restore Vercel**: In **Settings > Build & Development** on Vercel, set **Ignored Build Step** to "None" or "Default".
3. **Clean README**: Remove the `## 🆕 Novità` section from the `README.md` file.

---

## 5. Recommended Conventions
The system is optimized for **Conventional Commits**. By using prefixes like `feat:`, `fix:`, `docs:`, your news in the README will always be clear and organized.

*Example:* `git commit -m "feat: add 3D animation to hero"` -> This will appear as news in the README.
