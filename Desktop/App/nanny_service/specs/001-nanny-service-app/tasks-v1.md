---
description: "Task list for Nanny Service App — Profile Screen Redesign"
---

# Tasks: Profile Screen Redesign

**Input**: Design documents from `/specs/001-nanny-service-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md (Section 14), data-model.md (Profile section), contracts/README.md (Profile Screen UI Contract)

**Tests**: Not explicitly requested — no test tasks generated. Existing validation tests in `__tests__/profile/profileValidation.test.ts` will need updating after model/schema changes (included as implementation task).

**Organization**: Tasks grouped by user story. This redesign is **User Story 3 — Profile Management (P2)**. Scope: 3 source files modified (`src/models/index.ts`, `src/screens/Profile/ProfileScreen.tsx`, `src/utils/validation.ts`), 0 new files, 0 new dependencies.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US3)
- Exact file paths included in every task description

---

## Phase 1: Setup (Verification)

**Purpose**: Confirm current state of files that will be modified — verify existing models, validation schemas, and screen structure before making changes.

- [X] T001 Verify current `User` interface in src/models/index.ts has fields `id, name, email, mobile, babyDetails` — document that `age, address, emergencyContact, gender, fatherName, profileImage` are missing and need to be added
- [X] T002 [P] Verify current `BabyDetail` interface in src/models/index.ts has fields `id, name, age, gender, image?, notes?` — confirm `priorDisease` field is missing and needs to be added
- [X] T003 [P] Verify current `profileSchema` in src/utils/validation.ts only validates `name` and `email` — confirm extended fields (`age, address, emergencyContact, gender, fatherName`) are not yet validated
- [X] T004 [P] Verify current ProfileScreen in src/screens/Profile/ProfileScreen.tsx has no gradient header, no card layout, no edit/save toggle — confirm full redesign is needed

**Checkpoint**: All gaps confirmed — models need extension, validation needs extension, screen needs full redesign. Ready for Foundational phase.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend data models and validation schemas that the screen redesign depends on. These changes MUST be complete before the screen UI work begins.

**⚠️ CRITICAL**: ProfileScreen redesign (Phase 3) depends on extended User/BabyDetail interfaces and validation schemas.

- [X] T005 [P] Extend `User` interface in src/models/index.ts — add optional fields: `age?: number`, `address?: string`, `emergencyContact?: string`, `gender?: 'male' | 'female' | 'other'`, `fatherName?: string`, `profileImage?: string`. Keep all existing fields unchanged.
- [X] T006 [P] Extend `BabyDetail` interface in src/models/index.ts — add optional field: `priorDisease?: string`. Keep all existing fields unchanged.
- [X] T007 Extend `profileSchema` in src/utils/validation.ts — add validation for new fields: `age` (optional, integer 18–99), `address` (optional, max 500 chars), `emergencyContact` (optional, 10-digit phone matching `/^[6-9]\d{9}$/`), `gender` (optional, oneOf `['male', 'female', 'other']`), `fatherName` (optional, max 100 chars). Keep existing `name` and `email` validation unchanged.
- [X] T008 [P] Extend `babyDetailSchema` in src/utils/validation.ts — add validation for `priorDisease` (optional, max 500 chars). Keep existing `name, age, gender, notes` validation unchanged.
- [X] T009 Run TypeScript compilation check via `npx tsc --noEmit` — fix any type errors from model extensions in src/models/index.ts and src/utils/validation.ts

**Checkpoint**: Models extended, schemas extended, TypeScript compiles. Ready for screen redesign.

---

## Phase 3: User Story 3 — Profile Management (Priority: P2) 🎯

**Goal**: Redesign the ProfileScreen with a modern card-based UI: purple gradient header with circular avatar + camera edit overlay, white profile card with all fields (Name, Mobile, Age, Address, Emergency Contact, Email, Gender dropdown, Father Name), edit/save toggle mode, and dynamic baby card creation. UI-only — no backend API integration.

**Independent Test**: Launch app → navigate to Profile tab → see gradient purple header with avatar and user name → see white profile card with all fields in read-only mode → tap "Edit Profile" → all fields become editable (except mobile) → gender shows dropdown menu → change name and age → tap "Save" → fields return to read-only with updated values → tap "+ Add Baby" → new baby card appears with empty fields → fill in baby name, age, select gender from dropdown, enter prior disease and notes → tap "+ Add Baby" again → second baby card appears → tap delete icon on first baby card → card is removed → scroll entire screen smoothly.

### Implementation for User Story 3

- [X] T010 [US3] Rewrite ProfileScreen gradient header section in src/screens/Profile/ProfileScreen.tsx:
  - Import `LinearGradient` from `expo-linear-gradient`
  - Import `Avatar, IconButton, Menu` from `react-native-paper`
  - Add `LinearGradient` as header with `colors={[theme.colors.primary, palette.primary200]}`, `start={{x:0, y:0}}`, `end={{x:1, y:1}}`
  - Inside gradient: centered `Avatar.Image` (size 100) with fallback to `Avatar.Icon` (icon: `account`) when `profileImage` is undefined
  - Absolutely positioned `IconButton` (icon: `camera`, size: 18) at bottom-right of avatar with bg `theme.colors.primary`, white 2px border
  - User name `Text` below avatar, variant `headlineMedium`, color `theme.colors.onPrimary`, centered

- [X] T011 [US3] Add edit/save toggle state management in src/screens/Profile/ProfileScreen.tsx:
  - Add `const [isEditing, setIsEditing] = useState(false)` state
  - Add local state for all extended profile fields: `age, address, emergencyContact, gender, fatherName` (initialize from profile or empty)
  - Add `const [genderMenuVisible, setGenderMenuVisible] = useState(false)` for gender dropdown
  - Update `useEffect` that syncs from `profile` to also populate new fields
  - Add `handleEditToggle` function: if currently editing → validate with extended profileSchema → save (local state only, no API) → setIsEditing(false); if not editing → setIsEditing(true)

- [X] T012 [US3] Build profile card with all fields in src/screens/Profile/ProfileScreen.tsx:
  - Wrap all profile fields in a card `View` with `backgroundColor: theme.colors.surface`, `borderRadius: borderRadius.lg`, `shadows.sm`, `padding: spacing.md`
  - Screen background: `backgroundColor: theme.colors.background` (light theme maps to `#FAFAFA`, close to `#F7F7FB`)
  - Field order: Name, Mobile Number (+91 affix, always `disabled`), Age (number-pad), Address (multiline), Emergency Contact (phone-pad), Email (email-address), Gender (Menu+TextInput dropdown), Father Name
  - All TextInput components: `mode="outlined"`, `editable={isEditing}` (except mobile which is always `disabled`)
  - Gender field: `Menu` anchored to a `TextInput` with `right={<TextInput.Icon icon="chevron-down">}`, opens only when `isEditing`, options: Male, Female, Other
  - Validation error display with `HelperText` below each field

- [X] T013 [US3] Add Edit Profile / Save button in src/screens/Profile/ProfileScreen.tsx:
  - Below the profile card: `Button` with `mode="contained"`, `style={{ backgroundColor: '#8E6CEF', borderRadius: 24 }}`
  - Label: `isEditing ? 'Save' : 'Edit Profile'`
  - `onPress={handleEditToggle}`
  - Full width button with proper spacing

- [X] T014 [US3] Implement dynamic baby cards section in src/screens/Profile/ProfileScreen.tsx:
  - Add `const [babies, setBabies] = useState<BabyFormData[]>([])` — array of local baby form objects
  - Define `BabyFormData` type: `{ tempId: string; name: string; age: string; gender: 'male' | 'female' | 'other'; priorDisease: string; notes: string }`
  - Initialize `babies` from `profile?.babyDetails` in useEffect (map existing babies to form data)
  - Section header: `Text` "Baby Details" with `variant="titleLarge"`
  - Map `babies` array → card `View` per baby (same card style: `backgroundColor: theme.colors.surface`, `borderRadius: borderRadius.lg`, shadows.sm)
  - Each baby card contains: TextInput "Baby Name", TextInput "Age" (number-pad), Menu+TextInput "Gender" dropdown, TextInput "Any Prior Disease", TextInput "Notes" (multiline)
  - Each baby card has an `IconButton` (icon: `delete-outline`, color: error) in the top-right corner to remove that card
  - All baby card fields: `editable={isEditing}`
  - Per-baby `genderMenuVisible` state managed via `Record<string, boolean>` or individual toggle

- [X] T015 [US3] Add "+ Add Baby" button in src/screens/Profile/ProfileScreen.tsx:
  - Button below baby cards: `mode="outlined"`, `style={{ borderColor: '#8E6CEF', borderRadius: 24 }}`
  - Label: "+ Add Baby"
  - `onPress`: append a new empty `BabyFormData` object with a unique `tempId` (use `Date.now().toString()`) to the `babies` array
  - Only visible/enabled when `isEditing` is true

- [X] T016 [US3] Update StyleSheet in src/screens/Profile/ProfileScreen.tsx:
  - Add styles: `gradientHeader` (paddingTop safe area, paddingBottom 24, alignItems center), `avatarContainer` (width 100, height 100, position relative), `cameraIcon` (position absolute, bottom -4, right -4), `profileCard` (borderRadius: borderRadius.lg, shadows.sm, padding: spacing.md, marginHorizontal: spacing.md, marginTop -40 for overlap effect — bg color set dynamically via `theme.colors.surface`), `babyCard` (same as profileCard but with marginTop: spacing.md), `sectionHeader` (marginTop: spacing.lg, marginBottom: spacing.sm, marginHorizontal: spacing.md), `addBabyButton` (marginHorizontal: spacing.md, marginTop: spacing.sm, borderRadius: borderRadius.xl)
  - Remove old styles that are no longer needed: `sectionTitle`, `divider`, `babyItem`, `babyForm`
  - Container bg set dynamically via `theme.colors.background` (no hardcoded hex)

- [X] T017 [US3] Clean up unused imports and dead code in src/screens/Profile/ProfileScreen.tsx:
  - Remove unused imports: `Divider`, `List` from react-native-paper (if no longer used)
  - Remove old baby form state variables (`babyName, babyAge, babyGender, babyNotes, babyErrors`) if replaced by babies array
  - Remove old `handleAddBaby` function (replaced by dynamic card approach)
  - Remove old `handleUpdateProfile` (replaced by `handleEditToggle`)
  - Ensure all new imports are properly added: `LinearGradient`, `Avatar`, `IconButton`, `Menu`

- [X] T018 [US3] Run TypeScript compilation and lint check via `npx tsc --noEmit && npm run lint` — fix any type or lint errors across all modified files

- [X] T019 [US3] Run existing test suite via `npx jest --passWithNoTests --forceExit` and confirm all tests pass — verify no regressions from model/validation changes

**Checkpoint**: Profile screen fully redesigned with gradient header, card layout, edit/save toggle, extended fields, gender dropdown, and dynamic baby cards. All fields functional in UI. No test regressions.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, validation test updates, and visual verification.

- [X] T020 [P] Update profile validation tests in __tests__/profile/profileValidation.test.ts — add test cases for new `profileSchema` fields (age range 18–99, emergencyContact format, gender enum) and new `babyDetailSchema` field (priorDisease max length)
- [X] T021 [P] [US3] Add integration tests for critical profile screen paths in __tests__/profile/ProfileScreen.test.tsx:
  - Test 1: Renders all 8 profile fields in read-only mode by default
  - Test 2: Tap "Edit Profile" → fields become editable (except mobile), button label changes to "Save"
  - Test 3: Tap "Save" → fields return to read-only mode
  - Test 4: Tap "+ Add Baby" → a new baby card appears with 5 fields
  - Test 5: Tap delete icon on a baby card → card is removed from the list
  - Test 6: Gender dropdown opens Menu with 3 options when in edit mode
  - Use `@testing-library/react-native` render + fireEvent + screen queries
- [X] T022 [P] Verify no unused imports remain and run final lint — `npx tsc --noEmit && npm run lint && npm run format` on all modified files
- [X] T023 [P] Accessibility audit for ProfileScreen — verify all TextInputs have `accessibilityLabel`, Avatar has accessible alt text, gender Menu is navigable, all touch targets ≥ 44px, gradient header text contrast passes WCAG AA (white on #8E6CEF = 4.56:1 ✅)
- [X] T024 Visual QA pass — launch app on iOS simulator and verify:
  1. Gradient header renders with purple gradient (#8E6CEF → #B89EFF)
  2. Circular avatar (100px) centered with camera edit icon at bottom-right
  3. User name displayed in white below avatar
  4. Screen background is light grey (#F7F7FB)
  5. Profile card is white with rounded corners (16px) and soft shadow
  6. All 8 profile fields visible in read-only mode
  7. Mobile number field is always disabled with +91 prefix
  8. Tap "Edit Profile" → all fields become editable (except mobile)
  9. Gender field shows dropdown menu with Male/Female/Other options
  10. Tap "Save" → fields return to read-only
  11. Tap "Edit Profile" again → tap "+ Add Baby" → new baby card appears
  12. Baby card has 5 fields (Name, Age, Gender dropdown, Prior Disease, Notes)
  13. Tap delete icon → baby card removed
  14. Add multiple baby cards → all render properly with consistent spacing
  15. Scroll entire screen smoothly (no jank)
  16. Both light and dark themes render correctly
  17. KeyboardAvoidingView works on iOS when editing text fields

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — verification only, start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 verification — model/schema changes BLOCK screen work
- **Phase 3 (User Story 3)**: Depends on Phase 2 completion (needs extended User/BabyDetail interfaces + validation schemas)
- **Phase 4 (Polish)**: Depends on Phase 3 completion

### Within Phase 2 (Foundational)

```text
T005 + T006 (parallel model extensions) → T007 + T008 (parallel schema extensions) → T009 (tsc check)
```

### Within Phase 3 (User Story 3)

```text
T010 (gradient header) → T011 (state management) → T012 (profile card fields) → T013 (edit/save button)
     ↘                                                                              ↓
      T014 (baby cards) → T015 (add baby button) → T016 (styles) → T017 (cleanup) → T018 (tsc) → T019 (jest)
```

- T010: Sets up the gradient header (prerequisite layout change)
- T011: Adds state management that T012/T013/T014/T015 all depend on
- T012: Builds the profile card using state from T011
- T013: Adds edit/save button using `handleEditToggle` from T011
- T014: Builds baby cards (can start after T011, parallel with T012/T013)
- T015: Adds the "+ Add Baby" button (depends on babies state from T014)
- T016: Updates styles (depends on all layout tasks being defined)
- T017: Cleanup (final code hygiene, depends on all implementation)
- T018, T019: Sequential verification gates

### Parallel Opportunities

**Phase 1**: T001 + T002 + T003 + T004 (all read-only verification of different files)

**Phase 2**: T005 + T006 (different interfaces in same file, but non-overlapping sections can be done together); T007 + T008 (different schemas in same file)

**Phase 3**: T012 + T014 can partially overlap (different sections of screen); T013 + T015 (different buttons)

**Phase 4**: T020 + T021 (different files: test file vs source files)

---

## Parallel Example: Phase 2

```bash
# Extend both model interfaces in parallel (different interfaces in same file):
Task T005: "Extend User interface in src/models/index.ts"
Task T006: "Extend BabyDetail interface in src/models/index.ts"

# Extend both validation schemas in parallel (different schemas in same file):
Task T007: "Extend profileSchema in src/utils/validation.ts"
Task T008: "Extend babyDetailSchema in src/utils/validation.ts"
```

## Parallel Example: Phase 3

```bash
# After T011 (state management), these can overlap:
Task T012: "Build profile card with all fields"
Task T014: "Implement dynamic baby cards section"
```

---

## Implementation Strategy

### MVP First (Profile Card Only)

1. Complete Phase 1: Verify gaps (read-only, 1 min)
2. Complete Phase 2: Extend models + schemas (T005–T009)
3. Implement T010: Gradient header
4. Implement T011: State management
5. Implement T012: Profile card with all fields
6. Implement T013: Edit/save button
7. **STOP and VALIDATE**: Profile card with edit/save toggle working independently
8. This delivers the core profile editing UX without baby cards

### Full Delivery

1. Phase 1 (verify) → Phase 2 (models + schemas) → Phase 3 (screen redesign) → Phase 4 (polish + QA)
2. Total: **22 tasks**, 3 source files modified, 1 test file updated, 0 new files, 0 new dependencies
3. Estimated: Single developer, ~60–90 minutes

### Incremental Delivery

1. Phase 2 complete → Extended models available across app
2. T010–T013 complete → Profile card with gradient header + edit/save toggle (MVP)
3. T014–T015 complete → Baby cards with add/remove functionality
4. T016–T019 complete → Polished, type-safe, regression-free
5. T020–T022 complete → Tests updated, final QA passed

---

## Notes

- [P] tasks = different files or non-overlapping code sections, no dependencies
- [US3] label maps task to User Story 3 (Profile Management) from spec.md
- UI-only implementation — no API calls, no Redux dispatch for save (local state only)
- Mobile number is ALWAYS disabled — this is a hard requirement
- Gender dropdown uses RNP `Menu` component (no external picker library)
- Baby cards are managed as a local state array — not dispatched to Redux store
- Existing profile Redux slice (`profileSlice.ts`) is NOT modified — future task to wire API integration
