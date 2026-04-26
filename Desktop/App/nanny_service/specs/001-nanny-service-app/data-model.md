# Data Model: Subscription UX Refresh (Weekly Planning)

**Date**: 2026-04-20

## Overview

This design updates subscription scheduling from date-based inputs to weekly recurrence using frequency, weekday(s), and start/end times.

## Entities

### `Nanny` (existing domain entity)

**Purpose**: Search source for subscription assignment.

**Fields consumed in modal search list**:
- `id: string`
- `name: string`
- `image: string`
- `rating: number`
- `isOnline: boolean`

**Changes in this iteration**: None.

### `Subscription` (updated domain entity)

**Purpose**: Represents a recurring nanny service plan.

**Fields**:
- `id: string`
- `userId: string`
- `nannyId: string`
- `nannyName: string`
- `frequencyPerWeek: 1 | 2`
- `weekdays: string[]` (length must equal `frequencyPerWeek`)
- `startTime: string` (HH:mm)
- `endTime: string` (HH:mm)
- `status: 'active' | 'paused' | 'cancelled'`
- `createdAt: string`

**Validation rules**:
- `nannyId` and `nannyName` must map to selected nanny row.
- `frequencyPerWeek` must be `1` or `2`.
- Weekday count must match selected frequency.
- `startTime` and `endTime` are required.
- `endTime` must be greater than `startTime`.
- Duration must be at least 3 hours and within 08:00–20:00.

### `SubscriptionModalState` (screen-local)

**Purpose**: Handles create/edit modal user interactions.

**Fields**:
- `isOpen: boolean`
- `searchQuery: string`
- `filteredNannies: Nanny[]`
- `selectedNanny: Nanny | null`
- `frequencyPerWeek: 1 | 2 | null`
- `selectedWeekdays: string[]`
- `startTime: string | null`
- `endTime: string | null`
- `pendingAction: 'pause' | 'resume' | 'delete' | null`
- `pendingSubscriptionId: string | null`
- `validationErrors: Record<string, string>`

## Relationships

- `searchQuery` + `Nanny[]` → `filteredNannies` in modal list.
- `selectedNanny + frequencyPerWeek + selectedWeekdays + start/end` → `createSubscription` payload.
- Card action tap (`pause|resume|delete`) → confirmation modal → dispatch action.

## State Transitions

1. **Open modal**
   - Reset fields and errors

2. **Search and select nanny**
   - User types name
   - Runtime filtered list appears
   - User taps row to bind identity

3. **Choose plan cadence**
   - Select one-day or two-day frequency
   - Select corresponding weekday(s)

4. **Select time range (2-click)**
   - Click 1: set start time
   - Click 2: set end time

5. **Create subscription**
   - Valid form dispatches create thunk
   - On success modal closes and card list refreshes

6. **Manage subscription status**
   - Pause/resume/delete opens confirmation modal first
   - Confirm dispatches action; cancel aborts

## Non-Functional Rules

- Keep search/filter operations screen-local for responsive UX.
- Preserve token/theme usage (no hardcoded design constants).
- Maintain Redux/API boundaries and existing list action semantics.
