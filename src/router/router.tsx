/**
 * File: src/routes/router.tsx
 * Main router configuration using createBrowserRouter
 */

import { createBrowserRouter, Navigate } from "react-router";
import { Login } from "../pages/auth/Login";
import { Signup } from "../pages/auth/Signup";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { VerifyEmail } from "../pages/auth/VerifyEmail";

import { SetNewPassword } from "../pages/auth/SetNewPassword";
import { VerifyOTP } from "@/pages/auth/VerifyOtp";
import Home from "@/pages/Home";

// Import your main app layout (update path as needed)
// import { MainLayout } from "../components/layout/MainLayout";
// import { Dashboard } from "../pages/Dashboard";

export const route = createBrowserRouter([
  // Redirect root to login
  {
    path: "/",
    element: <Home />,
  },

  // Authentication Routes
  {
    path: "/auth",
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "verify-otp",
        element: <VerifyOTP />,
      },
      {
        path: "set-password",
        element: <SetNewPassword />,
      },
    ],
  },

  // Protected Routes (uncomment when ready)
  // {
  //   path: "/",
  //   element: <MainLayout />,
  //   children: [
  //     {
  //       path: "dashboard",
  //       element: <Dashboard />,
  //     },
  //     {
  //       path: "sales",
  //       children: [
  //         {
  //           path: "customers",
  //           element: <Customers />,
  //         },
  //         {
  //           path: "invoices",
  //           element: <Invoices />,
  //         },
  //         // ... more sales routes
  //       ],
  //     },
  //     // ... more routes
  //   ],
  // },

  // Redirect root to login (or dashboard if authenticated)
  // {
  //   path: "/",
  //   loader: () => {
  //     // Check if user is authenticated
  //     const isAuthenticated = false; // Replace with your auth check
  //     if (isAuthenticated) {
  //       return { redirect: "/dashboard" };
  //     }
  //     return { redirect: "/auth/login" };
  //   },
  // },
]);
