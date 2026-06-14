# Quick Reference & Checklists

Fast lookup guides and implementation checklists for common tasks.

## 🚀 Quick Start Checklist

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Create `.env.local` with API endpoints
- [ ] Run `npm run dev`
- [ ] Open http://localhost:5173
- [ ] Test with sample login
- [ ] Read [ONBOARDING.md](./ONBOARDING.md)
- [ ] Explore codebase
- [ ] Try creating a component

---

## 📝 Common Tasks

### Create a New Component

```bash
# 1. Create file
touch src/components/folder/MyComponent.tsx

# 2. Write component
# src/components/folder/MyComponent.tsx
interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onClick }) => {
  return <div className="p-4"><h2>{title}</h2></div>;
};

export default MyComponent;

# 3. Use in page/another component
import MyComponent from '@/components/folder/MyComponent';
<MyComponent title="Hello" />
```

### Fetch Data from API

```typescript
// 1. Create types
// src/types/myFeature.ts
export interface MyData {
  id: string;
  name: string;
}

// 2. Create service
// src/services/myFeatureService.ts
import api from './api';
import { API_URLS } from './urls';

export const getMyDataService = async (): Promise<MyData[]> => {
  const response = await api.get(API_URLS.MY_DATA);
  return response.data.data;
};

// 3. Use in component
import { getMyDataService } from '@/services/myFeatureService';

const MyPage = () => {
  const [data, setData] = useState<MyData[]>([]);

  useEffect(() => {
    getMyDataService()
      .then(setData)
      .catch(err => showAlert('error', 'Failed to load'));
  }, []);

  return <div>{data.map(d => <p key={d.id}>{d.name}</p>)}</div>;
};
```

### Show Alerts/Toasts

```typescript
import { showAlert } from '@/services/alertService';

// Success
showAlert('success', 'Operation successful!');

// Error
showAlert('error', 'Something went wrong');

// Warning
showAlert('warning', 'Please confirm', 'Confirm Delete');

// Info
showAlert('info', 'New updates available');
```

### Toggle Dark Mode

```typescript
// Create useTheme hook in src/hooks/useTheme.ts
import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be within ThemeProvider');
  return context;
};

// Use in component
const Component = () => {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{theme === 'dark' ? '☀' : '🌙'}</button>;
};
```

### Manage Sidebar State

```typescript
import { useSidebar } from '@/context/SidebarContext';

const Component = () => {
  const { isExpanded, toggleSidebar, activeItem, setActiveItem } = useSidebar();

  return (
    <>
      <button onClick={toggleSidebar}>
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>
    </>
  );
};
```

### Add Protected Route

```typescript
// src/App.tsx
import ProductPage from './pages/ProductPage';

<Route element={<ProtectedRoute />}>
  <Route element={<AppLayout />}>
    <Route path="/products" element={<ProductPage />} />
  </Route>
</Route>
```

### Create Form with Validation

```typescript
import { useForm } from 'react-hook-form';

interface FormData {
  name: string;
  email: string;
}

const MyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await submitService(data);
      showAlert('success', 'Submitted!');
    } catch (err) {
      showAlert('error', 'Failed to submit');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name', { required: 'Name required' })} />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <input {...register('email', { required: 'Email required' })} />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};
```

---

## ✅ Feature Implementation Checklist

Before committing code, ensure:

### Code Quality
- [ ] No TypeScript errors (`npm run build`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] No console errors/warnings
- [ ] Proper typing (no `any`)
- [ ] Comments for complex logic

### Functionality
- [ ] Feature works end-to-end
- [ ] All happy paths tested
- [ ] Error cases handled
- [ ] Loading states shown
- [ ] Responsive design (mobile + desktop)

### User Experience
- [ ] User feedback (toasts/alerts)
- [ ] No broken links
- [ ] Proper error messages (not technical)
- [ ] Disabled states on buttons
- [ ] Proper form validation

### Architecture
- [ ] Follows existing patterns
- [ ] Services separate from components
- [ ] Proper folder structure
- [ ] Descriptive file names
- [ ] Reusable components created
- [ ] No prop drilling

### Documentation
- [ ] Code comments where needed
- [ ] Related docs updated
- [ ] Component props documented
- [ ] Service functions commented

---

## 📚 Documentation Map

| Need | Document |
|------|----------|
| **First day?** | [ONBOARDING.md](./ONBOARDING.md) |
| **Setup?** | [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) |
| **How it works?** | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| **Code examples?** | [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) |
| **Patterns?** | [SECURITY_PATTERNS.md](./SECURITY_PATTERNS.md) |
| **API calls?** | [src/services/README.md](./src/services/README.md) |
| **Global state?** | [src/context/README.md](./src/context/README.md) |
| **Custom hooks?** | [src/hooks/COMPREHENSIVE.md](./src/hooks/COMPREHENSIVE.md) |
| **Utilities?** | [src/utils/README.md](./src/utils/README.md) |

---

## 🔍 Folder Guide

| Folder | Purpose | Create | Examples |
|--------|---------|--------|----------|
| `src/pages/` | Page components | New features | Dashboard, Users, Products |
| `src/components/` | Reusable UI | Shared components | Cards, Forms, Headers |
| `src/services/` | API calls | New domains | authService, userService |
| `src/context/` | Global state | Rare | Theme, Sidebar |
| `src/hooks/` | Custom hooks | Reusable logic | useModal, useFetch |
| `src/utils/` | Helpers | Utilities | formatters, validators |
| `src/layout/` | Page layout | Very rare | AppLayout |
| `src/icons/` | Icons | Icons only | Icon components |
| `public/` | Static assets | Assets | Images, fonts |

---

## 🎯 Architecture at a Glance

```
User Action (click, input, etc)
    ↓
Component/Page
    ↓
Service Layer (API call)
    ↓
Axios (with JWT token)
    ↓
Backend API
    ↓
Response Processing
    ↓
Update State (useState or Context)
    ↓
Component Re-render
    ↓
User sees update
```

---

## 🚨 Common Errors & Fixes

### Error: "Cannot find module '@/components/...'"
- Check file path is correct
- File must be `.tsx` (React components) or `.ts` (utilities)
- Import path uses `@` alias (configured in vite)

### Error: "X is not defined"
- Add import at top of file
- Check spelling and capitalization
- Verify export in source file

### Error: "Property 'X' does not exist on type 'Y'"
- TypeScript type mismatch
- Check interface definition
- Verify API response shape
- Use proper typing in functions

### Error: "Cannot read property of null/undefined"
- Check optional chaining `?.`
- Add null checks `if (value)`
- Initialize state with default value
- Check API response structure

### Error: "Hook rules of hooks violated"
- Hooks only at top level (not in loops/conditions)
- Create custom hook instead
- Move hook call to parent

### Styles not applying
- Check Tailwind imports in CSS
- Use complete class names (no string interpolation)
- Check media queries/dark mode
- Clear cache: `rm -rf node_modules/.vite`

---

## 💡 Pro Tips

### Tip 1: Fast Navigation
Use Ctrl+P in VS Code to jump to files instantly.

### Tip 2: Find References
Right-click symbol → "Find All References" to see usage.

### Tip 3: Automatic Imports
Start typing component name, press Ctrl+Space for autocomplete.

### Tip 4: Safe Type Changes
Use TypeScript strict mode to catch issues early.

### Tip 5: Mobile Testing
Add `?` to URL to open React DevTools Mobile Toolbar.

### Tip 6: Network Debugging
Open DevTools → Network tab to see API requests/responses.

### Tip 7: React DevTools
Chrome extension "React Developer Tools" for component inspection.

### Tip 8: Tailwind Plugin
VS Code extension "Tailwind CSS IntelliSense" for autocomplete.

---

## 📞 Getting Unstuck

1. **Check console** - F12 → Console tab
2. **Check network** - F12 → Network tab for API calls
3. **Search docs** - Ctrl+F in relevant README
4. **Search codebase** - Ctrl+Shift+F for patterns
5. **Check similar code** - Find working example
6. **Ask team member** - Provide context and what you tried
7. **Rubber duck debugging** - Explain problem out loud

---

## 🎓 Learning Path

### Week 1: Fundamentals
- [ ] Setup complete
- [ ] Understand architecture
- [ ] Create first component
- [ ] Fetch and display data

### Week 2: Integration
- [ ] Service layer basics
- [ ] Form handling
- [ ] State management
- [ ] Error handling

### Week 3: Advanced
- [ ] Custom hooks
- [ ] Context patterns
- [ ] Performance optimization
- [ ] Security best practices

### Week 4+: Mastery
- [ ] Lead feature implementation
- [ ] Code review others
- [ ] Documentation improvements
- [ ] Mentor new developers

---

## 📋 Before Submitting Code

```typescript
// 1. TypeScript check
npm run build

// 2. Linting
npm run lint -- --fix

// 3. Manual testing
npm run dev
// Test in browser

// 4. Code review checklist
- [ ] Follows patterns
- [ ] Proper error handling
- [ ] Component reuse
- [ ] Performance OK
- [ ] Accessibility OK
- [ ] Documentation updated
```

---

## 🎉 You're Ready!

You now have everything to:
- ✅ Set up your development environment
- ✅ Understand project architecture
- ✅ Implement new features
- ✅ Follow best practices
- ✅ Get unstuck when needed

### Next Steps:
1. Start with [ONBOARDING.md](./ONBOARDING.md) if new
2. Implement your first feature from [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
3. Reference docs as needed
4. Ask questions early

---

**Happy coding! 🚀**

For questions or updates, refer to relevant documentation files or discuss with team.
