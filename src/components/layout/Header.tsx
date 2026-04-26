/**
 * File: src/components/layout/Header.tsx
 * Fully Responsive Header with Quick Create, Notifications, and User dropdowns
 */

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Play,
  Pause,
  Bell,
  ChevronDown,
  Menu,
  X,
  FileText,
  Users,
  ShoppingCart,
  Package,
  Receipt,
  Building2,
  Clock,
  DollarSign,
  Settings,
  LogOut,
  User,
  Check,
} from "lucide-react";
import { SettingsDropdown } from "@/pages/SettingsDropdown";

interface HeaderProps {
  onMenuClick: () => void;
}

const quickCreateItems = [
  { label: "New Invoice", icon: FileText, path: "/sales/invoices" },
  { label: "New Customer", icon: Users, path: "/sales/customers" },
  { label: "New Estimate", icon: Receipt, path: "/sales/estimates" },
  { label: "New Sales Receipt", icon: DollarSign, path: "/sales/sales-receipts" },
  { label: "New Purchase Order", icon: ShoppingCart, path: "/purchase/purchase-orders" },
  { label: "New Vendor", icon: Building2, path: "/purchase/vendors" },
  { label: "New Product", icon: Package, path: "/items/product" },
  { label: "Log Time", icon: Clock, path: "/time-logs" },
];

const sampleNotifications = [
  {
    id: 1,
    title: "Invoice #1 is overdue",
    description: "Spark Tech Agency — $5,000 due",
    time: "2h ago",
    unread: true,
  },
  {
    id: 2,
    title: "Payment received",
    description: "Tech Corp paid Invoice #2",
    time: "5h ago",
    unread: true,
  },
  {
    id: 3,
    title: "New vendor added",
    description: "Fair Electronics was added",
    time: "1d ago",
    unread: false,
  },
  {
    id: 4,
    title: "Estimate approved",
    description: "Client approved Estimate #5",
    time: "2d ago",
    unread: false,
  },
];

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [searchQuery, setSearchQuery] = useState("");

  const quickCreateRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (quickCreateRef.current && !quickCreateRef.current.contains(e.target as Node))
        setShowQuickCreate(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setShowNotifications(false);
      if (userRef.current && !userRef.current.contains(e.target as Node))
        setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/sales/invoices`);
    }
  };

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-4 gap-2 sm:gap-4">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-gray-100 rounded transition-colors"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoices, customers, items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-1.5 text-xs sm:text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Quick Create Button */}
        <div className="relative" ref={quickCreateRef}>
          <button
            onClick={() => {
              setShowQuickCreate(!showQuickCreate);
              setShowNotifications(false);
              setShowUserMenu(false);
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-900 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
            title="Quick Create"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" strokeWidth={2} />
          </button>

          {showQuickCreate && (
            <div className="absolute right-0 top-10 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Quick Create
              </div>
              {quickCreateItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowQuickCreate(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <item.icon className="w-4 h-4 text-gray-400" />
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Timer - Hide on mobile */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md">
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-0.5 hover:bg-gray-100 rounded transition-colors"
            title={isTimerRunning ? "Pause timer" : "Start timer"}
          >
            {isTimerRunning ? (
              <Pause className="w-3.5 h-3.5 text-gray-700" />
            ) : (
              <Play className="w-3.5 h-3.5 text-gray-700" />
            )}
          </button>
          <span className="text-xs sm:text-sm font-mono text-gray-700">
            00:00:00
          </span>
        </div>

        {/* Settings Dropdown */}
        <div className="hidden sm:block">
          <SettingsDropdown />
        </div>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowQuickCreate(false);
              setShowUserMenu(false);
            }}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-medium">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-10 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">
                  Notifications
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.map((n) =>
                          n.id === notif.id ? { ...n, unread: false } : n,
                        ),
                      );
                    }}
                    className={`px-4 py-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 ${notif.unread ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      {notif.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                      )}
                      <div className={notif.unread ? "" : "ml-4"}>
                        <p className="text-sm font-medium text-gray-900">
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {notif.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-200">
                <Link
                  to="/reports"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  View all activity →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="hidden sm:block w-px h-6 bg-gray-200" />

        {/* User / Info Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowQuickCreate(false);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
              F
            </div>
            <span className="hidden sm:block text-xs sm:text-sm font-medium text-gray-700">
              Faisal
            </span>
            <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-10 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">Faisal Chowdhury</p>
                <p className="text-xs text-gray-500 truncate">
                  chowdhuryfaisal66@gmail.com
                </p>
              </div>
              <Link
                to="/companies"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Building2 className="w-4 h-4 text-gray-400" />
                My Company
              </Link>
              <Link
                to="/team"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <User className="w-4 h-4 text-gray-400" />
                Team
              </Link>
              <Link
                to="/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                Settings
              </Link>
              <Link
                to="/get-help"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Bell className="w-4 h-4 text-gray-400" />
                Help & Support
              </Link>
              <div className="border-t border-gray-200 mt-1 pt-1">
                <Link
                  to="/auth/login"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
