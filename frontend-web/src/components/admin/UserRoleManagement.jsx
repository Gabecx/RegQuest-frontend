import React, { useState } from 'react';
import { Shield } from 'lucide-react';

const UserRoleManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@ustp.edu.ph',
      role: 'Administrator',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria.santos@ustp.edu.ph',
      role: 'Staff',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Juan Dela Cruz',
      email: 'juan.delacruz@ustp.edu.ph',
      role: 'Staff',
      status: 'Inactive',
    },
  ]);

  const handleDeactivateToggle = (id) => {
    setUsers(prevUsers =>
      prevUsers.map(user => {
        if (user.id === id) {
          return {
            ...user,
            status: user.status === 'Active' ? 'Inactive' : 'Active'
          };
        }
        return user;
      })
    );
  };

  const handleChangeRole = (id) => {
    setUsers(prevUsers =>
      prevUsers.map(user => {
        if (user.id === id) {
          const newRole = user.role === 'Administrator' ? 'Staff' : 'Administrator';
          return { ...user, role: newRole };
        }
        return user;
      })
    );
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
                          onClick={() => handleChangeRole(user.id)}
                          className="px-4 py-2 bg-[#00007F] text-white text-xs font-bold rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
                        >
                          Change Role
                        </button>
                        <button
                          onClick={() => handleDeactivateToggle(user.id)}
                          className="px-4 py-2 border border-red-200 text-red-500 bg-white text-xs font-bold rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          Deactivate
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
    </div>
  );
};

export default UserRoleManagement;
