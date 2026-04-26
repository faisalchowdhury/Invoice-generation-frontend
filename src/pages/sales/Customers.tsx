import React, { useState } from "react";
import { showToast } from "../../utils/toast";
import {
  Search, Plus, Edit, Trash2, MoreVertical, Copy, Mail, Columns, CheckCircle,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  companyName: string;
  email: string;
  businessPhone: string;
  taxId: string;
  mobile: string;
  billingAddress: string;
  billingCity: string;
  billingCountry: string;
  shippingAddress: string;
  currency: string;
  paymentTerms: string;
  notes: string;
  outstanding: number;
  netProfit: number;
  sales: number;
  profit: number;
}

const sampleCustomers: Customer[] = [
  {
    id: "1", name: "Spark Tech Agency", companyName: "Spark Tech Agency", email: "info@sparktech.com",
    businessPhone: "3/1/2026", taxId: "TX001", mobile: "023330330", billingAddress: "Santa, santa",
    billingCity: "Bankok, 122 Bangladesh", billingCountry: "Bangladesh", shippingAddress: "Same as billing",
    currency: "$USD", paymentTerms: "Net 30", notes: "", outstanding: -134720, netProfit: 134720, sales: -4720, profit: 34720,
  },
  {
    id: "2", name: "Tech Corp", companyName: "Tech Corp Ltd", email: "contact@techcorp.com",
    businessPhone: "0238393884", taxId: "TX002", mobile: "8984934838", billingAddress: "123 Main St",
    billingCity: "New York", billingCountry: "USA", shippingAddress: "456 Delivery Ave, NY",
    currency: "$USD", paymentTerms: "Net 15", notes: "VIP customer", outstanding: 5500, netProfit: 22000, sales: 15000, profit: 7000,
  },
];

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(sampleCustomers[0]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "settings">("overview");
  const [formData, setFormData] = useState<Customer>(sampleCustomers[0]);

  const handleInputChange = (field: keyof Customer, value: any) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (isEditing) {
      setCustomers((prev) => prev.map((c) => (c.id === formData.id ? formData : c)));
      setSelectedCustomer(formData);
      showToast("Customer updated!", "success");
    } else {
      const newCustomer = { ...formData, id: Date.now().toString() };
      setCustomers((prev) => [...prev, newCustomer]);
      setSelectedCustomer(newCustomer);
      showToast("Customer created!", "success");
    }
    setShowForm(false);
  };

  const handleEdit = () => { setFormData(selectedCustomer); setIsEditing(true); setShowForm(true); setShowMobileList(false); };
  const handleCreate = () => { setFormData({ id: "", name: "", companyName: "", email: "", businessPhone: "", taxId: "", mobile: "", billingAddress: "", billingCity: "", billingCountry: "", shippingAddress: "", currency: "$USD", paymentTerms: "Net 30", notes: "", outstanding: 0, netProfit: 0, sales: 0, profit: 0 }); setIsEditing(false); setShowForm(true); setShowMobileList(false); };
  const handleCancel = () => setShowForm(false);

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h2 className="text-lg font-semibold text-gray-900">{showForm ? (isEditing ? "Edit Customer" : "New Customer") : "Customers"}</h2>
            {!showForm && (<><h3 className="text-lg font-medium text-gray-700">{selectedCustomer.name}</h3><span className="text-sm text-gray-500">{selectedCustomer.email}</span></>)}
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
                <div className="absolute right-0 top-12 w-52 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <button onClick={() => { showToast("Statement generated!", "info"); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Customer Statement</button>
                  <button onClick={() => { const dup = { ...selectedCustomer, id: Date.now().toString(), name: `${selectedCustomer.name} (Copy)`, email: "" }; setCustomers(prev => [...prev, dup]); showToast("Duplicated!", "success"); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Copy className="w-4 h-4" /> Duplicate</button>
                  <div className="border-t border-gray-200 my-1" />
                  <button onClick={() => { setCustomers(prev => prev.filter(c => c.id !== selectedCustomer.id)); if (customers.length > 1) setSelectedCustomer(customers.find(c => c.id !== selectedCustomer.id) || customers[0]); showToast("Customer deleted!", "info"); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2">
        <button onClick={() => setShowMobileList(!showMobileList)} className="flex items-center gap-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-md px-3 py-1.5">
          {showMobileList ? "← Back to Details" : "☰ View Customers"}
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex">
        <div className={`${showMobileList ? "flex" : "hidden"} lg:flex flex-col w-full lg:w-64 bg-white border-r border-gray-200`}>
          <div className="p-3 border-b border-gray-200">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search customers" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} onClick={() => { setSelectedCustomer(customer); setShowForm(false); setShowMobileList(false); }} className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${selectedCustomer?.id === customer.id && !showForm ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-sm font-medium">{customer.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{customer.name}</div>
                    <div className="text-xs text-gray-500 truncate">{customer.email}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200"><button onClick={handleCreate} className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 mx-auto"><Plus className="w-6 h-6" /></button></div>
          <div className="p-4 border-t border-gray-200 text-center">
            <div className="text-xl font-semibold text-gray-900">{customers.length}</div>
            <div className="text-xs text-gray-500">Customers</div>
          </div>
        </div>

        <div className={`${showMobileList ? "hidden" : "flex"} lg:flex flex-col flex-1 overflow-y-auto p-4 sm:p-6`}>
          {showForm ? (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Customer Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label><input type="text" value={formData.companyName} onChange={(e) => handleInputChange("companyName", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Display Name <span className="text-red-500">*</span></label><input type="text" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Tax ID</label><input type="text" value={formData.taxId} onChange={(e) => handleInputChange("taxId", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label><input type="text" value={formData.businessPhone} onChange={(e) => handleInputChange("businessPhone", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label><input type="text" value={formData.mobile} onChange={(e) => handleInputChange("mobile", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Currency</label><select value={formData.currency} onChange={(e) => handleInputChange("currency", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"><option>$USD</option><option>€EUR</option><option>£GBP</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label><select value={formData.paymentTerms} onChange={(e) => handleInputChange("paymentTerms", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"><option>Net 15</option><option>Net 30</option><option>Net 60</option><option>Due on Receipt</option></select></div>
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Billing Address</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label><input type="text" value={formData.billingAddress} onChange={(e) => handleInputChange("billingAddress", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">City / State</label><input type="text" value={formData.billingCity} onChange={(e) => handleInputChange("billingCity", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Country</label><input type="text" value={formData.billingCountry} onChange={(e) => handleInputChange("billingCountry", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label><input type="text" value={formData.shippingAddress} onChange={(e) => handleInputChange("shippingAddress", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
              </div>
              <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea rows={3} value={formData.notes} onChange={(e) => handleInputChange("notes", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
              <div className="flex justify-end gap-2 pt-6 border-t border-gray-200">
                <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">Save Customer</button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="border-b border-gray-200 px-6">
                <div className="flex gap-6">
                  {(["overview", "details", "settings"] as const).map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}>{tab}</button>
                  ))}
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {activeTab === "overview" && (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 pb-4 border-b border-gray-200">
                      <div className="text-center"><div className="text-xs text-gray-500 mb-1">Outstanding</div><div className="text-lg font-semibold text-red-600">${selectedCustomer.outstanding.toLocaleString()}</div></div>
                      <div className="text-center"><div className="text-xs text-gray-500 mb-1">Net Profit</div><div className="text-lg font-semibold text-gray-900">${selectedCustomer.netProfit.toLocaleString()}</div></div>
                      <div className="text-center"><div className="text-xs text-gray-500 mb-1">Sales</div><div className="text-lg font-semibold text-gray-900">${selectedCustomer.sales.toLocaleString()}</div></div>
                      <div className="text-center"><div className="text-xs text-gray-500 mb-1">Profit</div><div className="text-lg font-semibold text-green-600">${selectedCustomer.profit.toLocaleString()}</div></div>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Invoices</h4>
                    <div className="space-y-2">
                      {[{ ref: "Invoice #001", status: "Approved", amount: "$5,000", date: "Jul 26" }, { ref: "Invoice #002", status: "Draft", amount: "$2,200", date: "Aug 26" }].map((inv, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-md">
                          <div><div className="text-sm font-medium text-gray-900">{inv.ref}</div><div className="text-xs text-gray-500">{inv.date}</div></div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${inv.status === "Approved" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{inv.status}</span>
                            <span className="text-sm font-medium text-gray-900">{inv.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {activeTab === "details" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div><label className="text-xs text-gray-500 block mb-1">Company Name</label><p className="text-sm text-gray-900">{selectedCustomer.companyName}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Display Name</label><p className="text-sm text-gray-900">{selectedCustomer.name}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Email</label><p className="text-sm text-gray-900">{selectedCustomer.email}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Tax ID</label><p className="text-sm text-gray-900">{selectedCustomer.taxId}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Business Phone</label><p className="text-sm text-gray-900">{selectedCustomer.businessPhone}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Mobile</label><p className="text-sm text-gray-900">{selectedCustomer.mobile}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Billing Address</label><p className="text-sm text-gray-900">{selectedCustomer.billingAddress}, {selectedCustomer.billingCity}, {selectedCustomer.billingCountry}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Shipping Address</label><p className="text-sm text-gray-900">{selectedCustomer.shippingAddress}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Notes</label><p className="text-sm text-gray-900">{selectedCustomer.notes || "—"}</p></div>
                  </div>
                )}
                {activeTab === "settings" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div><label className="text-xs text-gray-500 block mb-1">Currency</label><p className="text-sm text-gray-900">{selectedCustomer.currency}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Payment Terms</label><p className="text-sm text-gray-900">{selectedCustomer.paymentTerms}</p></div>
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
