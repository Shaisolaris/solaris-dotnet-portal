# Solaris Workplace — .NET Enterprise Portal

A Blazor-style enterprise internal tool for employee directory, org chart, and leave management. Styled to match the corporate feel of an ASP.NET Core 8 + Blazor backoffice: Segoe UI typography, Microsoft purple, formal data grid, structured layouts.

**Live demo:** https://shaisolaris.github.io/solaris-dotnet-portal/

## What it shows

- **Left sidebar** with 3 sections (Employee Directory, Org Chart, Leave Management) + Azure AD SSO card
- **Employee Directory**:
  - 30 seeded employees across 5 departments
  - Search by name/title/email, department dropdown filter
  - Sortable data grid (click any column header)
  - Pagination (12/page)
  - Click any row to open a detailed modal with gradient header
  - "Export Excel" and "Add employee" buttons
- **Org Chart** — 5-column department layout with employee cards
- **Leave Management** — request form (type, dates, reason), balance sidebar with 3 leave categories, upcoming company holidays
- **Microsoft purple** (`#512BD4`) throughout with subtle purple accents
- **Segoe UI** font stack — the formal "this is clearly a .NET app" typographic tell
- **"SQL Server connected"** status chip in the header
- **Dark mode** with localStorage persistence
- Fully responsive

## What this demo represents

This is the **visual proof** for an ASP.NET Core / Blazor engagement. The real Blazor Server app (Razor components, EF Core DbContext, SignalR, Identity/Azure AD auth, minimal APIs) lives in the companion repositories. This showcase compiles the same UI concepts into a Next.js-hosted preview.

## Stack

- Next.js 15 (App Router, static export)
- React 19 + TypeScript
- Tailwind CSS 3
- Deployed to GitHub Pages

## Run locally

```bash
npm install
npm run dev
```

## License

MIT.
