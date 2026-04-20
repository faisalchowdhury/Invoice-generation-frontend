/**
 * File: src/components/layout/Header.tsx
 * Fully Responsive Header - Mobile, Tablet, Desktop
 */

import React from "react";
import {
  Search,
  Plus,
  Play,
  Pause,
  Settings,
  Bell,
  ChevronDown,
  Menu,
} from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [isTimerRunning, setIsTimerRunning] = React.useState(false);

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-4 gap-2 sm:gap-4">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-gray-100 rounded transition-colors"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Search Bar - Responsive */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-1.5 text-xs sm:text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Right Side Actions - Responsive */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Add Button */}
        <button className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-900 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors">
          <Plus
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
            strokeWidth={2}
          />
        </button>

        {/* Timer - Hide on mobile */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md">
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-0.5 hover:bg-gray-100 rounded transition-colors"
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

        {/* Settings - Hide on small mobile */}
        <button className="hidden sm:block p-1.5 hover:bg-gray-100 rounded transition-colors">
          <Settings className="w-4 h-4 text-gray-700" />
        </button>

        {/* Notifications */}
        <button className="p-1.5 hover:bg-gray-100 rounded transition-colors relative">
          <Bell className="w-4 h-4 text-gray-700" />
        </button>

        {/* Separator - Hide on mobile */}
        <div className="hidden sm:block w-px h-6 bg-gray-200"></div>

        {/* Info Dropdown */}
        <button className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1.5 hover:bg-gray-100 rounded transition-colors">
          <span className="text-xs sm:text-sm font-medium text-gray-700">
            Info
          </span>
          <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};
