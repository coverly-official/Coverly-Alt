# Meridian Trade — B2B Direct Manufacturing Marketplace

A dark-mode-first, glassmorphic B2B wholesale and manufacturing marketplace built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS 3.4**, **Framer Motion**, and **InsForge** as the backend.

Subverting the sterile enterprise look of legacy trade portals, Meridian Trade delivers visual authority borrowed from luxury industrial hardware, high-end fintech, and Awwwards-winning craftsmanship.

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
The application has a built-in offline fallback with 24 typed industrial products, 8 audited global suppliers, 8 sectors, and 12 live quotations.

To connect your live InsForge cloud backend:
1. Ensure `.env.local` contains:
```bash
VITE_INSFORGE_URL=https://duhxy56e.us-east.insforge.app
VITE_INSFORGE_ANON_KEY=anon_d8fc27cb79f31c2c3c92e083557a9f6b0354f23c85b86dee641ce4e68df78a93
```

2. Provision the database schema and storage bucket:
- Run `insforge/schema.sql` in the InsForge SQL editor or via CLI.
- Run `npx -y @insforge/cli storage create-bucket rfq-attachments --private`.

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🎨 Design Tokens & Customization

All design tokens are defined centrally:
- **Brand Name & Tagline:** `src/lib/config.ts` (`BRAND_NAME = "Meridian Trade"`, `TAGLINE = "Verified manufacturers. Direct quotes."`)
- **Color Palette:** `tailwind.config.ts` and `src/index.css`
  - `canvas`: `#2d3250` (Primary viewport background)
  - `elevated`: `#424769` (Secondary surfaces & navigation rail)
  - `muted`: `#676f9d` (Borders, dividers, and connectors)
  - `ink`: `#ffffff` (Primary typography)
  - `gold`: `#f7b117` (Strictly reserved conversion accent)
- **Glassmorphism:** `src/index.css` (`.glass-card`, `.glass-strong`, `.glass-subtle`, `.specular-border`)
- **Typography:** Self-hosted `Inter Tight` (Display) & `Inter` (Body)

---

## 🗂️ Project Structure

```
insforge/
  schema.sql                   # Complete PostgreSQL schema, RLS policies, & seeds
  storage.md                   # Instructions for rfq-attachments storage bucket
src/
  main.tsx                     # Entry point with self-hosted font imports
  App.tsx                      # Code-split routing, AuthProvider, MotionConfig
  index.css                    # Design token variables, glassmorphism utilities, dark scrollbars
  /data                        # Typed contracts & realistic B2B dataset (24 products, 8 suppliers)
  /services                    # Typed InsForge repository layer (products, rfqs, quotes, auth, storage)
  /hooks                       # useAsync, useMagnetic, useTilt, useScrolled, useDebounce, /queries
  /components
    /ui                        # Button, GlassCard, ProductVisual, StatusChip, SupplierBadge, Slider, etc.
    /layout                    # Navbar (docked search & BOM upload), Footer, CommandSearch, NoiseOverlay
    /home                      # Hero, HeroCollage, TrustBar, CategoryBento, HowItWorks, FeaturedSuppliers
    /catalog                   # FilterSidebar, ProductCard, ProductGrid, QuickViewDrawer, CompareTray
    /product                   # Gallery, SpecPanel, VolumePricingMatrix, RFQPanel, SupplierDossier
    /dashboard                 # Sidebar, KPICard, PipelineChart, QuoteTable, ActionQueue, EscrowTimeline
  /routes                      # HomePage, CatalogPage, ProductPage, SignInPage, SignUpPage, Dashboards
```

---

## 🛡️ WCAG 2.2 AA Accessibility & Polish
- 100% offline-runnable without external assets or broken images via `<ProductVisual />`.
- Gold focus rings (`outline: 2px solid #f7b117`) across all interactive elements.
- Dialogs, drawers, and command palette feature focus trapping and Esc dismissal.
- Full support for `prefers-reduced-motion` with calm, fade-only transitions.
