/**
 * File: src/pages/Services.tsx
 * Complete Services page with all features
 */

import React, { useState } from "react";
import {
  Search,
  MoreVertical,
  Plus,
  Edit2,
  Settings,
  Edit,
  Copy,
  Trash2,
  Check,
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  sac: string;
  quantity: string;
  unitType: string;
  rate: string;
  tax: string;
  description: string;
  amount: string;
}

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Service name",
      sac: "SAC",
      quantity: "01",
      unitType: "",
      rate: "$234443",
      tax: "Default Taxes (Services)",
      description: "",
      amount: "$5000",
    },
    {
      id: "2",
      name: "Ritat",
      sac: "hdjfj",
      quantity: "01",
      unitType: "",
      rate: "$8000",
      tax: "Default Taxes (Services)",
      description: "",
      amount: "$5000",
    },
    {
      id: "3",
      name: "Ritat",
      sac: "hdjfj",
      quantity: "01",
      unitType: "",
      rate: "$5000",
      tax: "Default Taxes (Services)",
      description: "",
      amount: "$5000",
    },
    {
      id: "4",
      name: "Ritat",
      sac: "hdjfj",
      quantity: "01",
      unitType: "",
      rate: "$5000",
      tax: "Default Taxes (Services)",
      description: "",
      amount: "$5000",
    },
    {
      id: "5",
      name: "Ritat",
      sac: "hdjfj",
      quantity: "01",
      unitType: "",
      rate: "$5000",
      tax: "Default Taxes (Services)",
      description: "",
      amount: "$5000",
    },
  ]);

  const [selectedService, setSelectedService] = useState<Service | null>(
    services[0],
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleServiceSelection = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId);
      return (
        total + (service ? parseFloat(service.amount.replace(/[$,]/g, "")) : 0)
      );
    }, 0);
  };

  return (
    <div className="h-full flex bg-[#FAFBFC]">
      {/* Left Panel - Services List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Products</h2>
            <div className="flex items-center gap-2">
              {isSelectionMode ? (
                <>
                  <button
                    onClick={() => alert("Sort")}
                    className="p-1.5 hover:bg-gray-100 rounded"
                  >
                    <Search className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => alert("Copy")}
                    className="p-1.5 hover:bg-gray-100 rounded"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => alert("Delete")}
                    className="p-1.5 hover:bg-gray-100 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => {
                      setIsSelectionMode(false);
                      setSelectedServices([]);
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded"
                  >
                    <Check className="w-4 h-4 text-gray-600" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => alert("Search")}
                    className="p-1.5 hover:bg-gray-100 rounded"
                  >
                    <Search className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="p-1.5 hover:bg-gray-100 rounded"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="p-1.5 hover:bg-gray-100 rounded relative"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-gray-600">Sort by</span>
            <select className="px-2 py-1 border border-gray-200 rounded text-gray-700">
              <option>Date</option>
              <option>Name</option>
            </select>
            <select className="px-2 py-1 border border-gray-200 rounded text-gray-700">
              <option>Status</option>
              <option>All</option>
            </select>
            <select className="px-2 py-1 border border-gray-200 rounded text-gray-700">
              <option>Customer / All</option>
            </select>
            <button className="px-2 py-1 border border-gray-200 rounded text-gray-700">
              Date Range
            </button>
            {!isSelectionMode && (
              <button className="px-2 py-1 border border-gray-200 rounded text-gray-700">
                Custom
              </button>
            )}
          </div>
        </div>

        {/* Services List */}
        <div className="flex-1 overflow-y-auto">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => !isSelectionMode && setSelectedService(service)}
              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedService?.id === service.id && !isSelectionMode
                  ? "bg-blue-50"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {isSelectionMode && (
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.id)}
                    onChange={() => toggleServiceSelection(service.id)}
                    className="mt-1"
                  />
                )}
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {service.name}
                    </span>
                    {service.sac !== "SAC" && (
                      <div className="text-xs text-gray-500 mt-1">
                        {service.sac}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {service.amount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {isSelectionMode && selectedServices.length > 0 ? (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="text-center mb-2">
              <div className="text-lg font-semibold text-gray-900">
                {selectedServices.length}Service selected
              </div>
              <div className="text-sm text-gray-600">
                Total{" "}
                <span className="font-medium">
                  ${calculateTotal().toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-t border-gray-200 flex justify-center">
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        )}

        {services.length > 0 && (
          <div className="p-4 border-t border-gray-200 text-center">
            <div className="text-lg font-semibold text-gray-900">$80.00</div>
            <div className="text-xs text-gray-500">1 Proforma Invoices</div>
          </div>
        )}
      </div>

      {/* Right Panel - Service Details/Form */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedService || showCreateForm || showEditForm ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Summary</span>
                <select className="px-3 py-1 border border-gray-200 rounded text-sm">
                  <option>This Year</option>
                  <option>This Month</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {showCreateForm || showEditForm
                      ? "Products"
                      : selectedService?.name || "Service Name"}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  {showCreateForm || showEditForm ? (
                    <>
                      <button
                        onClick={() => alert("Settings")}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Settings className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => {
                          setShowCreateForm(false);
                          setShowEditForm(false);
                        }}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          alert("Saved as Draft!");
                          setShowCreateForm(false);
                          setShowEditForm(false);
                        }}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                      >
                        Save as Draft
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => alert("Search")}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Search className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => setShowEditForm(true)}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        className="p-2 hover:bg-gray-100 rounded relative"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                        {showMoreMenu && (
                          <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                              Duplicate
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-gray-50">
                              Archive
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50">
                              Delete
                            </button>
                          </div>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Details
                </h3>

                {/* Service Name & SAC */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Service Name
                    </label>
                    <input
                      type="text"
                      placeholder="Service name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      defaultValue={selectedService?.name}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      SAC
                    </label>
                    <input
                      type="text"
                      placeholder="SAC"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      defaultValue={selectedService?.sac}
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Quantity
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="text"
                        placeholder="01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        defaultValue={selectedService?.quantity}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Unit Type
                      </label>
                      <input
                        type="text"
                        placeholder="Unit Type"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        defaultValue={selectedService?.unitType}
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing & Tax */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Pricing & Tax
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Rate
                      </label>
                      <input
                        type="text"
                        placeholder="$234443"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        defaultValue={selectedService?.rate}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Default Taxes (Services)
                      </label>
                      <input
                        type="text"
                        placeholder="Default Taxes (Services)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        defaultValue={selectedService?.tax}
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Description
                  </h3>
                  <textarea
                    rows={8}
                    placeholder="Notes"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    defaultValue={selectedService?.description}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a service to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};
