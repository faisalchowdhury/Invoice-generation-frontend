/**
 * File: src/routes/router.tsx
 * Main router configuration using createBrowserRouter
 */
import { createBrowserRouter } from "react-router";
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
import { Projects } from "@/pages/project/Projects";
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
import { ProjectDashboard } from "@/pages/dashboard/ProjectDashboard";
import { HRMDashboard } from "@/pages/dashboard/HRMDashboard";
import { AccountDashboard } from "@/pages/dashboard/AccountDashboard";
import { RecruitmentDashboard } from "@/pages/dashboard/RecruitmentDashboard";
import { POSDashboard } from "@/pages/dashboard/POSDashboard";
import { CRMDashboard } from "@/pages/dashboard/CRMDashboard";
import { SupportDashboard } from "@/pages/dashboard/SupportDashboard";
import { UserRoles } from "@/pages/userManagement/UserRoles";
import { UsersManagement } from "@/pages/userManagement/UsersManagement";
import { SalesProposals } from "@/pages/Proposal";
import { SalesInvoice } from "@/pages/sales/SalesInvoice";
import { SalesInvoiceReturns } from "@/pages/sales/SalesInvoiceReturns";
import { PurchaseInvoices } from "@/pages/purchase/PurchaseInvoice";
import { PurchaseReturns } from "@/pages/purchase/PurchaseReturns";
import { Warehouses } from "@/pages/purchase/Warehouses";
import { SystemSetup } from "@/pages/items/SystemSetup";
import { Quotations } from "@/pages/Quotation";
import { ProjectsNew } from "@/pages/project/ProjectsNew";
import {
  AccountsCustomers,
  CustomerDetails,
  EditCustomer,
} from "@/pages/accounting/customer/Customer";
import { AccountsVendors } from "@/pages/accounting/vendor/Vendor";
import { BankAccounts } from "@/pages/accounting/bank/BankAccounts";
import { BankTransactions } from "@/pages/accounting/bank/BankTransaction";
import { BankTransfers } from "@/pages/accounting/bank/BankTransfers";
import { ChartOfAccounts } from "@/pages/accounting/ChartOfAccounts";
import { VendorPayments } from "@/pages/accounting/VendorPayments";
import { CustomerPayments } from "@/pages/accounting/CustomerPayments";
import { Revenues } from "@/pages/accounting/Revenue";
import { Expense } from "@/pages/accounting/Expense";
import { AccountsDebitNotes } from "@/pages/accounting/DebitNotes";
import { AccountsCreditNotes } from "@/pages/accounting/AccountsCreditNotes";
import { AccountsReports } from "@/pages/accounting/AccountsReports";
import { AccountingSystem } from "@/pages/accounting/AccountsSystem";
import { Goals } from "@/pages/goal/Goals";
import { Milestones } from "@/pages/goal/Milestones";
import { Contributions } from "@/pages/goal/Contributions";
import { Tracking } from "@/pages/goal/Tracking";
import { Category } from "@/pages/goal/Category";
import { BudgetPeriods } from "@/pages/budgetPlanner/BudgetPeriods";
import { Budget } from "@/pages/budgetPlanner/Budget";
import { BudgetAllocations } from "@/pages/budgetPlanner/BudgetAllocation";
import { BudgetMonitoring } from "@/pages/budgetPlanner/BudgetMonitoring";
import { LedgerSummary } from "@/pages/doubleEntry/LedgerSummary";
import { TrialBalance } from "@/pages/doubleEntry/TrialBalance";
import { BalanceSheet } from "@/pages/doubleEntry/BalanceSheet";
import { ProfitLoss } from "@/pages/doubleEntry/ProfitLoss";
import { DoubleEntryReports } from "@/pages/doubleEntry/DoubleEntryReports";
import { Employees } from "@/pages/hrm/Employees";
import { SetSalary } from "@/pages/hrm/payslip/SetSalary";
import { Payroll } from "@/pages/hrm/payslip/Payroll";
import { Shifts } from "@/pages/hrm/attendance/Shifts";
import { Attendances } from "@/pages/hrm/attendance/Attendances";
import { LeaveTypes } from "@/pages/hrm/leaveManagement/LeaveTypes";
import { LeaveApplications } from "@/pages/hrm/leaveManagement/LeaveApplications";
import { LeaveBalance } from "@/pages/hrm/leaveManagement/LeaveBalance";
import { Holidays } from "@/pages/hrm/Holidays";
import { Awards } from "@/pages/hrm/Awards";
import { Promotions } from "@/pages/hrm/Promotions";
import { Resignations } from "@/pages/hrm/Resignations";
import { Terminations } from "@/pages/hrm/Terminations";
import { Warnings } from "@/pages/hrm/Warnings";
import { Transfers } from "@/pages/purchase/Transfers";
import { Complaints } from "@/pages/hrm/Complaints";
import { Documents } from "@/pages/hrm/Documents";
import { Acknowledgments } from "@/pages/hrm/Acknowledgments";
import { Announcements } from "@/pages/hrm/Announcements";
import { Events } from "@/pages/hrm/Events";
import { HRMSystemSetup } from "@/pages/hrm/HRMSystemSetup";
import { PerformanceIndicators } from "@/pages/performance/PerformanceIndicators";
import { EmployeeGoals } from "@/pages/performance/EmployeeGoals";
import { ReviewCycles } from "@/pages/performance/ReviewCycles";
import { EmployeeReviews } from "@/pages/performance/EmployeeReviews";
import PerformanceSystemSetup from "@/pages/performance/PerformanceSystemSetup";
import TrainingTypes from "@/pages/training/TrainingTypes";
import Trainers from "@/pages/training/Trainers";
import TrainingList from "@/pages/training/TrainingList";
import JobLocations from "@/pages/recruitment/JobLocations";
import CustomQuestions from "@/pages/recruitment/CustomQuestions";
import JobPostings from "@/pages/recruitment/JobPosting";
import Candidates from "@/pages/recruitment/Candidates";
import InterviewRounds from "@/pages/recruitment/InterviewRounds";
import Interviews from "@/pages/recruitment/Interview";
import { InterviewFeedback } from "@/pages/recruitment/InterviewFeedback";
import CandidateAssessments from "@/pages/recruitment/CandidateAssessments";
import Offers from "@/pages/recruitment/Offers";
import ChecklistItems from "@/pages/recruitment/ChecklistItems";
import { CandidateOnboarding } from "@/pages/recruitment/CandidateOnboarding";
import RecruitmentSystemSetup from "@/pages/recruitment/RecruitmentSystemSetup";
import Leads from "@/pages/crm/Leads";
import Deals from "@/pages/crm/Deals";
import DealDetail from "@/pages/crm/DealDetails";
import CrmSystemSetup from "@/pages/crm/CmsSystemSetup";
import LeadReports from "@/pages/crm/reports/LeadReports";
import DealReports from "@/pages/crm/reports/DealReports";
import FormBuilder from "@/pages/formBulder/FormBuilder";
import Tickets from "@/pages/supportTicket/Tickets";
import KnowledgeBase from "@/pages/supportTicket/KnowledgeBase";
import FAQ from "@/pages/supportTicket/FAQ";
import Contact from "@/pages/supportTicket/Contacts";
import STsystemSetup from "@/pages/supportTicket/STsystemSetup";
import Contracts from "@/pages/contract/Contracts";
import ContractTypes from "@/pages/contract/ContractTypes";
import ZoomMeetings from "@/pages/zoomMeetings/ZoomMeetings";
import Timesheet from "@/pages/Timesheet/TimeSheet";
import MediaLibrary from "@/pages/mediaLibrary/MediaLibrary";
import Messenger from "@/pages/messenger/Messenger";
import EmailTemplates from "@/pages/EmailTemplates/EmailTemplates";
import NotificationTemplates from "@/pages/notificationTemplates/NotificationTemplates";

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
      {
        path: "project-dashboard",
        element: <ProjectDashboard />,
      },
      {
        path: "account-dashboard",
        element: <AccountDashboard />,
      },
      {
        path: "hrm-dashboard",
        element: <HRMDashboard />,
      },
      {
        path: "recruitment-dashboard",
        element: <RecruitmentDashboard />,
      },
      {
        path: "pos-dashboard",
        element: <POSDashboard />,
      },
      {
        path: "crm-dashboard",
        element: <CRMDashboard />,
      },
      {
        path: "support-dashboard",
        element: <SupportDashboard />,
      },
      {
        path: "user-management",
        children: [
          { path: "user-roles", element: <UserRoles /> },
          { path: "users", element: <UsersManagement /> },
        ],
      },
      {
        path: "proposal",
        element: <SalesProposals />,
      },
      // Sales Routes
      {
        path: "sales",
        children: [
          { path: "customers", element: <Customers /> },
          { path: "invoices", element: <Invoices /> },
          { path: "sales-invoice", element: <SalesInvoice /> },
          { path: "sales-invoice-returns", element: <SalesInvoiceReturns /> },
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

      //purchase routes
      // purchase routes
      {
        path: "purchase",
        children: [
          {
            path: "purchase-invoice",
            element: <PurchaseInvoices />,
          },
          {
            path: "purchase-returns",
            element: <PurchaseReturns />,
          },
          {
            path: "warehouses",
            element: <Warehouses />,
          },
          {
            path: "transfers",
            element: <Warehouses />,
          },
          {
            path: "vendors",
            element: <Vendors />,
          },
          {
            path: "purchase-orders",
            element: <PurchaseOrder />,
          },
          {
            path: "bills",
            element: <Bills />,
          },
          {
            path: "expense",
            element: <Expenses />,
          },
          {
            path: "payment-made",
            element: <PaymentMade />,
          },
          {
            path: "debit-notes",
            element: <DebitNotes />,
          },
        ],
      },
      // Time Logs Route
      {
        path: "time-logs",
        element: <TimeLogs />,
      },
      // Projects
      {
        path: "project",
        children: [
          {
            path: "projects",
            element: <Projects />,
          },
          {
            path: "project-new",
            element: <ProjectsNew />,
          },
        ],
      },

      // Accounting
      {
        path: "accounting",
        children: [
          {
            path: "customer",
            element: <AccountsCustomers />,
          },
          {
            path: "customers/:id",
            element: <CustomerDetails />,
          },
          {
            path: "customers/edit/:id",
            element: <EditCustomer />,
          },

          {
            path: "vendor",
            element: <AccountsVendors />,
          },
          {
            path: "bank-accounts",
            element: <BankAccounts />,
          },
          {
            path: "bank-transaction",
            element: <BankTransactions />,
          },
          {
            path: "bank-transfers",
            element: <BankTransfers />,
          },
          {
            path: "chart-of-accounts",
            element: <ChartOfAccounts />,
          },
          {
            path: "vendor-payments",
            element: <VendorPayments />,
          },
          {
            path: "customer-payments",
            element: <CustomerPayments />,
          },
          {
            path: "revenue",
            element: <Revenues />,
          },
          {
            path: "expense",
            element: <Expense />,
          },
          {
            path: "debit-notes",
            element: <AccountsDebitNotes />,
          },
          {
            path: "credit-notes",
            element: <AccountsCreditNotes />,
          },
          {
            path: "reports",
            element: <AccountsReports />,
          },
          {
            path: "System",
            element: <AccountingSystem />,
          },
        ],
      },
      // Goal
      {
        path: "goal",
        children: [
          {
            path: "goals",
            element: <Goals />,
          },
          {
            path: "milestones",
            element: <Milestones />,
          },
          {
            path: "contributions",
            element: <Contributions />,
          },
          {
            path: "tracking",
            element: <Tracking />,
          },
          {
            path: "category",
            element: <Category />,
          },
        ],
      },
      //  Budget Planner
      {
        path: "budget-planner",
        children: [
          {
            path: "budget-periods",
            element: <BudgetPeriods />,
          },
          {
            path: "budget",
            element: <Budget />,
          },
          {
            path: "budget-allocations",
            element: <BudgetAllocations />,
          },
          {
            path: "budget-monitoring",
            element: <BudgetMonitoring />,
          },
        ],
      },
      // Double entry
      {
        path: "double-entry",
        children: [
          {
            path: "ledger-summary",
            element: <LedgerSummary />,
          },
          {
            path: "trial-balance",
            element: <TrialBalance />,
          },
          {
            path: "balance-sheet",
            element: <BalanceSheet />,
          },
          {
            path: "profit-loss",
            element: <ProfitLoss />,
          },
          {
            path: "reports",
            element: <DoubleEntryReports />,
          },
        ],
      },

      // HRM
      {
        path: "hrm",
        children: [
          {
            path: "employees",
            element: <Employees />,
          },
          // payslip
          {
            path: "payslip/set-salary",
            element: <SetSalary />,
          },
          {
            path: "payslip/payroll",
            element: <Payroll />,
          },

          // attendance
          { path: "attendance/shifts", element: <Shifts /> },
          { path: "attendance/attendances", element: <Attendances /> },

          // leave management
          { path: "leave-management/leave-types", element: <LeaveTypes /> },
          {
            path: "leave-management/leave-applications",
            element: <LeaveApplications />,
          },
          {
            path: "leave-management/leave-balance",
            element: <LeaveBalance />,
          },
          ///////////////////////
          {
            path: "holidays",
            element: <Holidays />,
          },
          {
            path: "awards",
            element: <Awards />,
          },
          {
            path: "promotions",
            element: <Promotions />,
          },
          {
            path: "resignations",
            element: <Resignations />,
          },
          {
            path: "terminations",
            element: <Terminations />,
          },
          {
            path: "warnings",
            element: <Warnings />,
          },
          {
            path: "complaints",
            element: <Complaints />,
          },
          {
            path: "transfers",
            element: <Transfers />,
          },
          {
            path: "documents",
            element: <Documents />,
          },
          {
            path: "acknowledgements",
            element: <Acknowledgments />,
          },
          {
            path: "announcements",
            element: <Announcements />,
          },
          {
            path: "events",
            element: <Events />,
          },
          {
            path: "system-setup",
            element: <HRMSystemSetup />,
          },
        ],
      },
      // Performance
      {
        path: "performance",
        children: [
          {
            path: "performance-indicators",
            element: <PerformanceIndicators />,
          },
          {
            path: "employee-goals",
            element: <EmployeeGoals />,
          },
          {
            path: "employee-reviews",
            element: <EmployeeReviews />,
          },
          {
            path: "review-cycles",
            element: <ReviewCycles />,
          },
          {
            path: "system-setup",
            element: <PerformanceSystemSetup />,
          },
        ],
      },
      // Training
      {
        path: "training",
        children: [
          {
            path: "training-types",
            element: <TrainingTypes />,
          },
          {
            path: "trainers",
            element: <Trainers />,
          },
          {
            path: "training-list",
            element: <TrainingList />,
          },
        ],
      },
      // recruitment
      {
        path: "recruitment",
        children: [
          {
            path: "job-locations",
            element: <JobLocations />,
          },
          {
            path: "custom-questions",
            element: <CustomQuestions />,
          },
          {
            path: "job-postings",
            element: <JobPostings />,
          },
          {
            path: "candidates",
            element: <Candidates />,
          },
          {
            path: "interview-rounds",
            element: <InterviewRounds />,
          },
          {
            path: "interview",
            element: <Interviews />,
          },
          {
            path: "interview-feedback",
            element: <InterviewFeedback />,
          },
          {
            path: "candidate-assessments",
            element: <CandidateAssessments />,
          },
          {
            path: "offers",
            element: <Offers />,
          },
          {
            path: "checklist-items",
            element: <ChecklistItems />,
          },
          {
            path: "candidate-onboarding",
            element: <CandidateOnboarding />,
          },
          {
            path: "system-setup",
            element: <RecruitmentSystemSetup />,
          },
        ],
      },
      // crm
      {
        path: "crm",
        children: [
          {
            path: "leads",
            element: <Leads />,
          },
          {
            path: "deals",
            element: <Deals />,
          },
          {
            path: "deals/:id",
            element: <DealDetail />,
          },
          {
            path: "system-setup",
            element: <CrmSystemSetup />,
          },

          // Reports
          {
            path: "lead-reports",
            element: <LeadReports />,
          },
          {
            path: "deal-reports",
            element: <DealReports />,
          },
        ],
      },
      // Form Bulder
      {
        path: "form-builder",
        element: <FormBuilder />,
      },
      // Support Ticket
      {
        path: "support-ticket",
        children: [
          {
            path: "tickets",
            element: <Tickets />,
          },
          {
            path: "knowledge-base",
            element: <KnowledgeBase />,
          },
          {
            path: "faq",
            element: <FAQ />,
          },
          {
            path: "contact",
            element: <Contact />,
          },
          {
            path: "system-setup",
            element: <STsystemSetup />,
          },
        ],
      },
      // Contract
      {
        path: "contract",
        children: [
          {
            path: "contracts",
            element: <Contracts />,
          },
          {
            path: "contract-types",
            element: <ContractTypes />,
          },
        ],
      },
      // Zoom Meetings
      {
        path: "zoom-meetings",
        element: <ZoomMeetings />,
      },
      // Timesheet
      {
        path: "timesheet",
        element: <Timesheet />,
      },
      // Media Library

      {
        path: "media-library",
        element: <MediaLibrary />,
      },
      // Messenger

      {
        path: "messenger",
        element: <Messenger />,
      },
      // Email Templates

      {
        path: "email-templates",
        element: <EmailTemplates />,
      },
      // Notification Templates

      {
        path: "notification-templates",
        element: <NotificationTemplates />,
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

      // Items
      {
        path: "items",
        children: [
          {
            path: "product",
            element: <Product />,
          },
          {
            path: "services",
            element: <Services />,
          },
          {
            path: "system-setup",
            element: <SystemSetup />,
          },
        ],
      },

      {
        path: "quotation",
        element: <Quotations />,
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
