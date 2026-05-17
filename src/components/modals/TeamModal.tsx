import React, { useState } from "react";

interface Member {
  id: string;
  email: string;
  role: string;
}

interface TeamModalProps {
  onClose: () => void;
  companyEmail?: string;
}

export const TeamModal: React.FC<TeamModalProps> = ({ onClose, companyEmail = "info@inovoic.com" }) => {
  const [members, setMembers] = useState<Member[]>([
    { id: "1", email: companyEmail, role: "Owner" },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Member");

  const handleAdd = () => {
    if (!newEmail.trim()) return;
    setMembers((prev) => [
      ...prev,
      { id: Date.now().toString(), email: newEmail.trim(), role: newRole },
    ]);
    setNewEmail("");
    setNewRole("Member");
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col"
        style={{ maxHeight: "80vh", minHeight: "420px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-900">Team</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Close
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-5 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>

        {/* Add form */}
        {showAddForm && (
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex-shrink-0 space-y-3">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email address"
              autoFocus
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="flex items-center gap-3">
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option>Member</option>
                <option>Admin</option>
                <option>Viewer</option>
                <option>Accountant</option>
              </select>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                Invite
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Members list */}
        <div className="flex-1 overflow-y-auto">
          {members.map((member, idx) => (
            <div key={member.id}>
              <div className="px-6 py-4">
                <p className="text-sm font-semibold text-gray-900">{member.email}</p>
                <p className="text-sm text-gray-500 mt-0.5">{member.role}</p>
              </div>
              {idx < members.length - 1 && (
                <div className="border-b border-gray-200 mx-6" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
