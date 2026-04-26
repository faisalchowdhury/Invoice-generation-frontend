import React, { useState } from "react";
import { showToast } from "../../utils/toast";
import {
  Search, Plus, Edit, Trash2, MoreVertical, Copy, Archive, Columns, CheckCircle,
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  sac: string;
  unitType: string;
  rate: number;
  tax: string;
  description: string;
  currency: string;
  amount: string;
}

const sampleServices: Service[] = [
  { id: "1", name: "Consulting", sac: "998313", unitType: "Hour", rate: 150, tax: "Default Taxes (Services)", description: "Professional consulting services", currency: "$USD", amount: "$5000" },
  { id: "2", name: "Design Work", sac: "998314", unitType: "Hour", rate: 120, tax: "Default Taxes (Services)", description: "UI/UX and graphic design services", currency: "$USD", amount: "$3600" },
  { id: "3", name: "Development", sac: "998315", unitType: "Hour", rate: 200, tax: "Default Taxes (Services)", description: "Software development services", currency: "$USD", amount: "$8000" },
];

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>(sampleServices);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<Service>(sampleServices[0]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);
  const [formData, setFormData] = useState<Service>(sampleServices[0]);

  const handleInputChange = (field: keyof Service, value: any) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (isEditing) {
      setServices((prev) => prev.map((s) => (s.id === formData.id ? formData : s)));
      setSelectedService(formData);
      showToast("Service updated!", "success");
    } else {
      const newService = { ...formData, id: Date.now().toString() };
      setServices((prev) => [...prev, newService]);
      setSelectedService(newService);
      showToast("Service created!", "success");
    }
    setShowForm(false);
  };

  const handleEdit = () => { setFormData(selectedService); setIsEditing(true); setShowForm(true); setShowMobileList(false); };
  const handleCreate = () => { setFormData({ id: "", name: "", sac: "", unitType: "Hour", rate: 0, tax: "Default Taxes (Services)", description: "", currency: "$USD", amount: "$0" }); setIsEditing(false); setShowForm(true); setShowMobileList(false); };
  const handleCancel = () => setShowForm(false);

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h2 className="text-lg font-semibold text-gray-900">{showForm ? (isEditing ? "Edit Service" : "New Service") : "Services"}</h2>
            {!showForm && (<><h3 className="text-lg font-medium text-gray-700">{selectedService.name}</h3><span className="text-sm text-gray-500">{selectedService.sac ? `SAC: ${selectedService.sac}` : ""}</span></>)}
          </div>
          {showForm ? (
            <div className="flex items-center gap-2">
              <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">Save</button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2 relative">
              <button onClick={() => showToast("Added to favorites!", "success")} className="p-2 hover:bg-gray-100 rounded-md"><CheckCircle className="w-5 h-5 text-gray-600" /></button>
              <button onClick={() => showToast("Column settings coming soon", "info")} className="p-2 hover:bg-gray-100 rounded-md"><Columns className="w-5 h-5 text-gray-600" /></button>
              <button onClick={handleEdit} className="p-2 hover:bg-gray-100 rounded-md"><Edit className="w-5 h-5 text-gray-600" /></button>
              <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="p-2 hover:bg-gray-100 rounded-md"><MoreVertical className="w-5 h-5 text-gray-600" /></button>
              {showMoreMenu && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <button onClick={() => { const dup = { ...selectedService, id: Date.now().toString(), name: `${selectedService.name} (Copy)` }; setServices(prev => [...prev, dup]); showToast("Duplicated!", "success"); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Copy className="w-4 h-4" /> Duplicate</button>
                  <button onClick={() => { showToast("Service archived!", "info"); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Archive className="w-4 h-4" /> Archive</button>
                  <div className="border-t border-gray-200 my-1" />
                  <button onClick={() => { setServices(prev => prev.filter(s => s.id !== selectedService.id)); if (services.length > 1) setSelectedService(services.find(s => s.id !== selectedService.id) || services[0]); showToast("Service deleted!", "info"); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2">
        <button onClick={() => setShowMobileList(!showMobileList)} className="flex items-center gap-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-md px-3 py-1.5">
          {showMobileList ? "← Back to Details" : "☰ View Services"}
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex">
        <div className={`${showMobileList ? "flex" : "hidden"} lg:flex flex-col w-full lg:w-64 bg-white border-r border-gray-200`}>
          <div className="p-3 border-b border-gray-200">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search services" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredServices.map((service) => (
              <div key={service.id} onClick={() => { setSelectedService(service); setShowForm(false); setShowMobileList(false); }} className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${selectedService?.id === service.id && !showForm ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-xs font-medium">{service.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{service.name}</div>
                    <div className="text-xs text-gray-500">Rate: ${service.rate}/{service.unitType}</div>
                  </div>
                </div>
                {service.sac && <div className="text-xs text-gray-400 mt-1 ml-11">SAC: {service.sac}</div>}
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200"><button onClick={handleCreate} className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 mx-auto"><Plus className="w-6 h-6" /></button></div>
          <div className="p-4 border-t border-gray-200 text-center">
            <div className="text-xl font-semibold text-gray-900">{services.length}</div>
            <div className="text-xs text-gray-500">Services</div>
          </div>
        </div>

        <div className={`${showMobileList ? "hidden" : "flex"} lg:flex flex-col flex-1 overflow-y-auto p-4 sm:p-6`}>
          {showForm ? (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Service Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Service Name <span className="text-red-500">*</span></label><input type="text" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">SAC Code</label><input type="text" value={formData.sac} onChange={(e) => handleInputChange("sac", e.target.value)} placeholder="Service Accounting Code" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label><select value={formData.unitType} onChange={(e) => handleInputChange("unitType", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"><option>Hour</option><option>Day</option><option>Week</option><option>Month</option><option>Fixed</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Rate <span className="text-red-500">*</span></label><input type="number" value={formData.rate} onChange={(e) => handleInputChange("rate", parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Tax</label><select value={formData.tax} onChange={(e) => handleInputChange("tax", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"><option>Default Taxes (Services)</option><option>No Tax</option><option>5%</option><option>10%</option><option>18%</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Currency</label><select value={formData.currency} onChange={(e) => handleInputChange("currency", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"><option>$USD</option><option>€EUR</option><option>£GBP</option></select></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea rows={3} value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
              </div>
              <div className="flex justify-end gap-2 pt-6 border-t border-gray-200">
                <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">Save Service</button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex items-start gap-4 mb-6 pb-4 border-b border-gray-200">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-2xl font-bold">{selectedService.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedService.name}</h3>
                  {selectedService.sac && <p className="text-sm text-gray-500">SAC: {selectedService.sac}</p>}
                  <p className="text-sm text-gray-600 mt-1">{selectedService.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-500 mb-1">Rate</div>
                  <div className="text-2xl font-bold text-blue-600">${selectedService.rate}</div>
                  <div className="text-xs text-gray-500">per {selectedService.unitType}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-500 mb-1">Unit Type</div>
                  <div className="text-lg font-semibold text-gray-900">{selectedService.unitType}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-500 mb-1">Currency</div>
                  <div className="text-lg font-semibold text-gray-900">{selectedService.currency}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div><label className="text-xs text-gray-500 block mb-1">Tax Configuration</label><p className="text-sm text-gray-900">{selectedService.tax}</p></div>
                <div><label className="text-xs text-gray-500 block mb-1">Description</label><p className="text-sm text-gray-900">{selectedService.description || "—"}</p></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
