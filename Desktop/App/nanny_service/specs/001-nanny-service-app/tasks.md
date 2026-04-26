# Implementation Tasks: Subscription UX Refresh (Weekly Plan + Time Range)

**Feature**: Subscription Management Redesign  
**Branch**: `[001-nanny-service-app]`  
**Plan**: [plan.md](plan.md) | [research.md](research.md) | [data-model.md](data-model.md) | [contract](contracts/subscription-redesign.md) | [quickstart](quickstart.md)

**Organization**: Tasks are organized by phase (foundation → user story → polish) and by parallelization potential.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **Checkbox**: ALWAYS start with `- [ ]` (markdown checkbox)
- **Task ID**: Sequential (T001, T002, T003...) in execution order
- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Maps to user story from spec.md (e.g., [US5]); omitted for foundational/polish tasks
- **Description**: Clear action with exact file path

---

## Dependency Graph

```
Phase 2 (Foundational)
├── T001: Update Subscription model types
├── T002: Regenerate mock subscription data
├── T003: Update API types and request mapping
└── T004: Update Redux slice schema validation

         ↓ (All Phase 2 must complete before Phase 3)

Phase 3 (US5: Subscription Management - P3)
├── T005: [P] Create ConfirmationModal component
├── T006: [P] Implement time range selection logic
├── T007: Redesign SubscriptionScreen weekday/frequency UI
├── T008: Add confirmation modal integration to card actions
├── T009: [P] Implement screen interaction tests (nanny search)
├── T010: [P] Implement screen interaction tests (schedule validation)
└── T011: Implement screen interaction tests (confirmation modal)

         ↓ (All Phase 3 must complete before Phase 4)

Phase 4 (Polish & Cross-Cutting)
├── T012: [P] Run full test suite (Redux + screen)
└── T013: [P] Lint and format all modified files
```

---

## Phase 2: Foundational (Schema & Domain Layer)

**Goal**: Update subscription domain model and infrastructure to support weekly scheduling (frequencyPerWeek, weekdays, startTime, endTime).  
**Independent Test Criteria**:
- Redux tests pass with new schema (7/7 existing pattern + new validators)
- Mock data compiles and Redux reducers accept it
- Type system prevents old schema usage (TypeScript compilation)
- API client validates new payload shape

---

### T001: Update Subscription model types

- [X] T001 Update Subscription interface in [src/models/index.ts](src/models/index.ts) to add `frequencyPerWeek: 1 | 2`, `weekdays: string[]`, `startTime: string`, `endTime: string` and remove `fromDate`, `toDate`, `timeSlot`

**Implementation tasks**:
- Export updated Subscription type with new schedule fields
- Add JSDoc comments for each field describing format (e.g., startTime: HH:mm)
- Ensure type is used by API, Redux, and screen layer
- Remove old schedule field types to prevent usage

**Validation**:
- TypeScript compilation succeeds
- No references to old fields (fromDate, toDate, timeSlot) remain
- Updated type imports in four files: api/subscription.ts, store/slices/subscriptionSlice.ts, screens/Subscription/SubscriptionScreen.tsx, mocks/data.ts

---

### T002: Regenerate mock subscription data

- [X] T002 Update mock subscriptions in [src/mocks/data.ts](src/mocks/data.ts) with new schedule format (frequencyPerWeek, weekdays, startTime, endTime)

**Implementation tasks**:
- Create 2–3 example subscriptions with `frequencyPerWeek: 1` and `frequencyPerWeek: 2`
- Include varied weekday combinations (e.g., ["Monday", "Wednesday"])
- Use realistic 3+ hour time ranges (e.g., "09:00" – "12:00")
- Maintain consistent nanny references (existing mock nanny IDs)
- Remove old fromDate/toDate/timeSlot fields from all mock objects

**Validation**:
- Mock data matches updated Subscription type
- Redux selectors can access new fields without errors
- App compiles and runs without mock data errors

---

### T003: Update API types and request mapping

- [X] T003 Refactor CreateSubscriptionRequest and subscription API types in [src/api/subscription.ts](src/api/subscription.ts) with new schema

**Implementation tasks**:
- Update `CreateSubscriptionRequest` type to include `frequencyPerWeek: 1 | 2`, `weekdays: string[]`, `startTime: string`, `endTime: string`
- Remove `fromDate`, `toDate`, `timeSlot` from API type definitions
- Update mock subscription API response structure
- Add request payload validation notes in JSDoc (frequency/weekday/time validation)

**Validation**:
- API types match data-model.md contract
- Payload mapping in thunk (T004) will align with this type
- TypeScript compilation succeeds

---

### T004: Update Redux slice schema validation

- [X] T004 Refactor subscription slice create thunk and reducers in [src/store/slices/subscriptionSlice.ts](src/store/slices/subscriptionSlice.ts) to validate new schema (frequencyPerWeek, weekdays, startTime, endTime)

**Implementation tasks**:
- Update `createSubscription` thunk to accept new payload shape
- Add validation checks:
  - `frequencyPerWeek` is 1 or 2
  - `weekdays` array length equals `frequencyPerWeek`
  - `startTime` and `endTime` are HH:mm format and within 08:00–20:00
  - `endTime > startTime` and duration ≥ 3 hours
- Update action payload types in createSlice
- Update mock API call and test fixtures to use new payload schema
- Update error messages to reference new field names

**Validation**:
- Redux tests pass with updated payloads (run: `npm test -- subscriptionSlice.test.ts`)
- Type guards prevent invalid payloads from reaching reducers
- Error messages are user-friendly and stored in errorMessage state

---

## Phase 3: User Story 5 - Subscription Management (P3)

**Goal**: Redesign the SubscriptionScreen to support weekly planning with nanny search, frequency/weekday/time selection, attractive card display, and confirmation modals before pause/resume/delete.  
**Independent Test Criteria**:
- Nanny search filters by typed name in real-time and reflects selection
- Frequency selector allows 1 or 2 days/week; weekday chips respond to frequency count
- Time range picker accepts exactly two clicks (start then end); validation enforces min duration and bounds
- Confirmation modal appears before every pause/resume/delete action
- Card layout is visually distinct and shows frequency label, weekday(s), and time range
- Screen interaction tests cover all user paths and validation failures

---

### T005: [P] Create ConfirmationModal component

- [X] T005 [P] [US5] Create ConfirmationModal component in [src/components/ConfirmationModal.tsx](src/components/ConfirmationModal.tsx) for pause/resume/delete actions

**Implementation tasks**:
- Create reusable modal component with props: `{ isVisible: boolean, title: string, message: string, onConfirm: () => void, onCancel: () => void, isLoading?: boolean }`
- Display centered on screen with dim background overlay
- Include `Cancel` and `Confirm` buttons using React Native Paper Button component
- Apply design tokens for colors, spacing, typography (no hardcoded values)
- Handle loading state during async dispatch (disable confirm button, show spinner)
- Export from [src/components/index.ts](src/components/index.ts)

**Validation**:
- Component renders without errors
- Buttons trigger callbacks correctly
- Modal closes when Cancel is tapped
- Loading state visibly blocks user interaction during submission
- Design tokens used throughout (reference [src/theme/tokens.ts](src/theme/tokens.ts))

---

### T006: [P] Implement time range selection logic

- [X] T006 [P] [US5] Create time range picker hook in [src/hooks/useTimeRangePicker.ts](src/hooks/useTimeRangePicker.ts) supporting two-click start/end selection

**Implementation tasks**:
- Hook accepts existing time range (if editing) and frequency constraint
- Exposes state: `{ startTime: string | null, endTime: string | null, activeField: 'start' | 'end' | null, errors: Record<string, string> }`
- On first time click: set `activeField: 'start'`, user selects start time
- On second time click: set `activeField: 'end'`, user selects end time and trigger validation
- Validate on second selection:
  - `endTime > startTime`
  - Duration ≥ 3 hours
  - Both times within 08:00–20:00
- Return validation errors if constraints violated
- Include reset function for form reuse
- Export from [src/hooks/index.ts](src/hooks/index.ts) (create if needed)

**Validation**:
- Type-safe state transitions
- Validation enforced at second click only
- Hook integrates cleanly with useState in SubscriptionScreen
- No errors in TypeScript compilation

---

### T007: [US5] Redesign SubscriptionScreen weekday/frequency UI

- [X] T007 [US5] Refactor SubscriptionScreen create modal form in [src/screens/Subscription/SubscriptionScreen.tsx](src/screens/Subscription/SubscriptionScreen.tsx): replace date pickers with frequency selector, weekday chips, and time range picker

**Implementation tasks**:
- Replace `fromDate` and `toDate` DateTimePicker fields with:
  - Frequency selector (segmented control or radio button group: "1 day/week" vs "2 days/week")
  - Weekday chip selection (Mon–Sun buttons) with count constraint matching frequency
  - Time range picker using `useTimeRangePicker` hook with two-click interaction
- Preserve nanny search modal (existing logic can be reused)
- Update form validation to block submission with incomplete fields:
  - Nanny not selected
  - Frequency not selected
  - Weekday count does not match frequency
  - Start or end time not set
  - Time range validation errors (from T006)
- Display inline validation errors below fields (color-coded via design tokens)
- Form submit dispatches Redux `createSubscription` thunk with new payload shape
- On success, close modal and refresh subscription list
- On error, display errorMessage from Redux state

**Validation**:
- Modal renders without errors
- Frequency selector limits weekday chip count
- Time picker icon/button responds to two clicks (start, then end)
- Form validation prevents submission with incomplete fields
- Errors display in accessible format
- Screen compiles without TypeScript errors

---

### T008: [US5] Add confirmation modal integration to card actions

- [X] T008 [US5] Integrate ConfirmationModal component with subscription card pause/resume/delete actions in [src/screens/Subscription/SubscriptionScreen.tsx](src/screens/Subscription/SubscriptionScreen.tsx)

**Implementation tasks**:
- Track pending action state in screen-local state: `{ pendingAction: 'pause' | 'resume' | 'delete' | null, pendingSubscriptionId: string | null }`
- When user taps card action button (pause/resume/delete), set pending state and show ConfirmationModal
- ConfirmationModal title and message vary by action:
  - Pause: "Pause Subscription?" / "This nanny will no longer service your account until you resume."
  - Resume: "Resume Subscription?" / "This nanny will resume service on the next scheduled date."
  - Delete: "Delete Subscription?" / "This cannot be undone."
- On confirm, dispatch Redux action (pauseSubscription / resumeSubscription / deleteSubscription) with subscription ID
- Pass `isLoading` prop from Redux state (isLoading) to ConfirmationModal to prevent double-clicks
- On cancel, clear pending state and close modal without dispatch
- On success, update Redux state automatically (reducer handles list update)
- On error, show error message from Redux state

**Validation**:
- Card action buttons are tappable
- Confirmation modal appears with correct action-specific message
- Redux action dispatches on confirm with correct ID
- Modal closes on cancel without dispatch
- Loading state prevents duplicate submissions

---

### T009: [P] Implement screen interaction tests (nanny search)

- [ ] T009 [P] [US5] Replace test.todo placeholders with working tests for nanny search in [__tests__/subscription/SubscriptionScreen.test.tsx](__tests__/subscription/SubscriptionScreen.test.tsx)

**Tests to implement**:
- Verify search input filters nanny list in real-time (type name → list updates)
- Verify tapping a nanny result row selects it and updates selectedNanny state
- Verify selected nanny row is visually highlighted (style prop differs)
- Verify empty search shows all available nannies
- Verify tapping nanny closes result list and shows nanny name in form
- Verify nanny selection persists across modal re-renders
- Verify selected nanny row displays image, name, and rating

**Implementation notes**:
- Use mock nanny data from src/mocks/data.ts
- Use React Testing Library queries (getByText, getByRole, etc.)
- Mock Redux dispatch to capture createSubscription calls
- Render SubscriptionScreen within Redux Provider (using test setup)

**Validation**:
- All tests pass (run: `npm test -- SubscriptionScreen.test.tsx`)
- Positive cases covered (search, select, close)
- Edge cases covered (empty search, no results, rapid re-selection)
- No test.todo placeholders remain

---

### T010: [P] Implement screen interaction tests (schedule validation)

- [ ] T010 [P] [US5] Implement tests for frequency/weekday/time validation in [__tests__/subscription/SubscriptionScreen.test.tsx](__tests__/subscription/SubscriptionScreen.test.tsx)

**Tests to implement**:
- Verify selecting frequency 1 restricts weekday chip selection to 1 max
- Verify selecting frequency 2 restricts weekday chip selection to 2 max
- Verify weekday chips can be toggled on/off
- Verify time picker responds to two clicks (first sets start, second sets end)
- Verify validation error if endTime ≤ startTime
- Verify validation error if time range < 3 hours
- Verify validation error if start time outside 08:00–20:00
- Verify validation error if end time outside 08:00–20:00
- Verify form submission blocked with inline error messages if any field invalid
- Verify form submission allowed when all fields valid

**Implementation notes**:
- Mock DateTimePicker or time input to simulate two clicks
- Test validation error messages are user-friendly text
- Verify error colors use design tokens (not hardcoded)
- Mock Redux dispatch; verify createSubscription action is only called with valid payloads

**Validation**:
- All edge cases covered (1-day, 2-day, boundary times, short duration, outside hours)
- Errors display in correct locations (below fields)
- Tests pass (run: `npm test -- SubscriptionScreen.test.tsx`)
- No test.todo placeholders remain

---

### T011: [US5] Implement screen interaction tests (confirmation modal)

- [ ] T011 [US5] Implement tests for pause/resume/delete confirmation flow in [__tests__/subscription/SubscriptionScreen.test.tsx](__tests__/subscription/SubscriptionScreen.test.tsx)

**Tests to implement**:
- Verify pause button on card opens ConfirmationModal with pause message
- Verify resume button on card opens ConfirmationModal with resume message
- Verify delete button on card opens ConfirmationModal with delete message
- Verify canceling modal closes it without dispatching action
- Verify confirming modal dispatches correct Redux action (pauseSubscription / resumeSubscription / deleteSubscription) with subscription ID
- Verify card list updates after successful action (subscription removed for delete, status changed for pause/resume)
- Verify error state displays if action fails (network error, validation error)
- Verify loading state prevents duplicate confirmations
- Verify modal message text matches contract specification

**Implementation notes**:
- Mock Redux dispatch to capture action calls
- Mock Redux state updates to reflect committed changes
- Test both success and error paths
- Verify accessibility (button labels, roles)

**Validation**:
- All tests pass (run: `npm test -- SubscriptionScreen.test.tsx`)
- Mock dispatch calls captured correctly
- Card list UI updates reflect committed state (not just UI state)
- Error handling shows user-friendly messages
- No test.todo placeholders remain

---

## Phase 4: Polish & Cross-Cutting Concerns

**Goal**: Ensure all code passes linting, type checking, and full test suite; prepare for merge.  
**Independent Test Criteria**:
- All jest tests pass (Redux + Screen)
- TypeScript compilation succeeds with no errors
- ESLint and Prettier formatting clean
- Coverage remains above baseline

---

### T012: [P] Run full test suite (Redux + screen)

- [ ] T012 [P] Execute full subscription test suite to validate all Phase 2/3 changes

**Command**:
```bash
npm test -- subscription
```

**Expected Results**:
- subscriptionSlice.test.ts passes (7 existing tests + new validator tests)
- SubscriptionScreen.test.tsx passes (T009, T010, T011 implementations)
- No test regressions from schema migration
- Coverage threshold met for new conditional logic

**Troubleshooting**:
- If React Native animations fail, see jest.setup.ts for mock configuration
- If type errors occur, verify T001 types propagated to all imports

**Success Criteria**:
- All tests pass
- Coverage report shows new branches covered (frequency validation, time validation, modal dispatch)

---

### T013: [P] Lint and format all modified files

- [ ] T013 [P] Run linting and formatting on all subscription-related files

**Commands**:
```bash
npm run lint -- --fix src/screens/Subscription/ src/store/slices/subscriptionSlice.ts src/api/subscription.ts src/models/index.ts src/mocks/data.ts src/components/ConfirmationModal.tsx src/hooks/useTimeRangePicker.ts __tests__/subscription/
npm run format -- src/screens/Subscription/ src/store/slices/subscriptionSlice.ts src/api/subscription.ts src/models/index.ts src/mocks/data.ts src/components/ConfirmationModal.tsx src/hooks/useTimeRangePicker.ts __tests__/subscription/
```

**Expected Results**:
- No ESLint errors or warnings
- Prettier formatting consistent
- TypeScript strict mode passes

**Validation**:
- All files format cleanly
- No code quality issues remain
- Conditional logic is clear and testable

**Success Criteria**:
- Zero linting errors/warnings
- Consistent formatting across all modified files

---

## Execution Strategy

### Sequential Phase Order (Required)
1. **Phase 2** (T001–T004): Schema layer → **blocks** all feature work
2. **Phase 3** (T005–T011): User story implementation
3. **Phase 4** (T012–T013): Polish and finalization

### Parallel Within Phases

**Phase 2 Parallelization**:
- T001 must complete first (types)
- Then T002, T003, T004 can run in parallel (all depend on T001)
- Estimated: 2–3 hours sequential

**Phase 3 Parallelization**:
- T005 & T006 can run in parallel (components, no dependencies)
- T007 depends on T001–T006 (main screen redesign)
- T008 depends on T005 & T007 (integration)
- T009, T010, T011 can start after T005 finishes (tests mostly independent)
- Estimated: 4–6 hours (with parallelization)

**Phase 4 Parallelization**:
- T012 & T013 can run in parallel (both depend on all Phase 3)
- Estimated: 1 hour

**Total Estimated Time**: 6–10 hours (with parallelization) vs. 12+ hours (sequential)

---

## Manual Quickstart Verification

Before merge, manually verify using [quickstart.md](quickstart.md):

- [ ] Open SubscriptionScreen. Search for nanny by typing name. Verify list filters in real-time.
- [ ] Tap nanny result row. Verify selection highlights and modal shows nanny name.
- [ ] Select "1 day/week" frequency. Verify weekday selector allows only 1 chip.
- [ ] Select "2 days/week" frequency. Verify weekday selector allows 2 chips.
- [ ] Tap time input twice (start, then end). Verify each click updates field.
- [ ] Enter invalid time (end ≤ start). Verify error message blocks submission.
- [ ] Enter valid time (3+ hours, within 08:00–20:00). Verify form allows submission.
- [ ] Tap "Create". Verify subscription card appears with frequency label, weekdays, and time range.
- [ ] Tap pause button. Verify confirmation modal appears with pause message.
- [ ] Tap cancel. Verify modal closes and subscription status unchanged.
- [ ] Tap pause, then confirm. Verify card status changes to "paused".
- [ ] Tap resume, then confirm. Verify card status changes to "active".
- [ ] Tap delete, then confirm. Verify card is removed.
- [ ] Verify UI is visually attractive (ample spacing, clear hierarchy, token-based design, no date fields).

---

## Success Criteria (Feature Complete)

✅ **User Story 5** (subscription management) achieves all acceptance criteria:
1. User can create subscription with 1 or 2 days/week
2. User can select specific weekdays and time range (2-click interaction)
3. User can pause, resume, or delete subscription with confirmation modal
4. Card display is attractive and shows frequency label, weekdays, time range
5. All changes are independently testable

✅ **Code Quality**:
- All tests pass (Redux + screen interaction)
- TypeScript strict mode compliance
- ESLint and Prettier clean
- No hardcoded design values (all tokens used)

✅ **Constitution Alignment** (per plan.md, Phase 0/1):
- Modular code within subscription boundaries
- Consistent UI patterns (React Native Paper, design tokens)
- Mobile-first and responsive
- Validation and error handling present
- Scalable architecture (weekly model is extensible)

---

## Notes

- **Test Environment**: React Native Testing Library may require animated library mocks. See jest.setup.ts if CI fails.
- **Design Tokens**: Ensure all colors, spacing, typography come from [src/theme/tokens.ts](src/theme/tokens.ts). No hardcoded values.
- **Redux DevTools**: Use Redux Devtools extension during development to inspect dispatches and state.
- **Git Workflow**: Commit after Phase 2 completion (schema lock), then Phase 3 (features), then Phase 4 (polish).

