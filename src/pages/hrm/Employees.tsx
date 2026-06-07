/**
 * File: src/pages/hrm/Employees.tsx
 * Complete Employees Management page with list view, multi-step create modal, and details modal
 * Based on provided screenshots design
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  X,
  Eye,
  DollarSign,
  Calendar,
  Upload,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Employee {
  id: string;
  employeeId: string;
  userId: string;
  userName: string;
  branch: string;
  department: string;
  designation: string;
  employmentType: "Full Time" | "Part Time" | "Contract" | "Temporary";
  dateOfJoining: string;
  shift: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyContactRelation: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  ifscCode: string;
  basicSalary: number;
  hoursPerDay: number;
  daysPerWeek: number;
  ratePerHour: number;
  status: "Active" | "Inactive" | "On Leave" | "Terminated";
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleEmployees: Employee[] = [
  {
    id: "1",
    employeeId: "EMP20260001",
    userId: "user_001",
    userName: "John Smith",
    branch: "Sales Office",
    department: "Customer Service",
    designation: "Senior Consultant",
    employmentType: "Part Time",
    dateOfJoining: "2023-05-10",
    shift: "Morning",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@company.com",
    phone: "+1234567890",
    dateOfBirth: "1990-01-15",
    gender: "Male",
    maritalStatus: "Married",
    addressLine1: "123 Main Street",
    addressLine2: "",
    city: "New York",
    state: "NY",
    country: "USA",
    zipCode: "10001",
    emergencyContactName: "Jane Smith",
    emergencyContactNumber: "+1987654321",
    emergencyContactRelation: "Spouse",
    bankName: "Chase Bank",
    accountNumber: "****1234",
    accountHolderName: "John Smith",
    ifscCode: "CHASUS33",
    basicSalary: 5000,
    hoursPerDay: 6,
    daysPerWeek: 5,
    ratePerHour: 41.67,
    status: "Active",
    createdAt: "2023-05-10",
  },
  {
    id: "2",
    employeeId: "EMP20260002",
    userId: "user_002",
    userName: "Michael Brown",
    branch: "Regional Office",
    department: "Finance & Accounting",
    designation: "Assistant Manager",
    employmentType: "Temporary",
    dateOfJoining: "2023-03-21",
    shift: "Morning",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@company.com",
    phone: "+1234567891",
    dateOfBirth: "1985-06-20",
    gender: "Male",
    maritalStatus: "Married",
    addressLine1: "456 Oak Avenue",
    addressLine2: "",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    zipCode: "90001",
    emergencyContactName: "Sarah Brown",
    emergencyContactNumber: "+1987654322",
    emergencyContactRelation: "Spouse",
    bankName: "Bank of America",
    accountNumber: "****5678",
    accountHolderName: "Michael Brown",
    ifscCode: "BOFAUS3N",
    basicSalary: 6500,
    hoursPerDay: 8,
    daysPerWeek: 5,
    ratePerHour: 40.63,
    status: "Active",
    createdAt: "2023-03-21",
  },
  {
    id: "3",
    employeeId: "EMP20260003",
    userId: "user_003",
    userName: "David Wilson",
    branch: "Regional Office",
    department: "Human Resources",
    designation: "Officer",
    employmentType: "Full Time",
    dateOfJoining: "2023-02-10",
    shift: "Morning",
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@company.com",
    phone: "+1234567892",
    dateOfBirth: "1992-08-12",
    gender: "Male",
    maritalStatus: "Single",
    addressLine1: "789 Pine Street",
    addressLine2: "",
    city: "Chicago",
    state: "IL",
    country: "USA",
    zipCode: "60601",
    emergencyContactName: "Emily Wilson",
    emergencyContactNumber: "+1987654323",
    emergencyContactRelation: "Sister",
    bankName: "Wells Fargo",
    accountNumber: "****9012",
    accountHolderName: "David Wilson",
    ifscCode: "WFBIUS6S",
    basicSalary: 4500,
    hoursPerDay: 8,
    daysPerWeek: 5,
    ratePerHour: 28.13,
    status: "Active",
    createdAt: "2023-02-10",
  },
  {
    id: "4",
    employeeId: "EMP20260004",
    userId: "user_004",
    userName: "Robert Taylor",
    branch: "North Branch",
    department: "Procurement",
    designation: "Analyst",
    employmentType: "Part Time",
    dateOfJoining: "2024-09-15",
    shift: "Evening",
    firstName: "Robert",
    lastName: "Taylor",
    email: "robert.taylor@company.com",
    phone: "+1234567893",
    dateOfBirth: "1988-03-25",
    gender: "Male",
    maritalStatus: "Married",
    addressLine1: "321 Elm Road",
    addressLine2: "",
    city: "Houston",
    state: "TX",
    country: "USA",
    zipCode: "77001",
    emergencyContactName: "Lisa Taylor",
    emergencyContactNumber: "+1987654324",
    emergencyContactRelation: "Spouse",
    bankName: "Citibank",
    accountNumber: "****3456",
    accountHolderName: "Robert Taylor",
    ifscCode: "CITIUS33",
    basicSalary: 4000,
    hoursPerDay: 5,
    daysPerWeek: 4,
    ratePerHour: 50.0,
    status: "Active",
    createdAt: "2024-09-15",
  },
  {
    id: "5",
    employeeId: "EMP20260005",
    userId: "user_005",
    userName: "James Garcia",
    branch: "Customer Service Center",
    department: "Legal & Compliance",
    designation: "Officer",
    employmentType: "Contract",
    dateOfJoining: "2025-01-13",
    shift: "Morning",
    firstName: "James",
    lastName: "Garcia",
    email: "james.garcia@company.com",
    phone: "+1234567894",
    dateOfBirth: "1995-11-08",
    gender: "Male",
    maritalStatus: "Single",
    addressLine1: "654 Cedar Lane",
    addressLine2: "",
    city: "Phoenix",
    state: "AZ",
    country: "USA",
    zipCode: "85001",
    emergencyContactName: "Maria Garcia",
    emergencyContactNumber: "+1987654325",
    emergencyContactRelation: "Mother",
    bankName: "TD Bank",
    accountNumber: "****7890",
    accountHolderName: "James Garcia",
    ifscCode: "TDOMCATTTOR",
    basicSalary: 5500,
    hoursPerDay: 8,
    daysPerWeek: 5,
    ratePerHour: 34.38,
    status: "Active",
    createdAt: "2025-01-13",
  },
];

const branches = [
  "Regional Office",
  "Sales Office",
  "North Branch",
  "South Branch",
  "Downtown Branch",
  "Customer Service Center",
];
const departments: Record<string, string[]> = {
  "Regional Office": [
    "Finance & Accounting",
    "Human Resources",
    "Administration",
    "IT",
  ],
  "Sales Office": ["Sales", "Marketing", "Customer Service"],
  "North Branch": ["Operations", "Procurement", "Logistics"],
  "South Branch": ["Finance & Accounting", "Sales", "Support"],
  "Downtown Branch": ["Quality Assurance", "Legal & Compliance", "Facilities"],
  "Customer Service Center": [
    "Customer Support",
    "Technical Support",
    "Legal & Compliance",
  ],
};
const designations: Record<string, string[]> = {
  "Finance & Accounting": [
    "Accountant",
    "Senior Accountant",
    "Finance Manager",
    "Director",
    "Assistant Manager",
    "Team Lead",
  ],
  "Human Resources": [
    "HR Officer",
    "HR Manager",
    "Recruiter",
    "Training Coordinator",
  ],
  Sales: [
    "Sales Executive",
    "Senior Sales Executive",
    "Sales Manager",
    "Director",
  ],
  Marketing: ["Marketing Executive", "Marketing Manager", "Brand Manager"],
  "Customer Service": [
    "Support Associate",
    "Senior Consultant",
    "Team Lead",
    "Manager",
  ],
  Operations: ["Operations Analyst", "Operations Manager", "Coordinator"],
  Procurement: ["Procurement Officer", "Analyst", "Manager"],
  Logistics: ["Logistics Coordinator", "Supply Chain Analyst", "Manager"],
  IT: ["IT Support", "System Administrator", "Developer", "IT Manager"],
  "Quality Assurance": ["QA Analyst", "Senior QA", "QA Manager", "Executive"],
  "Legal & Compliance": ["Legal Officer", "Compliance Officer", "Manager"],
  "Technical Support": [
    "Support Engineer",
    "Senior Support Engineer",
    "Team Lead",
  ],
};

const employmentTypes = ["Full Time", "Part Time", "Contract", "Temporary"];
const shifts = ["Morning", "Evening", "Night", "Rotational"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "employeeId"
  | "userName"
  | "branch"
  | "department"
  | "designation"
  | "employmentType"
  | "dateOfJoining";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const Employees: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("employeeId");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showFilters, setShowFilters] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Personal",
    "Employment",
    "Contact",
    "Banking",
    "Hours & Rates",
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "Male" as "Male" | "Female" | "Other",
    maritalStatus: "Single" as "Single" | "Married" | "Divorced" | "Widowed",
    userId: "",
    userName: "",
    branch: "",
    department: "",
    designation: "",
    employmentType: "Full Time" as
      | "Full Time"
      | "Part Time"
      | "Contract"
      | "Temporary",
    dateOfJoining: "",
    shift: "Morning",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    emergencyContactRelation: "",
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
    ifscCode: "",
    basicSalary: 0,
    hoursPerDay: 8,
    daysPerWeek: 5,
    ratePerHour: 0,
    status: "Active" as "Active" | "Inactive" | "On Leave" | "Terminated",
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const filteredEmployees = useMemo(() => {
    let result = [...employees];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.employeeId.toLowerCase().includes(q) ||
          e.userName.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.designation.toLowerCase().includes(q),
      );
    }
    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [employees, searchQuery, sortField, sortDir]);

  const totalPages = Math.ceil(filteredEmployees.length / perPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "Male",
      maritalStatus: "Single",
      userId: "",
      userName: "",
      branch: "",
      department: "",
      designation: "",
      employmentType: "Full Time",
      dateOfJoining: "",
      shift: "Morning",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      emergencyContactRelation: "",
      bankName: "",
      accountNumber: "",
      accountHolderName: "",
      ifscCode: "",
      basicSalary: 0,
      hoursPerDay: 8,
      daysPerWeek: 5,
      ratePerHour: 0,
      status: "Active",
    });
    setCurrentStep(0);
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      dateOfBirth: employee.dateOfBirth,
      gender: employee.gender,
      maritalStatus: employee.maritalStatus,
      userId: employee.userId,
      userName: employee.userName,
      branch: employee.branch,
      department: employee.department,
      designation: employee.designation,
      employmentType: employee.employmentType,
      dateOfJoining: employee.dateOfJoining,
      shift: employee.shift,
      addressLine1: employee.addressLine1,
      addressLine2: employee.addressLine2,
      city: employee.city,
      state: employee.state,
      country: employee.country,
      zipCode: employee.zipCode,
      emergencyContactName: employee.emergencyContactName,
      emergencyContactNumber: employee.emergencyContactNumber,
      emergencyContactRelation: employee.emergencyContactRelation,
      bankName: employee.bankName,
      accountNumber: employee.accountNumber,
      accountHolderName: employee.accountHolderName,
      ifscCode: employee.ifscCode,
      basicSalary: employee.basicSalary,
      hoursPerDay: employee.hoursPerDay,
      daysPerWeek: employee.daysPerWeek,
      ratePerHour: employee.ratePerHour,
      status: employee.status,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openViewModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  const openDeleteModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  const handleSaveEmployee = () => {
    if (!formData.firstName || !formData.lastName) {
      showToast("Please fill in personal information", "info");
      setCurrentStep(0);
      return;
    }
    if (!formData.branch || !formData.department || !formData.designation) {
      showToast("Please fill in employment information", "info");
      setCurrentStep(1);
      return;
    }
    if (
      !formData.addressLine1 ||
      !formData.city ||
      !formData.country ||
      !formData.emergencyContactName
    ) {
      showToast("Please fill in contact information", "info");
      setCurrentStep(2);
      return;
    }
    if (formData.basicSalary <= 0) {
      showToast("Please enter basic salary", "info");
      setCurrentStep(3);
      return;
    }

    const employeeId = `EMP${new Date().getFullYear()}${String(employees.length + 1).padStart(5, "0")}`;

    if (isEditing && selectedEmployee) {
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === selectedEmployee.id
            ? {
                ...e,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                maritalStatus: formData.maritalStatus,
                userName: formData.userName,
                branch: formData.branch,
                department: formData.department,
                designation: formData.designation,
                employmentType: formData.employmentType,
                dateOfJoining: formData.dateOfJoining,
                shift: formData.shift,
                addressLine1: formData.addressLine1,
                addressLine2: formData.addressLine2,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                zipCode: formData.zipCode,
                emergencyContactName: formData.emergencyContactName,
                emergencyContactNumber: formData.emergencyContactNumber,
                emergencyContactRelation: formData.emergencyContactRelation,
                bankName: formData.bankName,
                accountNumber: formData.accountNumber,
                accountHolderName: formData.accountHolderName,
                ifscCode: formData.ifscCode,
                basicSalary: formData.basicSalary,
                hoursPerDay: formData.hoursPerDay,
                daysPerWeek: formData.daysPerWeek,
                ratePerHour: formData.ratePerHour,
                status: formData.status,
              }
            : e,
        ),
      );
      showToast("Employee updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        employeeId: employeeId,
        userId: `user_${String(employees.length + 1).padStart(3, "0")}`,
        userName: `${formData.firstName} ${formData.lastName}`,
        branch: formData.branch,
        department: formData.department,
        designation: formData.designation,
        employmentType: formData.employmentType,
        dateOfJoining:
          formData.dateOfJoining || new Date().toISOString().split("T")[0],
        shift: formData.shift,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactNumber: formData.emergencyContactNumber,
        emergencyContactRelation: formData.emergencyContactRelation,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountHolderName: formData.accountHolderName,
        ifscCode: formData.ifscCode,
        basicSalary: formData.basicSalary,
        hoursPerDay: formData.hoursPerDay,
        daysPerWeek: formData.daysPerWeek,
        ratePerHour: formData.ratePerHour,
        status: formData.status,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setEmployees((prev) => [newEmployee, ...prev]);
      showToast("Employee created successfully!", "success");
      setShowCreateModal(false);
    }
    resetForm();
  };

  const handleDeleteEmployee = () => {
    if (selectedEmployee) {
      setEmployees((prev) => prev.filter((e) => e.id !== selectedEmployee.id));
      showToast("Employee deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedEmployee(null);
    }
  };

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case "Full Time":
        return "bg-green-100 text-green-700";
      case "Part Time":
        return "bg-blue-100 text-blue-700";
      case "Contract":
        return "bg-orange-100 text-orange-700";
      case "Temporary":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-red-100 text-red-700";
      case "On Leave":
        return "bg-yellow-100 text-yellow-700";
      case "Terminated":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const SortHeader: React.FC<{ field: SortField; label: string }> = ({
    field,
    label,
  }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-600 cursor-pointer select-none hover:bg-gray-50 whitespace-nowrap"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown
          className={`w-3 h-3 ${sortField === field ? "text-gray-900" : "text-gray-400"}`}
        />
      </div>
    </th>
  );

  const renderStepContent = () => {
    const availableDepartments = formData.branch
      ? departments[formData.branch] || []
      : [];
    const availableDesignations = formData.department
      ? designations[formData.department] || []
      : [];

    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marital Status
                </label>
                <select
                  value={formData.maritalStatus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maritalStatus: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Employment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User
                </label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                  placeholder="Select User"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Note: Company users will be applicable for create employee.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Joining
                </label>
                <input
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfJoining: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shift
                </label>
                <select
                  value={formData.shift}
                  onChange={(e) =>
                    setFormData({ ...formData, shift: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  {shifts.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch *
                </label>
                <select
                  value={formData.branch}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      branch: e.target.value,
                      department: "",
                      designation: "",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="">Select Branch</option>
                  {branches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      employmentType: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  {employmentTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      department: e.target.value,
                      designation: "",
                    })
                  }
                  disabled={!formData.branch}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white disabled:bg-gray-100"
                >
                  <option value="">
                    {formData.branch
                      ? "Select Department"
                      : "Select Branch first"}
                  </option>
                  {availableDepartments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation *
                </label>
                <select
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                  disabled={!formData.department}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white disabled:bg-gray-100"
                >
                  <option value="">
                    {formData.department
                      ? "Select Designation"
                      : "Select Department first"}
                  </option>
                  {availableDesignations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) =>
                    setFormData({ ...formData, addressLine1: e.target.value })
                  }
                  placeholder="Enter Address Line 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) =>
                    setFormData({ ...formData, addressLine2: e.target.value })
                  }
                  placeholder="Enter Address Line 2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="Enter City"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  placeholder="Enter State"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  placeholder="Enter Country"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) =>
                    setFormData({ ...formData, zipCode: e.target.value })
                  }
                  placeholder="Enter Zip Code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact Name *
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContactName: e.target.value,
                    })
                  }
                  placeholder="Enter Emergency Contact Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact Number *
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContactNumber: e.target.value,
                    })
                  }
                  placeholder="+1234567890"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Format: +[country code][phone number]
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact Relation
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactRelation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContactRelation: e.target.value,
                    })
                  }
                  placeholder="e.g., Spouse, Father, Mother"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Banking Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) =>
                    setFormData({ ...formData, bankName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, accountNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={formData.accountHolderName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      accountHolderName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IFSC / Routing Code
                </label>
                <input
                  type="text"
                  value={formData.ifscCode}
                  onChange={(e) =>
                    setFormData({ ...formData, ifscCode: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Hours & Rates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Basic Salary *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={formData.basicSalary || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        basicSalary: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours Per Day
                </label>
                <input
                  type="number"
                  value={formData.hoursPerDay}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hoursPerDay: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Days Per Week
                </label>
                <input
                  type="number"
                  value={formData.daysPerWeek}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      daysPerWeek: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate Per Hour
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.ratePerHour || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ratePerHour: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const CreateEditModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Employee" : "Create Employee"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Fill in the employee details
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetForm();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex gap-2 mb-6 border-b border-gray-200 pb-3">
            {steps.map((step, idx) => (
              <button
                key={step}
                onClick={() => setCurrentStep(idx)}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${currentStep === idx ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                {step}
              </button>
            ))}
          </div>
          {renderStepContent()}
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between gap-3">
          <div>
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
          </div>
          <div className="flex gap-3">
            {currentStep === steps.length - 1 ? (
              <>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEmployee}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {isEditing ? "Update" : "Create"}
                </button>
              </>
            ) : (
              <button
                onClick={() =>
                  setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const ViewModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Employee Details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedEmployee?.firstName} {selectedEmployee?.lastName}
            </p>
          </div>
          <button
            onClick={() => setShowViewModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {selectedEmployee && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-500">Employee ID</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedEmployee.employeeId}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Branch</p>
                <p className="text-sm text-gray-600">
                  {selectedEmployee.branch}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="text-sm text-gray-600">
                  {selectedEmployee.department}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Designation</p>
                <p className="text-sm text-gray-600">
                  {selectedEmployee.designation}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Employment Type</p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getEmploymentTypeColor(selectedEmployee.employmentType)}`}
                >
                  {selectedEmployee.employmentType}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date of Joining</p>
                <p className="text-sm text-gray-600">
                  {selectedEmployee.dateOfJoining}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedEmployee.status)}`}
                >
                  {selectedEmployee.status}
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Personal Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="text-sm text-gray-900">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-600">
                    {selectedEmployee.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-gray-600">
                    {selectedEmployee.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date of Birth</p>
                  <p className="text-sm text-gray-600">
                    {selectedEmployee.dateOfBirth}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Gender</p>
                  <p className="text-sm text-gray-600">
                    {selectedEmployee.gender}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Marital Status</p>
                  <p className="text-sm text-gray-600">
                    {selectedEmployee.maritalStatus}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm text-gray-600">
                    {selectedEmployee.addressLine1}
                    {selectedEmployee.addressLine2 &&
                      `, ${selectedEmployee.addressLine2}`}
                    <br />
                    {selectedEmployee.city}, {selectedEmployee.state}{" "}
                    {selectedEmployee.zipCode}
                    <br />
                    {selectedEmployee.country}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Emergency Contact</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Name:</span>{" "}
                    {selectedEmployee.emergencyContactName}
                    <br />
                    <span className="font-medium">Number:</span>{" "}
                    {selectedEmployee.emergencyContactNumber}
                    <br />
                    <span className="font-medium">Relation:</span>{" "}
                    {selectedEmployee.emergencyContactRelation || "-"}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Banking Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Bank Name</p>
                  <p className="text-sm text-gray-600">
                    {selectedEmployee.bankName || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Account Number</p>
                  <p className="text-sm text-gray-600">
                    {selectedEmployee.accountNumber || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Account Holder</p>
                  <p className="text-sm text-gray-600">
                    {selectedEmployee.accountHolderName || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">IFSC Code</p>
                  <p className="text-sm text-gray-600">
                    {selectedEmployee.ifscCode || "-"}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Hours & Rates
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Basic Salary</p>
                  <p className="text-sm font-medium text-gray-900">
                    {fmtCurrency(selectedEmployee.basicSalary)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Hours Per Day</p>
                  <p className="text-sm text-gray-600">
                    {selectedEmployee.hoursPerDay}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Days Per Week</p>
                  <p className="text-sm text-gray-600">
                    {selectedEmployee.daysPerWeek}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Rate Per Hour</p>
                  <p className="text-sm text-gray-600">
                    {fmtCurrency(selectedEmployee.ratePerHour)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => setShowViewModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={() => {
              setShowViewModal(false);
              if (selectedEmployee) openEditModal(selectedEmployee);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Employee
          </button>
        </div>
      </div>
    </div>
  );

  const DeleteModal = () => (
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
            Delete Employee
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {selectedEmployee?.firstName} {selectedEmployee?.lastName}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteEmployee}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-hidden flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => navigate("/")}
            className="hover:text-gray-700"
          >
            Dashboard
          </button>
          <span>›</span>
          <button
            onClick={() => navigate("/hrm")}
            className="hover:text-gray-700"
          >
            HRM
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Employees</span>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Employees
          </h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Employees..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-80 pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              onClick={() => showToast("Search applied", "info")}
              className="px-4 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
            >
              Search
            </button>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">Filters</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {showFilters && (
                <div className="absolute right-0 top-10 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-3 pb-1.5 mb-1 border-b border-gray-100">
                    <span className="text-xs font-medium text-gray-500">
                      Employment Type
                    </span>
                  </div>
                  <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50">
                    Full Time
                  </button>
                  <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50">
                    Part Time
                  </button>
                  <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50">
                    Contract
                  </button>
                  <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50">
                    Temporary
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="employeeId" label="Employee Id" />
                <SortHeader field="userName" label="Employee Name" />
                <SortHeader field="branch" label="Branch" />
                <SortHeader field="department" label="Department" />
                <SortHeader field="designation" label="Designation" />
                <SortHeader field="employmentType" label="Employment Type" />
                <SortHeader field="dateOfJoining" label="Date Of Joining" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openViewModal(employee)}
                >
                  <td className="px-4 py-3 font-mono text-sm text-gray-900">
                    {employee.employeeId}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                        {employee.firstName.charAt(0)}
                        {employee.lastName.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{employee.branch}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {employee.department}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {employee.designation}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getEmploymentTypeColor(employee.employmentType)}`}
                    >
                      {employee.employmentType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {employee.dateOfJoining}
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openViewModal(employee)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(employee)}
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(employee)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedEmployees.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-sm text-gray-500">
            Showing{" "}
            {filteredEmployees.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredEmployees.length)} of{" "}
            {filteredEmployees.length} results
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
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
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-8 h-8 text-sm rounded-md flex items-center justify-center ${currentPage === pageNumber ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {(showCreateModal || showEditModal) && <CreateEditModal />}
      {showViewModal && <ViewModal />}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
};
