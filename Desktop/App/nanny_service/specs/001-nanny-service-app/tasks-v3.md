---
description: "Task list for Nanny Service App — Notification Screen"
---

# Tasks: Notification Screen

**Input**: Design documents from `/specs/001-nanny-service-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md (Section 15), data-model.md (Notification section), contracts/notification-screen.md

**Tests**: Integration tests and slice tests are included. The Notification Screen is a new feature with no existing tests.

**Organization**: Tasks grouped by phase. This feature adds a new Notification Screen accessible from the Dashboard bell icon. It includes 1 new screen, 1 new reusable component, a Redux slice, navigation wiring, mock data, and tests. Zero new dependencies.

**Previous tasks**: Archived to tasks-v2.md (Profile View/Edit Refinement, T001–T013, all complete) and tasks-v1.md (initial app build, T001–T024, all complete).

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[NS]**: Notification Screen feature label
- Exact file paths included in every task description

---

## Phase 1: Setup (Models, API Stub, Mock Data)

**Purpose**: Define the Notification data model, create the API stub, and add mock notification data. Must be complete before Redux slice or UI work.

- [X] T001 Add `NotificationType`, `Notification`, and `NotificationSection` interfaces to src/models/index.ts:
  - Add `NotificationType` union type: `'payout' | 'topup' | 'alert' | 'received'`
  - Add `Notification` interface with fields:
    - `id: string` — unique notification ID
    - `type: NotificationType` — determines icon and badge style
    - `title: string` — main notification message text
    - `amount?: string` — optional dollar amount to highlight (e.g. "$19", "$640")
    - `timestamp: string` — display time (e.g. "11.00 AM")
    - `date: string` — ISO date string for grouping (e.g. "2026-04-18")
    - `isRead: boolean` — whether notification has been seen
  - Add `NotificationSection` interface for SectionList:
    - `title: string` — section header text ("TODAY", "YESTERDAY", "APR 16")
    - `data: Notification[]` — notifications in this date group
  - Export all three types from the file

- [X] T002 [P] Create notification API stub in src/api/notification.ts:
  - Import `Notification` from `../models`
  - Import `mockNotifications, delay` from `../mocks/data`
  - Export `fetchNotificationsApi` async function: calls `await delay(400)`, returns `mockNotifications` array
  - Add barrel export `export * from './notification'` to src/api/index.ts

- [X] T003 [P] Add mock notification data to src/mocks/data.ts:
  - Import `Notification` from `../models`
  - Add `mockNotifications: Notification[]` array with 4 entries matching the screenshot:
    1. `{ id: 'n1', type: 'payout', title: 'A Netflix payout of $19 has been successful!', amount: '$19', timestamp: '11.00 AM', date: '<today ISO>', isRead: false }`
    2. `{ id: 'n2', type: 'topup', title: 'Successfully top up balance $150 from US CITIBAN. See details here.', amount: '$150', timestamp: '08.00 AM', date: '<today ISO>', isRead: true }`
    3. `{ id: 'n3', type: 'alert', title: 'Please top up to continue transactions on Netflix', timestamp: '01.00 AM', date: '<today ISO>', isRead: true }`
    4. `{ id: 'n4', type: 'received', title: 'You received money from JENNIFER BACHDIM $640', amount: '$640', timestamp: '11.00 AM', date: '<yesterday ISO>', isRead: true }`
  - Use `new Date().toISOString().split('T')[0]` for today and compute yesterday dynamically
  - Export `mockNotifications` from the file
  - Add re-export in src/mocks/index.ts if barrel pattern exists

**Checkpoint**: Notification model types defined, API stub returns mock data, 4 mock notifications match the screenshot. No UI yet.

---

## Phase 2: Foundational (Redux Slice & Navigation Types)

**Purpose**: Create the Redux slice for notification state and update navigation types. MUST be complete before UI screens.

**⚠️ CRITICAL**: No UI or navigation work can begin until this phase is complete.

- [X] T004 Create notificationSlice in src/store/slices/notificationSlice.ts:
  - Import `createSlice, createAsyncThunk, PayloadAction` from `@reduxjs/toolkit`
  - Import `Notification, NotificationSection` from `../../models`
  - Import `fetchNotificationsApi` from `../../api/notification`
  - Import `RootState` from `../index` (or define inline type to avoid circular import)
  - Define `NotificationState` interface: `{ notifications: Notification[]; isLoading: boolean; error: string | null }`
  - Initial state: `{ notifications: [], isLoading: false, error: null }`
  - Create `fetchNotifications` async thunk: calls `fetchNotificationsApi()`, returns `Notification[]`
  - Create slice with name `'notification'`, extraReducers for pending/fulfilled/rejected states
  - Add `markAsRead` reducer: takes `PayloadAction<string>` (notification id), sets `isRead: true`
  - Export helper function `getDateLabel(dateStr: string): string`:
    - Compare `dateStr` to today's date → return `"TODAY"`
    - Compare to yesterday → return `"YESTERDAY"`
    - Otherwise → format as `"MMM DD"` uppercase (e.g. "APR 16") using `Date` methods and month names array
  - Export selector `selectGroupedNotifications(state: RootState): NotificationSection[]`:
    - Group `state.notification.notifications` by `date` field
    - For each group: `{ title: getDateLabel(date), data: notifications }`
    - Sort groups: today first, then yesterday, then older dates descending
  - Export `selectNotificationLoading` and `selectNotificationError` selectors
  - Export default reducer and named actions

- [X] T005 Register notificationSlice in src/store/index.ts:
  - Import `notificationReducer` from `./slices/notificationSlice`
  - Add `notification: notificationReducer` to the `reducer` object in `configureStore`

- [X] T006 [P] Add `Notifications` route to DashboardStackParamList in src/navigation/types.ts:
  - Add `Notifications: undefined` to the `DashboardStackParamList` type definition

**Checkpoint**: Redux slice ready with thunk + selectors, store configured, navigation types updated. UI work can now begin.

---

## Phase 3: Notification Screen (UI Implementation) 🎯

**Goal**: Build the NotificationItem component, the NotificationScreen with SectionList, wire navigation from Dashboard bell icon.

**Independent Test**: Launch app → tap bell icon on Dashboard → navigates to Notification screen with purple header → see "TODAY" section header with 3 notifications (payout, topup, alert) → see "YESTERDAY" section with 1 notification (received) → dollar amounts highlighted in red/coral → timestamps in grey → back button returns to Dashboard.

### Implementation

- [X] T007 [P] [NS] Create NotificationItem component in src/components/NotificationItem.tsx:
  - Import `View, StyleSheet` from `react-native`
  - Import `Text, Divider` from `react-native-paper`
  - Import `MaterialCommunityIcons` from `@expo/vector-icons`
  - Import `useAppTheme` from `../theme`
  - Import `spacing, borderRadius` from `../theme/tokens`
  - Import `Notification, NotificationType` from `../models`
  - Define `NotificationItemProps`: `{ notification: Notification; testID?: string }`
  - Define icon mapping constant:
    ```
    const ICON_MAP: Record<NotificationType, string> = {
      payout: 'credit-card-outline',
      topup: 'plus-circle-outline',
      alert: 'message-text-outline',
      received: 'clock-check-outline',
    };
    ```
  - Implement `renderHighlightedText(title: string, amount?: string)` helper:
    - If no `amount`, return `<Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>{title}</Text>`
    - If `amount` present, split `title` on the `amount` substring. Render parts as normal text with the amount portion as `<Text style={{ color: theme.colors.secondary, fontWeight: '700' }}>{amount}</Text>`
  - Layout per contract:
    - Row: `flexDirection: 'row'`, `alignItems: 'flex-start'`, `paddingHorizontal: spacing.lg`, `paddingVertical: spacing.md`
    - Icon badge: 44x44 `View`, `borderRadius: borderRadius.full`, `backgroundColor: theme.colors.primaryContainer`, `alignItems: 'center'`, `justifyContent: 'center'`
    - Icon: `MaterialCommunityIcons` name from `ICON_MAP[notification.type]`, size 20, color `theme.colors.primary`
    - Text container: `flex: 1`, `marginLeft: spacing.md`
    - Timestamp: `Text variant="bodySmall"`, color `theme.colors.outline`, `marginTop: spacing.xs`
    - Divider: `style={{ marginLeft: spacing.lg + 44 + spacing.md }}` (84 total, aligns with text start)
  - Accessibility: `accessible={true}`, `accessibilityLabel={`${notification.title}. ${notification.timestamp}`}` on row View
  - Icon badge: `accessibilityElementsHidden={true}` (decorative)
  - Export as default
  - Add `export { default as NotificationItem } from './NotificationItem'` to src/components/index.ts

- [X] T008 [NS] Create NotificationScreen in src/screens/Notification/NotificationScreen.tsx:
  - Import `React, useEffect` from `react`
  - Import `View, SectionList, StyleSheet` from `react-native`
  - Import `Text, ActivityIndicator` from `react-native-paper`
  - Import `MaterialCommunityIcons` from `@expo/vector-icons`
  - Import `useAppTheme` from `../../theme`
  - Import `spacing` from `../../theme/tokens`
  - Import `useAppDispatch, useAppSelector` from `../../store/hooks`
  - Import `fetchNotifications, selectGroupedNotifications, selectNotificationLoading, selectNotificationError` from `../../store/slices/notificationSlice`
  - Import `NotificationItem` from `../../components/NotificationItem`
  - Import `NotificationSection` from `../../models`
  - On mount: `dispatch(fetchNotifications())`
  - Get `sections` from `useAppSelector(selectGroupedNotifications)`
  - Get `isLoading` from `useAppSelector(selectNotificationLoading)`
  - Get `error` from `useAppSelector(selectNotificationError)`
  - **Loading state**: centered `ActivityIndicator` with `color={theme.colors.primary}`
  - **Error state**: centered `Text` with error message, color `theme.colors.error`
  - **Empty state** (sections.length === 0 and not loading):
    - Centered `View` with `flex: 1`, `justifyContent: 'center'`, `alignItems: 'center'`
    - `MaterialCommunityIcons` name `"bell-outline"`, size 64, color `theme.colors.surfaceVariant`
    - `Text variant="titleMedium"` color `theme.colors.onSurfaceVariant`: "No notifications yet"
    - `Text variant="bodySmall"` color `theme.colors.outline`: "You'll see your notifications here"
  - **SectionList**:
    - `sections={sections}`
    - `keyExtractor={(item) => item.id}`
    - `renderItem={({ item }) => <NotificationItem notification={item} testID={`notification-${item.id}`} />}`
    - `renderSectionHeader`: `<Text variant="labelLarge" style={{ color: theme.colors.primary, textTransform: 'uppercase', letterSpacing: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm }}>{section.title}</Text>` with `accessibilityRole="header"`
    - `stickySectionHeadersEnabled={false}`
    - `contentContainerStyle={{ flexGrow: 1 }}` (so empty state centers)
    - `style={{ backgroundColor: theme.colors.background }}`
  - Export as default

- [X] T009 [NS] Register NotificationScreen route in src/navigation/DashboardNavigator.tsx:
  - Import `NotificationScreen` from `../screens/Notification/NotificationScreen`
  - Add new `Stack.Screen` after the BookingConfirmation screen:
    ```tsx
    <Stack.Screen
      name="Notifications"
      component={NotificationScreen}
      options={{
        title: 'Notifications',
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#FFFFFF',
      }}
    />
    ```

- [X] T010 [NS] Wire bell icon navigation in src/screens/Dashboard/DashboardScreen.tsx:
  - Locate the `IconButton` with `icon="bell-outline"` (line ~105)
  - Change `onPress={() => {}}` to `onPress={() => navigation.navigate('Notifications')}`
  - `navigation` is already available from `useNavigation<NativeStackNavigationProp<DashboardStackParamList>>()`

- [X] T011 [NS] Run TypeScript compilation and lint check via `npx tsc --noEmit && npm run lint` — fix any type or lint errors from all new/updated files

**Checkpoint**: Full Notification Screen functional — bell icon navigates to screen, grouped notifications render with icons + highlighted amounts + timestamps, empty state works, back navigation works. Core feature complete.

---

## Phase 4: Tests & Polish

**Purpose**: Add test coverage for the notification slice and screen, run full verification, visual QA.

- [X] T012 [P] [NS] Create notificationSlice tests in __tests__/notification/notificationSlice.test.ts:
  - Import `notificationReducer, fetchNotifications, markAsRead, getDateLabel, selectGroupedNotifications` from slice
  - Import `configureStore` from `@reduxjs/toolkit`
  - **Test 1**: "initial state has empty notifications, isLoading false, error null"
  - **Test 2**: "fetchNotifications/pending sets isLoading true"
  - **Test 3**: "fetchNotifications/fulfilled populates notifications and sets isLoading false"
  - **Test 4**: "fetchNotifications/rejected sets error message and isLoading false"
  - **Test 5**: "markAsRead sets isRead true for matching notification id"
  - **Test 6**: "getDateLabel returns 'TODAY' for today's date"
  - **Test 7**: "getDateLabel returns 'YESTERDAY' for yesterday's date"
  - **Test 8**: "getDateLabel returns formatted 'MMM DD' for older dates"
  - **Test 9**: "selectGroupedNotifications groups notifications by date with correct section titles"
  - Use `configureStore` with `notification: notificationReducer` for selector tests

- [X] T013 [P] [NS] Create NotificationScreen integration tests in __tests__/notification/NotificationScreen.test.tsx:
  - Import `render, waitFor` from `@testing-library/react-native`
  - Import `Provider` from `react-redux`, `configureStore`, `NavigationContainer` from `@react-navigation/native`
  - Import `PaperProvider` from `react-native-paper`
  - Mock `../src/api/notification` to return mock data or empty array
  - Create helper `renderWithProviders` (consistent with existing test patterns in `__tests__/profile/`)
  - **Test 1**: "renders section headers TODAY and YESTERDAY" — wait for sections to appear, verify text
  - **Test 2**: "renders notification items with correct titles" — verify all 4 notification titles
  - **Test 3**: "highlights dollar amounts in notification text" — verify "$19", "$150", "$640" text nodes exist
  - **Test 4**: "renders timestamps for each notification" — verify "11.00 AM", "08.00 AM", "01.00 AM"
  - **Test 5**: "renders empty state when no notifications" — mock API to return `[]`, verify "No notifications yet" text
  - **Test 6**: "renders loading indicator while fetching" — verify `ActivityIndicator` appears before data loads

- [X] T014 Run full verification suite via `npx tsc --noEmit && npm run lint && npx jest --passWithNoTests --forceExit`:
  - Confirm 0 TypeScript errors
  - Confirm 0 ESLint errors
  - Confirm all existing tests still pass (78 from previous rounds)
  - Confirm new notification tests pass (up to 15 new tests)
  - Report final test count

- [X] T015 Visual QA pass — launch app and verify:
  1. Dashboard: bell icon in gradient header is tappable
  2. Tap bell → navigates to Notification screen with purple header bar, white "Notifications" title, back arrow
  3. "TODAY" section header in purple uppercase text
  4. 3 notifications under TODAY: payout (credit-card icon), topup (plus-circle icon), alert (message icon)
  5. Dollar amounts "$19", "$150" highlighted in red/coral (theme.colors.secondary)
  6. Timestamps "11.00 AM", "08.00 AM", "01.00 AM" in grey below each message
  7. "YESTERDAY" section header
  8. 1 notification: received (clock-check icon) with "$640" highlighted
  9. Dividers aligned with text start (84px left margin)
  10. Icon badges: 44px circle, light purple background, purple icon
  11. Back button returns to Dashboard
  12. Empty state: if mock data cleared, shows bell icon + "No notifications yet" + subtitle
  13. Works in both light and dark theme

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 (T001 models needed by T004 slice)
- **Phase 3 (UI)**: Depends on Phase 2 (T004 slice needed by T008 screen, T006 types needed by T009 route)
- **Phase 4 (Tests & Polish)**: Depends on Phase 3 completion

### Within Phase 1

```text
T001 (models) — T002 [P] (API stub) — T003 [P] (mock data)
T002 and T003 can run in parallel but both depend on T001 (import Notification type)
```

### Within Phase 2

```text
T004 (slice) → T005 (register in store)
T006 [P] (nav types) — can run in parallel with T004/T005
```

### Within Phase 3

```text
T007 [P] (NotificationItem) — can run in parallel with T008 setup
T008 (NotificationScreen) — depends on T007 for component import
T009 (route registration) — depends on T006 (types) + T008 (screen)
T010 (bell icon wiring) — depends on T009 (route exists)
T011 (tsc + lint) — depends on T010 (all code in place)
```

### Within Phase 4

```text
T012 [P] + T013 [P] — tests can run in parallel (different files)
T014 — depends on T012 + T013 (all tests written)
T015 — depends on T014 (all checks pass)
```

### Parallel Opportunities

- **Phase 1**: T002 + T003 can run in parallel after T001
- **Phase 2**: T006 can run in parallel with T004 + T005
- **Phase 3**: T007 can be written in parallel with early T008 work
- **Phase 4**: T012 + T013 can run in parallel (different test files)

---

## Parallel Example: Phase 1

```bash
# After T001 (models) is complete:
Task T002: "Create notification API stub in src/api/notification.ts"       # [P]
Task T003: "Add mock notification data to src/mocks/data.ts"               # [P]
```

## Parallel Example: Phase 4

```bash
# After Phase 3 is complete:
Task T012: "Create notificationSlice tests in __tests__/notification/notificationSlice.test.ts"       # [P]
Task T013: "Create NotificationScreen integration tests in __tests__/notification/NotificationScreen.test.tsx" # [P]
```

---

## Implementation Strategy

### MVP First (Notification Screen Viewable)

1. Complete Phase 1 (T001–T003): Models + API + mock data
2. Complete Phase 2 (T004–T006): Redux slice + store + nav types
3. Complete Phase 3 (T007–T011): UI + navigation wiring
4. **STOP and VALIDATE**: Tap bell icon → see grouped notifications with icons & highlighted amounts
5. This delivers the complete visual feature

### Full Delivery

1. Phase 1 (T001–T003) → Phase 2 (T004–T006) → Phase 3 (T007–T011) → Phase 4 (T012–T015)
2. Total: **15 tasks**, 5 existing files modified, 5 new files created, 2 test files
3. Zero new dependencies — all components from existing libraries
4. Estimated: Single developer, ~45–60 minutes

### Incremental Delivery

1. T001–T003 complete → Notification data model and mock data ready
2. T004–T006 complete → Redux state management and navigation prepared
3. T007–T010 complete → Full notification UI with navigation from dashboard
4. T011 complete → Type-safe and lint-clean
5. T012–T015 complete → Fully tested, verified, visually QA'd

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [NS] label = Notification Screen feature (new feature, not in original spec.md user stories)
- Zero new dependencies — uses existing react-native SectionList, react-native-paper, @expo/vector-icons, Redux Toolkit
- All styling via existing theme tokens — no hardcoded colors, spacing, or typography
- Mock data uses dynamic dates (today/yesterday computed at runtime) for realistic section headers
- `NotificationItem` is a reusable component — can be used in future push notification features
- `getDateLabel` helper is exported for unit testing and future reuse
- Previous tasks archived: tasks-v1.md (T001–T024) and tasks-v2.md (T001–T013)