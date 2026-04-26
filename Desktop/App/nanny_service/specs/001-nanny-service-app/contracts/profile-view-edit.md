# UI Contract: Profile Screen View/Edit Mode

**Updated**: 2026-04-18

## Overview

The Profile Screen renders in two distinct visual modes controlled by a single `isEditing: boolean` state. The transition is instantaneous (no animation).

## View Mode Contract (default)

### Profile Fields

Each field renders as a **ProfileFieldRow** component — a horizontal row of icon + label + value.

```text
┌─ Profile Card (white, borderRadius: 16, shadow.sm) ─────────────┐
│                                                                   │
│  [👤]  Name                                                      │
│        John Doe                                                   │
│  ─────────────────────────────────────────────                   │
│  [📱]  Mobile Number                                             │
│        +91 9876543210                                             │
│  ─────────────────────────────────────────────                   │
│  [📅]  Age                                                       │
│        32                                                         │
│  ─────────────────────────────────────────────                   │
│  [📍]  Address                                                   │
│        123 Main St, Mumbai                                        │
│  ─────────────────────────────────────────────                   │
│  [🚨]  Emergency Contact                                         │
│        +91 9123456789                                             │
│  ─────────────────────────────────────────────                   │
│  [✉️]  Email                                                     │
│        john@example.com                                           │
│  ─────────────────────────────────────────────                   │
│  [⚥]  Gender                                                    │
│        Male                                                       │
│  ─────────────────────────────────────────────                   │
│  [👨]  Father Name                                               │
│        Robert Doe                                                 │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

**Rules**:
- Label: `bodySmall` (12px), `theme.colors.outline` (grey)
- Value: `bodyLarge` (16px), `fontWeight: '600'`, `theme.colors.onSurface` (dark)
- Empty value: "—" in `theme.colors.outline`
- Icon: 20px, `theme.colors.outline`
- Divider: `theme.colors.surfaceVariant` between rows
- No borders, no input outlines, no input placeholders

### Baby Cards (View Mode)

```text
┌─ Baby Card (white, borderRadius: 16, shadow.sm) ────────────────┐
│  Jack                            (no delete button)              │
│  ─────────────────────────────────────────────                   │
│  Age        2                                                     │
│  Gender     Male                                                  │
│  Disease    None                                                  │
│  Notes      Allergic to peanuts                                   │
└───────────────────────────────────────────────────────────────────┘
```

**Rules**: Same label-value style as profile fields. No delete button. No "+ Add Baby" button visible.

### Header (View Mode)

```text
┌─ LinearGradient ['#8E6CEF', '#B89EFF'] ─────────────────────────┐
│                                                                   │
│        ┌─────────┐                                               │
│        │  Avatar  │  (no camera icon)                            │
│        └─────────┘                                               │
│          John Doe                                                 │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

**Camera icon**: HIDDEN in view mode.

## Edit Mode Contract

### Profile Fields

Each field converts to a Paper `TextInput mode="outlined"` with label.

```text
┌─ Profile Card ───────────────────────────────────────────────────┐
│                                                                   │
│  ┌─────────────────────────────────────────┐                     │
│  │ Name                                     │                     │
│  │ John Doe                                 │                     │
│  └─────────────────────────────────────────┘                     │
│  ┌─────────────────────────────────────────┐                     │
│  │ Mobile Number               (disabled)   │                     │
│  │ +91 9876543210                           │                     │
│  └─────────────────────────────────────────┘                     │
│  ... (remaining fields as TextInput)                              │
│  ┌─────────────────────────────────────────┐                     │
│  │ Gender                          [▼]      │                     │
│  │ Male                                     │                     │
│  └─────────────────────────────────────────┘                     │
│                                                                   │
│  [Validation error text in red below invalid fields]              │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

**Rules**:
- All fields: `TextInput mode="outlined"`, `editable={true}` (except mobile)
- Mobile: `TextInput mode="outlined"`, `editable={false}` always
- Gender: `Menu` anchored to `TextInput` with chevron-down icon
- Validation errors: `HelperText type="error"` below each invalid field
- Keyboard types: `number-pad` (age), `phone-pad` (emergency contact), `email-address` (email)

### Header (Edit Mode)

Camera `IconButton` visible:
```text
┌─ LinearGradient ─────────────────────────────────────────────────┐
│        ┌─────────┐                                               │
│        │  Avatar  │                                              │
│        │     [📷]─┘  ← camera icon (44x44, absolute bottom-right)│
│          John Doe                                                 │
└───────────────────────────────────────────────────────────────────┘
```

### Baby Cards (Edit Mode)

Delete button visible. TextInput for all fields. "+ Add Baby" button visible below cards.

## Sticky Footer Contract

```text
┌────────────────────────────────────────┐
│         ScrollView content             │
│         ...                            │
│         paddingBottom: 80              │  ← prevents hidden content
│                                        │
├────────────────────────────────────────┤
│  ┌──────────────────────────────────┐  │  ← position: absolute, bottom: 0
│  │     Edit Profile  /  Save       │  │     bg: theme.colors.background
│  └──────────────────────────────────┘  │     shadow.sm, borderTop hairline
│         paddingBottom: 24 (safe area)  │
└────────────────────────────────────────┘
```

**Rules**:
- Button is OUTSIDE the ScrollView
- `position: 'absolute'`, `bottom: 0`, `left: 0`, `right: 0`
- Background matches screen background for seamless look
- Top border + subtle shadow for visual separation
- `paddingBottom: spacing.lg` for safe area clearance
- Button: `mode="contained"`, `borderRadius: borderRadius.xl` (24), full-width
- View mode label: "Edit Profile"
- Edit mode label: "Save"
- Loading state: shows spinner in button during save

## Interaction Flow

1. **Initial load**: View mode → all fields as label-value rows
2. **Tap "Edit Profile"**: Toggle to edit mode → fields become TextInput, camera icon appears, Add Baby appears
3. **Edit fields**: User modifies values, validation runs on save
4. **Tap "Save"**: 
   - Run Yup validation
   - If valid: dispatch Redux, switch to view mode
   - If invalid: show errors, stay in edit mode
5. **Scroll**: Footer button always visible at bottom regardless of scroll position

## Accessibility

- View mode: `accessibilityLabel="{label}: {value}"` on each row
- Edit mode: `accessibilityLabel` on each TextInput (existing)
- Footer button: `accessibilityLabel="Edit profile"` / `"Save profile changes"`
- Camera icon: `accessibilityLabel="Change profile picture"` (hidden from tree in view mode)
