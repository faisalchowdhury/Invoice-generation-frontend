import React, { useState } from "react";
import { X, Plus, ChevronDown } from "lucide-react";

interface Tax {
  id: string;
  name: string;
  rate: string;
  type: string;
  status: "Active" | "Inactive";
}

interface TaxesModalProps {
  onClose: () => void;
}

export const TaxesModal: React.FC<TaxesModalProps> = ({ onClose }) => {
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [sortBy, setSortBy] = useState("Name");
  const [statusFilter, setStatusFilter] = useState("Active");

  const handleAdd = () => {
    const name = `Tax ${taxes.length + 1}`;
    setTaxes((prev) => [
      ...prev,
      { id: Date.now().toString(), name, rate: "0%", type: "Percentage", status: "Active" },
    ]);
  };

  const filtered = taxes.filter(
    (t) => statusFilter === "All" || t.status === statusFilter
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col"
        style={{ maxHeight: "85vh", minHeight: "480px" }}
      >
        {/* Header */}
        <div className="relative flex items-center justify-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute left-4 p-1.5 hover:bg-gray-100 rounded-md text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-base font-semibold text-gray-900">Taxes</h2>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 flex-shrink-0">
          {/* Sort by Name */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none text-sm text-gray-700 border border-gray-300 rounded-full pl-3 pr-7 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option>Name</option>
              <option>Rate</option>
              <option>Type</option>
            </select>
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none select-none pr-1">
              Sort by |&nbsp;
            </span>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
          </div>

          {/* Active filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none text-sm text-gray-700 border border-gray-300 rounded-full pl-3 pr-7 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>All</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto relative">
          {filtered.length === 0 ? (
            <div className="flex-1 flex items-center justify-center h-full min-h-[280px]" />
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((tax) => (
                <div
                  key={tax.id}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tax.name}</p>
                    <p className="text-xs text-gray-500">{tax.type}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-700">{tax.rate}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        tax.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {tax.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FAB */}
          <button
            onClick={handleAdd}
            className="absolute bottom-4 right-4 w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 text-center flex-shrink-0">
          <span className="text-sm text-gray-400">
            {filtered.length === 0 ? "No Records" : `${filtered.length} record${filtered.length > 1 ? "s" : ""}`}
          </span>
        </div>
      </div>
    </div>
  );
};
