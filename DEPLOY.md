# Deploy to GitHub Pages

## 1. Create a GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Name it e.g. `kaka-transform` (public repo — required for free Pages on personal accounts)
3. Do **not** add a README if you already have code locally

## 2. Push this project

```bash
cd c:\Users\Win\logistics-dashboard
git init
git add .
git commit -m "Initial commit: Kåkå CSV transform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your values.

## 3. Enable GitHub Pages

1. Open the repo on GitHub → **Settings** → **Pages**
2. Under **Build and deployment** → **Source**, choose **GitHub Actions**
3. Push to `main` (or merge a PR) — the workflow in `.github/workflows/deploy.yml` runs automatically

## 4. Open the app

After the Action finishes (green check on the **Actions** tab):

```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

Example: `https://jane.github.io/kaka-transform/`

## Local build (same as GitHub)

```bash
# Match GitHub Pages paths locally (optional test)
set VITE_BASE_PATH=/YOUR_REPO_NAME/
npm run build
npm run preview
```

On PowerShell:

```powershell
$env:VITE_BASE_PATH="/YOUR_REPO_NAME/"
npm run build
npm run preview
```

## Updates

Push to `main` — GitHub rebuilds and redeploys in a few minutes.

## Troubleshooting

### "Multiple artifacts named github-pages"

Usually caused by **Re-run failed jobs** (creates a second artifact). Fix:

1. **Actions** → cancel any running workflows
2. Push a **new** commit (do not use Re-run):

   ```bash
   git commit --allow-empty -m "redeploy pages"
   git push
   ```

3. On GitHub, check **Actions** — delete extra workflows if you see both `Deploy to GitHub Pages` and a default `pages-build-deployment` / Jekyll workflow. Keep only `.github/workflows/deploy.yml`.

## Private repos

GitHub Pages for **private** repos may require a paid GitHub plan. Use a **public** repo for free hosting, or host `dist` on your internal server instead (see conversation / IIS).
