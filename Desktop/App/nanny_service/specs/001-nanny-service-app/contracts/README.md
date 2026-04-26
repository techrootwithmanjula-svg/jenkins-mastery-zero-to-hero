# Interface Contracts: Nanny Service App — Purple/Violet Theme

**Updated**: 2026-04-20

## Current Feature Contracts

- `appointment-schedule.md` — appointment calendar and schedule timeline contract
- `dashboard-home.md` — dashboard marketing/action card contract
- `nanny-list-modal-preview.md` — available nanny list modal profile preview contract
- `notification-screen.md` — notifications list contract
- `profile-view-edit.md` — profile edit/view contract
- `schedule-modal.md` — dashboard schedule modal contract
- `subscription-redesign.md` — subscription modal and list UX redesign contract

## Theme Contract

### Color Palette API (`src/theme/colors.ts`)

The `palette` export is the single source of truth for all colors. Every component and screen MUST consume colors through the theme system, never via hardcoded hex values.

```typescript
export const palette = {
  // Primary — Purple/Violet
  primary50: '#F3EEFF',
  primary100: '#E1D5FF',
  primary200: '#C9ADFF',
  primary300: '#B08DFF',
  primary400: '#9B7FFF',
  primary500: '#8B6FEF',
  primary600: '#7C5CFC',  // MAIN BRAND COLOR
  primary700: '#6A4DE0',
  primary800: '#5A3EC7',
  primary900: '#3D2A8A',

  // Secondary — Red/Coral (favorites, hearts)
  secondary50: '#FFF5F5',
  secondary100: '#FFE0E0',
  secondary200: '#FFB3B3',
  secondary300: '#FF8080',
  secondary400: '#FF5252',
  secondary500: '#E53935',
  secondary600: '#D32F2F',
  secondary700: '#C62828',
  secondary800: '#B71C1C',
  secondary900: '#880E0E',

  // Neutrals (unchanged)
  white: '#FFFFFF',
  black: '#000000',
  grey50–grey900: ... // same as before

  // Semantic
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  favorite: '#FF5252', // NEW — heart icon color
} as const;
```

### Theme Consumption Contract

All components MUST use theme colors via:
```typescript
const { theme } = useAppTheme();
// Then access: theme.colors.primary, theme.colors.surface, etc.
```

**FORBIDDEN**: Direct hex colors in component StyleSheets (e.g., `color: '#43A047'`).

### Component Style Contracts

#### Button Variants
| Variant | Background | Text | Border | BorderRadius |
|---------|-----------|------|--------|-------------|
| contained (primary) | theme.colors.primary | theme.colors.onPrimary | none | 24 |
| outlined | transparent | theme.colors.primary | theme.colors.primary | 24 |
| text | transparent | theme.colors.primary | none | 24 |
| decline/danger | transparent | grey700 | grey300 | 24 |

#### Card Variants
| Variant | Background | BorderRadius | Shadow | Layout |
|---------|-----------|-------------|--------|--------|
| surface | theme.colors.surface | 16 | sm | vertical |
| nanny | theme.colors.surface | 12 | sm | horizontal (avatar + info + price) |
| service-category | theme.colors.surface | 12 | none | centered (icon + title + subtitle) |

#### Chip Variants (Status)
| Status | Background | Text |
|--------|-----------|------|
| online/available | #E8F5E9 | #2E7D32 |
| offline | #FFEBEE | #C62828 |
| pending | #FFF3E0 | #F57C00 |
| confirmed | #E8F5E9 | #2E7D32 |

#### Tab Bar Contract
| Property | Value |
|----------|-------|
| background | theme.colors.surface (white) |
| activeTintColor | theme.colors.primary (#7C5CFC) |
| inactiveTintColor | theme.colors.onSurfaceVariant (grey500) |
| borderTopColor | theme.colors.outlineVariant |
| icon style | MaterialCommunityIcons, 24px |

#### Dashboard Header Gradient
| Property | Value |
|----------|-------|
| colors | ['#5A3EC7', '#9B7FFF'] |
| start | { x: 0, y: 0 } |
| end | { x: 1, y: 1 } |
| minHeight | 200 |
| content | greeting, child selector, notification bell |

#### Auth Screen — Full-Screen Brand Layout Contract
| Property | Value |
|----------|-------|
| background | `#5A3EC7` (palette.primary800) — solid, no gradient |
| paddingTop | Platform.OS === 'ios' ? 80 : 60 |
| paddingHorizontal | spacing.lg (24) |
| paddingBottom | spacing.lg (24) |

##### Logo Section
| Property | Value |
|----------|-------|
| icon | '👶' emoji, fontSize: 72 |
| appName | variant: 'headlineLarge', color: '#FFFFFF', fontWeight: '700' |
| tagline | variant: 'bodyMedium', color: 'rgba(255,255,255,0.7)' |
| spacing | logo ↔ name: spacing.sm (8), name ↔ tagline: spacing.xs (4) |

##### Phone Input Pill (LoginScreen)
| Property | Value |
|----------|-------|
| container | bg: white, borderRadius: 9999, height: 56, flexDirection: 'row' |
| countryCode | "+91 ▾", color: grey900, paddingHorizontal: 16, fontWeight: '600' |
| divider | 1px, grey300, height: 24, vertical |
| textInput | flex: 1, fontSize: 16, color: grey900, no border |
| arrowButton | 44x44, borderRadius: 12, bg: palette.primary600, icon: 'arrow-right', iconColor: white |
| arrowButton margin | marginRight: 6 |

##### OTP Input Pill (OtpVerifyScreen) — UPDATED 2026-04-11
| Property | Value |
|----------|-------|
| container | bg: white, borderRadius: borderRadius.md, height: 56, flexDirection: 'row', alignItems: 'center', paddingLeft: spacing.lg, paddingRight: 6 |
| textInput | flex: 1, textAlign: 'center', fontSize: 24, letterSpacing: 12, color: grey900 |
| arrowButton | 44x44, borderRadius: borderRadius.md, bg: palette.primary600, icon: 'arrow-right', iconColor: white |
| arrowButton disabled | opacity: 0.5 |
| loading state | `<ActivityIndicator size="small" color={palette.white} />` replaces icon |
| accessibilityLabel | "Verify OTP" |
| accessibilityRole | "button" |

##### Verify Button (OtpVerifyScreen) — REMOVED 2026-04-11
~~Replaced by inline arrow button inside pill (see above)~~

##### Terms Footer — UPDATED 2026-04-11
| Property | Value |
|----------|-------|
| ~~"I will Sign up Later"~~ | **REMOVED** from LoginScreen |
| terms container | position: absolute or marginTop: auto — pinned to bottom |
| terms text | bodySmall, color: 'rgba(255,255,255,0.7)' |
| "Terms & Conditions" link | color: palette.primary300 (#B08DFF), onPress handler |

---

## Profile Screen UI Contract (2026-04-18)

### Screen Layout

| Section | Component | Style |
|---------|-----------|-------|
| Header | `LinearGradient` | colors: `['#8E6CEF', '#B89EFF']`, height: ~200px, paddingTop: safe area |
| Background | `ScrollView` | backgroundColor: `#F7F7FB` |
| Profile Card | `View` (white card) | backgroundColor: `#FFFFFF`, borderRadius: 16–20, shadows.sm, padding: 16 |
| Baby Cards | `View` (white card, mapped) | Same style as Profile Card |
| Buttons | `Button` (RNP) | mode: `contained` (primary), mode: `outlined` (secondary) |

### Header Section Contract

| Element | Props |
|---------|-------|
| `LinearGradient` | colors: `['#8E6CEF', '#B89EFF']`, start: `{x:0, y:0}`, end: `{x:1, y:1}` |
| `Avatar.Image` | size: 100, circular, centered |
| Edit icon | `IconButton` icon: `camera`, position: absolute, bottom-right of avatar, bg: `#8E6CEF`, border: 2px white |
| User name | `Text` variant: `headlineMedium`, color: `#FFFFFF`, centered below avatar |

### Profile Card Fields

| Field | Component | Props | Editable |
|-------|-----------|-------|----------|
| Name | `TextInput` mode="outlined" | label="Name" | Yes (edit mode) |
| Mobile Number | `TextInput` mode="outlined" | label="Mobile Number", left=`+91` affix | **Never** (always disabled) |
| Age | `TextInput` mode="outlined" | label="Age", keyboardType="number-pad" | Yes (edit mode) |
| Address | `TextInput` mode="outlined" | label="Address", multiline | Yes (edit mode) |
| Emergency Contact | `TextInput` mode="outlined" | label="Emergency Contact", keyboardType="phone-pad" | Yes (edit mode) |
| Email Address | `TextInput` mode="outlined" | label="Email Address", keyboardType="email-address" | Yes (edit mode) |
| Gender | `Menu` + `TextInput` | label="Gender", right=chevron-down icon | Yes (edit mode, dropdown) |
| Father Name | `TextInput` mode="outlined" | label="Father Name" | Yes (edit mode) |

### Baby Card Fields

| Field | Component | Props |
|-------|-----------|-------|
| Baby Name | `TextInput` mode="outlined" | label="Baby Name" |
| Age | `TextInput` mode="outlined" | label="Age", keyboardType="number-pad" |
| Gender | `Menu` + `TextInput` | label="Gender", right=chevron-down |
| Prior Disease | `TextInput` mode="outlined" | label="Any Prior Disease" |
| Notes | `TextInput` mode="outlined" | label="Notes", multiline |

### Button Contract

| Button | Mode | Style | Label |
|--------|------|-------|-------|
| Edit Profile | `contained` | bg: `#8E6CEF`, borderRadius: 24, full width | "Edit Profile" |
| Save | `contained` | bg: `#8E6CEF`, borderRadius: 24, full width | "Save" |
| + Add Baby | `outlined` | borderColor: `#8E6CEF`, borderRadius: 24, full width | "+ Add Baby" |
| Remove Baby | `IconButton` | icon: `delete-outline`, color: error | (icon only) |

### Interaction States

| State | Behavior |
|-------|----------|
| Default (View Mode) | All fields `editable={false}`, button shows "Edit Profile" |
| Edit Mode | All fields `editable={true}` (except mobile), button shows "Save" |
| Mobile field | `disabled={true}` always, grey appearance |
| Gender dropdown | Opens `Menu` on press (only in edit mode) |
| + Add Baby | Appends new empty baby card to array |
| Remove Baby | Removes baby card from array (with confirmation optional) |

### Design Tokens (Profile-specific)

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#F7F7FB` | Screen background |
| Card bg | `#FFFFFF` | Profile card, baby cards |
| Primary | `#8E6CEF` | Buttons, gradient, accents |
| Gradient end | `#B89EFF` | Lighter purple for gradient |
| Card radius | 16–20px (`borderRadius.lg` to `borderRadius.xl`) | All cards |
| Card shadow | `shadows.sm` (elevation 2, opacity 0.1) | All cards |
| Spacing grid | 8px base (`spacing.sm`) | Consistent spacing |
| Avatar size | 100px | Profile image |
| Input style | mode="outlined", soft borders | All TextInputs |
