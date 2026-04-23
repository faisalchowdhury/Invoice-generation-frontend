/**
 * File: src/pages/Banking.tsx
 * Banking page - Complete with Add Bank flow
 * Based on Figma screenshots
 */

import React, { useState } from "react";
import { Plus, Building2, Edit2, Trash2, MoreVertical } from "lucide-react";

interface BankAccount {
  id: string;
  accountName: string;
  accountCode: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  accountType: string;
  currency: string;
  notes: string;
}

export const Banking: React.FC = () => {
  const [isEmpty, setIsEmpty] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  const [formData, setFormData] = useState({
    accountName: "",
    accountCode: "",
    accountNumber: "",
    currency: "Default Company",
    bankName: "",
    ifscCode: "",
    accountType: "",
    notes: "",
    isPrimary: false,
  });

  const handleAddBankAccount = () => {
    setShowAddModal(true);
  };

  const handleAddManually = () => {
    setShowAddModal(false);
    setShowManualForm(true);
  };

  const handleAddOnline = () => {
    alert("Add Bank Online - Coming soon!");
  };

  const handleSaveBank = () => {
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      accountName: formData.accountName,
      accountCode: formData.accountCode,
      accountNumber: formData.accountNumber,
      bankName: formData.bankName,
      ifscCode: formData.ifscCode,
      accountType: formData.accountType,
      currency: formData.currency,
      notes: formData.notes,
    };

    setBankAccounts([...bankAccounts, newAccount]);
    setIsEmpty(false);
    setShowManualForm(false);
    setFormData({
      accountName: "",
      accountCode: "",
      accountNumber: "",
      currency: "Default Company",
      bankName: "",
      ifscCode: "",
      accountType: "",
      notes: "",
      isPrimary: false,
    });
  };

  const handleCancel = () => {
    setShowManualForm(false);
    setShowAddModal(false);
  };

  // EMPTY STATE
  if (isEmpty && !showAddModal && !showManualForm) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAFBFC]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <Building2 className="w-28 h-28 text-blue-600" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-semibold text-blue-600 mb-2">
            Add Bank Account(s)
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Add & Manage Bank Accounts
          </p>
          <button
            onClick={handleAddBankAccount}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Bank Account
          </button>
        </div>

        {/* Add Bank Modal - Choose Method */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-8 text-center">
                Add Bank
              </h2>

              <div className="grid grid-cols-2 gap-6">
                {/* Add Bank Online */}
                <button
                  onClick={handleAddOnline}
                  className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Add Bank Online
                  </span>
                </button>

                {/* Add Bank Manually */}
                <button
                  onClick={handleAddManually}
                  className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Add Bank Manually
                  </span>
                </button>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={handleCancel}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // MANUAL FORM OR BANK LIST
  return (
    <div className="flex-1 flex flex-col bg-[#FAFBFC] overflow-hidden">
      {!showManualForm ? (
        <>
          {/* Top Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">Banking</h1>
              <button
                onClick={handleAddBankAccount}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Bank Account
              </button>
            </div>
          </div>

          {/* Bank Accounts List */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Account Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Account Number
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Bank Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      IFSC Code
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bankAccounts.map((account) => (
                    <tr
                      key={account.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {account.accountName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {account.accountNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {account.bankName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {account.ifscCode}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 hover:bg-gray-100 rounded">
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Bank Modal - Choose Method */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-md p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-8 text-center">
                  Add Bank
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  {/* Add Bank Online */}
                  <button
                    onClick={handleAddOnline}
                    className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Add Bank Online
                    </span>
                  </button>

                  {/* Add Bank Manually */}
                  <button
                    onClick={handleAddManually}
                    className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Add Bank Manually
                    </span>
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={handleCancel}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* MANUAL FORM */
        <div className="flex-1 flex items-center justify-center bg-[#FAFBFC] p-6">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            {/* Form Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Add Bank</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancel}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBank}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Account Name"
                    value={formData.accountName}
                    onChange={(e) =>
                      setFormData({ ...formData, accountName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Account Code"
                    value={formData.accountCode}
                    onChange={(e) =>
                      setFormData({ ...formData, accountCode: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accountNumber: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400"
                  />
                </div>
                <div>
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                  >
                    <option value="Default Company">Default Company</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                  <div className="text-xs text-gray-500 mt-1">
                    Please Select your Currency
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Select Bank"
                    value={formData.bankName}
                    onChange={(e) =>
                      setFormData({ ...formData, bankName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="IFSC Code"
                    value={formData.ifscCode}
                    onChange={(e) =>
                      setFormData({ ...formData, ifscCode: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={formData.accountType}
                  onChange={(e) =>
                    setFormData({ ...formData, accountType: e.target.value })
                  }
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-400"
                >
                  <option value="">Select Account Type</option>
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                  <option value="Salary">Salary</option>
                </select>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPrimary}
                    onChange={(e) =>
                      setFormData({ ...formData, isPrimary: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-600"
                  />
                </label>
              </div>

              <div>
                <textarea
                  rows={4}
                  placeholder="Notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
