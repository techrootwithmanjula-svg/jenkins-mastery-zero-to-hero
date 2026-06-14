# src/context/ - Global State Management

React Context is used to manage global application state that multiple components need access to without prop drilling.

## 🎯 Purpose

- **Global State:** Theme, sidebar, alerts accessible throughout app
- **Avoid Prop Drilling:** No need to pass props through every component
- **Centralized Updates:** Single source of truth for each piece of state
- **Performance:** Only components using context re-render on updates

## 📁 Contexts

### 1. SidebarContext - Navigation State

**File:** `SidebarContext.tsx`

**Purpose:** Manage sidebar expand/collapse state, mobile overlay, and active menu.

**State:**
```typescript
{
  isExpanded: boolean;        // Sidebar wide (290px) vs narrow (90px)
  isMobileOpen: boolean;      // Mobile overlay visible
  isMobile: boolean;          // Screen width < 768px
  isHovered: boolean;         // Mouse over sidebar
  activeItem: string | null;  // Highlighted menu item
  openSubmenu: string | null; // Open submenu
}
```

**Exported Hook:** `useSidebar()`

| Property | Type | Description |
|----------|------|-------------|
| `isExpanded` | `boolean` | Is sidebar fully expanded |
| `isMobileOpen` | `boolean` | Is mobile sidebar overlay open |
| `isMobile` | `boolean` | Is screen width < 768px |
| `isHovered` | `boolean` | Is mouse hovering sidebar |
| `activeItem` | `string \| null` | Current active menu |
| `openSubmenu` | `string \| null` | Open submenu |
| `toggleSidebar` | `() => void` | Toggle expand/collapse |
| `toggleMobileSidebar` | `() => void` | Toggle mobile overlay |
| `setIsHovered` | `(v: boolean) => void` | Set hover state |
| `setActiveItem` | `(item: string \| null) => void` | Set active menu |
| `toggleSubmenu` | `(item: string) => void` | Toggle submenu |

**Usage:**
```typescript
import { useSidebar } from '@/context/SidebarContext';

const Header = () => {
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();

  return (
    <button onClick={toggleSidebar}>☰ Sidebar</button>
  );
};

const Layout = () => {
  const { isExpanded, isHovered } = useSidebar();

  return (
    <div className={isExpanded || isHovered ? 'ml-[290px]' : 'ml-[90px]'}>
      {/* Content */}
    </div>
  );
};
```

**Consumers:**
- `AppHeader` — Call sidebar toggle on hamburger button
- `AppLayout` — Adjust margin based on sidebar width
- `AppSidebar` — Display sidebar with expand/collapse animation
- Menu items — Highlight current page

---

### 2. ThemeContext - Dark/Light Mode

**File:** `ThemeContext.tsx`

**Purpose:** Manage light/dark theme preference with persistence.

**State:**
```typescript
{
  theme: 'light' | 'dark';    // Current theme
  toggleTheme: () => void;    // Switch theme
}
```

**Exported Hook:** `useTheme()`

**How it works:**
1. Reads saved preference from `localStorage`
2. Applies theme to `<html class="dark">` on mount
3. Persists to `localStorage` on change
4. Tailwind CSS responds with `dark:` classes

**Usage:**
```typescript
import { useTheme } from '@/context/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
};

// For responsive styling
export const Card = () => {
  return (
    <div className="bg-white dark:bg-gray-800">
      <p className="text-black dark:text-white">Content</p>
    </div>
  );
};
```

**Implementation Details:**
```typescript
// Saves to localStorage[key='theme']
// localStorage.getItem('theme') // 'light' | 'dark'

// Updates HTML element
document.documentElement.classList.add('dark')
document.documentElement.classList.remove('dark')
```

---

### 3. AlertProvider - Toast Notifications

**File:** `AlertProvider.tsx`

**Alternative Name:** `useAlert()` hook

**Purpose:** Manage toast notification queue and display.

**State:**
```typescript
interface Alert {
  id: string;
  variant: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

alerts: Alert[]  // Queue of active alerts
```

**How to show alerts:**
```typescript
import { showAlert } from '@/services/alertService';

// Success (green)
showAlert('success', 'Saved successfully!');

// Error (red)
showAlert('error', 'Something went wrong');

// Warning (yellow)
showAlert('warning', 'Confirm delete?', 'Warning');

// Info (blue)
showAlert('info', 'Update available');

// With custom duration
showAlert('success', 'Copied!', undefined, 2000);
```

**Features:**
- ✅ Multiple alerts stack vertically
- ✅ Auto-dismiss after 3 seconds (configurable)
- ✅ Manually dismissible (X button)
- ✅ Icon and color based on variant
- ✅ Persistent during API calls

---

## 🏗️ Creating a New Context

### Step 1: Define Type

```typescript
// src/context/MyContext.tsx
import { createContext, useContext, useState } from 'react';

interface MyContextType {
  value: string;
  setValue: (value: string) => void;
}

const MyContext = createContext<MyContextType | undefined>(undefined);
```

### Step 2: Create Provider

```typescript
export const MyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [value, setValue] = useState('');

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
};
```

### Step 3: Create Hook

```typescript
export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within MyProvider');
  }
  return context;
};
```

### Step 4: Wrap in main.tsx

```typescript
createRoot(document.getElementById('root')!).render(
  <MyProvider>
    <App />
  </MyProvider>,
);
```

### Step 5: Use in Components

```typescript
const MyComponent = () => {
  const { value, setValue } = useMyContext();
  return <button onClick={() => setValue('new')}>{value}</button>;
};
```

---

## Provider Setup in main.tsx

**Current setup:**
```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <AlertProvider>
          <App />
        </AlertProvider>
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>,
);
```

**Order matters:**
1. `ThemeProvider` first (applies theme early)
2. `AppWrapper` next (sets up Helmet for meta tags)
3. `AlertProvider` (uses ThemeContext)
4. `App` (routes and pages)
5. Sidebar provider usually wraps specific layouts



| Value | Type | Description |
|---|---|---|
| `theme` | `"light"` \| `"dark"` | Current active theme |
| `toggleTheme` | `() => void` | Flip between light and dark |

### Mechanism
On mount, reads `localStorage.getItem("theme")`. When changed, writes back to `localStorage` and toggles the `dark` class on `<html>` (Tailwind dark mode class strategy).

### Consumers
- `ThemeToggleButton` in `components/common/`
