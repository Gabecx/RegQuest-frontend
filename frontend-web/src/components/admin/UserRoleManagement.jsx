import React, { useState, useEffect } from 'react';
import { Shield, Users } from 'lucide-react';
import api from '../../api/axios';
import '../../styles/AdminRoles.css';

const UserRoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleModalUser, setRoleModalUser] = useState(null);
  const [selectedNewRole, setSelectedNewRole] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/accounts/users/');
      const allUsers = response.data.results || response.data;
      const staffAndAdmin = allUsers.filter(u => u.role === 'staff' || u.role === 'admin' || u.role === 'Administrator' || u.role === 'Staff');
      const formatted = staffAndAdmin.map(u => ({
        ...u,
        name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email,
        role: (u.role === 'admin' || u.role === 'Administrator') ? 'Administrator' : 'Staff',
        status: u.is_active ? 'Active' : 'Inactive'
      }));
      setUsers(formatted);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateToggle = async (id) => {
    try {
      const response = await api.post(`/accounts/users/${id}/toggle_active/`);
      const newStatus = response.data.is_active ? 'Active' : 'Inactive';
      setUsers(prevUsers =>
        prevUsers.map(user => {
          if (user.id === id) {
            return { ...user, status: newStatus };
          }
          return user;
        })
      );
    } catch (err) {
      console.error('Failed to toggle active status:', err);
      alert('Failed to update user status.');
    }
  };

  const openRoleModal = (user) => {
    setRoleModalUser(user);
    setSelectedNewRole(user.role);
  };

  const handleSaveRole = async () => {
    if (!roleModalUser) return;
    const rolePayload = selectedNewRole === 'Administrator' ? 'admin' : 'staff';
    try {
      await api.post(`/accounts/users/${roleModalUser.id}/assign_role/`, { role: rolePayload });
      fetchUsers(); // Refresh list
      setRoleModalUser(null);
    } catch (err) {
      console.error('Failed to assign role:', err);
      alert('Failed to save role. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900">User Role Management</h3>
        <p className="text-sm text-gray-500 font-semibold mt-0.5">Approve and assign staff roles</p>
      </div>

 
      <div className="bg-[#F0F5FA] border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="bg-[#DCE6F5]/60 border border-[#C5D5EB]/50 rounded-2xl p-5 flex items-center space-x-4 mb-6">
          <div className="p-3.5 bg-[#6387E8] text-white rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/10">
            <Shield size={24} />
          </div>
          <div>
            <h4 className="font-extrabold text-[#00007F] text-[15px]">Staff & Role Management</h4>
            <p className="text-[11px] font-bold text-[#64748b] mt-0.5">Set roles and access levels for registrar staff</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-white text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Current Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="py-4 px-6 font-extrabold text-gray-800">
                      {user.name}
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-400">
                      {user.email}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold ${
                        user.role === 'Administrator'
                          ? 'bg-[#FCE7F3] text-[#D01C8B]'
                          : 'bg-[#DBEAFE] text-[#3B82F6]'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold ${
                        user.status === 'Active'
                          ? 'bg-[#DCFCE7] text-[#16A34A]'
                          : 'bg-[#F3F4F6] text-[#6B7280]'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => openRoleModal(user)}
                          className="px-4 py-2 bg-[#00007F] text-white text-xs font-bold rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
                        >
                          Change Role
                        </button>
                        <button
                          onClick={() => handleDeactivateToggle(user.id)}
                          className={`px-4 py-2 border text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                            user.status === 'Active' 
                              ? 'border-red-200 text-red-500 bg-white hover:bg-red-50' 
                              : 'border-green-200 text-green-500 bg-white hover:bg-green-50'
                          }`}
                        >
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── APPROVE ROLE ASSIGNMENT MODAL ──────────────────── */}
      {roleModalUser && (
        <div className="modal-backdrop-overlay" style={{ zIndex: 1000 }}>
          <div className="role-assignment-modal-card">
            <h1>Approve Role Assignment</h1>
            
            <div className="role-modal-user-details-box">
              <span className="role-details-caption">User Details:</span>
              <h2>{roleModalUser.name}</h2>
              <p>{roleModalUser.email}</p>
              <div className="role-modal-current-badge-info">
                Current Role: <strong>{roleModalUser.role}</strong>
              </div>
            </div>

            <p className="role-selection-prompt-text">Select new role to approve:</p>

            <div className="role-options-vertical-stack">
              <div 
                className={`role-selection-option-card ${selectedNewRole === "Administrator" ? "role-card-active-blue" : ""}`}
                onClick={() => setSelectedNewRole("Administrator")}
              >
                <div className="role-card-icon-circle blue-icon-bg">
                  <Shield size={20} color="#4f46e5" />
                </div>
                <div className="role-card-meta-text">
                  <h3>Administrator</h3>
                  <p>Full system access + User role management</p>
                </div>
              </div>

              <div 
                className={`role-selection-option-card ${selectedNewRole === "Staff" ? "role-card-active-blue" : ""}`}
                onClick={() => setSelectedNewRole("Staff")}
              >
                <div className="role-card-icon-circle staff-icon-bg">
                  <Users size={20} color="#2563eb" />
                </div>
                <div className="role-card-meta-text">
                  <h3>Staff</h3>
                  <p>Request processing & Daily operations only</p>
                </div>
              </div>
            </div>

            <div className="role-modal-actions-wrapper">
              <button className="btn-role-cancel" onClick={() => setRoleModalUser(null)}>
                Cancel
              </button>
              <button className="btn-role-save" onClick={handleSaveRole}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserRoleManagement;
