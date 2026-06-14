# Developer Onboarding Guide

Welcome to the Admin Dashboard project! This guide will help you get up to speed in your first week.

## Day 1: Local Setup & Exploration

### 1. Initial Setup (30 minutes)

Follow [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md):

```bash
# Clone project
git clone <repository-url>
cd admin

# Install dependencies
npm install

# Create environment file
touch .env.local

# Add to .env.local:
VITE_API_BASE_URL=http://localhost:3000
```

### 2. Start Dev Server (5 minutes)

```bash
npm run dev
```

Open browser → `http://localhost:5173`

### 3. Explore the Project (30 minutes)

Walk through each folder:

```bash
src/
├── App.tsx                    # Main router
├── main.tsx                   # Entry point
│
├── pages/                     # Page components
│   ├── Dashboard/            # Home page
│   ├── AuthPages/            # Login pages
│   └── User/                 # User management
│
├── components/               # Reusable components
│   ├── auth/                # Auth guards
│   ├── common/              # Shared utilities
│   ├── form/                # Form components
│   ├── ui/                  # UI primitives
│   └── header/              # Header components
│
├── context/                 # State management
│   ├── ThemeContext.tsx     # Dark/light mode
│   ├── SidebarContext.tsx   # Sidebar state
│   └── AlertProvider.tsx    # Toast notifications
│
├── services/                # API layer
│   ├── api.tsx             # Axios instance
│   ├── authService.ts      # Auth APIs
│   └── urls.ts             # API endpoints
│
├── utils/                   # Helper functions
│   └── tokenManager.ts     # Token storage
│
└── hooks/                   # Custom React hooks
    ├── useGoBack.ts
    └── useModal.ts
```

**Try this:** Click through the application UI and identify:
- Where authentication happens
- How sidebar toggles work
- Where alerts appear
- Navigation flow

---

## Day 2: Understanding Architecture

### 1. Read Architecture Docs (1 hour)

Read [ARCHITECTURE.md](./ARCHITECTURE.md) carefully. Key takeaways:

- **Layered Architecture:** Presentation → Context → Services → Utils → Infrastructure
- **Authentication:** Uses token-based auth (JWT) stored in localStorage
- **State:** Global state via React Context (Theme, Sidebar, Alerts)
- **API:** Axios with interceptors for automatic JWT addition

### 2. Trace a User Action (30 minutes)

**Follow the flow: "User signs in"**

1. Open `src/pages/AuthPages/SignIn.tsx`
   - What does it render?
   - What component is it using?

2. Open the form component it uses
   - Find where form submission happens
   - What service does it call?

3. Open `src/services/authService.ts`
   - What API does `verifyOtpService` call?
   - How does it use Axios?

4. Open `src/utils/tokenManager.ts`
   - Where does the token get stored?
   - When is it used?

5. Open `src/components/auth/ProtectedRoute.tsx`
   - How does it check if user is authenticated?
   - What happens if token is missing?

**Result:** You understand the complete authentication flow!

### 3. Look at Data Flow (30 minutes)

**Follow the flow: "Dashboard loads user stats"**

1. Open `src/pages/Dashboard/Home.tsx`
   - What does it render on load?
   - What service does it call?

2. Open the service it calls
   - What API endpoint does it hit?
   - How is the response returned?

3. Open `src/services/api.tsx`
   - How does the Axios instance add JWT token?
   - What if request returns 401?

4. Open Axios interceptor response handler
   - What happens on error?
   - How are errors handled?

---

## Day 3: Writing Your First Component

### 1. Create a Simple Component (1 hour 30 minutes)

Let's create a WelcomeCard component:

**Step 1: Create file**
```bash
touch src/components/common/WelcomeCard.tsx
```

**Step 2: Write component**
```typescript
import React from 'react';

interface WelcomeCardProps {
  username: string;
  lastLogin?: string;
}

/**
 * WelcomeCard
 * Displays a greeting to the user
 */
export const WelcomeCard: React.FC<WelcomeCardProps> = ({
  username,
  lastLogin,
}) => {
  return (
    <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
      <h2 className="text-3xl font-bold">Welcome, {username}! 👋</h2>
      {lastLogin && (
        <p className="mt-2 text-sm opacity-90">
          Last login: {new Date(lastLogin).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default WelcomeCard;
```

**Step 3: Use in a page**

Open a page component and import it:
```typescript
import WelcomeCard from '@/components/common/WelcomeCard';

export default function SomePage() {
  return (
    <div>
      <WelcomeCard username="John" lastLogin="2024-01-15" />
    </div>
  );
}
```

**Step 4: Check in browser**
- See changes instantly (HMR)
- Inspect with React DevTools

### 2. Styling with Tailwind (15 minutes)

**Common Tailwind patterns:**

```typescript
// Spacing
<div className="p-4">    {/* padding 16px */}
<div className="mb-6">   {/* margin-bottom 24px */}

// Colors
<div className="bg-blue-500">        {/* blue background */}
<p className="text-gray-600">        {/* gray text */}
<button className="bg-green-600 hover:bg-green-700">

// Responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* 1 col on mobile, 2 on tablet, 4 on desktop */}

// Dark mode
<div className="bg-white dark:bg-gray-800">
<p className="text-black dark:text-white">

// Rounded
<div className="rounded">      {/* 4px radius */}
<div className="rounded-lg">   {/* 8px radius */}

// Shadows
<div className="shadow-sm">    {/* Light shadow */}
<div className="shadow-lg">    {/* Heavy shadow */}
```

---

## Day 4: Working with Forms & APIs

### 1. Study Form Component (45 minutes)

Open `src/components/form/Form.tsx` and related files:
- How does React Hook Form work?
- How are validations handled?
- How does form state update?

### 2. Build a Form (1 hour)

Create a feedback form:

```typescript
// src/components/forms/FeedbackForm.tsx
import { useForm } from 'react-hook-form';
import React from 'react';

interface FeedbackFormData {
  email: string;
  message: string;
  rating: number;
}

export const FeedbackForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FeedbackFormData>();

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 1000));
      console.log('Feedback submitted:', data);
      reset();
    } catch (error) {
      console.error('Error submitting:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          {...register('email', { required: 'Email is required' })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Rating</label>
        <select
          {...register('rating', { required: 'Rating is required' })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="">Select rating</option>
          <option value="1">Poor</option>
          <option value="2">Fair</option>
          <option value="3">Good</option>
          <option value="4">Excellent</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Message</label>
        <textarea
          rows={4}
          {...register('message', { required: 'Message is required' })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
};

export default FeedbackForm;
```

### 3. Create a Service (30 minutes)

Create a feedback service:

```typescript
// src/services/feedbackService.ts
import api from './api';
import { FEEDBACK_URLS } from './urls';

export const submitFeedbackService = async (feedback: {
  email: string;
  message: string;
  rating: number;
}) => {
  const response = await api.post(FEEDBACK_URLS.SUBMIT, feedback);
  return response.data;
};
```

Update URLs:
```typescript
// src/services/urls.ts
export const FEEDBACK_URLS = {
  SUBMIT: `${BASE_URL}/feedback/submit`,
};
```

---

## Day 5: Managing State & Context

### 1. Understanding AlertProvider (30 minutes)

Open `src/context/AlertProvider.tsx`:
- How does it manage alert queue?
- How are components notified?
- When are alerts auto-dismissed?

### 2. Using Alerts in Components (30 minutes)

```typescript
import { showAlert } from '@/services/alertService';

export const MyFeature = () => {
  const handleSuccess = () => {
    showAlert('success', 'Operation completed successfully!');
  };

  const handleError = () => {
    showAlert('error', 'Something went wrong. Please try again.');
  };

  const handleWarning = () => {
    showAlert('warning', 'This action cannot be undone.', 'Warning');
  };

  return (
    <div className="space-y-2">
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleWarning}>Show Warning</button>
    </div>
  );
};
```

### 3. Understanding Theme Context (30 minutes)

Open `src/context/ThemeContext.tsx`:
- Where is theme stored?
- How does dark mode work?
- How do components access theme?

Use theme in components:

```typescript
import { useTheme } from '@/hooks/useTheme'; // Create this hook

export const MyComponent = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={theme === 'dark' ? 'bg-gray-900' : 'bg-white'}>
      <button onClick={toggleTheme}>
        Switch to {theme === 'dark' ? 'light' : 'dark'} mode
      </button>
    </div>
  );
};
```

---

## Week 2: Implementation & Practice

### Task 1: Create a Dashboard Widget

Create a component that:
- Fetches data from an API
- Shows loading state
- Handles errors with alerts
- Displays data in a card
- Uses proper TypeScript types

See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for step-by-step instructions.

### Task 2: Implement a Feature

Pick a small feature and implement it end-to-end:
1. Create types
2. Create service
3. Create components
4. Test in browser
5. Document what you did

### Task 3: Code Review

Get a senior developer to review your code. Look for:
- TypeScript compliance
- Proper error handling
- Accessibility
- Performance
- Security

---

## Useful Commands & Tips

### Development Commands
```bash
npm run dev       # Start dev server (port 5173)
npm run build     # Production build
npm run lint      # Check code quality
npm run preview   # Test production build locally
```

### Debugging Commands
```bash
# Check for React errors
npm run lint

# Test specific page
npm run dev -- --port 3000  # If port 5173 in use

# Kill port if stuck
# macOS/Linux:
lsof -ti:5173 | xargs kill -9
```

### Browser DevTools
```
F12 → React DevTools (installed as extension)
- Inspect components
- View props/state
- Check which components re-render
```

### VS Code Tips
```
Ctrl+Shift+P  → Command palette
Ctrl+P        → Quick open file
Ctrl+F        → Find in file
Ctrl+H        → Find and replace
Ctrl+`        → Toggle terminal
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Missing TypeScript Types
```typescript
// Bad
const MyComponent = (props) => {};

// Good
interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onClick }) => {};
```

### ❌ Mistake 2: Not Handling API Errors
```typescript
// Bad
const data = await getProductsService();
return <div>{data.length}</div>; // What if error?

// Good
try {
  const data = await getProductsService();
  return <div>{data.length}</div>;
} catch (error) {
  showAlert('error', 'Failed to load products');
  return <div>Error loading products</div>;
}
```

### ❌ Mistake 3: Inline Styles Instead of Tailwind
```typescript
// Bad
<div style={{ padding: '16px', backgroundColor: 'blue' }}>

// Good
<div className="p-4 bg-blue-600">
```

### ❌ Mistake 4: Not Using Service Layer
```typescript
// Bad
const MyPage = () => {
  useEffect(() => {
    axios.get('/api/users').then(res => setUsers(res.data));
  }, []);
};

// Good
const MyPage = () => {
  useEffect(() => {
    getUsersService().then(setUsers);
  }, []);
};
```

### ❌ Mistake 5: Not Checking isLoggedIn
```typescript
// Bad - Anyone can access
<Route path="/admin" element={<AdminPage />} />

// Good
<Route element={<ProtectedRoute />}>
  <Route path="/admin" element={<AdminPage />} />
</Route>
```

---

## Learning Resources

### Documentation in Project
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Project structure
- [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) - Setup guide
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - How to add features
- [SECURITY_PATTERNS.md](./SECURITY_PATTERNS.md) - Best practices

### External Resources
- [React Docs](https://react.dev) - Official React documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Type safety
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Styling
- [React Router Docs](https://reactrouter.com) - Navigation
- [React Hook Form](https://react-hook-form.com) - Forms

### Video/Tutorials
- React 19 basics
- TypeScript fundamentals
- Tailwind CSS crash course
- React Context vs Redux

---

## Getting Help

### Resources in Order
1. **Project Docs** - Check README files in each folder
2. **Code Examples** - Look at similar features
3. **Search Code** - Use Ctrl+Shift+F to find patterns
4. **Ask Team Members** - They know project best
5. **Google/Stack Overflow** - For general React questions

### Good Questions to Ask
✅ "How do we handle X in this project?"  
✅ "Can you review my implementation?"  
✅ "What's the best way to structure Y?"  

❌ "Can you code this for me?"  
❌ "How do I use React?" (Google this)  
❌ Without showing effort first

---

## Checklist: First Month

- [ ] **Week 1:** Project setup, architecture understanding, first component
- [ ] **Week 2:** Service layer, API integration, state management
- [ ] **Week 3:** Implement a small feature, get code review
- [ ] **Week 4:** Implement a medium feature independently

---

## Conclusion

You now have everything needed to start contributing! Remember:

- **Always read the docs first**
- **Follow existing patterns**
- **Ask questions early**
- **Test thoroughly before submitting**
- **Document your code**

**Welcome to the team! 🎉**

---

Next: Start with [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) to build your first feature.
