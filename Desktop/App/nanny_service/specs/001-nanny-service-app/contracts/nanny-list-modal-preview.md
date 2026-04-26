# UI Contract: Available Nanny List — Modal Profile Preview

**Date**: 2026-04-20  
**Route**: `NannyList`  
**Primary File**: `src/screens/Nanny/NannyListScreen.tsx`

## Screen Intent

Users should be able to review nanny profile details without leaving the available list screen. Tapping a nanny card opens a modal preview that can be closed quickly, so users can continue browsing or check another profile.

## Inputs

### Navigation Params

```ts
{ date: string; startTime: string; endTime: string }
```

### Data Source

- `nannies` list from existing nanny slice state
- selected nanny item from list tap interaction

## Layout Contract

### 1. Top Header Simplification

**Required**:
- remove filter control
- remove sorting-distance control bar
- keep concise availability/result summary text

### 2. Nanny List

**Behavior**:
- cards remain scrollable in list
- card tap opens profile modal
- card tap must not navigate to `NannyDetail` route

### 3. Profile Preview Modal

**Required content**:
- nanny name, rating/reviews, price, distance/availability status
- key profile details (experience, specialties, availability snapshot)
- close action

**Optional in this scope**:
- booking action button (if present, it should keep current booking flow behavior)

**Behavior**:
- modal opens over current list
- modal close returns to same list context
- user can immediately tap another card to inspect another profile

## Interaction Contract

| Action | Expected Result |
|--------|-----------------|
| Tap nanny card | Opens profile modal in place |
| Close modal | Returns user to list without route transition |
| Tap another card after close | Opens new profile modal |
| Scroll list after closing modal | Maintains expected browsing continuity |

## Accessibility Contract

- Card tap targets remain accessible with clear labels.
- Modal close control is labeled and keyboard/screen-reader reachable.
- Modal content must be readable without relying on color-only cues.
- Hidden/removed filter controls should not remain in accessibility tree.

## Theme Contract

- Use existing theme colors and tokenized spacing/radius/shadows.
- No new hardcoded visual constants introduced for modal chrome or list header.

## Test Scenarios

1. ✅ Filter and sorting-distance controls are not rendered.
2. ✅ Nanny card tap opens modal profile preview.
3. ✅ Modal close works and keeps user on list.
4. ✅ Repeated card selection allows quick switching between profiles.
5. ✅ Booking handoff (placeholder ready for future implementation).
6. ✅ Accessibility labels exist for card and modal close interactions.

## Implementation Status

**Completed**: 2026-04-20

- Modal preview fully functional
- Filter/sort bar removed from top header
- Profile switching works without route navigation
- Booking action placeholder available
- Lint checks passing
- Test scaffolding created

## Notes for Developers

- Modal state is managed locally in `NannyListScreen` (not in Redux)
- Modal animates upward using `animationType="slide"`
- Profile content reuses fields from Nanny entity
- Close button uses accessible `IconButton` from React Native Paper
- Book button ready for booking flow implementation
