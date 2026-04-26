/**
 * File: src/components/layout/Sidebar.tsx
 * Updated with all menu items from screenshot
 */

import React, { useState } from "react";
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
  },
  {
    label: "Sales",
    icon: DollarSign,
    children: [
      { label: "Customers", icon: Users, path: "/sales/customers" },
      { label: "Invoices", icon: FileText, path: "/sales/invoices" },
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
    ],
  },
  {
    label: "Time Logs",
    icon: Clock,
    path: "/time-logs",
  },
  {
    label: "Projects",
    icon: FolderOpen,
    path: "/projects",
  },
  {
    label: "Documents",
    icon: FolderOpen,
    children: [
      { label: "Quick Scan", icon: Scan, path: "/documents/quick-scan" },
      {
        label: "My Documents",
        icon: FileCheck,
        path: "/documents/my-documents",
      },
    ],
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
          fixed lg:static inset-y-0 left-0 z-50
          ${isCollapsed ? "w-[60px]" : "w-[260px]"} lg:${isCollapsed ? "w-[60px]" : "w-[260px]"}
          h-screen bg-[#FAFBFC] border-r border-gray-200 flex flex-col
          transform transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
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
                onClick={() => setIsCollapsed(!isCollapsed)}
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
                onClick={() => setIsCollapsed(!isCollapsed)}
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
                      <ul className="mt-0.5 space-y-0.5">
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
                              <child.icon
                                className="w-[16px] h-[16px]"
                                strokeWidth={1.8}
                              />
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
