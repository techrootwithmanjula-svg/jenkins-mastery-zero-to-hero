# src/layout/

Shell components that form the app's chrome — the persistent sidebar, header, and the layout wrapper that ties them together.

## Files

### `AppLayout.tsx`
The main layout wrapper used for all **protected** pages.

- Renders `<AppSidebar />`, `<AppHeader />`, `<Backdrop />`, and an `<Outlet />` for the active page
- Wraps everything in `SidebarProvider` and `ThemeProvider`
- This is the `element` for the `<Route element={<AppLayout />}>` parent route in `App.tsx`

### `AppSidebar.tsx`
Left-side navigation panel.

**Behaviour:**
- **Desktop expanded:** full 290 px wide with text labels
- **Desktop collapsed:** 90 px wide, icons only; expands on hover
- **Mobile:** hidden off-screen; slides in when `isMobileOpen` is true

**Nav items** are defined in the `navItems` array at the top of the file. Each entry has `name`, `icon`, `path`, and optionally `subItems[]`.

> **Known issue:** The current sidebar has "Prents" (typo for "Parents") and both "Nanny" and "Prents" point to `/nanny`. These routes are not yet defined in `App.tsx`.

### `AppHeader.tsx`
Sticky top navigation bar.

- Hamburger button toggles `SidebarContext` (desktop expand or mobile open)
- Mobile: shows logo + a `⋯` menu button that reveals the actions row
- Desktop: always shows `ThemeToggleButton`, `NotificationDropdown`, and `UserDropdown`

### `Backdrop.tsx`
Semi-transparent dark overlay rendered behind the mobile sidebar. Clicking it closes the sidebar (`toggleMobileSidebar`).

## Layout Tree

```
AppLayout
├── AppSidebar
├── main
│   ├── AppHeader
│   └── <Outlet />   ← active page renders here
└── Backdrop         ← visible only on mobile when sidebar is open
```
