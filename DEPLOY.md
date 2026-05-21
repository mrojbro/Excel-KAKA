# Deploy Kåkå Excel-transform

## GitHub Pages

1. Create a new repo (e.g. `kaka-excel-transform`) — **not** CostKontroll-FO
2. Push **only** this folder
3. Settings → Pages → Source: **GitHub Actions**
4. URL: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Internal server (IIS)

```bash
npm run build
```

Copy the `dist` folder to your web server. Open via `https://` — do not double-click `index.html`.

If hosted in a subfolder, set `base` in `vite.config.ts` before building.
