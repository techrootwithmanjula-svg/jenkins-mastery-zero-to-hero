# Quickstart: Subscription UX Refresh (Weekly + Time Range)

**Feature**: Redesign subscription cards and create modal for attractive, easy-to-use weekly planning.

## Goal

Deliver a clean and mobile-friendly subscription flow where users:
- Search nanny by name (no nanny ID input)
- See runtime nanny list with image and rating
- Choose `One day/week` or `Two days/week`
- Select weekday(s) based on chosen frequency
- Select start and end time in two clicks
- Confirm pause/resume/delete through modal

## Planned Files

- `src/screens/Subscription/SubscriptionScreen.tsx`
- `src/models/index.ts`
- `src/api/subscription.ts`
- `src/store/slices/subscriptionSlice.ts`
- `src/mocks/data.ts`
- `__tests__/subscription/subscriptionSlice.test.ts`
- `__tests__/subscription/SubscriptionScreen.test.tsx`
- `specs/001-nanny-service-app/contracts/subscription-redesign.md`

## Manual Verification Flow

1. Open Subscription screen.
2. Confirm redesigned cards look clean and readable.
3. Tap `+ New Subscription`.
4. Type nanny name and verify list rows show image, name, rating.
5. Select a nanny row.
6. Select `One day/week`, then select exactly one weekday.
7. Select start time and end time using two-click flow.
8. Create subscription and verify card shows frequency, weekday(s), time range.
9. Repeat with `Two days/week` and verify exactly two weekdays are required.
10. Tap `Pause` and verify confirmation modal appears before status update.
11. Tap `Resume` and verify confirmation modal appears before status update.
12. Tap `Delete` and verify confirmation modal appears before removal.

## Validation Checklist

- Modal does not require nanny ID entry.
- Date fields are not present.
- Frequency is limited to one-day/week or two-days/week.
- Weekday selection count matches selected frequency.
- Time selection completes via start/end two-click interaction.
- Invalid time range is blocked with user-friendly validation.
- Pause/resume/delete always require confirmation.
- Screen remains theme-aware and token-based.

## Suggested Validation Commands

- `npm run lint`
- `npm test -- __tests__/subscription/subscriptionSlice.test.ts`
- `npm test -- __tests__/subscription/SubscriptionScreen.test.tsx`
