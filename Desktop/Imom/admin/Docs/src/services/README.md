# src/services/ - API & Business Logic Layer

The services layer is the single source of truth for all API communication and business logic. It provides a clean abstraction between components and backend APIs.

## 🎯 Purpose

- **Centralized API Calls:** All HTTP requests go through services
- **Business Logic:** Encapsulate complex operations
- **Type Safety:** TypeScript ensures correct data structures  
- **Error Handling:** Consistent error management across app
- **Reusability:** Services can be used across multiple components
- **Maintainability:** Single place to update API endpoints

## 📁 File Structure

```
services/
├── api.tsx              # Axios instance with interceptors
├── urls.ts              # All API endpoints
├── authService.ts       # Authentication API calls
├── userService.ts       # User API calls
├── alertService.ts      # Alert notification service
└── README.md            # This file
```

## Core Files

### 1. urls.ts - API Endpoint Configuration

**Purpose:** Single source of truth for all backend endpoints.

```ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.example.com";

// Authentication endpoints
export const AUTH_URLS = {
  SEND_OTP:   `${BASE_URL}/auth/send-otp`,
  VERIFY_OTP: `${BASE_URL}/auth/verify-otp`,
  RESEND_OTP: `${BASE_URL}/auth/resend-otp`,
  GET_STATS:  `${BASE_URL}/auth/stats`,
};

// User endpoints
export const USER_URLS = {
  LIST:       `${BASE_URL}/users`,
  GET:        `${BASE_URL}/users`,
  UPDATE:     `${BASE_URL}/users/update`,
  DELETE:     `${BASE_URL}/users/delete`,
};

// Product endpoints (example)
export const PRODUCT_URLS = {
  LIST:       `${BASE_URL}/products`,
  GET:        `${BASE_URL}/products`,
  CREATE:     `${BASE_URL}/products/create`,
  UPDATE:     `${BASE_URL}/products/update`,
  DELETE:     `${BASE_URL}/products/delete`,
};

export default BASE_URL;
```

**Benefits:**
- ✅ Update all endpoints in one place
- ✅ No hardcoded strings in components
- ✅ Reuse endpoint variables
- ✅ Easy environment configuration

**When to update:** Whenever backend API structure changes.

---

### 2. api.tsx - Axios Configuration

**Purpose:** Pre-configured Axios instance with automatic token management and error handling.

**Configuration:**
- **Base URL:** From `urls.ts`
- **Timeout:** 30,000 ms (30 seconds)
- **Headers:** `Content-Type: application/json`
- **Credentials:** Include cookies (for httpOnly tokens)

**Request Interceptor:**
Automatically adds JWT token to every request:
```
Authorization: Bearer <jwt-token-from-localStorage>
```

**Response Interceptor:**
Handles authentication errors:
- **401 Unauthorized:** Token invalid/expired
  - Clears token from storage
  - Redirects user to `/signin`
  - Prevents infinite API loops

**Example:**
```typescript
import api from '@/services/api';

// Token is automatically added to this request
const response = await api.get('/users');

// On 401 response:
// 1. Token cleared from localStorage
// 2. User redirected to signin
// 3. All subsequent requests fail (not unauthorized)
```

---

### 3. authService.ts - Authentication Service

**Purpose:** All OTP-based authentication API calls.

**Functions:**

```typescript
// Send OTP to phone number
export const sendOtpService = async (mobile: string) => {
  const response = await api.post(AUTH_URLS.SEND_OTP, { mobile });
  return response.data;
  // Returns: { success: true, message: "OTP sent" }
};

// Verify OTP and get authentication token
export const verifyOtpService = async (mobile: string, otp: string) => {
  const response = await api.post(AUTH_URLS.VERIFY_OTP, { mobile, otp });
  return response.data;
  // Returns: { success: true, token: "jwt_token..." }
};

// Resend OTP if not received
export const resendOtpService = async (mobile: string) => {
  const response = await api.post(AUTH_URLS.RESEND_OTP, { mobile });
  return response.data;
};

// Get authenticated user statistics
export const getStatsService = async () => {
  const response = await api.get(AUTH_URLS.GET_STATS);
  return response.data;
};
```

**Usage in Components:**
```typescript
import { verifyOtpService, showAlert } from '@/services';
import { tokenManager } from '@/utils';

const handleOtpSubmit = async (mobile: string, otp: string) => {
  try {
    const result = await verifyOtpService(mobile, otp);
    
    // Save token to localStorage
    tokenManager.setToken(result.token);
    
    // Redirect to dashboard
    navigate('/');
    
    showAlert('success', 'Logged in successfully');
  } catch (error) {
    showAlert('error', 'Invalid OTP. Please try again.');
  }
};
```

---

### 4. userService.ts - User Management Service

**Purpose:** User profile and user list API calls.

**Functions:**
```typescript
export const getUserListService = async (page: number, limit: number) 
export const getUserService = async (id: string)
export const updateUserService = async (id: string, data: any)
export const deleteUserService = async (id: string)
```

**Usage:**
```typescript
import { getUserListService } from '@/services/userService';

const [users, setUsers] = useState([]);

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const data = await getUserListService(1, 10);
      setUsers(data);
    } catch (error) {
      showAlert('error', 'Failed to load users');
    }
  };
  fetchUsers();
}, []);
```

---

### 5. alertService.ts - Toast Notifications

**Purpose:** Display user-friendly notifications throughout the app.

**Function:**
```typescript
export const showAlert = (
  variant: 'success' | 'error' | 'warning' | 'info',
  message: string,
  title?: string,
  duration?: number
) => void;
```

**Usage:**
```typescript
import { showAlert } from '@/services/alertService';

// Success notification
showAlert('success', 'User created successfully!');

// Error notification  
showAlert('error', 'Failed to create user');

// Warning with custom title
showAlert('warning', 'This action cannot be undone', 'Confirm Delete');

// Info notification
showAlert('info', 'Changes saved automatically');

// Custom duration (milliseconds)
showAlert('success', 'Copied!', undefined, 2000);
```

---

## 📋 Adding a New Service

### Step 1: Add URLs
Edit `src/services/urls.ts`:
```typescript
export const MY_FEATURE_URLS = {
  LIST:   `${BASE_URL}/my-feature`,
  GET:    `${BASE_URL}/my-feature`,
  CREATE: `${BASE_URL}/my-feature/create`,
  UPDATE: `${BASE_URL}/my-feature/update`,
  DELETE: `${BASE_URL}/my-feature/delete`,
};
```

### Step 2: Create Service File
Create `src/services/myFeatureService.ts`:
```typescript
import api from './api';
import { MY_FEATURE_URLS } from './urls';
import type { MyFeature, CreatePayload } from '@/types';

/**
 * Get all items
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @returns List of items
 */
export const getMyFeaturesService = async (
  page: number = 1,
  limit: number = 10
): Promise<MyFeature[]> => {
  const response = await api.get(MY_FEATURE_URLS.LIST, {
    params: { page, limit },
  });
  return response.data.data;
};

/**
 * Create new item
 * @param payload - Item data
 * @returns Created item
 */
export const createMyFeatureService = async (
  payload: CreatePayload
): Promise<MyFeature> => {
  const response = await api.post(MY_FEATURE_URLS.CREATE, payload);
  return response.data.data;
};

// ... more functions
```

### Step 3: Use in Components
```typescript
import { getMyFeaturesService } from '@/services/myFeatureService';

const MyPage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getMyFeaturesService();
        setItems(data);
      } catch (error) {
        showAlert('error', 'Failed to load items');
      }
    };
    fetchItems();
  }, []);

  return <div>{/* render items */}</div>;
};
```

---

## 🔐 Security Considerations

✅ **JWT Token Handling:**
- Token stored in localStorage (sent by backend)
- Automatically added to all requests
- Cleared on 401 response
- Consider httpOnly cookies for enhanced security

✅ **Error Responses:**
- Never expose backend details to user
- Show friendly error messages
- Log actual errors for debugging

✅ **Input Validation:**
- Validate on client for UX
- Backend must validate all inputs
- Never trust client-side validation

---

## 💡 Best Practices

✅ **DO:**
- Create separate service for each domain
- Document function parameters and return types
- Handle errors with try-catch
- Use TypeScript for type safety
- Keep services focused and single-purpose
- Use service methods from components

❌ **DON'T:**
- Import services within other services
- Handle component state in services
- Hardcode API URLs
- Ignore error responses
- Mix business logic with UI logic
- Expose error details to users

---

## 🧪 Testing Services

```typescript
import { getMyFeatureService } from '@/services/myFeatureService';
import api from '@/services/api';

jest.mock('@/services/api');

describe('myFeatureService', () => {
  it('should fetch item', async () => {
    const mockItem = { id: '1', name: 'Test' };
    api.get.mockResolvedValue({ data: { data: mockItem } });

    const result = await getMyFeatureService('1');

    expect(result).toEqual(mockItem);
    expect(api.get).toHaveBeenCalled();
  });
});
```

---

## 📚 Related Documentation

- [ARCHITECTURE.md](../../ARCHITECTURE.md#api--services-layer) - API layer design
- [IMPLEMENTATION_GUIDE.md](../../IMPLEMENTATION_GUIDE.md#step-3-create-service-layer) - Create service tutorial
- [SECURITY_PATTERNS.md](../../SECURITY_PATTERNS.md) - Secure API patterns

| Function | Method | Endpoint | Payload | Returns |
|---|---|---|---|---|
| `sendOtpService(mobile)` | POST | `/auth/send-otp` | `{ mobile }` | `{ status, message }` |
| `verifyOtpService(mobile, otp)` | POST | `/auth/verify-otp` | `{ mobile, otp }` | `{ status, token, user }` |
| `resendOtpService(mobile)` | POST | `/auth/resend-otp` | `{ mobile }` | `{ status, message }` |

All functions use the shared `api` instance (with the auth interceptors applied).

## Adding a New Service

1. Add endpoint constants to `urls.ts`
2. Create a new file `src/services/xyzService.ts`
3. Import `api` and `XYZ_URLS` and export async functions

Example:
```ts
import api from "./api";
import { USER_URLS } from "./urls";

export const getUsersService = async () => {
  const response = await api.get(USER_URLS.LIST);
  return response.data;
};
```
