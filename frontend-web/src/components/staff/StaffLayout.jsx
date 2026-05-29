import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';
import logo from '../../assets/regquest-logo.png';

const menuItems = [
  { name: 'Dashboard', path: '/staff/dashboard' },
  { name: 'Process Request', path: '/staff/process-requests' },
  { name: 'Processing Calendar', path: '/staff/processing-calendar' },
];

const StaffLayout = ({ children, banner }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-100 flex items-center justify-between px-8 py-3">
        <div className="flex items-center space-x-3">
          <Link to="/staff/dashboard" className="flex items-center space-x-2">
            <img src={logo} alt="RegQuest Logo" className="h-9 w-auto" />
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-blue-950 text-[17px] tracking-tight">RegQuest Staff</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Registrar Portal</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-right leading-tight">
            <p className="text-sm font-extrabold text-gray-800">
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Staff User'}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
              {user?.role === 'staff' || !user?.role ? 'Registrar Staff' : user?.role}
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center space-x-2 text-xs font-bold text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3.5 py-2 rounded-xl bg-white hover:bg-red-50 transition-all duration-200 cursor-pointer shadow-sm"
          >
            <LogOut size={14} />
            <span>Log out</span>
          </button>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200 px-8">
        <nav className="flex space-x-8 max-w-7xl mx-auto">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`py-4 px-1 border-b-2 text-xs font-bold transition-all duration-200 relative -mb-[2px] ${
                  active 
                    ? 'border-blue-900 text-blue-950' 
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {banner}

      <main className="flex-1 max-w-7xl w-full mx-auto p-8 space-y-8">
        {children}
      </main>
    </div>
  );
};

export default StaffLayout;
