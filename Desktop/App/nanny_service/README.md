# Nanny Service App

A mobile-first nanny service application built with React Native (Expo) for Android and iOS.

## Features

- **OTP Authentication** — Secure mobile number login with OTP verification
- **Nanny Search & Booking** — Search by date/time, view nanny profiles, book slots
- **Profile Management** — Edit name/email, add baby details
- **Booking History** — View past and upcoming bookings
- **Subscriptions** — Recurring nanny bookings with pause/resume/delete
- **Admin Controls** — Manage bookings, refund users, toggle nanny availability
- **Multi-Theme** — Light and dark theme with system preference detection
- **Accessibility** — WCAG 2.1 AA compliant

## Tech Stack

- **Framework**: React Native (Expo SDK 54)
- **Language**: TypeScript
- **UI Library**: React Native Paper (Material Design 3)
- **Navigation**: React Navigation 7
- **State Management**: Redux Toolkit
- **API Client**: Axios
- **Forms**: React Hook Form + Yup validation
- **Testing**: Jest + React Native Testing Library

## Prerequisites

- Node.js (LTS)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app (for mobile testing)

## Setup

```bash
# Clone the repo
git clone <repo-url>
cd nanny_service

# Install dependencies
npm install --legacy-peer-deps

# Copy environment config
cp .env.example .env

# Start development server
npm start
```

## Running

```bash
npm run android   # Android
npm run ios       # iOS
npm run web       # Web browser
```

Scan the QR code with Expo Go (Android) or Camera (iOS) to launch on device.

## Testing

```bash
npm test          # Run all tests
npm run lint      # ESLint
npm run format    # Prettier
```

## Project Structure

```
src/
├── api/            # Axios API service layer
├── components/     # Reusable UI components
├── models/         # TypeScript entity models
├── navigation/     # React Navigation setup
├── screens/        # App screens by feature
│   ├── Admin/
│   ├── Auth/
│   ├── Booking/
│   ├── Dashboard/
│   ├── Nanny/
│   ├── Profile/
│   └── Subscription/
├── store/          # Redux Toolkit store & slices
├── theme/          # Centralized theme & tokens
└── utils/          # Helpers, validation, config
```

## Booking Rules

- Minimum booking duration: 3 hours
- Available hours: 8:00 AM – 8:00 PM
- Payment required at booking time

## Environment Variables

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_API_URL` | Backend API base URL |

## License

Private — All rights reserved.
