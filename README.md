# Logistik Kostnadskontroll

Dark-theme logistics cost-control dashboard. Upload an Excel file (`.xlsx` / `.xls`) and explore KPIs, filters, summaries, and charts — entirely in the browser (no backend).

## Stack

- React + TypeScript + Vite
- [SheetJS (xlsx)](https://sheetjs.com/) for Excel parsing
- Tailwind CSS v4
- Recharts

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Expected Excel columns

| Excel column | Dashboard field |
|---|---|
| Freight order / Service order | FO |
| Date | Datum |
| Stage Destination location name | Butiksnamn |
| Stage Destination location ID | Butiksnr |
| Means of transport | Typ |
| Charge description | Kostnad |
| Rate Amount | Mängd |
| Calculated amount | Summa |
| Quantity | RPU |

**Calculated:** `Pall = RPU / 1.7` (per row)

**KPI cards:** `Total RPU` sums `RPU` only where `Kostnad` is `Freight by RPU`. `Total Pall` = `Total RPU / 1.7`.

### Row filters (applied automatically)

- Skip rows where FO contains `Subtotal`
- Skip rows with empty Butiksnr
- Skip rows where Butiksnr is `CDCANGERED`

## Build

```bash
npm run build
npm run preview
```
