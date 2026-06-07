# Backend Integration Guide

This frontend ships with a complete, reusable data layer so wiring it to a real
backend is a small, mechanical task. Until a backend is connected, data-driven
pages fall back to in-memory sample data automatically, so the UI always runs.

## 1. Configure the API base URL

Copy `.env.example` to `.env` and set your backend:

```
VITE_BACKEND_BASE=http://localhost:5500
# API base resolves to ${VITE_BACKEND_BASE}/api/v1 unless you override:
# VITE_API_BASE_URL=https://api.example.com/v1
```

All env access goes through `src/lib/env.ts` — nothing reads `import.meta.env`
directly.

## 2. Architecture

```
src/lib/env.ts                 Typed env config (single source of truth)
src/lib/api/client.ts          Shared axios instance + auth + error interceptors
src/lib/api/tokenStore.ts      Token persistence (localStorage) + subscriptions
src/lib/api/ApiError.ts        Normalized error type (status/code/message)
src/lib/api/createResource.ts  Factory: REST CRUD service for any entity
src/lib/queryClient.ts         TanStack Query client + sane defaults
src/hooks/useResource.ts       Factory: React Query CRUD hooks for a service
src/hooks/useResourceData.ts   Page helper: API data with offline sample fallback
src/services/*.ts              One file per entity (type + service + hooks)
src/context/AuthProvider.tsx   Auth state (login/logout/profile)
```

Providers are wired in `src/App.tsx` (`QueryClientProvider` + `AuthProvider`).

## 3. Add a new entity (the whole pattern)

Create `src/services/products.ts`:

```ts
import { createResource } from "@/lib/api/createResource";
import { createResourceHooks } from "@/hooks/useResource";
import type { Entity } from "@/lib/api/types";

export interface Product extends Entity {
  name: string;
  price: number;
}

export const productsService = createResource<Product>("/products");
export const productHooks = createResourceHooks("products", productsService);
```

That's it — you now have `productHooks.useList()`, `.useGet(id)`, `.useCreate()`,
`.useUpdate()`, `.useRemove()` with caching and automatic cache invalidation.

## 4. Use it in a page

Direct (online-only) usage:

```ts
const { data, isLoading } = productHooks.useList();
const create = productHooks.useCreate();
create.mutate({ name: "Widget", price: 9.99 });
```

Demo-friendly usage with sample-data fallback (see `src/pages/sales/Customers.tsx`
and `src/pages/sales/Invoices.tsx` for full reference implementations):

```ts
const { items, create, update, remove, offline } = useResourceData(
  productHooks,
  { seed: sampleProducts },
);
```

`offline` is `true` when no backend is reachable; mutations then update the
in-memory copy so the page stays interactive.

## 5. Backend contract

`createResource("/x")` expects conventional REST routes:

| Method | Route        | Purpose       |
| ------ | ------------ | ------------- |
| GET    | `/x`         | list          |
| GET    | `/x/:id`     | get one       |
| POST   | `/x`         | create        |
| PATCH  | `/x/:id`     | update        |
| DELETE | `/x/:id`     | delete        |

Responses may be returned either at the top level or wrapped as `{ data }` —
the client unwraps a single `data` envelope automatically.

Auth endpoints used by `AuthProvider`:

| Method | Route               | Returns          |
| ------ | ------------------- | ---------------- |
| POST   | `/auth/login`       | `{ token, user? }` |
| GET    | `/auth/my-profile`  | the current user |

## 6. Enable auth-protected routes (optional)

Auth is opt-in so the app runs unguarded during development. To protect the app
shell, wrap it with `PrivateRoute` in `src/router/router.tsx`:

```tsx
import PrivateRoute from "@/privateRoutes/PrivateRoute";

{
  path: "/",
  element: (
    <PrivateRoute>
      <MainLayout />
    </PrivateRoute>
  ),
  children: [ /* ... */ ],
}
```

Unauthenticated users are redirected to `/auth/login`. Wire the login form to
`useAuth().login(email, password)`.
