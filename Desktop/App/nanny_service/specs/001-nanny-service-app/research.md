# Research: Subscription UX Refresh (Weekly Planning)

**Date**: 2026-04-20  
**Status**: Complete

## Decision 1: Weekly frequency model (`1 day/week` or `2 days/week`)

**Decision**: Represent subscription cadence as `frequencyPerWeek` with allowed values `1` or `2`.

**Rationale**:
- Directly matches the user’s requested mental model.
- Makes validation simple and deterministic.
- Keeps modal controls concise for mobile UX.

**Alternatives considered**:
- Free-form frequency text — rejected due to inconsistent input.
- Open numeric frequency — rejected as out of scope.

## Decision 2: Replace date fields with weekday selection

**Decision**: Remove date inputs and capture recurring plan via selected weekday(s).

**Rationale**:
- Explicit user requirement: remove date fields.
- Weekly plans are better represented by weekdays.
- Reduces cognitive load and form complexity.

**Alternatives considered**:
- Keep optional date range — rejected (conflicts with request).
- Hybrid date + weekday form — rejected (unnecessary complexity).

## Decision 3: Two-click time range selection

**Decision**: Use a start/end time range where first click sets start time and second click sets end time.

**Rationale**:
- Matches user requirement for completing time selection in two clicks.
- Produces clear schedule summary on cards.
- Supports strict validation (`end > start`, min duration).

**Alternatives considered**:
- Single predefined slot only — rejected (not explicit start/end).
- Multi-step wizard — rejected as slower and less user-friendly.

## Decision 4: Confirmation modal before pause/resume/delete

**Decision**: Require explicit confirmation modal for all three card actions.

**Rationale**:
- Prevents accidental lifecycle changes and deletions.
- Matches explicit user requirement.
- Keeps behavior consistent across action types.

**Alternatives considered**:
- Undo snackbar pattern — rejected (user asked for modal first).
- Confirm delete only — rejected (pause/resume also requested).

## Decision 5: Attractive, easy-to-scan card/modal layout

**Decision**: Redesign card hierarchy and modal sectioning (nanny, frequency, weekdays, time range, actions) with token-based spacing and theming.

**Rationale**:
- Resolves complaint that current card/screen does not look good.
- Improves readability and touch flow on mobile.
- Aligns with constitution requirements for consistency and theming.

**Alternatives considered**:
- Minor visual tweak only — rejected (insufficient UX improvement).

## Research Summary

- Runtime nanny search remains local UI state.
- New schedule model should be `frequencyPerWeek + weekdays + startTime + endTime`.
- Date fields are removed from subscription UX.
- Confirmation modal is mandatory before pause/resume/delete.
- No additional dependencies are required for this design update.
