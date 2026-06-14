# Advanced Patterns & Security Guide

## Security Best Practices

### 1. Authentication Security

#### Token Management

**Current Implementation:**
```typescript
// src/utils/tokenManager.ts
const TOKEN_KEY = "accessToken";

export const tokenManager = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  isLoggedIn: () => !!localStorage.getItem(TOKEN_KEY),
};
```

**⚠️ Security Issue:** localStorage is vulnerable to XSS attacks.

**Recommended Enhancement:**
Use httpOnly cookies instead:

```typescript
// src/utils/tokenManager.ts
export const tokenManager = {
  // Cookies are set by backend (httpOnly, secure)
  // Frontend only checks if token exists
  getToken: () => {
    // For API calls, backend automatically sends token in cookies
    return true; // Authorization is implicit
  },
  
  isLoggedIn: () => {
    // Check if user session is active
    return !!document.cookie.includes('session');
  },
  
  logout: () => {
    // Trigger logout endpoint to clear cookie
    api.post('/auth/logout');
  },
};
```

**Backend should:**
```
Set-Cookie: accessToken=<JWT>; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
```

---

#### Secure API Calls

**Instead of:**
```typescript
// Manual header addition (exposed in localStorage)
api.interceptors.request.use((config) => {
  const token = tokenManager.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Use:**
```typescript
// Token sent automatically via httpOnly cookies
// No manual header needed
// CORS credentials required:
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Include cookies
});
```

---

### 2. XSS (Cross-Site Scripting) Prevention

**❌ Vulnerable:**
```typescript
// User input directly in HTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

**✅ Safe:**
```typescript
// React automatically escapes text content
<div>{userInput}</div>

// For user-generated HTML, use DOMPurify
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userInput) 
}} />
```

---

### 3. CSRF (Cross-Site Request Forgery) Prevention

**Backend should provide CSRF token:**

```typescript
// Request CSRF token on app load
const getCsrfToken = async () => {
  const response = await axios.get('/api/csrf-token');
  return response.data.token;
};

// Add to all state-changing requests
api.interceptors.request.use((config) => {
  if (['post', 'put', 'delete'].includes(config.method || '')) {
    const token = sessionStorage.getItem('csrfToken');
    if (token) {
      config.headers['X-CSRF-Token'] = token;
    }
  }
  return config;
});
```

---

### 4. Sensitive Data Handling

**❌ Never store in localStorage:**
```typescript
localStorage.setItem('password', userPassword); // DANGER!
localStorage.setItem('creditCard', cardNumber); // DANGER!
```

**✅ Safe approaches:**
```typescript
// 1. Don't store sensitive data at all
// 2. Let backend handle sensitive operations
// 3. Use memory-only variables for temporary data
const sensitiveData = useRef<string | null>(null);
sensitiveData.current = cardNumber; // Only in memory
// Data lost on page refresh (safe!)
```

---

### 5. Environment Variables

**❌ Don't expose secrets:**
```typescript
// .env (committed to git)
VITE_API_SECRET=super_secret_key // ❌ EXPOSED!
VITE_DATABASE_PASSWORD=pass123    // ❌ EXPOSED!
```

**✅ Correct approach:**
```bash
# .env.local (NOT committed, only for local dev)
VITE_API_URL=http://localhost:3000 # ✅ Safe

# Backend always handles secrets
# Example: Backend reads from env vars
// Backend .env
DATABASE_PASSWORD=secure_pass_in_env
API_SECRET=secret_in_env
JWT_SECRET=jwt_secret_in_env
```

All secrets should be:
- Managed by backend
- Stored in secure environment variable management
- Never exposed to frontend

---

### 6. Input Validation

**Client-side validation (UX only):**
```typescript
// Catch obvious errors early
const form = useForm({
  resolver: yupResolver(schema),
});

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});
```

**⚠️ Always validate on backend too!**
```typescript
// Malicious users can bypass client validation
// Backend is the source of truth
app.post('/login', (req, res) => {
  // Validate all inputs
  if (!isValidEmail(req.body.email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  // Process securely
});
```

---

### 7. API Security Headers

**Frontend should include:**

```typescript
// Request headers
const api = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  },
});
```

**Backend should respond with:**

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self';
```

---

## Advanced State Management Patterns

### 1. Complex State with useReducer

Instead of multiple useState for related state:

```typescript
// ❌ Multiple useState
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// ✅ useReducer for complex state
interface State {
  data: User[];
  loading: boolean;
  error: string | null;
}

interface Action {
  type: 'FETCH_START' | 'FETCH_SUCCESS' | 'FETCH_ERROR';
  payload?: any;
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, data: action.payload, loading: false };
    case 'FETCH_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const UserPage = () => {
  const [state, dispatch] = useReducer(reducer, {
    data: [],
    loading: false,
    error: null,
  });

  const fetchUsers = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await getUsersService();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  };

  return (
    <div>
      {state.loading && <p>Loading...</p>}
      {state.error && <p>Error: {state.error}</p>}
      {state.data.map(user => <UserCard key={user.id} user={user} />)}
      <button onClick={fetchUsers}>Fetch Users</button>
    </div>
  );
};
```

---

### 2. Custom Hooks for Logic Reuse

Extract complex logic into custom hooks:

```typescript
// src/hooks/useFetch.ts
interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(
  fetcher: () => Promise<T>,
  deps?: React.DependencyList
): UseFetchState<T> {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetch = async () => {
      setState(prev => ({ ...prev, loading: true }));
      try {
        const data = await fetcher();
        if (isMounted) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    };

    fetch();

    return () => {
      isMounted = false;
    };
  }, deps);

  return state;
}

// Usage:
const UsersList = () => {
  const { data: users, loading, error } = useFetch(
    () => getProductsService(),
    [] // dependency array
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <>{users?.map(u => <p key={u.id}>{u.name}</p>)}</>;
};
```

---

### 3. Context with useCallback

Prevent unnecessary re-renders:

```typescript
// ❌ Problem: All consumers re-render
export const MyProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ✅ Solution: Memoize context value
export const MyProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const value = useMemo(
    () => ({ theme, setTheme }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
```

---

### 4. React Query Pattern (Recommended Future)

For server state management, consider React Query in future:

```typescript
// npm install @tanstack/react-query

import { useQuery } from '@tanstack/react-query';

const UsersList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => getProductsService(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <>{data?.map(u => <p key={u.id}>{u.name}</p>)}</>;
};
```

---

## Performance Optimization

### 1. Component Memoization

```typescript
// Prevent re-render if props unchanged
const UserCard = React.memo(({ user }: UserCardProps) => (
  <div>{user.name}</div>
));

// With custom comparison
const UserCard = React.memo(
  ({ user }: UserCardProps) => <div>{user.name}</div>,
  (prevProps, nextProps) => {
    return prevProps.user.id === nextProps.user.id;
  }
);
```

---

### 2. Callback Memoization

```typescript
// ❌ New function on every render
<ProductList onSelect={(product) => setSelected(product)} />

// ✅ Memoized callback
const handleSelect = useCallback(
  (product: Product) => setSelected(product),
  [] // dependencies
);
<ProductList onSelect={handleSelect} />
```

---

### 3. useDeferredValue for Heavy Lists

```typescript
const [searchTerm, setSearchTerm] = useState('');
const deferredSearchTerm = useDeferredValue(searchTerm);

// Heavy filtering won't block UI updates
const filteredUsers = useMemo(
  () => users.filter(u => 
    u.name.includes(deferredSearchTerm)
  ),
  [users, deferredSearchTerm]
);

return (
  <>
    <input 
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
    <UserList users={filteredUsers} />
  </>
);
```

---

### 4. Code Splitting with React.lazy

```typescript
// Lazy load routes
const ProductPage = React.lazy(() => 
  import('./pages/Products/ProductPage')
);

const routes = [
  {
    path: '/products',
    element: (
      <Suspense fallback={<Loading />}>
        <ProductPage />
      </Suspense>
    ),
  },
];
```

---

## Recommended Refactoring/Improvements

### 1. State Management Layer

**Current:** Context + localStorage
**Recommendation:** Add a reducer layer for complex state

```typescript
// src/context/AppStateContext.tsx
interface AppState {
  user: User | null;
  notifications: Notification[];
  sidebar: SidebarState;
  theme: Theme;
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_THEME'; payload: Theme };

const appReducer = (state: AppState, action: AppAction): AppState => {
  // Handle all state updates in one place
};

export const AppStateContext = createContext<AppState | null>(null);
export const AppDispatchContext = createContext<
  React.Dispatch<AppAction> | undefined
>(undefined);
```

---

### 2. Type-Safe API Calls

**Add API response types:**

```typescript
// src/types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Usage:
const api = axios.create<ApiResponse<any>>();
```

---

### 3. Error Handling Wrapper

```typescript
// src/utils/errorHandler.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static handle(error: any) {
    if (axios.isAxiosError(error)) {
      const { status, data } = error.response || {};
      return new ApiError(
        status || 500,
        data?.message || 'API Error',
        data?.errors
      );
    }
    return new ApiError(500, 'Unknown error');
  }
}

// Usage:
try {
  await getUserService();
} catch (error) {
  const apiError = ApiError.handle(error);
  showAlert('error', apiError.message);
  if (apiError.errors) {
    // Show field-level errors
  }
}
```

---

### 4. Form Handling Abstraction

```typescript
// src/hooks/useFormHandler.ts
export function useFormHandler<T extends Record<string, unknown>>(
  onSubmit: (data: T) => Promise<void>
) {
  const { handleSubmit, formState: { isSubmitting }, ...form } = 
    useForm<T>();

  const onFormSubmit = handleSubmit(async (data) => {
    try {
      await onSubmit(data);
      showAlert('success', 'Saved successfully');
    } catch (error) {
      showAlert('error', error instanceof Error ? error.message : 'Error');
    }
  });

  return { onSubmit: onFormSubmit, isSubmitting, ...form };
}

// Usage:
const { onSubmit, isSubmitting } = useFormHandler(
  async (data) => {
    await createProductService(data);
  }
);
```

---

### 5. Environment Variable Validation

```typescript
// src/config/env.ts
const requiredEnvVars = [
  'VITE_API_BASE_URL',
  'VITE_BASE_URL',
] as const;

const validateEnv = () => {
  const missing: string[] = [];
  
  requiredEnvVars.forEach(key => {
    if (!import.meta.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing environment variables: ${missing.join(', ')}`
    );
  }
};

validateEnv();

export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
  BASE_URL: import.meta.env.VITE_BASE_URL as string,
};
```

---

## Testing Strategy

### Unit Tests (Component Level)

```typescript
// src/components/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
  };

  it('renders product information', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', () => {
    const mockOnEdit = jest.fn();
    render(
      <ProductCard product={mockProduct} onEdit={mockOnEdit} />
    );
    
    screen.getByRole('button', { name: /edit/i }).click();
    expect(mockOnEdit).toHaveBeenCalledWith(mockProduct);
  });
});
```

### API Mocking (MSW)

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/products', () => {
    return HttpResponse.json({
      success: true,
      data: [{ id: '1', name: 'Product 1' }],
    });
  }),
];
```

---

See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for practical examples.
