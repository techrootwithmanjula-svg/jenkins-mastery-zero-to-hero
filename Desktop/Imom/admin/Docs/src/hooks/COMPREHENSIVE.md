# src/hooks/ - Custom React Hooks

Reusable React hooks that encapsulate complex logic and state management.

## 🎯 Purpose

- **Logic Reuse:** Share complex logic across multiple components
- **State Abstraction:** Hide implementation details
- **Custom Behaviors:** Build domain-specific React functionality
- **Cleaner Components:** Move logic out of component body

## 📁 Current Hooks

### 1. useGoBack - Navigation

**File:** `useGoBack.ts`

**Purpose:** Go back to previous page with fallback.

**Usage:**
```typescript
import { useGoBack } from '@/hooks/useGoBack';

export const MyPage = () => {
  const goBack = useGoBack();

  return (
    <>
      <button onClick={goBack}>← Back</button>
    </>
  );
};
```

**Behavior:**
- Navigates to previous page if history exists
- Falls back to home page if no history
- Useful for detail/edit pages

###2. useModal - Modal Management

**File:** `useModal.ts`

**Purpose:** Manage modal/dialog open/close state.

**Usage:**
```typescript
import { useModal } from '@/hooks/useModal';

export const MyComponent = () => {
  const { isOpen, open, close } = useModal();

  return (
    <>
      <button onClick={open}>Open Modal</button>
      {isOpen && (
        <div className="modal">
          <p>Modal content</p>
          <button onClick={close}>Close</button>
        </div>
      )}
    </>
  );
};
```

**Returns:**
```typescript
{
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}
```

---

## 📋 Creating Custom Hooks

### Pattern 1: Simple State Hook

```typescript
// src/hooks/useToggle.ts
import { useState, useCallback } from 'react';

export const useToggle = (initialValue: boolean = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse };
};

// Usage:
const { value: isOpen, toggle } = useToggle();
```

### Pattern 2: Async Data Hook

```typescript
// src/hooks/useFetch.ts
import { useState, useEffect } from 'react';

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useFetch = <T,>(
  fetcher: () => Promise<T>,
  deps?: React.DependencyList
): UseFetchState<T> => {
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
};

// Usage:
const { data: users, loading, error } = useFetch(
  () => getUsersService(),
  [] // run once
);
```

### Pattern 3: Form Hook

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export const useLocalStorage = <T,>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setState(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [state, setValue];
};

// Usage:
const [name, setName] = useLocalStorage('userName', 'Guest');
```

### Pattern 4: Ref Callback Hook

```typescript
// src/hooks/usePrevious.ts
import { useRef, useEffect } from 'react';

export const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

// Usage:
const [count, setCount] = useState(0);
const prevCount = usePrevious(count);
```

### Pattern 5: Debounce Hook

```typescript
// src/hooks/useDebounce.ts
import { useEffect, useState } from 'react';

export const useDebounce = <T,>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Usage: Debounce search input
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 300);

useEffect(() => {
  // Only search when user stops typing
  searchUsers(debouncedSearchTerm);
}, [debouncedSearchTerm]);
```

### Pattern 6: Async Callback Hook

```typescript
// src/hooks/useAsync.ts
import { useState, useCallback } from 'react';

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useAsync = <T, A extends any[]>(
  asyncFunction: (...args: A) => Promise<T>,
  immediate: boolean = true
) => {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(
    async (...args: A) => {
      setState({ data: null, loading: true, error: null });
      try {
        const result = await asyncFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error';
        setState({ data: null, loading: false, error: message });
        throw error;
      }
    },
    [asyncFunction]
  );

  return { ...state, execute };
};

// Usage:
const { data, loading, error, execute } = useAsync(
  (userId: string) => getUserService(userId),
  false // don't run immediately
);

const handleFetch = async () => {
  await execute('123');
};
```

---

## Best Practices

✅ **DO:**
- Return object with clear property names
- Use TypeScript for type safety
- Handle cleanup (return function from useEffect)
- Memoize callbacks when appropriate
- Add comprehensive JSDoc comments

❌ **DON'T:**
- Call hooks conditionally
- Update state directly in useMemo
- Forget dependency arrays
- Create hooks inside render
- Return new object instances every render

---

## Common Hook Mistakes

### ❌ Missing Dependency

```typescript
// Bad: useEffect runs every render
useEffect(() => {
  fetchData();
}, []); // Missing dependency

// Good: Runs once on mount
useEffect(() => {
  fetchData();
}, []);
```

### ❌ Hook Called Conditionally

```typescript
// Bad: Breaks Rules of Hooks
if (condition) {
  useEffect(() => {});
}

// Good: Move condition inside effect
useEffect(() => {
  if (condition) {
    // do something
  }
}, [condition]);
```

### ❌ Stale Closures

```typescript
// Bad: Callback uses stale data
const handleClick = () => {
  alert(data); // data might be stale
};

// Good: Add data to dependencies
const handleClick = useCallback(() => {
  alert(data);
}, [data]);
```

---

## Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react';
import { useToggle } from '@/hooks/useToggle';

describe('useToggle', () => {
  it('should toggle value', () => {
    const { result } = renderHook(() => useToggle(false));

    expect(result.current.value).toBe(false);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.value).toBe(true);
  });
});
```

---

See [ARCHITECTURE.md](../../ARCHITECTURE.md) for patterns using hooks.
