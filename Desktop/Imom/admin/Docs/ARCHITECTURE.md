# Project Architecture Overview

## High-Level Architecture

This admin dashboard follows a **component-driven, layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────┐
│          Presentation Layer                  │
│  (Pages, Components, UI)                     │
├─────────────────────────────────────────────┤
│          Context & State Layer                │
│  (Theme, Sidebar, Alert Management)          │
├─────────────────────────────────────────────┤
│          Services & Business Logic            │
│  (API, Auth, User Services)                  │
├─────────────────────────────────────────────┤
│          Utilities & Helpers                  │
│  (Token Manager, Token Manager, etc.)        │
├─────────────────────────────────────────────┤
│          Infrastructure                      │
│  (React Router, Axios, Vite)                 │
└─────────────────────────────────────────────┘
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI Framework** | React 19 | Component-based UI |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **Routing** | React Router 7 | Client-side navigation |
| **State Management** | React Context + Hooks | Local state & global context |
| **HTTP Client** | Axios | REST API communication |
| **Type Safety** | TypeScript 5 | Static type checking |
| **Build Tool** | Vite 6 | Fast dev server & bundler |
| **Form Handling** | React Hook Form | Form state & validation |
| **Charts** | ApexCharts | Data visualization |
| **Calendar** | FullCalendar | Calendar functionality |
| **Data & Drag** | React DnD | Drag and drop |
| **File Upload** | React Dropzone | File input handling |
| **Meta Tags** | React Helmet Async | Document head management |
| **Vector Maps** | React JVectorMap | Geographic visualization |

## Core Architecture Patterns

### 1. **Authentication & Authorization**

```
┌─────────────────┐
│  SignIn Page    │
└────────┬────────┘
         │
         ├─ verifyOtpService() ──→ API
         │
         ├─ tokenManager.setToken()
         │
         └─→ ProtectedRoute Guard
              │
              ├─ Check tokenManager.isLoggedIn()
              │
              └─→ Allow/Redirect
```

**Files:**
- `src/components/auth/ProtectedRoute.tsx` - Protects authenticated routes
- `src/components/auth/PublicRoute.tsx` - Protects public routes (sign-in only)
- `src/utils/tokenManager.ts` - Token storage & retrieval
- `src/services/authService.ts` - OTP sending & verification

### 2. **Context-Based State Management**

The app uses React Context for global state:

```
┌─────────────────────────────────┐
│     main.tsx (App Root)         │
├─────────────────────────────────┤
│     <ThemeProvider>             │
│       ├─ Theme state            │
│       ├─ Toggle functionality   │
│       └─ localStorage sync      │
│                                 │
│     <AppWrapper>                │
│       ├─ Helmet setup           │
│       └─ Meta tags              │
│                                 │
│     <AlertProvider>             │
│       ├─ Alert queue            │
│       ├─ Show/hide alerts       │
│       └─ Auto-dismiss logic     │
│                                 │
│     <App />                     │
│       └─ Router + Routes        │
└─────────────────────────────────┘
```

**Context Providers:**
- **ThemeContext** (`src/context/ThemeContext.tsx`) - Light/dark mode
- **SidebarContext** (`src/context/SidebarContext.tsx`) - Sidebar state (expand/collapse/mobile)
- **AlertProvider** (`src/context/AlertProvider.tsx`) - Show toasts/notifications

### 3. **API & Services Layer**

```
┌──────────────────────┐
│   Component/Page     │
└──────────┬───────────┘
           │
           ├─ sendOtpService()
           ├─ verifyOtpService()
           ├─ getStatsService()
           └─ getUserService()
           │
           └─→ api (axios instance)
                  │
                  ├─ Request Interceptor (add JWT)
                  ├─ Response Interceptor (handle errors)
                  └─→ Backend API
```

**Key Features:**
- **Axios Interceptors:**
  - Request: Automatically adds JWT token to headers
  - Response: Handles 401 errors (redirects to sign-in)
- **Base URL:** Configured in `src/services/urls.ts`
- **Services:** Organized by domain (auth, user, stats)

### 4. **Routing Architecture**

```
/
├── /signin (PUBLIC)
│   ├─ SignIn page
│   └─ OTP verification flow
│
├── / (PROTECTED)
│   ├─ AppLayout (Sidebar + Header + Content)
│   │   ├─ Dashboard (Home)
│   │   ├─ Users
│   │   ├─ Nannies
│   │   ├─ Profile
│   │   └─ Blank (Template)
│   │
│   └─ [Protected by ProtectedRoute]
│
└── * (Redirect to /)
```

## Component Hierarchy

```
App.tsx (Router)
│
├── PublicRoute
│   └─ SignIn Page
│       └─ AuthPageLayout
│           └─ SignInForm
│
├── ProtectedRoute
│   └─ AppLayout
│       ├─ AppHeader
│       │   ├─ NotificationDropdown
│       │   └─ UserDropdown
│       │
│       ├─ AppSidebar
│       │   └─ Sidebar Navigation
│       │
│       ├─ Backdrop (Mobile)
│       │
│       └─ main outlet
│           ├─ Home (Dashboard)
│           ├─ User List
│           ├─ Nanny List
│           ├─ User Profile
│           └─ Blank Page
│
└── ScrollToTop (Global)
```

## Data Flow

### Authentication Flow

```
1. User visits /signin
2. SignIn component renders → SignInForm
3. User enters phone & clicks "Send OTP"
   └─ sendOtpService(mobile) → API
4. User receives OTP
5. User enters OTP & clicks "Verify"
   └─ verifyOtpService(mobile, otp) → API
6. API returns token
7. tokenManager.setToken(token) → localStorage
8. Redirect to "/" → ProtectedRoute allows access
9. AppLayout renders with Sidebar + Header + Content
```

### Page/Component Usage Flow

```
1. User navigates to protected route
2. ProtectedRoute checks tokenManager.isLoggedIn()
3. If logged in → Render AppLayout + Page Component
4. Page Component may:
   - Call service layer (getStatsService, getUserService, etc.)
   - Update Context (useSidebar, useTheme, showAlert)
   - Re-render on state changes
5. Axios interceptor adds JWT token to all requests
6. On 401 response → Redirect to /signin
```

## File Organization Strategy

### Public Routes (No Auth Required)
- `src/pages/AuthPages/` - Authentication pages
- `src/components/auth/PublicRoute.tsx` - Route guard

### Protected Routes (Auth Required)
- `src/pages/Dashboard/` - Dashboard page
- `src/pages/User/` - User management
- `src/pages/Nanny/` - Nanny management
- `src/pages/UserProfiles.tsx` - User profile
- `src/pages/Blank.tsx` - Template page
- `src/components/auth/ProtectedRoute.tsx` - Route guard

### Shared Components
- `src/components/common/` - Shared utility components
- `src/components/ui/` - Reusable UI primitives
- `src/components/form/` - Form components
- `src/components/header/` - Header components
- `src/components/ecommerce/` - E-commerce specific components
- `src/components/charts/` - Chart components
- `src/components/tables/` - Table components

### Utilities & Helpers
- `src/hooks/` - Custom React hooks
- `src/utils/` - Helper functions
- `src/icons/` - Icon components
- `src/services/` - API & business logic services
- `src/context/` - React Context providers

## State Management Strategy

### Global State (Context)
- **Theme** - Light/dark mode
- **Sidebar** - Expansion state
- **Alerts** - Toast notifications
- **Authentication** - Token (localStorage)

### Local State (useState)
- Form inputs
- Component visibility toggles
- Temporary UI state

### Server State
- Fetched from API via services
- Cached in component state (useState)
- Refetched on needs

## API Integration Pattern

```typescript
// 1. Define service
export const getStatsService = async () => {
  const response = await api.get(API_URLS.GET_STATS);
  return response.data;
};

// 2. Use in component
const [stats, setStats] = useState(null);

useEffect(() => {
  const fetchStats = async () => {
    try {
      const data = await getStatsService();
      setStats(data);
    } catch (error) {
      showAlert('error', 'Failed to fetch stats');
    }
  };
  fetchStats();
}, []);

// 3. Render
return <div>{stats?.value}</div>;
```

## Error Handling Strategy

- **Axios Interceptor** - Catches 401 errors globally, redirects to signin
- **Try-Catch** - Component level error handling
- **AlertProvider** - Show user-friendly error messages
- **Service functions** - Return/throw errors for component to handle

## Security Considerations

1. **Token Management**
   - Stored in localStorage (consider using httpOnly cookies for enhanced security)
   - Automatically added to all API requests via interceptor
   - Cleared on 401 response

2. **Protected Routes**
   - ProtectedRoute component checks authentication before rendering
   - Public routes prevent access to signin when already logged in

3. **Input Validation**
   - React Hook Form handles client-side validation
   - Server should validate all inputs

4. **CORS**
   - Handled by backend (CORS headers)

## Building & Deployment

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Output:** `dist/` folder (static files ready for hosting)

## Design System

- **Colors:** Tailwind CSS default palette
- **Typography:** Tailwind CSS default typography scale
- **Spacing:** Tailwind CSS spacing scale
- **Dark Mode:** Supported via `dark:` classes
- **Responsive:** Mobile-first approach with Tailwind breakpoints

---

See [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) for local development instructions.
See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for step-by-step feature implementation.
