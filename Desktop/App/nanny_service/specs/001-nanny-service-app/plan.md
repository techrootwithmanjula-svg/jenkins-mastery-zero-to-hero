# Implementation Plan: Subscription UX Refresh (Weekly Plan + Time Range)

**Branch**: `[001-nanny-service-app]` | **Date**: 2026-04-20 | **Spec**: [specs/001-nanny-service-app/spec.md](specs/001-nanny-service-app/spec.md)
**Input**: Feature specification from `/specs/001-nanny-service-app/spec.md` with clarified user requirements for subscription redesign.

## Summary

Redesign the subscription list cards and create-subscription modal to improve usability and visual appeal while changing subscription inputs from date-based scheduling to weekly planning. The new flow supports selecting a nanny by name, choosing `one day a week` or `two days a week`, selecting weekday(s), and selecting a start/end time range using a two-click interaction. Date fields are removed. Pause/resume/delete actions require a confirmation modal before dispatching state changes.

## Technical Context

**Language/Version**: TypeScript 5.9 / React 19.1 / React Native 0.81.5  
**Primary Dependencies**: Expo ~54.0, React Native Paper 5.13 (MD3), React Navigation 7, Redux Toolkit 2.6, `@react-native-community/datetimepicker` 8.4.4  
**Storage**: N/A (Redux in-memory state + mock data)  
**Testing**: Jest + React Native Testing Library  
**Target Platform**: iOS and Android (Expo managed workflow)  
**Project Type**: Mobile app (single React Native project)  
**Performance Goals**: Smooth 60fps interactions; no visible lag in modal search/filter and card action flows  
**Constraints**: Mobile-first UI, centralized design tokens, no date field in subscription form, confirmation required before destructive/status-changing actions  
**Scale/Scope**: Subscription feature slice only (`SubscriptionScreen`, related contracts/docs, tests)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Gate Review

1. **Clean, Modular, and Reusable Code** — PASS  
   Redesign remains inside subscription feature boundaries; shared UI primitives and store actions are reused.
2. **Consistent UI/UX Patterns** — PASS  
   Uses existing React Native Paper components, spacing tokens, and card/modal patterns.
3. **Mobile-First Responsive Design** — PASS  
   Flow is optimized for compact modal interaction and touch-first controls.
4. **Performance Optimization** — PASS  
   Runtime nanny filtering remains lightweight and local; confirmation modal adds negligible overhead.
5. **Validation and Error Handling** — PASS  
   Required-field validation and action confirmation are explicitly included.
6. **Scalable and Maintainable Architecture** — PASS  
   Existing Redux/API boundaries remain unchanged; only schedule input schema and UI behavior are refined.
7. **Design Tokens and Theming** — PASS  
   Plan enforces theme-aware styles and no hardcoded new design primitives.

### Post-Design Gate Review

PASS — Phase 0/1 artifacts keep schema, UX contract, and quickstart aligned with the constitution and user constraints.

## Project Structure

### Documentation (this feature)

```text
specs/001-nanny-service-app/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── subscription-redesign.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── api/
├── components/
├── models/
├── navigation/
├── screens/
│   └── Subscription/
├── store/
│   └── slices/
└── theme/

__tests__/
└── subscription/
```

**Structure Decision**: Single React Native project; subscription redesign is implemented as focused changes in existing screen/store/API/model/test/doc locations.

## Phase 0: Research Focus

- Confirm UX pattern for weekly subscription planning with one-day/two-day frequency.
- Confirm time-range input strategy with two-click interaction (`start time` then `end time`) and no date field.
- Confirm confirmation-modal behavior for pause/resume/delete actions.

## Phase 1: Design Focus

- Update subscription domain model and form state documentation to weekly schedule fields.
- Update UX contract for list card and create modal states/validation.
- Update quickstart steps for manual verification of the redesigned flow.

## Complexity Tracking

No constitution violations or additional complexity exemptions required.
