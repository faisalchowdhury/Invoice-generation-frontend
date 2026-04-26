import React, { useState } from "react";
import { showToast } from "../../utils/toast";
import {
  Search, Plus, Edit, Trash2, MoreVertical, Copy, Eye,
  Printer, Mail, X, Calendar, CheckCircle, Send, Columns, DollarSign, Users,
} from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  status: "Draft" | "Approved" | "Cancelled";
  amount: string;
  date: string;
  taxId: string;
  currency: string;
  notes: string;
}

const sampleVendors: Vendor[] = [
  { id: "1", name: "Ritat", companyName: "Ritat Corp", email: "info@gmail.com", phone: "0238393884", mobile: "8984934838", address: "Santa, santa Bankok, 122 Bangladesh", status: "Draft", amount: "$5000", date: "23 4:25 PM", taxId: "TX001", currency: "$USD", notes: "" },
  { id: "2", name: "Footwear Inc", companyName: "Footwear Inc", email: "contact@footwear.com", phone: "0238393885", mobile: "8984934839", address: "123 Main St, New York", status: "Approved", amount: "$3200", date: "15 Jun 26", taxId: "TX002", currency: "$USD", notes: "" },
  { id: "3", name: "Spark Tech Agency", companyName: "Spark Tech", email: "info@sparktech.com", phone: "0238393886", mobile: "8984934840", address: "456 Commerce Ave", status: "Approved", amount: "$8000", date: "10 Jul 26", taxId: "TX003", currency: "$USD", notes: "" },
];

export const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>(sampleVendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<Vendor>(sampleVendors[0]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "details">("overview");
  const [formData, setFormData] = useState<Vendor>(sampleVendors[0]);

  const handleInputChange = (field: keyof Vendor, value: any) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (isEditing) {
      setVendors((prev) => prev.map((v) => (v.id === formData.id ? formData : v)));
      setSelectedVendor(formData);
      showToast("Vendor updated!", "success");
    } else {
      const newVendor = { ...formData, id: Date.now().toString() };
      setVendors((prev) => [...prev, newVendor]);
      setSelectedVendor(newVendor);
      showToast("Vendor created!", "success");
    }
    setShowForm(false);
  };

  const handleEdit = () => { setFormData(selectedVendor); setIsEditing(true); setShowForm(true); setShowMobileList(false); };
  const handleCreate = () => { setFormData({ id: "", name: "", companyName: "", email: "", phone: "", mobile: "", address: "", status: "Draft", amount: "$0", date: "", taxId: "", currency: "$USD", notes: "" }); setIsEditing(false); setShowForm(true); setShowMobileList(false); };
  const handleCancel = () => setShowForm(false);

  const filteredVendors = vendors.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft": return "bg-gray-100 text-gray-700";
      case "Approved": return "bg-green-100 text-green-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-hidden flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-6"><button className="text-sm font-medium text-gray-900 border-b-2 border-blue-600 pb-2">Summary</button></div>
          <div className="flex items-center gap-3">
            <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white"><option>This Year</option><option>This Month</option></select>
            <button className="p-1.5 hover:bg-gray-100 rounded"><svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 10h18M3 16h18" /></svg></button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <h2 className="text-lg font-semibold text-gray-900">{showForm ? (isEditing ? "Edit Vendor" : "New Vendor") : "Vendors"}</h2>
            {!showForm && (<><h3 className="text-lg font-medium text-gray-700">{selectedVendor.name}</h3><span className="text-sm text-gray-500">{selectedVendor.email}</span></>)}
          </div>
          {showForm ? (
            <div className="flex items-center gap-2">
              <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">Save</button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2 relative">
              <button onClick={() => showToast("Column settings coming soon", "info")} className="p-2 hover:bg-gray-100 rounded-md"><Columns className="w-5 h-5 text-gray-600" /></button>
              <button onClick={handleEdit} className="p-2 hover:bg-gray-100 rounded-md"><Edit className="w-5 h-5 text-gray-600" /></button>
              <button onClick={() => showToast("Email sent!", "success")} className="p-2 hover:bg-gray-100 rounded-md"><Mail className="w-5 h-5 text-gray-600" /></button>
              <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="p-2 hover:bg-gray-100 rounded-md"><MoreVertical className="w-5 h-5 text-gray-600" /></button>
              {showMoreMenu && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <button onClick={() => { showToast("Statement generated!", "info"); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Vendor Statement</button>
                  <button onClick={() => { const dup = { ...selectedVendor, id: Date.now().toString(), name: `${selectedVendor.name} (Copy)` }; setVendors(prev => [...prev, dup]); showToast("Duplicated!", "success"); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Copy className="w-4 h-4" /> Duplicate</button>
                  <div className="border-t border-gray-200 my-1" />
                  <button onClick={() => { setVendors(prev => prev.filter(v => v.id !== selectedVendor.id)); if (vendors.length > 1) setSelectedVendor(vendors.find(v => v.id !== selectedVendor.id) || vendors[0]); showToast("Vendor deleted!", "info"); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2">
        <button onClick={() => setShowMobileList(!showMobileList)} className="flex items-center gap-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-md px-3 py-1.5">
          {showMobileList ? "← Back to Details" : "☰ View Vendors"}
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex">
        <div className={`${showMobileList ? "flex" : "hidden"} lg:flex flex-col w-full lg:w-64 bg-white border-r border-gray-200`}>
          <div className="p-3 border-b border-gray-200">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search vendors" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredVendors.map((vendor) => (
              <div key={vendor.id} onClick={() => { setSelectedVendor(vendor); setShowForm(false); setShowMobileList(false); }} className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${selectedVendor?.id === vendor.id && !showForm ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-sm font-medium">{vendor.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{vendor.name}</div>
                    <div className="text-xs text-gray-500 truncate">{vendor.email}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200"><button onClick={handleCreate} className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 mx-auto"><Plus className="w-6 h-6" /></button></div>
          <div className="p-4 border-t border-gray-200 text-center">
            <div className="text-xl font-semibold text-gray-900">{vendors.length}</div>
            <div className="text-xs text-gray-500">Vendors</div>
          </div>
        </div>

        <div className={`${showMobileList ? "hidden" : "flex"} lg:flex flex-col flex-1 overflow-y-auto p-4 sm:p-6`}>
          {showForm ? (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Vendor Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label><input type="text" value={formData.companyName} onChange={(e) => handleInputChange("companyName", e.target.value)} placeholder="Company name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Display Name <span className="text-red-500">*</span></label><input type="text" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="Vendor name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Tax ID</label><input type="text" value={formData.taxId} onChange={(e) => handleInputChange("taxId", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label><input type="text" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label><input type="text" value={formData.mobile} onChange={(e) => handleInputChange("mobile", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Currency</label><select value={formData.currency} onChange={(e) => handleInputChange("currency", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"><option>$USD</option><option>€EUR</option><option>£GBP</option></select></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><textarea rows={2} value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea rows={3} value={formData.notes} onChange={(e) => handleInputChange("notes", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
              </div>
              <div className="flex justify-end gap-2 pt-6 border-t border-gray-200">
                <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">Save Vendor</button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Tabs */}
              <div className="border-b border-gray-200 px-6">
                <div className="flex gap-6">
                  {(["overview", "details"] as const).map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}>{tab}</button>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {activeTab === "overview" && (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 pb-4 border-b border-gray-200">
                      <div className="text-center"><div className="text-xs text-gray-500 mb-1">Outstanding</div><div className="text-lg font-semibold text-red-600">-$5,000</div></div>
                      <div className="text-center"><div className="text-xs text-gray-500 mb-1">Net Profit</div><div className="text-lg font-semibold text-gray-900">$12,000</div></div>
                      <div className="text-center"><div className="text-xs text-gray-500 mb-1">Total Bills</div><div className="text-lg font-semibold text-gray-900">$8,200</div></div>
                      <div className="text-center"><div className="text-xs text-gray-500 mb-1">Paid</div><div className="text-lg font-semibold text-green-600">$3,200</div></div>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Bills</h4>
                    <div className="space-y-2">
                      {[{ ref: "Bill #001", status: "Approved", amount: "$2,000", date: "Jun 26" }, { ref: "Bill #002", status: "Draft", amount: "$3,000", date: "Jul 26" }].map((bill, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-md">
                          <div><div className="text-sm font-medium text-gray-900">{bill.ref}</div><div className="text-xs text-gray-500">{bill.date}</div></div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${bill.status === "Approved" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{bill.status}</span>
                            <span className="text-sm font-medium text-gray-900">{bill.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {activeTab === "details" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div><label className="text-xs text-gray-500 block mb-1">Company Name</label><p className="text-sm text-gray-900">{selectedVendor.companyName}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Display Name</label><p className="text-sm text-gray-900">{selectedVendor.name}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Email</label><p className="text-sm text-gray-900">{selectedVendor.email}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Tax ID</label><p className="text-sm text-gray-900">{selectedVendor.taxId}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Business Phone</label><p className="text-sm text-gray-900">{selectedVendor.phone}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Mobile</label><p className="text-sm text-gray-900">{selectedVendor.mobile}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Currency</label><p className="text-sm text-gray-900">{selectedVendor.currency}</p></div>
                    <div className="sm:col-span-2"><label className="text-xs text-gray-500 block mb-1">Address</label><p className="text-sm text-gray-900">{selectedVendor.address}</p></div>
                    <div className="sm:col-span-2"><label className="text-xs text-gray-500 block mb-1">Notes</label><p className="text-sm text-gray-900">{selectedVendor.notes || "—"}</p></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
