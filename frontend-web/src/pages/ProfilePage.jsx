import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, CreditCard, Lock, Bell, Fingerprint, ImagePlus } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Card from '../components/Card';
import '../styles/ProfilePage.css';

const ProfilePage = ({ currentUser }) => {
    const navigate = useNavigate();
    
    const user = currentUser || {
        first_name: "Juan",
        last_name: "De Letchi",
        univ_id: "2026202686",
        email: "juan@email.com",
        course: "BS in Information Technology",
        year_level: "1",
        avatar: null
    };

    const [activeTab, setActiveTab] = useState('personal');

    return (
        <div className="profile-page-container">
            <Navbar currentUser={user} />
            
            <main className="profile-main-content">
                <div className="profile-header">
                    <h1 className="profile-page-title">Profile Settings</h1>
                    <p className="profile-page-subtitle">Manage your account details and preferences.</p>
                </div>

                <div className="profile-layout">
                    <Card className="profile-sidebar">
                        <nav className="profile-nav">
                            <button 
                                className={`profile-nav-btn ${activeTab === 'personal' ? 'active' : ''}`}
                                onClick={() => setActiveTab('personal')}
                            >
                                <User size={18} />
                                Personal Information
                            </button>
                            <button 
                                className={`profile-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
                                onClick={() => setActiveTab('security')}
                            >
                                <Lock size={18} />
                                Security & Password
                            </button>
                            <button 
                                className={`profile-nav-btn ${activeTab === 'payment' ? 'active' : ''}`}
                                onClick={() => setActiveTab('payment')}
                            >
                                <CreditCard size={18} />
                                Payment Methods
                            </button>
                            <button 
                                className={`profile-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
                                onClick={() => setActiveTab('notifications')}
                            >
                                <Bell size={18} />
                                Notifications
                            </button>
                        </nav>
                    </Card>

                    <div className="profile-content-area">
                        {activeTab === 'personal' && (
                            <Card className="profile-content-card">
                                <h2 className="content-title">Personal Information</h2>
                                <hr className="content-divider" />
                                
                                <div className="avatar-section">
                                    <div className="avatar-placeholder">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="Profile" className="avatar-img" />
                                        ) : (
                                            <User size={40} color="#a1a1aa" />
                                        )}
                                        <button className="upload-avatar-btn">
                                            <ImagePlus size={16} />
                                        </button>
                                    </div>
                                    <div className="avatar-info">
                                        <h3>Profile Picture</h3>
                                        <p>PNG, JPEG under 5MB</p>
                                    </div>
                                </div>

                                <div className="form-grid profile-form-grid">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input type="text" defaultValue={user.first_name || user.firstName} />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input type="text" defaultValue={user.last_name || user.lastName} />
                                    </div>
                                    <div className="form-group">
                                        <label>Student ID</label>
                                        <input type="text" defaultValue={user.univ_id || user.studentId || user.student_id || 'N/A'} readOnly className="readonly-input" />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input type="email" defaultValue={user.email} />
                                    </div>
                                    <div className="form-group">
                                        <label>Program / Course</label>
                                        <input type="text" defaultValue={user.course || user.program || 'N/A'} readOnly className="readonly-input" />
                                    </div>
                                    <div className="form-group">
                                        <label>Year Level</label>
                                        <input type="text" defaultValue={
                                            user.year_level 
                                                ? `${user.year_level}${['st', 'nd', 'rd'][(user.year_level % 10) - 1] || 'th'} Year` 
                                                : user.yearLevel || 'N/A'
                                        } readOnly className="readonly-input" />
                                    </div>
                                </div>
                                
                                <div className="profile-actions">
                                    <Button className="btn-primary">Save Changes</Button>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'security' && (
                            <Card className="profile-content-card">
                                <h2 className="content-title">Security & Password</h2>
                                <hr className="content-divider" />
                                
                                <div className="security-section">
                                    <div className="form-group full-width">
                                        <label>Current Password</label>
                                        <input type="password" placeholder="••••••••" />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>New Password</label>
                                        <input type="password" placeholder="••••••••" />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Confirm New Password</label>
                                        <input type="password" placeholder="••••••••" />
                                    </div>
                                    
                                    <div className="profile-actions">
                                        <Button className="btn-primary">Update Password</Button>
                                    </div>
                                </div>
                                
                                <div className="two-factor-section">
                                    <div className="setting-row">
                                        <div className="setting-info">
                                            <h4>Two-Factor Authentication</h4>
                                            <p>Add an extra layer of security to your account.</p>
                                        </div>
                                        <Button className="btn-outline-small">Enable</Button>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'payment' && (
                            <Card className="profile-content-card">
                                <h2 className="content-title">Payment Methods</h2>
                                <hr className="content-divider" />
                                
                                <div className="saved-payments">
                                    <div className="payment-card-item">
                                        <div className="payment-icon gcash">GC</div>
                                        <div className="payment-details">
                                            <h4>GCash</h4>
                                            <p>0912 •••• 5678</p>
                                        </div>
                                        <span className="badge default">Default</span>
                                    </div>
                                </div>
                                
                                <Button className="btn-outline dashed-btn">
                                    + Add New Payment Method
                                </Button>
                            </Card>
                        )}

                        {activeTab === 'notifications' && (
                            <Card className="profile-content-card">
                                <h2 className="content-title">Notification Preferences</h2>
                                <hr className="content-divider" />
                                
                                <div className="toggle-list">
                                    <div className="toggle-item">
                                        <div className="toggle-info">
                                            <h4>Email Updates</h4>
                                            <p>Receive email updates when your document status changes.</p>
                                        </div>
                                        <label className="switch">
                                            <input type="checkbox" defaultChecked />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    <hr className="sub-divider" />
                                    <div className="toggle-item">
                                        <div className="toggle-info">
                                            <h4>In-App Notifications</h4>
                                            <p>Receive notifications inside the RegQuest application.</p>
                                        </div>
                                        <label className="switch">
                                            <input type="checkbox" defaultChecked />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    <hr className="sub-divider" />
                                    <div className="toggle-item">
                                        <div className="toggle-info">
                                            <h4>Marketing Emails</h4>
                                            <p>Receive exciting news and updates from the Registrar.</p>
                                        </div>
                                        <label className="switch">
                                            <input type="checkbox" />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default ProfilePage;
