import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import api from "../../api/axios";
import "../../styles/AdminRoles.css";

const IconUsers = ({ size = 20, color = "#666" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconShield = ({ size = 22, color = "#7286ff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IconUserPlus = ({ size = 22, color = "#e67e22" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

const IconUser = ({ size = 22, color = "#27ae60" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconCheck = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconX = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconInputUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconInputId = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" /><line x1="7" y1="8" x2="17" y2="8" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="7" y1="16" x2="13" y2="16" />
  </svg>
);
const IconInputGrad = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 2.5 3 6 3s6-1 6-3v5" />
  </svg>
);
const IconInputCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconInputMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const AdminRoles = () => {
  const [isAdding, setIsAdding] = useState(false);
  
  const [pendingStudents, setPendingStudents] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [stats, setStats] = useState({ total: 0, staff: 0, admin: 0, pending: 0 });

  const [selectedStudent, setSelectedStudent] = useState(null); 
  const [modalMode, setModalMode] = useState("view");
  const [roleModalUser, setRoleModalUser] = useState(null);
  const [selectedNewRole, setSelectedNewRole] = useState("");   
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'staff' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pendingRes, approvedRes, usersRes] = await Promise.all([
        api.get('/accounts/verifications/?status=PENDING'),
        api.get('/accounts/verifications/?status=APPROVED'),
        api.get('/accounts/users/')
      ]);

      const pendingData = pendingRes.data.results || pendingRes.data;
      const formattedPending = pendingData.map(p => ({
        id: p.id,
        name: `${p.first_name || ''} ${p.last_name || ''}`.trim(),
        email: p.email,
        requested: p.verified_at ? new Date(p.verified_at).toLocaleDateString() : 'Pending',
        studentId: p.univ_id,
        program: p.course,
        yearLevel: `${p.year_level} Year`,
        id_image_url: p.id_image_url
      }));
      setPendingStudents(formattedPending);

      const approvedData = approvedRes.data.results || approvedRes.data;
      const formattedApproved = approvedData.map(s => ({
        id: s.id,
        name: `${s.first_name || ''} ${s.last_name || ''}`.trim(),
        idNum: s.univ_id,
        program: s.course,
        year: `${s.year_level} Year`,
        email: s.email,
        id_image_url: s.id_image_url
      }));
      setStudentList(formattedApproved);

      const allUsers = usersRes.data.results || usersRes.data;
      const staffAndAdmin = allUsers.filter(u => u.role === 'staff' || u.role === 'admin' || u.role === 'Administrator' || u.role === 'Staff');
      const formattedStaff = staffAndAdmin.map(u => ({
        id: u.id,
        name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email,
        email: u.email,
        role: (u.role === 'admin' || u.role === 'Administrator') ? 'Administrator' : 'Staff',
        status: u.is_active ? 'Active' : 'Inactive'
      }));
      setStaffList(formattedStaff);

      setStats({
        total: allUsers.length,
        staff: formattedStaff.filter(u => u.role === 'Staff').length,
        admin: formattedStaff.filter(u => u.role === 'Administrator').length,
        pending: formattedPending.length
      });

    } catch (err) {
      console.error('Error fetching admin role data:', err);
    }
  };

  const openRoleModal = (user) => {
    setRoleModalUser(user);
    setSelectedNewRole(user.role);
  };

  const handleInputChange = (field, value) => {
    setSelectedStudent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const nameParts = (selectedStudent.name || '').trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      await api.post(`/accounts/verifications/${selectedStudent.id}/update_profile/`, {
        first_name: firstName,
        last_name: lastName,
        univ_id: selectedStudent.studentId,
        course: selectedStudent.program,
        year_level: parseInt(selectedStudent.yearLevel) || 1
      });
      fetchData();
      setSelectedStudent(null);
    } catch (err) {
      console.error('Failed to update student profile:', err);
      const backendError = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      alert(`Failed to update profile. Error: ${backendError}`);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await api.post(`/accounts/users/${id}/toggle_active/`);
      fetchData();
    } catch (err) {
      console.error('Failed to toggle active status:', err);
      alert('Failed to update user status.');
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      alert("Name and Email are required");
      return;
    }
    try {
      await api.post('/accounts/users/create_staff/', newUser);
      setIsAdding(false);
      setNewUser({ name: '', email: '', role: 'staff' });
      fetchData();
      alert("New user created successfully! Default password is: RegQuest@123");
    } catch (err) {
      console.error("Failed to create user:", err);
      alert("Failed to create user. Email may already exist.");
    }
  };

  const handleVerifyStudent = async (studentId, status) => {
    try {
      await api.post(`/accounts/verifications/${studentId}/verify/`, {
        verification_status: status
      });
      fetchData(); // Refresh all data
      setSelectedStudent(null);
    } catch (err) {
      console.error('Failed to verify student:', err);
      alert('Failed to process verification. Please try again.');
    }
  };

  const handleSaveRole = async () => {
    if (!roleModalUser) return;
    const rolePayload = selectedNewRole === 'Administrator' ? 'admin' : 'staff';
    try {
      await api.post(`/accounts/users/${roleModalUser.id}/assign_role/`, { role: rolePayload });
      fetchData(); // Refresh list
      setRoleModalUser(null);
    } catch (err) {
      console.error('Failed to assign role:', err);
      alert('Failed to save role. Please try again.');
    }
  };

  return (
    <AdminLayout>
      <div className="roles-main">

        <div className="roles-stats">
          <div className="roles-stat-card gray">
            <div className="stat-header">
              <IconUsers size={16} color="#8e8e8e" />
              <h4>Total Users</h4>
            </div>
            <h1>{stats.total}</h1>
          </div>

          <div className="roles-stat-card green">
            <div className="stat-header">
              <IconUsers size={16} color="#41d98a" />
              <h4>Staff Member</h4>
            </div>
            <h1>{stats.staff}</h1>
          </div>

          <div className="roles-stat-card blue">
            <div className="stat-header">
              <IconShield size={16} color="#7286ff" />
              <h4>Administrator</h4>
            </div>
            <h1>{stats.admin}</h1>
          </div>

          <div className="roles-stat-card orange">
            <div className="stat-header">
              <IconUserPlus size={16} color="#ffa34d" />
              <h4>Pending Approval</h4>
            </div>
            <h1>{stats.pending}</h1>
          </div>
        </div>

        <div className="roles-card pending-students-card">
          <div className="section-title-inline orange-text">
            <IconUserPlus size={24} color="#e67e22" />
            <h2>Pending Students Account Requests</h2>
          </div>

          <div className="pending-students-list">
            {pendingStudents.map((student) => (
              <div key={student.id} className="student-row">
                <div className="student-info">
                  <h3>{student.name}</h3>
                  <p className="student-email">{student.email}</p>
                  <p className="student-date">Requested: {student.requested}</p>
                </div>

                <div className="student-actions">
                  <button 
                    className="btn-view" 
                    onClick={() => {
                      setSelectedStudent(student);
                      setModalMode("view");
                    }}
                  >
                    View Infromation
                  </button>
                  <button className="btn-approve-outline" onClick={() => handleVerifyStudent(student.id, 'APPROVED')}>
                    <IconCheck size={13} /> Approve
                  </button>
                  <button className="btn-reject-outline" onClick={() => handleVerifyStudent(student.id, 'REJECTED')}>
                    <IconX size={13} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>



        <div className="roles-card add-user-section-container">
          {!isAdding ? (
            <div className="add-user-trigger-view">
              <button className="btn-add-new-trigger" onClick={() => setIsAdding(true)}>
                Add New User
              </button>
            </div>
          ) : (
            <div className="add-user-form-expanded">
              <h2>Add New User</h2>
              <div className="add-user-inputs-row">
                <input type="text" placeholder="Full Name" className="form-control" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                <input type="email" placeholder="Email" className="form-control" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                <select className="form-select" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                  <option value="staff">Staff</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="add-user-actions-row">
                <button className="btn-add-submit" onClick={handleAddUser}>Add User</button>
                <button className="btn-cancel-submit" onClick={() => setIsAdding(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        <div className="roles-card structured-section blue-bg-section">
          <div className="section-title-with-subtitle">
            <div className="title-icon-wrapper">
              <IconShield size={32} color="#7286ff" />
              <div>
                <h2>Staff & Role Management</h2>
                <p>Set roles and access levels for registrar staff</p>
              </div>
            </div>
          </div>

          <div className="table-responsive white-table-container">
            <table className="roles-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Current Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff) => (
                  <tr key={staff.id}>
                    <td className="font-semibold">{staff.name}</td>
                    <td className="text-muted">{staff.email}</td>
                    <td>
                      <span className={`badge ${staff.role === "Administrator" ? "admin-badge" : "staff-badge"}`}>
                        {staff.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge status-badge ${staff.status === "Active" ? "active-badge" : "inactive-badge"}`}>
                        {staff.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button className="btn-change-role" onClick={() => openRoleModal(staff)}>
                          Change Role
                        </button>
                        <button 
                          className={staff.status === "Active" ? "btn-deactivate" : "btn-deactivate text-green-600 border-green-600"} 
                          onClick={() => handleDeactivate(staff.id)}
                        >
                          {staff.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="roles-card structured-section green-bg-section">
          <div className="section-title-with-subtitle">
            <div className="title-icon-wrapper">
              <IconUser size={32} color="#27ae60" />
              <div>
                <h2>Student Accounts Management</h2>
                <p>View, update, and organize student profiles and registration data.</p>
              </div>
            </div>
          </div>

          <div className="table-responsive white-table-container">
            <table className="roles-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID Number</th>
                  <th>Program</th>
                  <th>Year Level</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentList.map((student) => (
                  <tr key={student.id}>
                    <td className="font-semibold">{student.name}</td>
                    <td>{student.idNum}</td>
                    <td>{student.program}</td>
                    <td>{student.year}</td>
                    <td className="text-muted">{student.email}</td>
                    <td>
                      <button 
                        className="btn-view-update"
                        onClick={() => {
                          setSelectedStudent({
                            ...student,
                            studentId: student.idNum,
                            program: student.program,
                            yearLevel: student.year
                          });
                          setModalMode("edit");
                        }}
                      >
                        View / Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedStudent && (
          <div className="modal-backdrop-overlay">
            <div className="student-info-modal-card">
              <h1>Student Information</h1>
              
              <div className="modal-grid-fields">
                <div className="modal-field-group">
                  <label>Full Name</label>
                  <div className="modal-input-container">
                    <IconInputUser />
                    <input 
                      type="text" 
                      value={selectedStudent.name || ""} 
                      readOnly={modalMode === "view"}
                      onChange={(e) => handleInputChange("name", e.target.value)} 
                    />
                  </div>
                </div>

                <div className="modal-field-group">
                  <label>Student ID</label>
                  <div className="modal-input-container">
                    <IconInputId />
                    <input 
                      type="text" 
                      value={selectedStudent.studentId || ""} 
                      readOnly={modalMode === "view"}
                      onChange={(e) => handleInputChange("studentId", e.target.value)} 
                    />
                  </div>
                </div>

                <div className="modal-field-group">
                  <label>Program / Course</label>
                  <div className="modal-input-container">
                    <IconInputGrad />
                    <input 
                      type="text" 
                      value={selectedStudent.program || ""} 
                      readOnly={modalMode === "view"}
                      onChange={(e) => handleInputChange("program", e.target.value)} 
                    />
                  </div>
                </div>

                <div className="modal-field-group">
                  <label>Year Level</label>
                  <div className="modal-input-container">
                    <IconInputCalendar />
                    <input 
                      type="text" 
                      value={selectedStudent.yearLevel || ""} 
                      readOnly={modalMode === "view"}
                      onChange={(e) => handleInputChange("yearLevel", e.target.value)} 
                    />
                  </div>
                </div>

                <div className="modal-field-group">
                  <label>Email Address</label>
                  <div className="modal-input-container">
                    <IconInputMail />
                    <input 
                      type="text" 
                      value={selectedStudent.email || ""} 
                      readOnly={modalMode === "view"}
                      onChange={(e) => handleInputChange("email", e.target.value)} 
                    />
                  </div>
                </div>

                <div className="modal-field-group">
                  <label>School ID</label>
                  <div className="school-id-preview-box">
                    <img 
                      src={selectedStudent.id_image_url || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=300&auto=format&fit=crop"} 
                      alt="School ID Card" 
                      className="id-card-img"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer-controls">
                <button className="btn-modal-back" onClick={() => setSelectedStudent(null)}>
                  <IconArrowLeft /> Back
                </button>
                
                {/* Dynamically loads footer layouts according to Screenshot 2026-05-25 222640.png */}
                {modalMode === "edit" ? (
                  <button className="btn-modal-only-save" onClick={handleSaveChanges}>
                    Save
                  </button>
                ) : (
                  <div className="modal-decision-buttons">
                    <button className="btn-modal-approve" onClick={() => handleVerifyStudent(selectedStudent.id, 'APPROVED')}>
                      <IconCheck size={16} /> Approve
                    </button>
                    <button className="btn-modal-reject" onClick={() => handleVerifyStudent(selectedStudent.id, 'REJECTED')}>
                      <IconX size={16} /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── APPROVE ROLE ASSIGNMENT MODAL ──────────────────── */}
        {roleModalUser && (
          <div className="modal-backdrop-overlay">
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
                    <IconShield size={20} color="#4f46e5" />
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
                    <IconUsers size={20} color="#2563eb" />
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
    </AdminLayout>
  );
};

export default AdminRoles;