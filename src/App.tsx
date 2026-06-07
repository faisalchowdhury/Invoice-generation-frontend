/**
 * File: src/App.tsx
 * App root: wires global providers (React Query + Auth) around the router.
 */

import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./App.css";
import { route } from "./router/router";
import { queryClient } from "./lib/queryClient";
import AuthProvider from "./context/AuthProvider";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={route} />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
