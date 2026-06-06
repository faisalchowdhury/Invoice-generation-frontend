/**
 * File: src/components/layout/Sidebar.tsx
 * Updated with all menu items from screenshot
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  FileSpreadsheet,
  ClipboardList,
  Truck,
  CreditCard,
  DollarSign,
  ShoppingCart,
  Package,
  Clock,
  FolderOpen,
  BarChart3,
  UserCog,
  Building2,
  Landmark,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Menu,
  X,
  Box,
  Wrench,
  Scan,
  FileCheck,
  ListTodo,
  User,
  Proportions,
  Handshake,
  BanknoteArrowUp,
  Network,
  FileQuestionMark,
  RefreshCcwDot,
  CornerDownLeft,
  FileStack,
  Calculator,
  Goal,
  CircleDollarSign,
  Copy,
  ChartColumnDecreasing,
  ContactRound,
  TrendingUp,
  BookText,
  Presentation,
  Images,
  MessageCircleMore,
  Mail,
  BellRing,
} from "lucide-react";
import Logo from "../../assets/logo.png";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
    children: [
      { label: "Project Dashboard", icon: ListTodo, path: "project-dashboard" },
      { label: "Account Dashboard", icon: User, path: "/account-dashboard" },
      { label: "HRM Dashboard", icon: Proportions, path: "hrm-dashboard" },
      {
        label: "Recruitment Dashboard",
        icon: Handshake,
        path: "recruitment-dashboard",
      },
      { label: "POS Dashboard", icon: BanknoteArrowUp, path: "pos-dashboard" },
      { label: "CRM Dashboard", icon: Network, path: "crm-dashboard" },
      {
        label: "Support Dashboard",
        icon: FileQuestionMark,
        path: "support-dashboard",
      },
    ],
  },
  {
    label: "User Management",
    icon: Users,
    children: [
      { label: "Roles", icon: UserCog, path: "user-management/user-roles" },
      { label: "User", icon: Network, path: "user-management/users" },
    ],
  },
  {
    label: "proposal",
    icon: RefreshCcwDot,
    path: "/proposal",
  },
  {
    label: "Sales",
    icon: DollarSign,
    children: [
      { label: "Customers", icon: Users, path: "/sales/customers" },
      { label: "Invoices", icon: FileText, path: "/sales/invoices" },
      {
        label: "Sales Invoice",
        icon: DollarSign,
        path: "/sales/sales-invoice",
      },
      {
        label: "Sales Invoice Returns",
        icon: CornerDownLeft,
        path: "/sales/sales-invoice-returns",
      },
      { label: "Sales Receipts", icon: Receipt, path: "/sales/sales-receipts" },
      { label: "Estimates", icon: FileSpreadsheet, path: "/sales/estimates" },
      {
        label: "Proforma Invoices",
        icon: ClipboardList,
        path: "/sales/proforma-invoices",
      },
      {
        label: "Delivery Challan",
        icon: Truck,
        path: "/sales/delivery-challan",
      },
      { label: "Credit Notes", icon: CreditCard, path: "/sales/credit-notes" },
      {
        label: "Payment Received",
        icon: DollarSign,
        path: "/sales/payment-received",
      },
    ],
  },

  {
    label: "Purchase",
    icon: ShoppingCart,
    children: [
      {
        label: "Purchase Invoice",
        icon: FileText,
        path: "/purchase/purchase-invoice",
      },
      {
        label: "Purchase Returns",
        icon: FileStack,
        path: "/purchase/purchase-returns",
      },
      {
        label: "Warehouses",
        icon: FileStack,
        path: "/purchase/warehouses",
      },
      {
        label: "Transfers",
        icon: FileStack,
        path: "/purchase/transfers",
      },
      { label: "Vendors", icon: Building2, path: "/purchase/vendors" },
      {
        label: "Purchase Order",
        icon: ClipboardList,
        path: "/purchase/purchase-orders",
      },
      { label: "Bills", icon: FileText, path: "/purchase/bills" },
      { label: "Expense", icon: Receipt, path: "/purchase/expense" },
      {
        label: "Payment Made",
        icon: DollarSign,
        path: "/purchase/payment-made",
      },
      { label: "Debit Notes", icon: CreditCard, path: "/purchase/debit-notes" },
    ],
  },
  {
    label: "Items",
    icon: Package,
    children: [
      { label: "Product", icon: Box, path: "/items/product" },
      { label: "Services", icon: Wrench, path: "/items/services" },
      { label: "System Setup", icon: Wrench, path: "/items/system-setup" },
    ],
  },
  {
    label: "Quotation",
    icon: Clock,
    path: "/quotation",
  },
  {
    label: "Time Logs",
    icon: Clock,
    path: "/time-logs",
  },
  {
    label: "Project",
    icon: FolderOpen,
    children: [
      { label: "Projects", icon: FolderOpen, path: "/project/projects" },
      { label: "Projects New", icon: FolderOpen, path: "/project/project-new" },
    ],
  },

  {
    label: "Acounting",
    icon: Calculator,
    children: [
      { label: "Customer", icon: Scan, path: "/accounting/customer" },
      { label: "Vendor", icon: Scan, path: "/accounting/vendor" },
      { label: "Bank Accounts", icon: Scan, path: "/accounting/bank-accounts" },
      {
        label: "Bank Transaction",
        icon: Scan,
        path: "/accounting/bank-transaction",
      },
      {
        label: "Bank Transfers",
        icon: Scan,
        path: "/accounting/bank-transfers",
      },
      {
        label: "Chart of Accounts",
        icon: Scan,
        path: "/accounting/chart-of-accounts",
      },
      {
        label: "Vendor Payments",
        icon: Scan,
        path: "/accounting/vendor-payments",
      },
      {
        label: "Customer Payments",
        icon: Scan,
        path: "/accounting/customer-payments",
      },
      {
        label: "Revenue",
        icon: Scan,
        path: "/accounting/revenue",
      },
      {
        label: "Expense",
        icon: Scan,
        path: "/accounting/expense",
      },
      {
        label: "Debit Notes",
        icon: Scan,
        path: "/accounting/debit-notes",
      },
      {
        label: "Credit Notes",
        icon: Scan,
        path: "/accounting/credit-notes",
      },
      {
        label: "Reports",
        icon: Scan,
        path: "/accounting/reports",
      },
      {
        label: "System",
        icon: Scan,
        path: "/accounting/system",
      },
    ],
  },

  {
    label: "Goal",
    icon: Goal,
    children: [
      { label: "Goals", icon: FolderOpen, path: "/goal/goals" },
      { label: "Milestones", icon: FolderOpen, path: "/goal/milestones" },
      { label: "Contributions", icon: FolderOpen, path: "/goal/contributions" },
      { label: "Tracking", icon: FolderOpen, path: "/goal/tracking" },
      { label: "Category", icon: FolderOpen, path: "/goal/category" },
    ],
  },
  // Budget
  {
    label: "Budget Planner",
    icon: CircleDollarSign,
    children: [
      {
        label: "Budget Periods",
        icon: FolderOpen,
        path: "/budget-planner/budget-periods",
      },
      {
        label: "Budget",
        icon: FolderOpen,
        path: "/budget-planner/budget",
      },
      {
        label: "Budget Allocations",
        icon: FolderOpen,
        path: "/budget-planner/budget-allocations",
      },
      {
        label: "Budget Monitoring",
        icon: FolderOpen,
        path: "/budget-planner/budget-monitoring",
      },
    ],
  },

  // Double Entry

  {
    label: "Double Entry",
    icon: Copy,
    children: [
      {
        label: "Ledger Summary",
        icon: FolderOpen,
        path: "/double-entry/ledger-summary",
      },
      {
        label: "Trial Balance",
        icon: FolderOpen,
        path: "/double-entry/trial-balance",
      },
      {
        label: "Balance Sheet",
        icon: FolderOpen,
        path: "/double-entry/balance-sheet",
      },
      {
        label: "Profit & Loss",
        icon: FolderOpen,
        path: "/double-entry/profit-loss",
      },
      {
        label: "Reports",
        icon: FolderOpen,
        path: "/double-entry/reports",
      },
    ],
  },
  // HRM
  {
    label: "HRM",
    icon: ChartColumnDecreasing,
    children: [
      {
        label: "Employees",
        icon: FolderOpen,
        path: "/hrm/employees",
      },
      {
        label: "Set Salary",
        icon: FolderOpen,
        path: "/hrm/payslip/set-salary",
      },
      {
        label: "Payroll",
        icon: FolderOpen,
        path: "/hrm/payslip/payroll",
      },
      {
        label: "Shifts",
        icon: FolderOpen,
        path: "/hrm/attendance/shifts",
      },
      {
        label: "Attendances",
        icon: FolderOpen,
        path: "/hrm/attendance/attendances",
      },
      {
        label: "Leave Types",
        icon: FolderOpen,
        path: "/hrm/leave-management/leave-types",
      },
      {
        label: "Leave Applications",
        icon: FolderOpen,
        path: "/hrm/leave-management/leave-applications",
      },
      {
        label: "Leave Balance",
        icon: FolderOpen,
        path: "/hrm/leave-management/leave-balance",
      },
      {
        label: "Holidays",
        icon: FolderOpen,
        path: "/hrm/holidays",
      },
      {
        label: "Awards",
        icon: FolderOpen,
        path: "/hrm/awards",
      },
      {
        label: "Promotions",
        icon: FolderOpen,
        path: "/hrm/promotions",
      },
      {
        label: "Resignations",
        icon: FolderOpen,
        path: "/hrm/resignations",
      },
      {
        label: "Terminations",
        icon: FolderOpen,
        path: "/hrm/terminations",
      },
      {
        label: "Warnings",
        icon: FolderOpen,
        path: "/hrm/warnings",
      },
      {
        label: "Complaints",
        icon: FolderOpen,
        path: "/hrm/complaints",
      },
      {
        label: "Transfers",
        icon: FolderOpen,
        path: "/hrm/transfers",
      },
      {
        label: "Documents",
        icon: FolderOpen,
        path: "/hrm/documents",
      },
      {
        label: "Acknowledgements",
        icon: FolderOpen,
        path: "/hrm/acknowledgements",
      },
      {
        label: "Announcements",
        icon: FolderOpen,
        path: "/hrm/announcements",
      },
      {
        label: "Events",
        icon: FolderOpen,
        path: "/hrm/events",
      },
      {
        label: "System Setup",
        icon: FolderOpen,
        path: "/hrm/system-setup",
      },
    ],
  },
  // Performance
  {
    label: "Performance",
    icon: TrendingUp,
    children: [
      {
        label: "Performance Indicators",
        icon: FolderOpen,
        path: "/performance/performance-indicators",
      },
      {
        label: "Employee Goals",
        icon: FolderOpen,
        path: "/performance/employee-goals",
      },
      {
        label: "Emaployee Reviews",
        icon: FolderOpen,
        path: "/performance/employee-reviews",
      },
      {
        label: "Review Cycles",
        icon: FolderOpen,
        path: "/performance/review-cycles",
      },
      {
        label: "System Setup",
        icon: FolderOpen,
        path: "/performance/system-setup",
      },
    ],
  },
  // training
  {
    label: "training",
    icon: TrendingUp,
    children: [
      {
        label: "Training Types",
        icon: FolderOpen,
        path: "/training/training-types",
      },
      {
        label: "Trainers",
        icon: FolderOpen,
        path: "/training/trainers",
      },
      {
        label: "Training List",
        icon: FolderOpen,
        path: "/training/training-list",
      },
    ],
  },
  // Recruitment
  {
    label: "Recruitment",
    icon: TrendingUp,
    children: [
      {
        label: "Job Locations",
        icon: FolderOpen,
        path: "/recruitment/job-locations",
      },
      {
        label: "Custom Questions",
        icon: FolderOpen,
        path: "/recruitment/custom-questions",
      },
      {
        label: "Job Postings",
        icon: FolderOpen,
        path: "/recruitment/job-postings",
      },
      {
        label: "Candidates",
        icon: FolderOpen,
        path: "/recruitment/candidates",
      },
      {
        label: "Interview Rounds",
        icon: FolderOpen,
        path: "/recruitment/interview-rounds",
      },
      {
        label: "Interview",
        icon: FolderOpen,
        path: "/recruitment/interview",
      },
      {
        label: "Interview Feedback",
        icon: FolderOpen,
        path: "/recruitment/interview-feedback",
      },
      {
        label: "Candidate Assessments",
        icon: FolderOpen,
        path: "/recruitment/candidate-assessments",
      },
      {
        label: "Offers",
        icon: FolderOpen,
        path: "/recruitment/offers",
      },
      {
        label: "Checklists Items",
        icon: FolderOpen,
        path: "/recruitment/checklist-items",
      },
      {
        label: "Candidate Onboarding",
        icon: FolderOpen,
        path: "/recruitment/candidate-onboarding",
      },
      {
        label: "System Setup",
        icon: FolderOpen,
        path: "/recruitment/system-setup",
      },
    ],
  },
  // CRM
  {
    label: "CRM",
    icon: ContactRound,
    children: [
      {
        label: "Leads",
        icon: FolderOpen,
        path: "/crm/leads",
      },
      {
        label: "Deals",
        icon: FolderOpen,
        path: "/crm/deals",
      },
      {
        label: "Systems Setup",
        icon: FolderOpen,
        path: "/crm/system-setup",
      },
      // Reports
      {
        label: "Leads Reports",
        icon: FolderOpen,
        path: "/crm/lead-reports",
      },
      {
        label: "Deal Reports",
        icon: FolderOpen,
        path: "/crm/deal-reports",
      },
    ],
  },

  // Support
  {
    label: "Support Ticket",
    icon: ContactRound,
    children: [
      {
        label: "Tickets",
        icon: FolderOpen,
        path: "/support-ticket/tickets",
      },
      {
        label: "Knowledge Base",
        icon: FolderOpen,
        path: "/support-ticket/knowledge-base",
      },
      {
        label: "FAQ",
        icon: FolderOpen,
        path: "/support-ticket/faq",
      },
      {
        label: "Contacts",
        icon: FolderOpen,
        path: "/support-ticket/contact",
      },
      {
        label: "System Setup",
        icon: FolderOpen,
        path: "/support-ticket/system-setup",
      },
    ],
  },
  // contract
  {
    label: "Contract",
    icon: ContactRound,
    children: [
      {
        label: "Contracts",
        icon: FolderOpen,
        path: "/contract/contracts",
      },
      {
        label: "Contract Types",
        icon: FolderOpen,
        path: "/contract/contract-types",
      },
    ],
  },
  {
    label: "Form Builder",
    icon: BookText,
    path: "/form-builder",
  },
  {
    label: "Zoom Meetings",
    icon: Presentation,
    path: "/zoom-meetings",
  },
  {
    label: "Timesheet",
    icon: Clock,
    path: "/timesheet",
  },
  {
    label: "Media Library",
    icon: Images,
    path: "/media-library",
  },
  {
    label: "Messenger",
    icon: MessageCircleMore,
    path: "/messenger",
  },
  {
    label: "Email Templates",
    icon: Mail,
    path: "/email-templates",
  },
  {
    label: "Notification Templates",
    icon: BellRing,
    path: "/notification-templates",
  },
  {
    label: "Reports",
    icon: BarChart3,
    path: "/reports",
  },
  {
    label: "Team",
    icon: UserCog,
    path: "/team",
  },
  {
    label: "Banking",
    icon: Landmark,
    path: "/banking",
  },
  {
    label: "Companies",
    icon: Building2,
    path: "/companies",
  },
];

interface SidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const MIN_WIDTH = 60;
const MAX_WIDTH = 480;
const COLLAPSE_THRESHOLD = 120;
const DEFAULT_WIDTH = 260;

export const Sidebar: React.FC<SidebarProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "Sales",
    "Purchase",
    "Items",
    "Documents",
  ]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(DEFAULT_WIDTH);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    const delta = e.clientX - dragStartX.current;
    const newWidth = Math.min(
      MAX_WIDTH,
      Math.max(MIN_WIDTH, dragStartWidth.current + delta),
    );
    setSidebarWidth(newWidth);
    setIsCollapsed(newWidth < COLLAPSE_THRESHOLD);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
    // snap to minimum if below threshold
    setSidebarWidth((w) => (w < COLLAPSE_THRESHOLD ? MIN_WIDTH : w));
  }, [handleMouseMove]);

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      dragStartX.current = e.clientX;
      dragStartWidth.current = sidebarWidth;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [sidebarWidth, handleMouseMove, handleMouseUp],
  );

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const toggleCollapse = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setSidebarWidth(DEFAULT_WIDTH);
    } else {
      setIsCollapsed(true);
      setSidebarWidth(MIN_WIDTH);
    }
  };

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const isParentActive = (children?: NavItem[]) => {
    if (!children) return false;
    return children.some((child) => location.pathname === child.path);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden transition-opacity duration-200"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          h-screen bg-[#FAFBFC] border-r border-gray-200 flex flex-col
          ${isDragging.current ? "" : "transition-all duration-300 ease-in-out"}
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ width: sidebarWidth }}
      >
        {/* Drag handle */}
        <div
          onMouseDown={handleDragStart}
          className="absolute right-0 top-0 bottom-0 w-1 z-10 cursor-col-resize group hidden lg:flex items-stretch"
        >
          <div className="w-full group-hover:bg-blue-400 transition-colors duration-150 opacity-0 group-hover:opacity-60 rounded-full" />
        </div>
        {/* Logo Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200 bg-white">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5">
              {/* Logo Icon */}
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center shadow-sm">
                <img src={Logo} alt="Qayd Logo" />
              </div>
              {/* Logo Text */}
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                Qayd
              </h1>
            </div>
          )}

          {isCollapsed && (
            <div className="flex items-center justify-center w-full">
              <button
                className="hidden lg:flex p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                onClick={toggleCollapse}
                title="Expand sidebar"
              >
                <Menu className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}

          {/* Mobile Close / Desktop Menu Toggle */}
          {!isCollapsed && (
            <>
              <button
                className="lg:hidden p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
              <button
                className="hidden lg:block p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                onClick={toggleCollapse}
              >
                <Menu className="w-4 h-4 text-gray-600" />
              </button>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          <ul className="">
            {navigationItems.map((item) => (
              <li key={item.label}>
                {/* Parent with Children */}
                {item.children && item.children.length > 0 ? (
                  <>
                    <button
                      onClick={() => !isCollapsed && toggleExpand(item.label)}
                      className={`
                        w-full flex items-center ${isCollapsed ? "justify-center" : "justify-between"} px-2.5 py-2 
                         font-normal transition-all duration-150 border-y border-gray-200
                        ${
                          isParentActive(item.children)
                            ? "bg-gray-300 text-gray-900 shadow-sm"
                            : "text-gray-700 hover:bg-gray-300"
                        }
                      `}
                      title={isCollapsed ? item.label : ""}
                    >
                      <div
                        className={`flex items-center ${isCollapsed ? "" : "gap-2.5"}`}
                      >
                        <item.icon
                          className="w-[16px] h-[16px]"
                          strokeWidth={1.8}
                        />
                        {!isCollapsed && (
                          <span className="tracking-tight">{item.label}</span>
                        )}
                      </div>
                      {!isCollapsed &&
                        (expandedItems.includes(item.label) ? (
                          <ChevronDown
                            className="w-3.5 h-3.5 text-gray-500"
                            strokeWidth={2}
                          />
                        ) : (
                          <ChevronRight
                            className="w-3.5 h-3.5 text-gray-500"
                            strokeWidth={2}
                          />
                        ))}
                    </button>

                    {/* Children - Flat design with icons */}
                    {!isCollapsed && expandedItems.includes(item.label) && (
                      <ul className="mt-0.5 space-y-0.5 ml-5 border-l border-gray-200">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              to={child.path || "#"}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`
                                flex items-center gap-2.5 px-2.5 py-2 
                                 transition-all duration-150
                                ${
                                  isActive(child.path)
                                    ? "border-b bg-gray-200 text-gray-900 font-medium shadow-sm"
                                    : "text-gray-600 hover:bg-gray-300 hover:text-gray-900"
                                }
                              `}
                            >
                              {/* Icon for submenu items */}
                              {/* <child.icon
                                className="w-[16px] h-[16px]"
                                strokeWidth={1.8}
                              /> */}
                              <span className="tracking-tight">
                                {child.label}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  /* Single Item */
                  <Link
                    to={item.path || "#"}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center ${isCollapsed ? "justify-center" : "gap-2.5"} px-2.5 py-2 
                       font-normal transition-all duration-150
                      ${
                        isActive(item.path)
                          ? "border-b bg-gray-200 text-gray-900 font-medium shadow-sm"
                          : "text-gray-700 hover:bg-gray-300"
                      }
                    `}
                    title={isCollapsed ? item.label : ""}
                  >
                    <item.icon
                      className="w-[16px] h-[16px]"
                      strokeWidth={1.8}
                    />
                    {!isCollapsed && (
                      <span className="tracking-tight">{item.label}</span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Get Help Footer */}
        <div className="border-t border-gray-200 p-2">
          <Link
            to="/get-help"
            className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-2.5"} px-2.5 py-2 rounded-md  text-gray-700 hover:bg-gray-300 transition-all duration-150`}
            title={isCollapsed ? "Get Help" : ""}
          >
            <HelpCircle className="w-[16px] h-[16px]" strokeWidth={1.8} />
            {!isCollapsed && <span className="tracking-tight">Get Help</span>}
          </Link>
        </div>
      </div>
    </>
  );
};
