---
description: "Task list for Nanny Service App — Profile Screen View/Edit Mode Refinement"
---

# Tasks: Profile Screen View/Edit Mode Refinement

**Input**: Design documents from `/specs/001-nanny-service-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md (Section 14), data-model.md (View/Edit Refinement section), contracts/profile-view-edit.md

**Tests**: Existing integration tests (6 tests in `__tests__/profile/ProfileScreen.test.tsx`) will need updating to verify view mode shows label-value rows and edit mode shows TextInputs. Existing validation tests (20 tests) remain unchanged.

**Organization**: Tasks grouped by user story. This refinement is **User Story 3 — Profile Management (P2)**. The previous round (tasks-v1.md, T001–T024, all complete) implemented the initial ProfileScreen. This round refines the view/edit rendering, adds a sticky footer button, and conditionally hides the camera icon.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US3)
- Exact file paths included in every task description

---

## Phase 1: Setup (New Component)

**Purpose**: Create the shared `ProfileFieldRow` component that the view mode depends on. Must be complete before ProfileScreen refactoring.

- [X] T001 Create `ProfileFieldRow` component in src/components/ProfileFieldRow.tsx — reusable label-value row for view mode:
  - Props: `icon?: string` (MaterialCommunityIcons name), `label: string`, `value: string`, `testID?: string`
  - Import `Text, Divider` from `react-native-paper`, `View` from `react-native`, `MaterialCommunityIcons` from `@expo/vector-icons`
  - Import `useAppTheme` from `../../theme` and tokens `spacing` from `../../theme/tokens`
  - Layout: `flexDirection: 'row'`, `alignItems: 'flex-start'`, `paddingVertical: spacing.sm`, `paddingHorizontal: spacing.md`
  - Icon: size 20, `color: theme.colors.outline`, `marginRight: spacing.sm`, `marginTop: 2` (visual align with label)
  - Label: `variant="bodySmall"`, `color: theme.colors.outline`
  - Value: `variant="bodyLarge"`, `color: theme.colors.onSurface`, `fontWeight: '600'`; if value is empty/undefined, show "—" in `theme.colors.outline`
  - Include `Divider` at bottom with `style={{ backgroundColor: theme.colors.surfaceVariant }}`
  - Add `accessibilityLabel={`${label}: ${value || 'not set'}`}` on the row View
  - Export as default and add to src/components/index.ts barrel export

- [X] T002 [P] Run TypeScript compilation check via `npx tsc --noEmit` — confirm ProfileFieldRow compiles correctly with all imports and props typed

**Checkpoint**: ProfileFieldRow component ready for use. No existing code modified yet.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No foundational changes needed — models, validation schemas, and Redux slices are unchanged from the previous round. This phase is skipped.

**⚠️ Note**: All model interfaces (`User`, `BabyDetail`), validation schemas (`profileSchema`, `babyDetailSchema`), and Redux state remain exactly as implemented in tasks-v1.md. No blocking prerequisites for this refinement.

---

## Phase 3: User Story 3 — Profile View/Edit Mode Refactor (Priority: P2) 🎯

**Goal**: Refactor ProfileScreen to render **view mode** as label-value text rows (ProfileFieldRow) and **edit mode** as TextInput fields. Move the edit/save button to a sticky footer. Show camera icon only in edit mode. All styling uses existing purple theme tokens.

**Independent Test**: Launch app → navigate to Profile tab → see gradient header with avatar (no camera icon) → profile card shows 8 label-value rows with icons (Name, Mobile, Age, Address, Emergency Contact, Email, Gender, Father Name) → tap "Edit Profile" (fixed at bottom) → all fields become TextInputs, camera icon appears on avatar, "+ Add Baby" appears → edit name → tap "Save" → fields return to label-value display with updated name → scroll entire screen, footer button stays fixed.

### Implementation for User Story 3

- [X] T003 [US3] Refactor profile card **view mode** rendering in src/screens/Profile/ProfileScreen.tsx:
  - Import `ProfileFieldRow` from `../../components/ProfileFieldRow`
  - Import `MaterialCommunityIcons` from `@expo/vector-icons` (if not already imported)
  - Replace the 8 current `TextInput` components inside the profile card with conditional rendering: `{isEditing ? <TextInput ...> : <ProfileFieldRow icon="..." label="..." value={...} />}`
  - Field mapping (view mode):
    - Name: `icon="account-outline"`, `label="Name"`, `value={name}`
    - Mobile: `icon="phone-outline"`, `label="Mobile Number"`, `value={profile?.mobile || ''}`
    - Age: `icon="calendar-account-outline"`, `label="Age"`, `value={age}`
    - Address: `icon="map-marker-outline"`, `label="Address"`, `value={address}`
    - Emergency Contact: `icon="phone-alert-outline"`, `label="Emergency Contact"`, `value={emergencyContact}`
    - Email: `icon="email-outline"`, `label="Email"`, `value={email}`
    - Gender: `icon="gender-male-female"`, `label="Gender"`, `value={getGenderLabel(gender)}`
    - Father Name: `icon="account-supervisor-outline"`, `label="Father Name"`, `value={fatherName}`
  - Keep all existing edit mode `TextInput` + `HelperText` rendering unchanged (wrapped in `isEditing` conditional)
  - Keep `Menu` for gender dropdown in edit mode unchanged

- [X] T004 [US3] Refactor baby cards **view mode** rendering in src/screens/Profile/ProfileScreen.tsx:
  - Inside each baby card's `babies.map(...)`, add conditional rendering:
    - **View mode**: Show baby name as bold header `Text` (no delete button), then `ProfileFieldRow` rows for Age (`value={baby.age}`), Gender (`value={getGenderLabel(baby.gender)}`), Prior Disease (`icon="medical-bag"`, `value={baby.priorDisease}`), Notes (`icon="note-text-outline"`, `value={baby.notes}`)
    - **Edit mode**: Keep existing `TextInput` fields and `Menu` dropdown, delete `IconButton` — all unchanged
  - Baby card header in view mode: `Text variant="titleMedium"` with `baby.name || 'Baby'`, no delete button
  - Baby card header in edit mode: Keep existing row with `baby.name || 'New Baby'` + delete `IconButton` — unchanged

- [X] T005 [US3] Move edit/save button to **sticky footer** in src/screens/Profile/ProfileScreen.tsx:
  - Move the `Button` ("Edit Profile" / "Save") from inside the `ScrollView` to OUTSIDE it, as a sibling of the `ScrollView` within `KeyboardAvoidingView`
  - Wrap the button in a new `View` with `style={styles.stickyFooter}` and inline theme styles: `backgroundColor: theme.colors.background`, `borderTopWidth: StyleSheet.hairlineWidth`, `borderTopColor: theme.colors.surfaceVariant`, `...shadows.sm`
  - Update `ScrollView` `contentContainerStyle` paddingBottom from `spacing.xxl` (48) to `80` to prevent content from hiding behind the footer
  - Button styling: keep existing `mode="contained"`, `borderRadius: borderRadius.xl`

- [X] T006 [US3] Make camera icon **edit-mode only** in src/screens/Profile/ProfileScreen.tsx:
  - Find the `IconButton` with `icon="camera"` inside the gradient header's avatar container
  - Wrap it in a conditional: `{isEditing && (<IconButton icon="camera" ... />)}`
  - No other changes to the IconButton's props, styling, or accessibility label

- [X] T007 [US3] Update StyleSheet in src/screens/Profile/ProfileScreen.tsx:
  - Add new `stickyFooter` style: `{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg }`
  - Update `content` (ScrollView contentContainerStyle) paddingBottom to `80`
  - Update `editSaveButton` style: remove `marginTop` and `marginHorizontal` (button is now full-width inside padded footer), keep `borderRadius: borderRadius.xl`
  - All values must use tokens from `src/theme/tokens.ts` — no hardcoded numbers except `paddingBottom: 80` (footer clearance)

- [X] T008 [US3] Run TypeScript compilation and lint check via `npx tsc --noEmit && npm run lint` — fix any type or lint errors from the refactored ProfileScreen

- [X] T009 [US3] Run existing test suite via `npx jest --passWithNoTests --forceExit` — confirm no regressions from view/edit mode changes; note any failing tests for Phase 4 fixes

**Checkpoint**: ProfileScreen renders label-value rows in view mode, TextInputs in edit mode, camera icon hidden in view mode, edit/save button fixed at bottom. Core UI refinement complete.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Update integration tests to verify the new view/edit mode rendering, run final QA checks.

- [X] T010 [P] [US3] Update integration tests in __tests__/profile/ProfileScreen.test.tsx:
  - **Update Test 1** ("Renders all 8 profile fields"): Change assertions to verify `ProfileFieldRow` text is rendered (query for label+value text like "Name", "John Doe") instead of querying for TextInput elements. Verify NO TextInput components are rendered in default view mode.
  - **Update Test 2** ("Tap Edit Profile → fields become editable"): After pressing "Edit Profile", verify TextInput components appear for Name, Age, Address, etc. Verify camera icon (`"Change profile picture"`) becomes visible via `accessibilityLabel` query.
  - **Update Test 3** ("Tap Save → fields return to read-only"): After save, verify TextInput components disappear and label-value text re-appears.
  - **Add Test 7**: "View mode hides camera icon" — render screen, query for `accessibilityLabel="Change profile picture"`, assert it is NOT in the tree.
  - **Add Test 8**: "Sticky footer button is always visible" — render screen, query for "Edit Profile" button, assert it's present outside scroll context.
  - Keep Tests 4, 5, 6 (add baby, remove baby, gender dropdown) — adjust selectors if view/edit conditional changed the render tree.

- [X] T011 [P] Accessibility audit for ProfileScreen view mode — verify:
  - All `ProfileFieldRow` components have `accessibilityLabel` with format "{label}: {value}"
  - Footer button: `accessibilityLabel` is "Edit profile" in view mode, "Save profile changes" in edit mode
  - Camera icon hidden from accessibility tree in view mode (not rendered, so automatically excluded)
  - All touch targets ≥ 44px (footer button, camera icon in edit mode)
  - Contrast: label grey (`theme.colors.outline`) on white card passes WCAG AA for large text; value dark on white is AAA

- [X] T012 Run full test suite + lint + tsc via `npx tsc --noEmit && npm run lint && npx jest --passWithNoTests --forceExit` — confirm all tests pass, 0 lint errors, 0 type errors

- [X] T013 Visual QA pass — launch app on iOS simulator and verify:
  1. **View mode default**: Gradient header with avatar, NO camera icon visible
  2. Profile card shows 8 label-value rows with icons (account, phone, calendar, map, alert, email, gender, supervisor)
  3. Each row: grey label text above bold dark value text, thin divider between rows
  4. Empty fields show "—" placeholder
  5. Baby cards show label-value rows (no delete button, no TextInput borders)
  6. "Edit Profile" button fixed at screen bottom with subtle top shadow
  7. Scroll up/down — footer button stays pinned at bottom
  8. **Edit mode**: Tap "Edit Profile" → all fields become TextInput with outlines, camera icon appears on avatar
  9. "+ Add Baby" button appears below baby cards
  10. Baby cards show TextInputs + delete button
  11. Gender dropdown opens Menu in edit mode
  12. Tap "Save" → returns to label-value view mode
  13. Both light and dark themes render correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — new component creation, start immediately
- **Phase 2 (Foundational)**: Skipped — no model/schema changes needed
- **Phase 3 (US3 Refactor)**: Depends on Phase 1 (T001 creates ProfileFieldRow needed by T003/T004)
- **Phase 4 (Polish)**: Depends on Phase 3 completion

### Within Phase 3

```text
T003 (profile view mode) → T004 (baby view mode) → T005 (sticky footer) → T006 (camera conditional) → T007 (styles) → T008 (tsc + lint) → T009 (jest)
```

- T003–T007 all modify `src/screens/Profile/ProfileScreen.tsx` — must be applied sequentially to avoid conflicts
- T003 is the largest change (8 fields × conditional rendering)
- T005 restructures the JSX tree (moves button outside ScrollView) — should be done after field changes
- T006 is a minimal 1-line conditional wrap
- T007 is a styles-only change, safe to do last before checks

### Parallel Opportunities

**Phase 1**: T001 and T002 are sequential (T002 checks T001's output)

**Phase 4**: T010 + T011 can run in parallel (different files/concerns: test updates vs accessibility audit)

---

## Parallel Example: Phase 4

```bash
# These can run in parallel (different concerns):
Task T010: "Update integration tests in __tests__/profile/ProfileScreen.test.tsx"
Task T011: "Accessibility audit for ProfileScreen view mode"
```

---

## Implementation Strategy

### MVP First (View Mode + Sticky Footer)

1. Complete T001: Create `ProfileFieldRow` component
2. Complete T003: Refactor profile card view mode
3. Complete T005: Move button to sticky footer
4. **STOP and VALIDATE**: Profile fields render as label-value rows in view mode, button is fixed at bottom
5. This delivers the core visual improvement immediately

### Full Delivery

1. Phase 1 (T001–T002) → Phase 3 (T003–T009) → Phase 4 (T010–T013)
2. Total: **13 tasks**, 2 source files modified (ProfileScreen.tsx, components/index.ts), 1 new file (ProfileFieldRow.tsx), 1 test file updated
3. Estimated: Single developer, ~30–45 minutes
4. Zero new dependencies

### Incremental Delivery

1. T001 complete → Reusable `ProfileFieldRow` available for any future screen
2. T003–T006 complete → Full view/edit mode distinction working in UI
3. T007–T009 complete → Styles polished, type-safe, no regressions
4. T010–T013 complete → Tests updated, accessibility verified, visual QA passed

---

## Notes

- [P] tasks = different files, no dependencies
- [US3] label maps task to User Story 3 (Profile Management) from spec.md
- This is a **UI refactoring round** — same state model, same Redux integration, same validation
- No new dependencies — uses existing `react-native-paper`, `@expo/vector-icons`, theme tokens
- `ProfileFieldRow` is a new shared component in `src/components/` for reuse across future screens
- Mobile number is rendered as `ProfileFieldRow` in view mode (never editable, no conditional needed for it)
- Baby card view mode uses `ProfileFieldRow` without icons (simpler display) — icons optional per field
- Previous tasks (tasks-v1.md, T001–T024) are all marked complete and archived
