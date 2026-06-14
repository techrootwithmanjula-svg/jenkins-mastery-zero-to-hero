# Development Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** - v18 or higher ([download](https://nodejs.org))
- **npm** or **yarn** - v9 or higher (comes with Node.js)
- **Git** - For version control ([download](https://git-scm.com))
- **Code Editor** - VS Code recommended ([download](https://code.visualstudio.com))

### Verify Installation

```bash
node --version    # Should be v18+
npm --version     # Should be v9+
git --version     # Should be installed
```

## Initial Setup (First Time)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd admin
```

### 2. Install Dependencies

```bash
npm install
```

This will install all packages listed in `package.json`:
- React, React Router, React DOM
- TypeScript, Vite, ESLint
- Tailwind CSS, PostCSS
- Axios, React Hook Form
- ApexCharts, FullCalendar, and other libraries

### 3. Environment Configuration

Create a `.env.local` file in the project root:

```bash
touch .env.local
```

Add the following variables (update with actual values):

```env
VITE_BASE_URL=http://localhost:3000
VITE_API_BASE_URL=https://api.example.com
```

> **Note:** Vite requires variables to start with `VITE_` to be exposed to the browser.

### 4. Access Environment Variables in Code

```typescript
// .ts or .tsx files
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const baseUrl = import.meta.env.VITE_BASE_URL;
```

## Running the Application

### Development Server

```bash
npm run dev
```

This will:
- Start Vite dev server on `http://localhost:5173` (or next available port)
- Enable hot module replacement (HMR) for instant reload on file changes
- Watch for TypeScript errors
- Watch for ESLint errors

### Production Build

```bash
npm run build
```

This will:
- Run TypeScript type checking (`tsc -b`)
- Build optimized assets to `dist/` folder
- Generate sourcemaps for debugging
- Minify and bundle code

### Preview Production Build

```bash
npm run preview
```

This starts a local server serving the production build. Use this to test the final output before deploying.

### Code Quality Checks

```bash
npm run lint
```

This runs ESLint to check for:
- Unused variables
- React hooks usage errors
- TypeScript compliance issues
- Code style violations

Fix automatically where possible:

```bash
npm run lint -- --fix
```

## Project Structure Quick Reference

```
admin/
├── src/
│   ├── components/        # Reusable components
│   ├── pages/             # Page components (routes)
│   ├── context/           # React Context providers
│   ├── services/          # API and business logic
│   ├── utils/             # Helper functions
│   ├── hooks/             # Custom React hooks
│   ├── icons/             # Icon components
│   ├── layout/            # Layout components
│   ├── App.tsx            # Main router
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
│
├── public/                # Static assets
├── Docs/                  # Documentation
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind config
├── eslintrc.config.js     # ESLint config
└── package.json           # Dependencies
```

## Development Workflow

### Creating a New Component

1. Create file in appropriate folder:
   ```bash
   src/components/common/MyComponent.tsx
   ```

2. Write component with TypeScript:
   ```typescript
   import React from 'react';

   interface MyComponentProps {
     title: string;
     onClick?: () => void;
   }

   export const MyComponent: React.FC<MyComponentProps> = ({
     title,
     onClick,
   }) => {
     return (
       <div className="p-4">
         <button onClick={onClick}>{title}</button>
       </div>
     );
   };

   export default MyComponent;
   ```

3. Import and use in another component:
   ```typescript
   import MyComponent from '@/components/common/MyComponent';

   export default function Page() {
     return <MyComponent title="Hello" />;
   }
   ```

### Adding a New Page

1. Create page file:
   ```bash
   src/pages/MyFeature/MyFeaturePage.tsx
   ```

2. Create the page:
   ```typescript
   import { PageMeta } from '@/components/common/PageMeta';

   export default function MyFeaturePage() {
     return (
       <PageMeta title="My Feature">
         <div>
           <h1>My Feature Page</h1>
         </div>
       </PageMeta>
     );
   }
   ```

3. Add route in `src/App.tsx`:
   ```typescript
   import MyFeaturePage from "./pages/MyFeature/MyFeaturePage";

   export default function App() {
     return (
       <Router>
         <Routes>
           <Route element={<ProtectedRoute />}>
             <Route element={<AppLayout />}>
               <Route path="/my-feature" element={<MyFeaturePage />} />
             </Route>
           </Route>
         </Routes>
       </Router>
     );
   }
   ```

### Creating a New Service

1. Create service file:
   ```bash
   src/services/myFeatureService.ts
   ```

2. Define service functions:
   ```typescript
   import api from "./api";
   import { API_URLS } from "./urls";

   export const getMyFeatureDataService = async (id: string) => {
     const response = await api.get(`${API_URLS.MY_FEATURE}/${id}`);
     return response.data;
   };

   export const updateMyFeatureService = async (id: string, data: any) => {
     const response = await api.put(`${API_URLS.MY_FEATURE}/${id}`, data);
     return response.data;
   };
   ```

3. Use in component:
   ```typescript
   const [data, setData] = useState(null);

   useEffect(() => {
     const fetchData = async () => {
       try {
         const result = await getMyFeatureDataService('123');
         setData(result);
       } catch (error) {
         console.error('Failed to fetch:', error);
       }
     };
     fetchData();
   }, []);
   ```

## TypeScript Setup

### Type Definitions

Create `src/types/index.ts` for shared types:

```typescript
// User type
export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  avatar?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Component props
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}
```

### Using Types

```typescript
import type { User, ApiResponse } from '@/types';

export const getUserService = async (id: string): Promise<User> => {
  const response = await api.get<ApiResponse<User>>(`/users/${id}`);
  return response.data.data;
};
```

## Styling Guide

### Tailwind CSS Classes

All styling uses Tailwind CSS utility classes:

```typescript
<div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Title</h2>
  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Description</p>
</div>
```

### Dark Mode

Prefix classes with `dark:` for dark mode styles:

```typescript
<div className="bg-white dark:bg-gray-800">
  <p className="text-black dark:text-white">Text</p>
</div>
```

### Responsive Design

Use Tailwind breakpoints:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns */}
</div>
```

Breakpoints:
- `sm` - 640px
- `md` - 768px
- `lg` - 1024px
- `xl` - 1280px
- `2xl` - 1536px

## Common Issues & Solutions

### Port Already in Use

If port 5173 is in use:

```bash
npm run dev -- --port 3000
```

### TypeScript Errors

Clear build cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### HMR Not Working

Restart dev server:

```bash
# Stop: Ctrl + C
npm run dev
```

### Tailwind Classes Not Applied

Ensure all template files are in `tailwind.config.js`:

```javascript
content: [
  "./src/**/*.{js,jsx,ts,tsx}",  // All src files
]
```

### ESLint Errors on Commit

Run linter with fix:

```bash
npm run lint -- --fix
```

## VS Code Extensions (Recommended)

Install these extensions for better development experience:

- **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
- **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss
- **TypeScript Vue Plugin (Volar)** - Vue.volar
- **Prettier - Code formatter** - esbenp.prettier-vscode
- **ESLint** - dbaeumer.vscode-eslint

## Debugging

### Browser DevTools

1. Open app in browser: `http://localhost:5173`
2. Press `F12` or right-click → Inspect
3. Use React DevTools browser extension for component inspection

### Console Logging

```typescript
console.log('Value:', myValue);
console.error('Error occurred:', error);
console.table(arrayOfObjects); // Display array as table
```

### Debugger Statement

```typescript
const myFunction = () => {
  debugger; // Execution pauses here when DevTools open
  // ... rest of code
};
```

## Git Workflow

### Feature Branch

```bash
# Create and switch to feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push to remote
git push origin feature/my-feature
```

### Commit Message Format

```
feat: add new feature
fix: fix specific issue
docs: update documentation
style: formatting changes
refactor: code restructuring
test: add tests
chore: dependency updates
```

## Performance Optimization Tips

1. **Lazy Load Routes** - Split bundles by route
2. **Memoize Components** - Use `React.memo()` for expensive renders
3. **Optimize Images** - Compress and use appropriate formats
4. **Tree Shake** - Remove unused code with imports
5. **Code Splitting** - Dynamic imports for heavy components

## Next Steps

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand project structure
- See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for adding features
- Check component-specific documentation in respective folders

---

**Need help?** Check the individual README.md files in each folder.
