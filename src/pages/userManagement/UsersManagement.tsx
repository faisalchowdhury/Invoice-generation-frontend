/**
 * File: src/pages/UsersManagement.tsx
 * Complete Users Management page with user listing and edit user modal
 * Edit modal has transparent background and permission settings with tabs
 */

import React, { useState } from "react";
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  Plus,
  Mail,
  Phone,
  Shield,
  Globe,
  CheckCircle,
  XCircle,
  X,
  UserCheck,
  UserPlus,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  Settings,
  Image,
  User as UserIcon,
  FileText,
  Bell,
  ShoppingCart,
  FileSignature,
  Package,
  Truck,
  RefreshCw,
  LayoutDashboard,
  Package as PackageIcon,
  FolderKanban,
  BookOpen,
  Layout,
  Users as UsersIcon,
  Headphones,
  CreditCard,
  Target,
  PieChart,
  GraduationCap,
  Award,
  UserPlus as UserPlusIcon,
  FileSpreadsheet,
  FileCheck,
  Clock,
} from "lucide-react";

// User type definition
interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  role: string;
  loginStatus: "Enabled" | "Disabled";
  avatar: string;
  lastLogin: string;
  createdAt: string;
}

// Permission category interface
interface PermissionCategory {
  name: string;
  icon: React.ElementType;
  permissions: Permission[];
  expanded: boolean;
}

interface Permission {
  id: string;
  label: string;
  checked: boolean;
}

// Module tabs
const modules = [
  { id: "general", name: "General", icon: Settings },
  { id: "product_service", name: "Product & Service", icon: PackageIcon },
  { id: "project", name: "Project", icon: FolderKanban },
  { id: "accounting", name: "Accounting", icon: BookOpen },
  { id: "cms", name: "CMS", icon: Layout },
  { id: "hrm", name: "HRM", icon: UsersIcon },
  { id: "crm", name: "CRM", icon: Users },
  { id: "pos", name: "POS", icon: ShoppingCart },
  { id: "support_ticket", name: "Support Ticket", icon: Headphones },
  { id: "double_entry", name: "Double Entry", icon: CreditCard },
  { id: "financial_goal", name: "Financial Goal", icon: Target },
  { id: "budget_planner", name: "Budget Planner", icon: PieChart },
  { id: "training", name: "Training", icon: GraduationCap },
  { id: "performance", name: "Performance", icon: Award },
  { id: "recruitment", name: "Recruitment", icon: UserPlusIcon },
  { id: "form_builder", name: "Form Builder", icon: FileSpreadsheet },
  { id: "contract", name: "Contract", icon: FileCheck },
  { id: "time", name: "Time", icon: Clock },
];

// Users data
const initialUsersData: User[] = [
  {
    id: 1,
    name: "vandor",
    email: "vandor@gmail.com",
    mobile: "+1234567890",
    role: "Vendor",
    loginStatus: "Enabled",
    avatar: "VA",
    lastLogin: "2024-02-15 10:30 AM",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    name: "ProSmart Solutions",
    email: "prosmartsolutions.hr@example.com",
    mobile: "+12000000051",
    role: "Hr",
    loginStatus: "Enabled",
    avatar: "PS",
    lastLogin: "2024-02-14 03:45 PM",
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    name: "Empower HR",
    email: "empowerhr@example.com",
    mobile: "+12000000050",
    role: "Hr",
    loginStatus: "Enabled",
    avatar: "EH",
    lastLogin: "2024-02-14 11:20 AM",
    createdAt: "2024-01-20",
  },
  {
    id: 4,
    name: "Quality Solutions Inc",
    email: "sales@qualsol.com",
    mobile: "+12000000047",
    role: "Client",
    loginStatus: "Enabled",
    avatar: "QS",
    lastLogin: "2024-02-13 02:15 PM",
    createdAt: "2024-01-25",
  },
  {
    id: 5,
    name: "Strategic Consulting",
    email: "hello@stratcon.com",
    mobile: "+12000000049",
    role: "Client",
    loginStatus: "Enabled",
    avatar: "SC",
    lastLogin: "2024-02-13 09:00 AM",
    createdAt: "2024-01-28",
  },
];

// Get permissions for each module
const getPermissionsForModule = (moduleId: string): Permission[] => {
  const commonPermissions = [
    { id: `dashboard_${moduleId}`, label: "Dashboard", checked: false },
    {
      id: `manage_dashboard_${moduleId}`,
      label: "Manage Dashboard",
      checked: false,
    },
  ];

  const moduleSpecificPermissions: Record<string, Permission[]> = {
    general: [
      { id: "manage_settings", label: "Manage Settings", checked: false },
      {
        id: "edit_brand_settings",
        label: "Edit Brand Settings",
        checked: false,
      },
      {
        id: "manage_system_settings",
        label: "Manage System Settings",
        checked: false,
      },
      {
        id: "edit_currency_settings",
        label: "Edit Currency Settings",
        checked: false,
      },
      {
        id: "manage_cookie_settings",
        label: "Manage Cookie Settings",
        checked: false,
      },
      { id: "edit_seo_settings", label: "Edit SEO Settings", checked: false },
      {
        id: "manage_email_settings",
        label: "Manage Email Settings",
        checked: false,
      },
      {
        id: "manage_email_notification_settings",
        label: "Manage Email Notification Settings",
        checked: false,
      },
      { id: "manage_media", label: "Manage Media", checked: false },
      { id: "create_media", label: "Create Media", checked: false },
      {
        id: "manage_media_directories",
        label: "Manage Media Directories",
        checked: false,
      },
      {
        id: "create_media_directories",
        label: "Create Media Directories",
        checked: false,
      },
      { id: "manage_profile", label: "Manage Profile", checked: false },
      { id: "edit_profile", label: "Edit Profile", checked: false },
      {
        id: "change_password_profile",
        label: "Change Password Profile",
        checked: false,
      },
      {
        id: "manage_email_templates",
        label: "Manage Email Templates",
        checked: false,
      },
      {
        id: "edit_email_templates",
        label: "Edit Email Templates",
        checked: false,
      },
      {
        id: "manage_notification_templates",
        label: "Manage Notification Templates",
        checked: false,
      },
      {
        id: "edit_notification_templates",
        label: "Edit Notification Templates",
        checked: false,
      },
    ],
    product_service: [
      { id: "manage_products", label: "Manage Products", checked: false },
      { id: "create_products", label: "Create Products", checked: false },
      { id: "edit_products", label: "Edit Products", checked: false },
      { id: "delete_products", label: "Delete Products", checked: false },
      { id: "manage_categories", label: "Manage Categories", checked: false },
      { id: "manage_brands", label: "Manage Brands", checked: false },
      { id: "manage_units", label: "Manage Units", checked: false },
      { id: "manage_warehouses", label: "Manage Warehouses", checked: false },
    ],
    project: [
      { id: "manage_projects", label: "Manage Projects", checked: false },
      { id: "create_projects", label: "Create Projects", checked: false },
      { id: "edit_projects", label: "Edit Projects", checked: false },
      { id: "delete_projects", label: "Delete Projects", checked: false },
      { id: "view_project_tasks", label: "View Project Tasks", checked: false },
      {
        id: "manage_project_members",
        label: "Manage Project Members",
        checked: false,
      },
      {
        id: "manage_project_milestones",
        label: "Manage Project Milestones",
        checked: false,
      },
    ],
    accounting: [
      { id: "manage_accounts", label: "Manage Accounts", checked: false },
      { id: "create_accounts", label: "Create Accounts", checked: false },
      { id: "edit_accounts", label: "Edit Accounts", checked: false },
      { id: "delete_accounts", label: "Delete Accounts", checked: false },
      {
        id: "manage_journal_entries",
        label: "Manage Journal Entries",
        checked: false,
      },
      {
        id: "manage_chart_of_accounts",
        label: "Manage Chart of Accounts",
        checked: false,
      },
      {
        id: "view_financial_reports",
        label: "View Financial Reports",
        checked: false,
      },
      { id: "manage_tax_rates", label: "Manage Tax Rates", checked: false },
    ],
    cms: [
      { id: "manage_pages", label: "Manage Pages", checked: false },
      { id: "create_pages", label: "Create Pages", checked: false },
      { id: "edit_pages", label: "Edit Pages", checked: false },
      { id: "delete_pages", label: "Delete Pages", checked: false },
      { id: "manage_blog_posts", label: "Manage Blog Posts", checked: false },
      { id: "manage_comments", label: "Manage Comments", checked: false },
      { id: "manage_menus", label: "Manage Menus", checked: false },
    ],
    hrm: [
      { id: "manage_employees", label: "Manage Employees", checked: false },
      { id: "create_employees", label: "Create Employees", checked: false },
      { id: "edit_employees", label: "Edit Employees", checked: false },
      { id: "delete_employees", label: "Delete Employees", checked: false },
      { id: "manage_attendance", label: "Manage Attendance", checked: false },
      { id: "manage_leaves", label: "Manage Leaves", checked: false },
      { id: "manage_payroll", label: "Manage Payroll", checked: false },
      { id: "manage_departments", label: "Manage Departments", checked: false },
    ],
    crm: [
      { id: "manage_leads", label: "Manage Leads", checked: false },
      { id: "create_leads", label: "Create Leads", checked: false },
      { id: "edit_leads", label: "Edit Leads", checked: false },
      { id: "delete_leads", label: "Delete Leads", checked: false },
      { id: "manage_customers", label: "Manage Customers", checked: false },
      {
        id: "manage_opportunities",
        label: "Manage Opportunities",
        checked: false,
      },
      { id: "manage_crm_reports", label: "Manage CRM Reports", checked: false },
    ],
    pos: [
      { id: "manage_pos", label: "Manage POS", checked: false },
      { id: "process_sales", label: "Process Sales", checked: false },
      {
        id: "manage_pos_products",
        label: "Manage POS Products",
        checked: false,
      },
      {
        id: "manage_cash_registers",
        label: "Manage Cash Registers",
        checked: false,
      },
      { id: "view_pos_reports", label: "View POS Reports", checked: false },
      {
        id: "manage_pos_customers",
        label: "Manage POS Customers",
        checked: false,
      },
    ],
    support_ticket: [
      { id: "manage_tickets", label: "Manage Tickets", checked: false },
      { id: "create_tickets", label: "Create Tickets", checked: false },
      { id: "edit_tickets", label: "Edit Tickets", checked: false },
      { id: "delete_tickets", label: "Delete Tickets", checked: false },
      { id: "assign_tickets", label: "Assign Tickets", checked: false },
      {
        id: "manage_ticket_categories",
        label: "Manage Ticket Categories",
        checked: false,
      },
      {
        id: "view_ticket_reports",
        label: "View Ticket Reports",
        checked: false,
      },
    ],
    double_entry: [
      {
        id: "manage_double_entry",
        label: "Manage Double Entry",
        checked: false,
      },
      {
        id: "create_journal_entries",
        label: "Create Journal Entries",
        checked: false,
      },
      {
        id: "edit_journal_entries",
        label: "Edit Journal Entries",
        checked: false,
      },
      {
        id: "delete_journal_entries",
        label: "Delete Journal Entries",
        checked: false,
      },
      {
        id: "manage_account_balances",
        label: "Manage Account Balances",
        checked: false,
      },
      { id: "view_trial_balance", label: "View Trial Balance", checked: false },
      { id: "view_ledger", label: "View Ledger", checked: false },
    ],
    financial_goal: [
      { id: "manage_goals", label: "Manage Goals", checked: false },
      { id: "create_goals", label: "Create Goals", checked: false },
      { id: "edit_goals", label: "Edit Goals", checked: false },
      { id: "delete_goals", label: "Delete Goals", checked: false },
      {
        id: "track_goal_progress",
        label: "Track Goal Progress",
        checked: false,
      },
      { id: "view_goal_reports", label: "View Goal Reports", checked: false },
    ],
    budget_planner: [
      { id: "manage_budgets", label: "Manage Budgets", checked: false },
      { id: "create_budgets", label: "Create Budgets", checked: false },
      { id: "edit_budgets", label: "Edit Budgets", checked: false },
      { id: "delete_budgets", label: "Delete Budgets", checked: false },
      {
        id: "track_budget_vs_actual",
        label: "Track Budget vs Actual",
        checked: false,
      },
      {
        id: "view_budget_reports",
        label: "View Budget Reports",
        checked: false,
      },
    ],
    training: [
      { id: "manage_trainings", label: "Manage Trainings", checked: false },
      { id: "create_trainings", label: "Create Trainings", checked: false },
      { id: "edit_trainings", label: "Edit Trainings", checked: false },
      { id: "delete_trainings", label: "Delete Trainings", checked: false },
      { id: "enroll_employees", label: "Enroll Employees", checked: false },
      {
        id: "view_training_reports",
        label: "View Training Reports",
        checked: false,
      },
    ],
    performance: [
      { id: "manage_performance", label: "Manage Performance", checked: false },
      { id: "create_reviews", label: "Create Reviews", checked: false },
      { id: "edit_reviews", label: "Edit Reviews", checked: false },
      { id: "delete_reviews", label: "Delete Reviews", checked: false },
      { id: "manage_kpis", label: "Manage KPIs", checked: false },
      {
        id: "view_performance_reports",
        label: "View Performance Reports",
        checked: false,
      },
    ],
    recruitment: [
      { id: "manage_recruitment", label: "Manage Recruitment", checked: false },
      {
        id: "create_job_postings",
        label: "Create Job Postings",
        checked: false,
      },
      { id: "edit_job_postings", label: "Edit Job Postings", checked: false },
      {
        id: "delete_job_postings",
        label: "Delete Job Postings",
        checked: false,
      },
      {
        id: "manage_applications",
        label: "Manage Applications",
        checked: false,
      },
      {
        id: "schedule_interviews",
        label: "Schedule Interviews",
        checked: false,
      },
      {
        id: "view_recruitment_reports",
        label: "View Recruitment Reports",
        checked: false,
      },
    ],
    form_builder: [
      { id: "manage_forms", label: "Manage Forms", checked: false },
      { id: "create_forms", label: "Create Forms", checked: false },
      { id: "edit_forms", label: "Edit Forms", checked: false },
      { id: "delete_forms", label: "Delete Forms", checked: false },
      {
        id: "manage_form_submissions",
        label: "Manage Form Submissions",
        checked: false,
      },
      { id: "view_form_reports", label: "View Form Reports", checked: false },
    ],
    contract: [
      { id: "manage_contracts", label: "Manage Contracts", checked: false },
      { id: "create_contracts", label: "Create Contracts", checked: false },
      { id: "edit_contracts", label: "Edit Contracts", checked: false },
      { id: "delete_contracts", label: "Delete Contracts", checked: false },
      { id: "sign_contracts", label: "Sign Contracts", checked: false },
      {
        id: "view_contract_reports",
        label: "View Contract Reports",
        checked: false,
      },
    ],
    time: [
      { id: "manage_time", label: "Manage Time", checked: false },
      { id: "track_time", label: "Track Time", checked: false },
      { id: "manage_timesheets", label: "Manage Timesheets", checked: false },
      { id: "approve_timesheets", label: "Approve Timesheets", checked: false },
      { id: "view_time_reports", label: "View Time Reports", checked: false },
      {
        id: "manage_time_categories",
        label: "Manage Time Categories",
        checked: false,
      },
    ],
  };

  const modulePermissions = moduleSpecificPermissions[moduleId] || [];
  return [...commonPermissions, ...modulePermissions];
};

// Languages
const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
];

export const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsersData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeModule, setActiveModule] = useState("general");

  // Permission state for each module
  const [modulePermissions, setModulePermissions] = useState<
    Record<string, Permission[]>
  >(() => {
    const initialPermissions: Record<string, Permission[]> = {};
    modules.forEach((module) => {
      initialPermissions[module.id] = getPermissionsForModule(module.id);
    });
    return initialPermissions;
  });

  // Form data for edit
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "Staff",
    loginStatus: "Enabled" as "Enabled" | "Disabled",
  });

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile.includes(searchTerm),
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Toggle single permission
  const togglePermission = (moduleId: string, permissionId: string) => {
    setModulePermissions((prev) => ({
      ...prev,
      [moduleId]: prev[moduleId].map((perm) =>
        perm.id === permissionId ? { ...perm, checked: !perm.checked } : perm,
      ),
    }));
  };

  // Toggle all permissions in a module
  const toggleAllPermissions = (moduleId: string) => {
    const allChecked = modulePermissions[moduleId].every((p) => p.checked);
    setModulePermissions((prev) => ({
      ...prev,
      [moduleId]: prev[moduleId].map((perm) => ({
        ...perm,
        checked: !allChecked,
      })),
    }));
  };

  // Show toast notification
  const showToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  // Edit User
  const handleEditUser = () => {
    if (selectedUser) {
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              name: formData.name,
              email: formData.email,
              mobile: formData.mobile,
              role: formData.role,
              loginStatus: formData.loginStatus,
              avatar: formData.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2),
            }
          : user,
      );
      setUsers(updatedUsers);
      setShowEditModal(false);
      setSelectedUser(null);
      setFormData({
        name: "",
        email: "",
        mobile: "",
        role: "Staff",
        loginStatus: "Enabled",
      });
      showToast("User updated successfully!");
    }
  };

  // Delete User
  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);
      showToast("User deleted successfully!");
    }
  };

  // Open Edit Modal
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      loginStatus: user.loginStatus,
    });
    setActiveModule("general");
    setShowEditModal(true);
  };

  // Open Delete Modal
  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Open View Modal
  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "vendor":
        return "bg-purple-100 text-purple-700";
      case "hr":
        return "bg-blue-100 text-blue-700";
      case "client":
        return "bg-green-100 text-green-700";
      case "staff":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "Enabled") {
      return <CheckCircle className="w-3 h-3 text-green-600" />;
    }
    return <XCircle className="w-3 h-3 text-red-600" />;
  };

  const getStatusColor = (status: string) => {
    return status === "Enabled"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };

  // Get total permissions count across all modules
  const totalPermissions = Object.values(modulePermissions).reduce(
    (sum, perms) => sum + perms.length,
    0,
  );

  const checkedPermissions = Object.values(modulePermissions).reduce(
    (sum, perms) => sum + perms.filter((p) => p.checked).length,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Success Toast */}
        {showSuccessToast && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </div>
          </div>
        )}

        {/* Breadcrumb */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Users</span>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Globe className="w-4 h-4" />
              {languages.find((lang) => lang.code === selectedLanguage)?.name}
              <ChevronRight className="w-3 h-3 rotate-90" />
            </button>
            {showLanguageDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowLanguageDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.code);
                        setShowLanguageDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2 ${
                        selectedLanguage === lang.code
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      <span>{lang.flag}</span>
                      {lang.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              Manage Users
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage system users, roles, and access permissions
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add New User
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Role:</span>
                  <div className="flex gap-2 flex-wrap">
                    {["All", "Staff", "Client", "Vendor", "Hr"].map((role) => (
                      <button
                        key={role}
                        className="px-3 py-1 text-sm rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Avatar
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Mobile No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Login Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                        {user.avatar}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                        {user.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {user.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {user.mobile}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                          user.role,
                        )}`}
                      >
                        <Shield className="w-3 h-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          user.loginStatus,
                        )}`}
                      >
                        {getStatusIcon(user.loginStatus)}
                        {user.loginStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openViewModal(user)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          title="View User"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
                className="px-2 py-1 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-500">per page</span>
            </div>

            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
              {filteredUsers.length} results
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      currentPage === pageNumber
                        ? "bg-blue-600 text-white"
                        : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* User Summary Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-blue-600 font-medium">
                  Total Users
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {users.length}
                </div>
                <div className="text-xs text-blue-500 mt-1">
                  Active accounts
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-green-600 font-medium">
                  Active Users
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {users.filter((u) => u.loginStatus === "Enabled").length}
                </div>
                <div className="text-xs text-green-500 mt-1">
                  Currently active
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-purple-600 font-medium">Roles</div>
                <div className="text-2xl font-bold text-purple-700">5</div>
                <div className="text-xs text-purple-500 mt-1">
                  Different roles
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-orange-600 font-medium">
                  New This Month
                </div>
                <div className="text-2xl font-bold text-orange-700">8</div>
                <div className="text-xs text-orange-500 mt-1">
                  +23% vs last month
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal with Permissions - Transparent Background */}
      {showEditModal && selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Edit User: {selectedUser.name}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Update user information and access permissions
                </p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - User Info */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      User Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mobile Number
                        </label>
                        <input
                          type="text"
                          value={formData.mobile}
                          onChange={(e) =>
                            setFormData({ ...formData, mobile: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <select
                          value={formData.role}
                          onChange={(e) =>
                            setFormData({ ...formData, role: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Staff">Staff</option>
                          <option value="Client">Client</option>
                          <option value="Vendor">Vendor</option>
                          <option value="Hr">HR</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Login Status
                        </label>
                        <select
                          value={formData.loginStatus}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              loginStatus: e.target.value as
                                | "Enabled"
                                | "Disabled",
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Enabled">Enabled</option>
                          <option value="Disabled">Disabled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Permissions with Tabs */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-gray-900">
                        Access Permissions
                      </h3>
                      <div className="text-sm text-gray-500">
                        {checkedPermissions} of {totalPermissions} permissions
                        granted
                      </div>
                    </div>

                    {/* Module Tabs */}
                    <div className="flex flex-wrap gap-1 mb-4 border-b border-gray-200 pb-2">
                      {modules.map((module) => (
                        <button
                          key={module.id}
                          onClick={() => setActiveModule(module.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                            activeModule === module.id
                              ? "bg-blue-600 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <module.icon className="w-3.5 h-3.5" />
                          {module.name}
                        </button>
                      ))}
                    </div>

                    {/* Permissions for Active Module */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const activeModuleItem = modules.find(
                              (m) => m.id === activeModule,
                            );
                            if (!activeModuleItem) return null;
                            const ActiveModuleIcon = activeModuleItem.icon;
                            return (
                              <ActiveModuleIcon className="w-4 h-4 text-gray-500" />
                            );
                          })()}
                          <span className="font-medium text-gray-900">
                            {modules.find((m) => m.id === activeModule)?.name}{" "}
                            Permissions
                          </span>
                          <span className="text-xs text-gray-400">
                            (
                            {modulePermissions[activeModule]?.filter(
                              (p) => p.checked,
                            ).length || 0}
                            /{modulePermissions[activeModule]?.length || 0})
                          </span>
                        </div>
                        <button
                          onClick={() => toggleAllPermissions(activeModule)}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          {modulePermissions[activeModule]?.every(
                            (p) => p.checked,
                          )
                            ? "Deselect All"
                            : "Select All"}
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {modulePermissions[activeModule]?.map(
                            (permission) => (
                              <label
                                key={permission.id}
                                className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={permission.checked}
                                  onChange={() =>
                                    togglePermission(
                                      activeModule,
                                      permission.id,
                                    )
                                  }
                                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                  {permission.label}
                                </span>
                              </label>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete User
              </h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{selectedUser.name}</span>? This
                action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteUser}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                User Details
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-medium">
                  {selectedUser.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedUser.name}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedUser.role}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Mobile Number</p>
                    <p className="text-sm text-gray-900">
                      {selectedUser.mobile}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Role</p>
                    <p className="text-sm text-gray-900">{selectedUser.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusIcon(selectedUser.loginStatus)}
                  <div>
                    <p className="text-xs text-gray-500">Login Status</p>
                    <p className="text-sm text-gray-900">
                      {selectedUser.loginStatus}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  openEditModal(selectedUser);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit User
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
