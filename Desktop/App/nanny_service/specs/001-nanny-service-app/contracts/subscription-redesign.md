# Contract: Subscription Screen Redesign (Weekly + Time Range)

**Feature**: User-friendly subscription management with runtime nanny-name search.  
**Updated**: 2026-04-20

## Screen Contract

### Primary Goals

- Replace `Nanny ID` entry with nanny-name search input.
- Show nanny suggestion list while user types (image, name, rating).
- Remove date fields from subscription flow.
- Capture schedule as weekly frequency + weekday(s) + start/end time.
- Show confirmation modal before pause/resume/delete.

## Create/Edit Modal Contract

### Fields

| Field | Type | Required | Behavior |
|------|------|----------|----------|
| nannyNameQuery | text | Yes | Filters nanny list in real-time as user types |
| selectedNannyId | string | Yes | Set only by selecting a result row |
| frequencyPerWeek | 1 \| 2 | Yes | `One day/week` or `Two days/week` |
| weekdays | string[] | Yes | Count must match `frequencyPerWeek` |
| startTime | time | Yes | First click in two-click range selection |
| endTime | time | Yes | Second click in two-click range selection |

### Nanny Search Result Row

Each row must include:
- Avatar image
- Nanny name
- Rating

Row interaction:
- Tap row selects nanny and binds identifier (`selectedNannyId`).
- Selected row style is visibly distinct.

### Validation Rules

- Submission blocked if nanny is not selected.
- Submission blocked if frequency or weekday selection is incomplete.
- Submission blocked if time range incomplete/invalid.
- `endTime > startTime`, minimum 3 hours, within 08:00–20:00.
- Validation messages are user-friendly.

## Subscription Card Contract (List)

Each subscription card must display:
- Nanny name
- Frequency label (`1 day/week` or `2 days/week`)
- Selected weekday(s)
- Time range (`startTime - endTime`)
- Status chip (`active`, `paused`, `cancelled`)
- Contextual actions:
  - `Pause` for active
  - `Resume` for paused
  - `Delete` for all states

## Action Confirmation Modal Contract

Before action execution (`pause`, `resume`, `delete`):
- Show confirmation modal with action-specific message
- `Cancel` closes modal without dispatch
- `Confirm` dispatches action

## State/Action Contract

### Create payload (logical)

```ts
{
  nannyId: string;
  nannyName: string;
  frequencyPerWeek: 1 | 2;
  weekdays: string[];
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}
```

### Action outcomes

- `create`: inserts new card into list.
- `pause`: status changes to paused after confirmation.
- `resume`: status changes to active after confirmation.
- `delete`: card removed after confirmation.

## Accessibility Contract

- Search input has clear accessible label and hint.
- Frequency/weekday/time controls expose selected state.
- Confirmation modal text clearly states action impact.
- Action buttons remain keyboard/screen-reader reachable.

## Theming Contract

- Use theme/tokens for color, spacing, radius, typography.
- No new hardcoded visual constants in screen/component files.