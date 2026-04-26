# Feature Specification: Nanny Service App

**Feature Branch**: `[001-nanny-service-app]`  
**Created**: 2026-04-10  
**Status**: Draft  
**Input**: User description: "Build a mobile-first nanny service application.\n\n## Authentication\n- Login using mobile number and OTP\n\n## Dashboard\n- Modern UI with multiple cards\n- Search nanny with filters (date, time slot)\n\n## Time Rules\n- Min booking: 3 hours\n- Start: 8 AM\n- End: 8 PM\n\n## Nanny Listing\n- Show image, name, rating\n\n## Booking Flow\n- Select slot\n- Show address, amount, promo\n- Payment → confirm booking\n\n## Profile\n- Editable: name, email\n- Non-editable: mobile number\n- Add baby details\n\n## Booking History\n- Show past + upcoming bookings\n\n## Subscription\n- Select nanny, time, weekday\n- Modify, pause, delete subscription\n\n## Admin\n- View bookings\n- Refund user\n- Make nanny offline\n\n## UI\n- Clean, modern, mobile-first\nEOF"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mobile OTP Login (Priority: P1)
A user can log in using their mobile number and a one-time password (OTP) sent to their device.
**Why this priority**: Secure, frictionless authentication is critical for onboarding and trust.
**Independent Test**: Can be fully tested by registering a new number and verifying OTP flow.
**Acceptance Scenarios**:
1. **Given** a new user, **When** they enter their mobile number, **Then** they receive an OTP and can log in.
2. **Given** an existing user, **When** they log in, **Then** their session is restored securely.

---

### User Story 2 - Nanny Search & Booking (Priority: P1)
A user can search for available nannies by date and time slot, view nanny details, and book a slot (min 3 hours, 8 AM–8 PM).
**Why this priority**: Core value proposition—finding and booking a nanny.
**Independent Test**: Can be tested by searching with filters and completing a booking.
**Acceptance Scenarios**:
1. **Given** a logged-in user, **When** they search with filters, **Then** matching nannies are shown.
2. **Given** a selected nanny and slot, **When** the user completes payment, **Then** the booking is confirmed.

---

### User Story 3 - Profile Management (Priority: P2)
A user can edit their name, email, age, address, emergency contact, gender, and father name, view their mobile number (non-editable), and add baby details (name, age, gender, prior disease, notes).
**Why this priority**: Personalization and accurate records.
**Independent Test**: Can be tested by updating profile fields and adding baby info.
**Acceptance Scenarios**:
1. **Given** a logged-in user, **When** they update their profile, **Then** changes are reflected in the UI. *(Note: Current iteration is UI-only; backend persistence is a future task.)*
2. **Given** a user, **When** they add baby details, **Then** the info is shown in the profile UI.

---

### User Story 4 - Booking History (Priority: P2)
A user can view their past and upcoming bookings.
**Why this priority**: Transparency and trust.
**Independent Test**: Can be tested by making bookings and checking history.
**Acceptance Scenarios**:
1. **Given** a user with bookings, **When** they open booking history, **Then** all relevant bookings are displayed.

---

### User Story 5 - Subscription Management (Priority: P3)
A user can subscribe to recurring nanny services, modify, pause, or delete subscriptions.
**Why this priority**: Convenience for repeat users.
**Independent Test**: Can be tested by creating, modifying, pausing, and deleting a subscription.
**Acceptance Scenarios**:
1. **Given** a user, **When** they subscribe to a nanny, **Then** the subscription is created and visible.
2. **Given** a subscription, **When** the user modifies or pauses it, **Then** changes are reflected.

---

### User Story 6 - Admin Controls (Priority: P3)
An admin can view all bookings, refund users, and make nannies offline.
**Why this priority**: Operational control and support.
**Independent Test**: Can be tested by performing admin actions and verifying outcomes.
**Acceptance Scenarios**:
1. **Given** an admin, **When** they view bookings, **Then** all bookings are listed.
2. **Given** a refund request, **When** the admin processes it, **Then** the user is refunded.
3. **Given** a nanny, **When** the admin makes them offline, **Then** they are not available for booking.

---

## Functional Requirements
1. Mobile-first responsive UI for all screens.
2. Authentication via mobile number and OTP.
3. Dashboard with modern cards and search/filter for nannies.
4. Enforce booking rules: min 3 hours, 8 AM–8 PM slots.
5. Nanny listing with image, name, rating.
6. Booking flow: slot selection, address, amount, promo, payment, confirmation.
7. Profile management: edit name/email/age/address/emergency contact/gender/father name, view mobile (non-editable), add baby details (name, age, gender, prior disease, notes).
8. Booking history: past and upcoming bookings.
9. Subscription: select nanny, time, weekday; modify/pause/delete.
10. Admin: view bookings, refund, make nanny offline.
11. UI must be clean, modern, and support multiple themes.
12. All design tokens (colors, spacing, typography) must be centralized and reused.
13. Validation and error handling on all forms and flows.

## Success Criteria
- 95%+ of users can complete booking flow without errors.
- All screens render correctly on mobile (iOS and Android).
- Booking, profile, and subscription flows are independently testable.
- Admin actions are reflected in real time.
- Theming can be switched without UI breakage.
- All user input is validated and errors are user-friendly.
- Performance: UI loads in <2s on 3G mobile.
- Accessibility: Meets WCAG 2.1 AA.

## Key Entities
- User (id, name, email, mobile, age, address, emergencyContact, gender, fatherName, profileImage, baby details)
- Nanny (id, name, image, rating, availability)
- Booking (id, user, nanny, slot, address, amount, promo, status)
- Subscription (id, user, nanny, time, weekday, status)
- Admin (id, name, permissions)

## Assumptions
- Payment gateway integration is available.
- SMS/OTP service is reliable.
- Admins are managed separately from users.
- UI library and theming system are in place.

## Open Questions
None. All requirements are specified.
