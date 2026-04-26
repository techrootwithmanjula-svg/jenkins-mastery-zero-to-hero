# UI Contract: Appointment Schedule Screen — Calendar Picker Polish

**Date**: 2026-04-19  
**Route**: `Appointments`  
**Primary File**: `src/screens/Appointment/AppointmentScheduleScreen.tsx`

## Screen Intent

The `Appointments` screen keeps the existing week-strip and hourly schedule layout, but upgrades the month/date trigger so tapping the calendar control opens a polished date-selection experience rather than a visually abrupt inline picker.

## Inputs

### Navigation Params

```ts
{ serviceId: string; serviceTitle: string }
```

### UI State

```ts
interface CalendarViewState {
  selectedDate: Date;
  visibleMonthDate: Date;
  isPickerOpen: boolean;
  draftDate?: Date;
}
```

## Layout Contract

### 1. Month / Date Trigger

**Visual requirements**:
- Displayed in the schedule header above the week strip
- Styled as a compact card or pill using theme tokens
- Shows current month/year as the primary label
- Shows current selected full date as a secondary line
- Includes trailing calendar icon

**Behavior**:
- Tapping opens the platform-appropriate date-selection experience
- The trigger remains visible and stable; opening the picker must not distort the week strip layout
- Trigger exposes expanded state while iOS picker overlay is open

### 2. iOS Picker Surface

**Presentation**:
- Appears in a React Native Paper `Portal`/`Modal` style surface
- Uses theme-aware surface, spacing, border radius, and elevation tokens
- Contains:
  - title
  - currently selected date summary
  - native inline date picker
  - footer with `Cancel` and `Apply`

**Behavior**:
- Opening seeds `draftDate` from `selectedDate`
- Browsing changes only `draftDate`
- `Cancel` dismisses with no schedule changes
- `Apply` commits `draftDate` to `selectedDate`
- Picker summary text reflects `draftDate` while browsing

### 3. Android Picker Flow

**Presentation**:
- Uses the native date dialog flow from the existing datetime picker package

**Behavior**:
- Opens as a dialog, not an inline widget in the screen body
- On confirm, selected date commits immediately
- On dismiss, no schedule changes occur
- `draftDate` is synchronized with committed date after confirm

### 4. Week Strip

**Behavior**:
- Continues to show the 7-day window for the committed `selectedDate`
- Updates only after the user confirms a new date
- Maintains current selected and today states

### 5. Timeline

**Behavior**:
- Continues to render 8 AM–8 PM hourly rows
- Filters appointments by committed `selectedDate`
- Must not rerender to a different day while the picker is only browsing draft state

## Interaction Contract

| Action | Expected Result |
|--------|-----------------|
| Tap month/date trigger | Opens the polished date-selection experience |
| Browse date while picker is open | Updates draft state only |
| Tap `Cancel` on iOS overlay | Closes picker, keeps previous `selectedDate` |
| Confirm date on iOS overlay | Closes picker and commits the new date |
| Confirm date on Android dialog | Closes dialog and commits the new date |
| Dismiss Android dialog | Leaves schedule unchanged |
| Tap a week-strip day | Still commits immediately and updates schedule |

## Accessibility Contract

- Trigger uses `accessibilityRole="button"`
- Trigger label includes the currently selected full date
- Trigger exposes open/expanded state where supported
- `Cancel` and `Apply` are individually labeled and keyboard/screen-reader reachable
- Interactive targets meet mobile touch target expectations
- Selected date is communicated without relying only on color

## Theme Contract

- Use `theme.colors.surface`, `surfaceVariant`, `onSurface`, `onSurfaceVariant`, `primary`, and `backdrop`
- Use shared `spacing`, `borderRadius`, and `shadows` tokens
- No new hardcoded visual constants should be introduced for picker chrome

## Test Scenarios

1. Trigger opens the correct picker presentation for the platform.
2. Opening the picker does not push the week strip or timeline into an awkward layout.
3. Cancel keeps the existing selected date.
4. Apply updates trigger label, week strip, and timeline together.
5. Dark mode preserves readable colors and contrast.
6. Accessibility labels announce the selected date and available actions.
