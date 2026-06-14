# Feature Implementation Guide

A step-by-step guide to implement new features in the admin dashboard following project conventions.

## Overview: Feature Implementation Checklist

```
1️⃣ Setup & Planning → Define feature scope, requirements, API contracts
2️⃣ Backend API → Create/modify API endpoints
3️⃣ Types → Define TypeScript interfaces
4️⃣ Services → Create service layer for API calls
5️⃣ Pages → Create main page component
6️⃣ Components → Create reusable UI components
7️⃣ State & Context → Add context/hooks if global state needed
8️⃣ Routing → Add route to App.tsx
9️⃣ Testing → Test feature end-to-end
🔟 Documentation → Update documentation
```

## Step-by-Step: Adding a New Feature

### Example Feature: "ProductsManagement"

Let's implement a feature to manage products with CRUD operations.

---

### Step 1: Plan the Feature

**Feature:** Product Management  
**Pages:** List, Create, Edit, View  
**API Endpoints:**
- `GET /products` - List all products
- `GET /products/:id` - Get single product
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

**Components Needed:**
- ProductList (main page)
- ProductCard (reusable card)
- ProductForm (create/edit form)
- ProductModal (view details)

---

### Step 2: Define Types

Create `src/types/product.ts`:

```typescript
/**
 * Product Types
 * 
 * Defines all TypeScript interfaces for product-related data
 * and API responses.
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: File;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}

export interface ProductListResponse {
  success: boolean;
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProductDetailResponse {
  success: boolean;
  data: Product;
}
```

---

### Step 3: Create Service Layer

Create `src/services/productService.ts`:

```typescript
/**
 * Product Service
 * 
 * All API calls related to product management.
 * Uses axios instance with built-in interceptors for authentication.
 */

import api from "./api";
import { PRODUCT_URLS } from "./urls";
import type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
  ProductListResponse,
  ProductDetailResponse,
} from "../types/product";

/**
 * Fetch all products
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @returns List of products
 */
export const getProductsService = async (
  page: number = 1,
  limit: number = 10
): Promise<ProductListResponse> => {
  const response = await api.get<ProductListResponse>(
    PRODUCT_URLS.LIST,
    {
      params: { page, limit },
    }
  );
  return response.data;
};

/**
 * Fetch single product by ID
 * @param id - Product ID
 * @returns Product details
 */
export const getProductService = async (
  id: string
): Promise<Product> => {
  const response = await api.get<ProductDetailResponse>(
    `${PRODUCT_URLS.DETAIL}/${id}`
  );
  return response.data.data;
};

/**
 * Create new product
 * @param payload - Product data
 * @returns Created product
 */
export const createProductService = async (
  payload: CreateProductPayload
): Promise<Product> => {
  const formData = new FormData();
  Object.keys(payload).forEach((key) => {
    if (payload[key as keyof CreateProductPayload] !== undefined) {
      formData.append(
        key,
        payload[key as keyof CreateProductPayload]
      );
    }
  });

  const response = await api.post<ProductDetailResponse>(
    PRODUCT_URLS.CREATE,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.data;
};

/**
 * Update existing product
 * @param id - Product ID
 * @param payload - Product data to update
 * @returns Updated product
 */
export const updateProductService = async (
  id: string,
  payload: UpdateProductPayload
): Promise<Product> => {
  const response = await api.put<ProductDetailResponse>(
    `${PRODUCT_URLS.UPDATE}/${id}`,
    payload
  );
  return response.data.data;
};

/**
 * Delete product
 * @param id - Product ID
 * @returns Success response
 */
export const deleteProductService = async (
  id: string
): Promise<{ success: boolean }> => {
  const response = await api.delete(
    `${PRODUCT_URLS.DELETE}/${id}`
  );
  return response.data;
};
```

Update `src/services/urls.ts`:

```typescript
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const PRODUCT_URLS = {
  LIST: `${BASE_URL}/products`,
  DETAIL: `${BASE_URL}/products`,
  CREATE: `${BASE_URL}/products`,
  UPDATE: `${BASE_URL}/products`,
  DELETE: `${BASE_URL}/products`,
};

// ... other URLs
```

---

### Step 4: Create Reusable Components

Create `src/components/products/ProductCard.tsx`:

```typescript
/**
 * ProductCard Component
 * 
 * Reusable card component to display product information.
 * Used in product list and grid views.
 */

import React from "react";
import type { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Product Image */}
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="mb-4 h-48 w-full rounded-md object-cover"
        />
      )}

      {/* Product Info */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {product.name}
      </h3>

      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {product.description}
      </p>

      {/* Price & Stock */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Price</p>
          <p className="text-2xl font-bold text-green-600">
            ${product.price.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Stock</p>
          <p className="text-2xl font-bold text-blue-600">
            {product.stock}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-2">
        <button
          onClick={() => onView?.(product)}
          className="flex-1 rounded bg-blue-500 py-2 text-white hover:bg-blue-600"
        >
          View
        </button>
        <button
          onClick={() => onEdit?.(product)}
          className="flex-1 rounded bg-yellow-500 py-2 text-white hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete?.(product.id)}
          className="flex-1 rounded bg-red-500 py-2 text-white hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
```

Create `src/components/products/ProductForm.tsx`:

```typescript
/**
 * ProductForm Component
 * 
 * Form for creating and editing products.
 * Uses React Hook Form for state management.
 * Supports file upload for product images.
 */

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Product, CreateProductPayload } from "../../types/product";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductPayload) => Promise<void>;
  isLoading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProductPayload>({
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category,
        }
      : undefined,
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
      });
    }
  }, [product, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Product Name
        </label>
        <input
          type="text"
          {...register("name", { required: "Name is required" })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          rows={4}
          {...register("description", {
            required: "Description is required",
          })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Price & Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Price
          </label>
          <input
            type="number"
            step="0.01"
            {...register("price", { required: "Price is required" })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Stock
          </label>
          <input
            type="number"
            {...register("stock", { required: "Stock is required" })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-500">{errors.stock.message}</p>
          )}
        </div>
      </div>

      {/* Category Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category
        </label>
        <select
          {...register("category", { required: "Category is required" })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
        >
          <option value="">Select category</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="furniture">Furniture</option>
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Save Product"}
      </button>
    </form>
  );
};

export default ProductForm;
```

---

### Step 5: Create Main Page Component

Create `src/pages/Products/ProductPage.tsx`:

```typescript
/**
 * ProductPage Component
 * 
 * Main page for product management.
 * Handles listing, searching, and CRUD operations.
 * Integrates with ProductCard and ProductForm components.
 */

import React, { useEffect, useState } from "react";
import { PageMeta } from "../../components/common/PageMeta";
import { showAlert } from "../../services/alertService";
import {
  getProductsService,
  createProductService,
  updateProductService,
  deleteProductService,
} from "../../services/productService";
import type { Product, CreateProductPayload } from "../../types/product";
import ProductCard from "../../components/products/ProductCard";
import ProductForm from "../../components/products/ProductForm";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProductsService();
      setProducts(response.data);
      showAlert("success", "Products loaded successfully");
    } catch (error) {
      console.error("Failed to fetch products:", error);
      showAlert("error", "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (data: CreateProductPayload) => {
    try {
      const newProduct = await createProductService(data);
      setProducts([...products, newProduct]);
      setShowForm(false);
      showAlert("success", "Product created successfully");
    } catch (error) {
      console.error("Failed to create product:", error);
      showAlert("error", "Failed to create product");
    }
  };

  const handleEditProduct = async (data: CreateProductPayload) => {
    if (!selectedProduct) return;

    try {
      const updated = await updateProductService(selectedProduct.id, data);
      setProducts(
        products.map((p) => (p.id === updated.id ? updated : p))
      );
      setShowForm(false);
      setSelectedProduct(null);
      showAlert("success", "Product updated successfully");
    } catch (error) {
      console.error("Failed to update product:", error);
      showAlert("error", "Failed to update product");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteProductService(productId);
      setProducts(products.filter((p) => p.id !== productId));
      showAlert("success", "Product deleted successfully");
    } catch (error) {
      console.error("Failed to delete product:", error);
      showAlert("error", "Failed to delete product");
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  return (
    <PageMeta title="Products">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Products Management
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            + Add Product
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedProduct ? "Edit Product" : "Create Product"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-400"
              >
                ✕
              </button>
            </div>
            <ProductForm
              product={selectedProduct || undefined}
              onSubmit={
                selectedProduct
                  ? handleEditProduct
                  : handleCreateProduct
              }
            />
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-gray-500">No products found</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Create the first product
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}
      </div>
    </PageMeta>
  );
}
```

---

### Step 6: Add Route

Update `src/App.tsx`:

```typescript
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import UserProfiles from "./pages/UserProfiles";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import User from "./pages/User/User";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import Nanny from "./pages/Nanny/Nanny";
import ProductPage from "./pages/Products/ProductPage"; // Add import

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<SignIn />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/users" element={<User />} />
            <Route path="/nannies" element={<Nanny />} />
            <Route path="/products" element={<ProductPage />} /> {/* Add route */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/blank" element={<Blank />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
```

---

### Step 7: Update Sidebar Navigation

Add menu item to `src/layout/AppSidebar.tsx`:

```typescript
// Find the sidebar menu array and add:
{
  label: "Products",
  icon: <ShoppingBagIcon />,
  path: "/products",
  active: activeItem === "products",
}
```

---

### Step 8: Test End-to-End

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Login** with valid credentials

3. **Navigate** to Products page from sidebar

4. **Create** a new product:
   - Click "+ Add Product"
   - Fill form
   - Submit
   - Verify product appears in list

5. **Edit** product:
   - Click "Edit" on card
   - Modify data
   - Submit
   - Verify changes

6. **Delete** product:
   - Click "Delete" on card
   - Confirm deletion
   - Verify product removed from list

7. **Test error cases:**
   - Network offline - should show error
   - Missing required fields - should show validation error
   - API error (500) - should show readable message

---

## Best Practices Checklist

- ✅ Create types/interfaces for all data
- ✅ Use service layer for API calls
- ✅ Handle loading/error states
- ✅ Show user-friendly messages (alerts)
- ✅ Use TypeScript for type safety
- ✅ Follow component naming conventions
- ✅ Add JSDoc comments for complex logic
- ✅ Use Tailwind CSS classes (no inline styles)
- ✅ Handle edge cases (empty states, errors)
- ✅ Test feature before committing
- ✅ Update documentation

---

## Common Patterns

### Pagination

```typescript
const [page, setPage] = useState(1);

const handleNextPage = () => setPage(p => p + 1);
const handlePrevPage = () => setPage(p => Math.max(1, p - 1));

useEffect(() => {
  fetchProducts(page);
}, [page]);
```

### Search/Filter

```typescript
const [search, setSearch] = useState("");
const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

useEffect(() => {
  if (search.trim() === "") {
    setFilteredProducts(products);
  } else {
    setFilteredProducts(
      products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }
}, [search, products]);
```

### Modal/Dialog

```typescript
const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <button onClick={() => setIsOpen(true)}>Open Modal</button>
    {isOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6">
          {/* Content */}
          <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
      </div>
    )}
  </>
);
```

---

See [ARCHITECTURE.md](./ARCHITECTURE.md) for more architecture details.
