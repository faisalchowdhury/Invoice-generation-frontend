/**
 * File: src/pages/Companies.tsx
 * Companies page - Complete with list and company details
 * Based on Figma screenshots
 */

import React, { useState } from "react";
import { Plus, Edit2, FileText } from "lucide-react";

interface Company {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  mobile: string;
  fax: string;
  website: string;
  billingAddress: string;
  address: string;
  regNo: string;
  taxId: string;
  paymentTermsSales: string;
  paymentTermsPurchase: string;
  financialYear: string;
  currency: string;
  isOwner: boolean;
}

export const Companies: React.FC = () => {
  const [showMobileList, setShowMobileList] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "1",
      businessName: "Info",
      email: "info@invoice@gmail.com",
      phone: "Info",
      mobile: "Info",
      fax: "Info",
      website: "Info",
      billingAddress: "Santa,\nsanta\nBankok,122 Bangladesh",
      address: "",
      regNo: "Info",
      taxId: "Info",
      paymentTermsSales: "Net On Receipt",
      paymentTermsPurchase: "Net On Receipt",
      financialYear: "October",
      currency: "US Dollar (United St...",
      isOwner: true,
    },
    {
      id: "2",
      businessName: "Info",
      email: "info@invoice@gmail.com",
      phone: "Info",
      mobile: "Info",
      fax: "Info",
      website: "Info",
      billingAddress: "Santa,\nsanta\nBankok,122 Bangladesh",
      address: "",
      regNo: "Info",
      taxId: "Info",
      paymentTermsSales: "Net On Receipt",
      paymentTermsPurchase: "Net On Receipt",
      financialYear: "October",
      currency: "US Dollar (United St...",
      isOwner: true,
    },
  ]);

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(
    companies[0],
  );
  const [activeTab, setActiveTab] = useState<"info" | "add">("info");
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<Company>({
    id: "",
    businessName: "Info",
    email: "",
    phone: "Info",
    mobile: "Info",
    fax: "Info",
    website: "Info",
    billingAddress: "",
    address: "",
    regNo: "Info",
    taxId: "Info",
    paymentTermsSales: "Net On Receipt",
    paymentTermsPurchase: "Net On Receipt",
    financialYear: "October",
    currency: "US Dollar (United St...",
    isOwner: false,
  });

  const handleAddCompany = () => {
    setActiveTab("add");
    setIsEditing(false);
    setFormData({
      id: "",
      businessName: "Info",
      email: "",
      phone: "Info",
      mobile: "Info",
      fax: "Info",
      website: "Info",
      billingAddress: "",
      address: "",
      regNo: "Info",
      taxId: "Info",
      paymentTermsSales: "Net On Receipt",
      paymentTermsPurchase: "Net On Receipt",
      financialYear: "October",
      currency: "US Dollar (United St...",
      isOwner: false,
    });
  };

  const handleSaveCompany = () => {
    if (formData.id) {
      // Update existing
      setCompanies(companies.map((c) => (c.id === formData.id ? formData : c)));
      setSelectedCompany(formData);
    } else {
      // Add new
      const newCompany = { ...formData, id: Date.now().toString() };
      setCompanies([...companies, newCompany]);
      setSelectedCompany(newCompany);
    }
    setActiveTab("info");
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (selectedCompany) {
      setFormData(selectedCompany);
      setActiveTab("add");
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setActiveTab("info");
    setIsEditing(false);
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setActiveTab("info");
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FAFBFC] overflow-hidden">
      {/* Mobile Toggle Bar */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2">
        <button
          onClick={() => setShowMobileList(!showMobileList)}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-md px-3 py-1.5"
        >
          {showMobileList ? "← Back to Details" : "☰ View Companies"}
        </button>
      </div>

      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <button className="text-sm font-medium text-gray-900 border-b-2 border-blue-600 pb-2">
            Summary
          </button>
          <div className="flex items-center gap-3">
            <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
              <option>This Year</option>
            </select>
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h18M3 10h18M3 16h18"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* LEFT PANEL - Companies List */}
        <div className={`${showMobileList ? "flex" : "hidden"} lg:flex flex-col w-full lg:w-80 bg-white border-r border-gray-200`}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Companies
            </h2>

            {/* Sort Dropdown */}
            <div>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-600">
                <option>Sort by Name</option>
                <option>Sort by Date</option>
                <option>Sort by Type</option>
              </select>
            </div>
          </div>

          {/* Companies List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {companies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => { handleCompanySelect(company); setShowMobileList(false); }}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedCompany?.id === company.id
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-semibold flex-shrink-0">
                    I
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {company.businessName}
                    </div>
                  </div>
                  {company.isOwner && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      Owner
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleAddCompany}
              className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 mx-auto"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* RIGHT PANEL - Company Details */}
        <div className={`${showMobileList ? "hidden" : "flex"} lg:flex flex-col flex-1 overflow-y-auto bg-white`}>
          <div className="p-4 sm:p-6">
            {/* Tabs */}
            <div className="flex items-center justify-between mb-6 border-b border-gray-200">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "info"
                      ? "text-gray-900 border-blue-600"
                      : "text-gray-500 border-transparent hover:text-gray-700"
                  }`}
                >
                  Info
                </button>
                {(activeTab === "add" || isEditing) && (
                  <button className="pb-3 text-sm font-medium text-gray-900 border-b-2 border-blue-600">
                    Add Companies
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activeTab === "add" || isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveCompany}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <button className="p-2 hover:bg-gray-100 rounded-md">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={handleEdit}
                      className="p-2 hover:bg-gray-100 rounded-md"
                    >
                      <Edit2 className="w-5 h-5 text-gray-600" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Company Details / Form */}
            {activeTab === "info" && selectedCompany ? (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name
                    </label>
                    <div className="text-base text-gray-900">
                      {selectedCompany.businessName}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="w-16 h-16 bg-blue-600 rounded"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <a
                      href={`mailto:${selectedCompany.email}`}
                      className="text-base text-blue-600 hover:underline"
                    >
                      {selectedCompany.email}
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <div className="text-base text-gray-900">
                      {selectedCompany.phone}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile
                    </label>
                    <div className="text-base text-gray-900">
                      {selectedCompany.mobile}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fax
                    </label>
                    <div className="text-base text-gray-900">
                      {selectedCompany.fax}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <div className="text-base text-gray-900">
                      {selectedCompany.website}
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Address
                  </h3>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Billing Address
                    </label>
                    <div className="text-sm text-gray-900 whitespace-pre-line">
                      {selectedCompany.billingAddress}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <div className="text-sm text-gray-600">
                      {selectedCompany.address || "Not specified"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reg No
                      </label>
                      <div className="text-base text-gray-900">
                        {selectedCompany.regNo}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tax ID
                      </label>
                      <div className="text-base text-gray-900">
                        {selectedCompany.taxId}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment teams(sales)
                      </label>
                      <div className="text-base text-gray-900">
                        {selectedCompany.paymentTermsSales}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment teams(purchase)
                      </label>
                      <div className="text-base text-gray-900">
                        {selectedCompany.paymentTermsPurchase}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Star Financial Year
                      </label>
                      <div className="text-base text-gray-900">
                        {selectedCompany.financialYear}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Currency Cards */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-4 bg-blue-600 rounded-lg text-white"
                    >
                      <div className="text-xs mb-1">Currency & Format</div>
                      <div className="text-sm">{selectedCompany.currency}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Add/Edit Form */
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div className="flex justify-end">
                    <div className="w-16 h-16 bg-blue-600 rounded"></div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile
                    </label>
                    <input
                      type="text"
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData({ ...formData, mobile: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fax
                    </label>
                    <input
                      type="text"
                      value={formData.fax}
                      onChange={(e) =>
                        setFormData({ ...formData, fax: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="text"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Address Section */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Address
                  </h3>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Billing Address
                    </label>
                    <textarea
                      rows={3}
                      value={formData.billingAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billingAddress: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reg No
                      </label>
                      <input
                        type="text"
                        value={formData.regNo}
                        onChange={(e) =>
                          setFormData({ ...formData, regNo: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax ID
                      </label>
                      <input
                        type="text"
                        value={formData.taxId}
                        onChange={(e) =>
                          setFormData({ ...formData, taxId: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
