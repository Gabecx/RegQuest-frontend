import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import logo from '../assets/regquest-logo.png';
import '../styles/Navbar.css';
const Navbar = () => {
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user, logout } = useAuth();

    const displayUser = user || { 
        name: "Guest",
        notifications: 0,
        role: 'guest'
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

    return (
        <nav className="navbar">
            <div className="logo-section">
                <Link to="/home">
                    <img src={logo} alt="RegQuest" className="logo-image" />
                </Link>
            </div>
            <button 
                className="mobile-menu-btn" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-label="Toggle navigation menu">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                <Link to="/home" className={isActive('/home')} onClick={() => setIsMenuOpen(false)}>Home</Link>
                
                {displayUser?.role === 'student' && (
                    <>
                        <Link to="/request-document" className={isActive('/request-document')} onClick={() => setIsMenuOpen(false)}>Request Document</Link>
                        <Link to="/track-status" className={isActive('/track-status')} onClick={() => setIsMenuOpen(false)}>Track Status</Link>
                    </>
                )}
                {displayUser?.role === 'staff' && (
                    <>
                        <Link to="/staff/dashboard" className={isActive('/staff/dashboard')} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                        <Link to="/staff/process-requests" className={isActive('/staff/process-requests')} onClick={() => setIsMenuOpen(false)}>Requests</Link>
                    </>
                )}
                {displayUser?.role === 'admin' && (
                    <Link to="/admin/dashboard" className={isActive('/admin/dashboard')} onClick={() => setIsMenuOpen(false)}>System Administration</Link>
                )}
            </div>
            <div className="user-section">
                <button className="notification-btn">
                    <Bell size={20} />
                    {displayUser.notifications > 0 && (
                        <span className="notification-badge">{displayUser.notifications}</span>
                    )}
                </button>
                <div className="user-profile" ref={dropdownRef}>
                    <span style={{ marginRight: '10px', fontWeight: '600', color: '#4B4A4A' }}> 
                        Hello, {displayUser.first_name || displayUser.name?.split(' ')[0] || "User"}
                    </span>
                    <button 
                        className="profile-btn"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <UserIcon size={24} />
                    </button>

                    {isDropdownOpen && (
                        <div className="profile-dropdown">
                            <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                <UserIcon size={16} />
                                Profile
                            </Link>
                            <button className="dropdown-item logout" onClick={() => {
                                setIsDropdownOpen(false);
                                logout();
                            }}>
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
export default Navbar;
