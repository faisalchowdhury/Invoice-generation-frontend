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
import { MainLayout } from "@/components/layout/MainLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Customers } from "@/pages/sales/Customers";
import { Invoices } from "@/pages/sales/Invoices";
import { SalesReceipts } from "@/pages/sales/SalesReceipts";
import { ProformaInvoices } from "@/pages/sales/Proformainvoices";
import { Estimates } from "@/pages/sales/Estimates";
import { DeliveryChallan } from "@/pages/sales/Deliverychallan ";
import { CreditNotes } from "@/pages/sales/CreditNotes";
import { PaymentReceived } from "@/pages/sales/PaymentReceived";
import { QuickScan } from "@/pages/documents/QuickScan";
import { MyDocument } from "@/pages/documents/MyDocument";
import { TimeLogs } from "@/pages/TimeLogs";
import { Projects } from "@/pages/Projects";
import { Reports } from "@/pages/Reports";
import { Team } from "@/pages/Team";
import { Banking } from "@/pages/Banking";

import { GetHelp } from "@/pages/GetHelp";
import { SettingsDropdown } from "@/pages/SettingsDropdown";
import { Companies } from "@/pages/Companies";
import { Vendors } from "@/pages/purchase/Vendors";
import { PurchaseOrder } from "@/pages/purchase/PurchaseOrders";
import { Bills } from "@/pages/purchase/Bills";
import { Expenses } from "@/pages/purchase/Expense";
import { PaymentMade } from "@/pages/purchase/PaymentMade";
import { DebitNotes } from "@/pages/purchase/DebitNotes";
import { Product } from "@/pages/items/Product";
import { Services } from "@/pages/items/Services";

// Import your main app layout (update path as needed)
// import { MainLayout } from "../components/layout/MainLayout";
// import { Dashboard } from "../pages/Dashboard";

export const route = createBrowserRouter([
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
  // ============================================
  // APP ROUTES (With MainLayout - Header + Sidebar + Outlet)
  // ============================================
  {
    path: "/",
    element: <MainLayout />, // 👈 This wraps all child routes
    children: [
      // Dashboard
      {
        index: true, // Default route for "/"
        element: <Dashboard />,
      },

      // Sales Routes
      {
        path: "sales",
        children: [
          { path: "customers", element: <Customers /> },
          { path: "invoices", element: <Invoices /> },
          { path: "sales-receipts", element: <SalesReceipts /> },
          { path: "estimates", element: <Estimates /> },
          { path: "proforma-invoices", element: <ProformaInvoices /> },
          { path: "delivery-challan", element: <DeliveryChallan /> },
          { path: "credit-notes", element: <CreditNotes /> },
          { path: "payment-received", element: <PaymentReceived /> },
        ],
      },

      // Documents Routes

      {
        path: "documents",
        children: [
          { path: "quick-scan", element: <QuickScan /> },
          { path: "my-documents", element: <MyDocument /> },
        ],
      },
      {
        path: "purchase/vendors",
        element: <Vendors />,
      },
      {
        path: "purchase/purchase-orders",
        element: <PurchaseOrder />,
      },
      {
        path: "purchase/bills",
        element: <Bills />,
      },
      {
        path: "purchase/expense",
        element: <Expenses />,
      },
      {
        path: "purchase/payment-made",
        element: <PaymentMade />,
      },
      {
        path: "purchase/debit-notes",
        element: <DebitNotes />,
      },

      // Time Logs Route
      {
        path: "time-logs",
        element: <TimeLogs />,
      },
      // Projects
      {
        path: "projects",
        element: <Projects />,
      },
      // Reports
      {
        path: "reports",
        element: <Reports />,
      },
      // Team
      {
        path: "team",
        element: <Team />,
      },
      // Banking
      {
        path: "banking",
        element: <Banking />,
      },
      // companies
      {
        path: "companies",
        element: <Companies />,
      },
      {
        path: "items/product",
        element: <Product />,
      },
      {
        path: "items/services",
        element: <Services />,
      },
      // Get help
      {
        path: "get-help",
        element: <GetHelp />,
      },
      // Settongs
      {
        path: "settings",
        element: <SettingsDropdown />,
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
