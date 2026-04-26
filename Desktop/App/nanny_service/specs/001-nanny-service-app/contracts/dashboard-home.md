# UI Contract: Dashboard Home — Marketing and Action Card Refresh

**Date**: 2026-04-20  
**Route**: `Dashboard`  
**Primary File**: `src/screens/Dashboard/DashboardScreen.tsx`

## Screen Intent

The dashboard should present a polished home experience with two clearly different card roles:
- four view-only marketing cards that communicate service value
- two clickable action cards that help the user jump directly into key flows

## Inputs

### User Context

- authenticated user name
- baby details for the child summary card
- existing theme mode and notification access

### Dashboard Card Data

```ts
interface DashboardMarketingCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  badge?: string;
}

interface DashboardActionCard {
  id: 'babysitting' | 'admin';
  title: string;
  subtitle: string;
  icon: string;
  ctaLabel: string;
  destination: 'Appointments' | 'AdminMain';
}
```

## Layout Contract

### 1. Header

**Must keep**:
- greeting
- notifications shortcut
- theme toggle
- child summary card

**Must preserve**:
- mobile-first spacing
- existing gradient-brand feel
- theme-aware content contrast

### 2. Marketing Cards Section

**Count**: exactly 4 cards

**Visual requirements**:
- same card family as the rest of the dashboard
- icon, title, and supporting copy
- may include small badge or tone accent
- should look polished and informative, not disabled

**Behavior**:
- no navigation on tap
- no `button` role
- no CTA row or chevron that implies interaction
- optional press feedback should be avoided to reduce confusion

### 3. Action Cards Section

**Count**: exactly 2 cards

**Required cards**:
1. `Babysitting`
2. `Admin`

**Visual requirements**:
- same design family as marketing cards, but clearly more actionable
- includes CTA label and/or trailing affordance icon
- has visible pressed-state behavior

**Behavior**:
- `Babysitting` navigates to `Appointments` with babysitting route params
- `Admin` navigates to root `AdminMain`
- cards expose `accessibilityRole="button"`
- labels must describe the destination clearly

### 4. Section Separation

**Required**:
- section labels or spacing must make informational vs actionable content obvious
- users should not infer that all six cards behave the same way

## Interaction Contract

| Action | Expected Result |
|--------|-----------------|
| Tap marketing card | No navigation or action occurs |
| Tap babysitting action card | Opens the babysitting appointments flow |
| Tap admin action card | Opens the admin dashboard |
| Use screen reader on marketing card | Announces informational content only |
| Use screen reader on action card | Announces tappable button and destination |

## Accessibility Contract

- Marketing cards must not present themselves as disabled buttons.
- Action cards must announce as buttons.
- Titles and subtitles must remain readable in light and dark themes.
- Touch targets for action cards must remain comfortably tappable.
- Card differentiation must not rely on color only.

## Theme Contract

- Use shared `theme.colors`, `spacing`, `borderRadius`, and `shadows` tokens.
- Any accent treatment must come from the existing palette/theme system.
- No new hardcoded spacing or color values should be introduced for the new card sections.

## Test Scenarios

1. Dashboard renders four marketing cards and two action cards.
2. Marketing cards do not trigger navigation.
3. Babysitting card navigates to `Appointments` with babysitting params.
4. Admin card navigates to `AdminMain`.
5. Accessibility semantics differ correctly between the two card groups.
6. Theme changes preserve contrast and visual hierarchy.
