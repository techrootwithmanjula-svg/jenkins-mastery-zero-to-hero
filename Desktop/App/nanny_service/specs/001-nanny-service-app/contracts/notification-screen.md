# UI Contract: Notification Screen

**Created**: 2026-04-18

## Overview

The Notification Screen displays a grouped list of notifications accessible from the bell icon on the Dashboard header. Notifications are grouped by date ("TODAY", "YESTERDAY", or formatted date) and rendered as a SectionList. Each notification row shows a circular icon badge, message text with highlighted dollar amounts, and a grey timestamp.

## Screen Layout

```text
┌─ StatusBar (purple / theme.colors.primary) ──────────────────────┐
├─ Navigation Header ──────────────────────────────────────────────┤
│  [←]  Notifications                                              │
│       headerStyle: { backgroundColor: theme.colors.primary }     │
│       headerTintColor: theme.colors.onPrimary (white)            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  SectionList (white background, full screen)                      │
│                                                                   │
│  TODAY                          ← section header, uppercase       │
│  ─────────────────────────────────                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ [💳]  A Netflix payout of $19 has been successful!          │ │
│  │       11.00 AM                                               │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ [⊕]   Successfully top up balance $150 from US CITIBAN.    │ │
│  │       See details here.                                      │ │
│  │       08.00 AM                                               │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ [💬]  Please top up to continue transactions on Netflix     │ │
│  │       01.00 AM                                               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  YESTERDAY                      ← section header, uppercase       │
│  ─────────────────────────────────                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ [🕐]  You received money from JENNIFER BACHDIM $640        │ │
│  │       11.00 AM                                               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## Section Header Contract

```text
┌──────────────────────────────────────────────────────────────────┐
│  TODAY                                                            │
│  ↑ Text variant="labelLarge", color: theme.colors.primary        │
│    textTransform: 'uppercase', letterSpacing: 1                   │
│    paddingHorizontal: spacing.lg, paddingTop: spacing.lg          │
│    paddingBottom: spacing.sm                                      │
└──────────────────────────────────────────────────────────────────┘
```

**Rules**:
- "TODAY" / "YESTERDAY" computed by comparing notification date to current date
- Older dates formatted as "MMM DD" (e.g. "APR 16")
- Text color: `theme.colors.primary` (purple)
- Font: `labelLarge` variant (14px, weight 500)
- Uppercase with letter spacing

## Notification Row Contract (NotificationItem component)

```text
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  ┌────┐                                                          │
│  │icon│  A Netflix payout of $19 has been                        │
│  │ 44 │  successful!                                              │
│  └────┘  11.00 AM                                                │
│                                                                   │
│  ──────────────────────────── (Divider)                          │
└──────────────────────────────────────────────────────────────────┘
```

### Icon Badge

| Property | Value |
|----------|-------|
| Container size | 44 x 44 |
| Border radius | `borderRadius.full` (9999 = circle) |
| Background | `theme.colors.primaryContainer` (light purple #E1D5FF light / #5A3EC7 dark) |
| Icon size | 20 |
| Icon color | `theme.colors.primary` |
| Alignment | centered in container |

### Message Text

| Property | Value |
|----------|-------|
| Variant | `bodyMedium` (14px) |
| Color (normal text) | `theme.colors.onSurface` (dark) |
| Color (amount "$XX") | `theme.colors.secondary` (red/coral #E53935) |
| Font weight (amount) | `'700'` (bold) |
| Number of lines | unlimited (wraps) |

### Timestamp

| Property | Value |
|----------|-------|
| Variant | `bodySmall` (12px) |
| Color | `theme.colors.outline` (grey) |
| Margin top | `spacing.xs` (4) |

### Row Layout

| Property | Value |
|----------|-------|
| Direction | `flexDirection: 'row'` |
| Align | `alignItems: 'flex-start'` |
| Padding horizontal | `spacing.lg` (24) |
| Padding vertical | `spacing.md` (16) |
| Icon → Text gap | `spacing.md` (16) |

### Divider

| Property | Value |
|----------|-------|
| Color | `theme.colors.surfaceVariant` |
| Left margin | `spacing.lg + 44 + spacing.md` = 84 (aligns with text start) |

## Props: NotificationItem

```typescript
interface NotificationItemProps {
  notification: Notification;
  testID?: string;
}
```

## Navigation Contract

### Entry Point
- **Dashboard bell icon** → `navigation.navigate('Notifications')`
- Bell icon is at [DashboardScreen.tsx line ~104](src/screens/Dashboard/DashboardScreen.tsx)
- Currently `onPress={() => {}}` — needs wiring

### Route
- Added to `DashboardStackParamList`: `Notifications: undefined`
- Registered in `DashboardNavigator` with:
  - `title: 'Notifications'`
  - `headerStyle: { backgroundColor: theme.colors.primary }`
  - `headerTintColor: '#FFFFFF'`

### Back Navigation
- Standard stack back button (←) auto-provided by React Navigation
- Returns to Dashboard

## Empty State Contract

```text
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│                                                                   │
│            [🔔]   (bell icon, 64px, grey300)                     │
│                                                                   │
│          No notifications yet                                     │
│          ↑ titleMedium, theme.colors.onSurfaceVariant            │
│                                                                   │
│          You'll see your notifications here                       │
│          ↑ bodySmall, theme.colors.outline                       │
│                                                                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## Accessibility

- Section headers: `accessibilityRole="header"`
- Each notification row: `accessibilityLabel="{title}. {timestamp}"` on the row View, `accessible={true}`
- Icon badge: `accessibilityElementsHidden={true}` (decorative)
- Amount text: no special role (screen reader reads the full sentence naturally)
- Back button: default stack behavior provides `accessibilityLabel="Go back"`

## Interaction Flow

1. User taps bell icon on Dashboard → navigates to Notification screen
2. Screen loads → dispatches `fetchNotifications()` thunk
3. Loading state → `LoadingSpinner` component shown
4. Data arrives → SectionList renders grouped notifications
5. Empty state → shown if notifications array is empty after loading
6. Error state → `ErrorMessage` with retry button
7. User taps back arrow → returns to Dashboard
