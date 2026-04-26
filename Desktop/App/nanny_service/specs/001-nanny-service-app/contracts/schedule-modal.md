# UI Contract: Dashboard Schedule Modal — Guided Search Flow

**Date**: 2026-04-20  
**Component**: `ScheduleModal`  
**Primary File**: `src/components/ScheduleModal.tsx`

## Intent

The dashboard scheduler should feel easy to understand before the user interacts with native pickers. It must explain the selected date and time range, expose booking constraints up front, and guide the user toward a valid nanny search.

## Inputs

```ts
interface ScheduleModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSchedule: (date: string, startTime: string, endTime: string) => void;
  babyName: string;
}
```

## Booking Rules

- minimum booking length: 3 hours
- allowed booking window: 8:00 AM to 8:00 PM
- same-day bookings must respect the next valid quarter-hour slot
- end time must remain at or after start time plus minimum booking duration

## Layout Contract

### 1. Header

**Must include**:
- clear title using the child name
- dismiss control
- short supporting copy or summary label

### 2. Schedule Summary

**Must appear near the top** and show:
- selected date
- selected start time
- selected end time
- computed duration

**Behavior**:
- updates immediately when draft values change
- remains visible even when a picker is open

### 3. Rule Hints

**Must communicate**:
- minimum 3-hour booking rule
- service hours window
- same-day availability caveat when relevant

**Behavior**:
- shown as helper content before submission
- error-state copy appears inline when the current draft is invalid

### 4. Input Order

Controls should appear in this order:
1. `Date`
2. `From`
3. `To`

Each control must:
- show current value clearly
- indicate that it opens a picker
- remain theme-aware

### 5. Native Picker Use

**Date**:
- uses native date picker behavior
- blocks past dates

**Time**:
- uses native time picker behavior
- enforces min/max values from booking rules
- should not silently leave the user in an impossible state without visible messaging

### 6. Footer Actions

**Required actions**:
- `Cancel`
- `Search`

**Behavior**:
- `Search` is visually primary
- primary action stays easy to reach on mobile
- invalid state must be visible before or when search is attempted

## Interaction Contract

| Action | Expected Result |
|--------|-----------------|
| Open scheduler | Existing or default draft values are visible immediately |
| Change date | Time values stay synchronized to the chosen day |
| Change start time | End time and duration respond to minimum-duration rules |
| Create invalid range | User sees a clear inline explanation |
| Tap `Cancel` | Modal closes without triggering search |
| Tap `Search` with valid draft | `onSchedule(date, startTime, endTime)` fires |

## Accessibility Contract

- Every field trigger must expose `button` semantics.
- Summary content must be readable without relying on the picker alone.
- Validation messaging must be readable by screen readers.
- Dismiss and primary actions must have clear labels.
- The flow must remain usable in both light and dark theme modes.

## Theme Contract

- Use shared `theme.colors`, `spacing`, `borderRadius`, and `shadows` tokens only.
- Summary, helper, and error surfaces must maintain readable contrast in both themes.
- Do not introduce isolated hardcoded color choices for validation or helper messaging unless they map to existing semantic theme colors.

## Test Scenarios

1. Opening the modal shows schedule summary and helper text.
2. Changing date/start/end updates the summary and duration.
3. Invalid same-day or minimum-duration states show clear feedback.
4. Valid search still routes to nanny search with correct formatted values.
5. Cancel dismisses without side effects.
6. Accessibility labels remain correct for field triggers and action buttons.
