# Troubleshooting & FAQ

Comprehensive guide to solve common problems and answer frequent questions.

## 🔴 Setup & Installation Issues

### "npm install" times out or fails

**Problem:** Dependencies fail to install
**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Try with verbose output to see what fails
npm install --verbose

# Use different npm registry
npm install --registry https://registry.npmjs.org/

# Update Node and npm
node --version  # Should be v18+
npm --version   # Should be v9+
# If old, download latest from nodejs.org
```

### "Port 5173 already in use"

**Problem:** Another process is using dev server port
**Solutions:**
```bash
# Use different port
npm run dev -- --port 3000

# Find and kill process using port (macOS/Linux)
lsof -ti:5173 | xargs kill -9

# On Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### "Module not found" error

**Problem:** Import path doesn't exist
**Solutions:**
```typescript
// ❌ Wrong
import MyComponent from './MyComponent'; // Relative path issues

// ✅ Correct
import MyComponent from '@/components/MyComponent';

// Check:
// 1. File exists
// 2. File has correct extension (.tsx, .ts, .json)
// 3. Export exists in that file
// 4. Path is relative to src/ with @ alias
```

---

## 🟡 Development Issues

### Changes not hot-reloading

**Problem:** File changes not reflected in browser
**Solutions:**
```bash
# Restart dev server
# Ctrl+C in terminal
npm run dev

# Clear Vite cache
rm -rf node_modules/.vite

# Check file was saved
# Ensure file is in src/ folder
# Try changing file name to trigger reload
```

### TypeScript errors not showing

**Problem:** Type errors not caught
**Solutions:**
```bash
# Run type check
npm run build

# Check tsconfig.json exists
cat tsconfig.json

# Check strict mode is enabled
grep strict tsconfig.json
```

### Console shows React errors

**Problem:** React warnings in browser console
**Examples:**
```
Warning: Each child in a list should have a unique "key" prop.
```

**Solutions:**
```typescript
// ❌ Wrong - no key
{items.map(item => <div>{item}</div>)}

// ✅ Correct - unique key
{items.map(item => <div key={item.id}>{item}</div>)}

// Warning: Rules of Hooks violated
// Move hooks to top level of component

// Warning: Can't perform a React state update on unmounted component
const { data } = useFetch();  // May update after unmount
// Solution: Add cleanup in useEffect
```

---

## 🔵 API & Authentication Issues

### "401 Unauthorized" errors

**Problem:** API returns 401, user redirected to signin
**Solutions:**
```typescript
try {
  const data = await getStatsService();
} catch (error) {
  // API returned 401 - token invalid/expired
  // User automatically redirected to signin
  // This is expected behavior for expired tokens
}

// To fix:
// 1. Log in again
// 2. Get new token
// 3. Refresh page to use new token
```

### API request not including token

**Problem:** Token not sent with request headers
**Solutions:**
```typescript
// Token automatically added by interceptor
// Check:
// 1. Token exists: tokenManager.isLoggedIn()
// 2. Interceptor active in src/services/api.tsx
// 3. Browser console → Network → Request headers

// Manual check
const token = tokenManager.getToken();
console.log('Token:', token); // Should see 'Bearer ...'
```

### CORS errors

**Problem:** Browser blocks request (Cross-Origin Resource Sharing)
**Error:** `Access to XMLHttpRequest blocked by CORS policy`
**Solutions:**
```typescript
// CORS is configured on backend
// Your frontend just makes requests

// Check:
// 1. API URL is correct in .env.local
// 2. Backend allows requests from origin
// 3. Request method is allowed (GET, POST)

// Backend must return:
// Access-Control-Allow-Origin: *
// (or your frontend domain)
```

### Token not persisting after page reload

**Problem:** User logged out after refresh
**Solutions:**
```typescript
// Token stored in localStorage
// Check browser DevTools → Application → Local Storage
// Should see key: 'accessToken' with value: 'jwt_token...'

// If not there:
// 1. Token not being saved: tokenManager.setToken()
// 2. localStorage disabled in browser
// 3. Private/Incognito mode clears localStorage

// To fix:
// 1. Ensure tokenManager.setToken(token) is called
// 2. Check browser privacy settings
// 3. Try regular mode instead of private
```

---

## 🟢 Styling & Layout Issues

### Tailwind classes not applying

**Problem:** Tailwind CSS styles not working
**Example:**
```html
<div className="bg-blue-500">Not showing blue!</div>
```

**Solutions:**
```typescript
// ❌ Wrong - dynamic class names
const bgClass = `bg-${color}-500`;
<div className={bgClass}>  // Tailwind won't find this!

// ✅ Correct - static class names
<div className={color === 'blue' ? 'bg-blue-500' : 'bg-red-500'}>

// Check:
// 1. Class name is in Tailwind docs
// 2. Class spelled correctly
// 3. Using dynamic values? Use clsx or tailwind-merge
```

### Dark mode not working

**Problem:** `dark:` classes not applying
**Solutions:**
```typescript
// Check if theme is 'dark'
import { useTheme } from '@/context/ThemeContext';
const { theme } = useTheme();
console.log('Current theme:', theme); // Should be 'light' or 'dark'

// Check HTML element
// Open DevTools → Elements
// <html> should have class "dark"
document.documentElement.classList.contains('dark'); // true/false

// Try toggling theme:
const { toggleTheme } = useTheme();
toggleTheme(); // Switch light ↔ dark
```

### Layout broken on mobile

**Problem:** Layout doesn't look good on small screens
**Solutions:**
```typescript
// Use responsive Tailwind classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* 1 col: mobile, 2 cols: tablet, 4 cols: desktop */}
</div>

// Test responsiveness:
// DevTools → Toggle device toolbar (Ctrl+Shift+M)
// Or resize browser window

// Common breakpoints:
// sm → 640px
// md → 768px (tablet)
// lg → 1024px
// xl → 1280px
// 2xl → 1536px
```

---

## 🟣 Component & State Issues

### Component re-renders too much

**Problem:** Component renders every second even with no changes
**Solutions:**
```typescript
// Likely cause: Creating new objects in render
const App = () => {
  // ❌ Bad - new object created every render
  const handleClick = () => alert('clicked');
  
  // ✅ Good - memoized callback
  const handleClick = useCallback(() => alert('clicked'), []);

  // ❌ Bad - new object every render
  return <Child style={{ color: 'red' }} />;
  
  // ✅ Good - static object
  const style = { color: 'red' };
  return <Child style={style} />;
};

// Check:
// 1. Use React DevTools → Profiler
// 2. Identify unnecessary renders
// 3. Memoize objects and callbacks
// 4. Check parent re-renders
```

### State not updating

**Problem:** setState doesn't update component
**Solutions:**
```typescript
// ❌ Wrong - mutating state directly
const [user, setUser] = useState({ name: 'John' });
user.name = 'Jane'; // Won't trigger re-render

// ✅ Correct - create new object
setUser({ ...user, name: 'Jane' });

// For arrays:
// ❌ Wrong
users.push(newUser);
setUsers(users);

// ✅ Correct
setUsers([...users, newUser]);

// Check:
// 1. Are you mutating state directly?
// 2. Is new state different from old state?
// 3. Are you calling setState?
```

### Context value not updating

**Problem:** useContext hook returns stale values
**Solutions:**
```typescript
// Make sure component is wrapped by provider
// In main.tsx or parent component:
<ThemeProvider>  {/* Provider must wrap component */}
  <MyComponent />
</ThemeProvider>

// If still not working:
const MyProvider = ({ children }) => {
  const [value, setValue] = useState('');
  
  // ❌ Problem - creates new object every render
  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
};

// ✅ Solution - memoize context value
const contextValue = useMemo(() => ({ value, setValue }), [value]);
return (
  <MyContext.Provider value={contextValue}>
    {children}
  </MyContext.Provider>
);
```

---

## 🔴 Form Issues

### Form validation not working

**Problem:** Error messages don't show
**Solutions:**
```typescript
const form = useForm({
  resolver: yupResolver(validationSchema), // or zodResolver
});

// Check:
// 1. Resolver is provided
// 2. Schema matches field names
// 3. Errors are checked: {errors.field?.message}
// 4. Submit handler actually calls form submit

<form onSubmit={form.handleSubmit(onSubmit)}>
  {/* form.handleSubmit wraps handler */}
</form>
```

### Form values not saving

**Problem:** Form changes don't update useState
**Solutions:**
```typescript
const { register, watch } = useForm();

// Register connects input to form state
<input {...register('name')} /> // ✅ Works

// Don't do this:
<input onChange={(e) => setName(e.target.value)} /> // Conflicts!

// To watch values:
const name = watch('name'); // Get real-time value

// To get final values on submit:
const onSubmit = (data) => {
  console.log(data.name); // Final value when submitted
};
```

---

## 🔷 Performance Issues

### App is slow / jank

**Problem:** App feels laggy or unresponsive
**Solutions:**
```typescript
// Profile performance
// DevTools → Performance → Start recording
// Interact with app
// Stop recording and analyze

// Common causes:
// 1. Large lists re-rendering
// Solution: Virtualization or pagination

// 2. Expensive computations
// Solution: useMemo
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);

// 3. Frequent re-renders
// Solution: React.memo
const MyComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});

// 4. Network requests blocking render
// Solution: async/await with loading state
const [loading, setLoading] = useState(false);
```

### Bundle size too large

**Problem:** Build output is huge
**Solution:**
```bash
# Analyze bundle
npm run build
# Check dist/ folder size

# Reduce by:
// 1. Remove unused packages
npm list
// 2. Code splitting
const Component = React.lazy(() => import('./Component'));
// 3. Tree shaking - use named imports
// ❌ import * as utils from './utils'
// ✅ import { helper1, helper2 } from './utils'
```

---

## ❓ FAQ - General Questions

### Q: Where should I put the file?

**A:** Use this structure:
```
src/
├── pages/         ← Page components (routable)
├── components/    ← Reusable UI
├── services/      ← API calls
├── context/       ← Global state
├── hooks/         ← Custom hooks
├── utils/         ← Helpers
├── icons/         ← Icons
├── layout/        ← Layout wrappers
└── types/         ← TypeScript types
```

### Q: Should I create a component or page?

**A:**
- **Component:** Reusable piece of UI (Card, Button, Modal)
- **Page:** Full-screen view connected to route

### Q: How do I prevent API calls?

**A:**
```typescript
// Avoid multiple calls by checking useEffect deps
useEffect(() => {
  fetchData();
}, []); // ← Empty means run once on mount
```

### Q: Can I use axios directly?

**A:** No, always use services:
```typescript
// ❌ Don't
axios.get('/api/users');

// ✅ Do
import api from '@/services/api';
api.get('/api/users');
// Or even better
getUsersService();
```

### Q: How do I debug TypeScript errors?

**A:**
```bash
# Run type checking
npm run build

# Or use IDE:
# Hover over error in VS Code to see details
```

### Q: Can I commit `.env.local`?

**A:** No, add to `.gitignore`:
```
.env.local
.env.*.local
```

### Q: How do I update dependencies?

**A:**
```bash
npm outdated  # See what's outdated
npm update    # Update to latest minor versions

# Or specific:
npm install react@latest
```

---

## 🆘 Still Stuck?

### Debug Checklist
- [ ] Read error message carefully
- [ ] Check browser console (F12)
- [ ] Check network tab for API issues
- [ ] Search relevant documentation
- [ ] Find similar code in project
- [ ] Try simpler version first
- [ ] Ask team member with context
- [ ] Read error stack trace

### Ask for Help Effectively

```
Good question:
"I'm trying to fetch user data in the Products page. 
The service is returning data but it's not showing in the component. 
Here's what I tried...
[code snippet]
What am I missing?"

Bad question:
"It doesn't work"
```

---

## 📞 Getting Help

### Resources in Order
1. Check relevant README in Docs/
2. Search [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
3. Look for similar code in project
4. Check browser console errors
5. Ask team member

### Docs to Check
- General: [ARCHITECTURE.md](./ARCHITECTURE.md)
- API: [src/services/README.md](./src/services/README.md)
- State: [src/context/README.md](./src/context/README.md)
- New to JS?: [ONBOARDING.md](./ONBOARDING.md)

---

**Remember:** Most errors have been solved before. Search the docs first! 🔍
