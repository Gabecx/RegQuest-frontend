import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/StaffLayout.css";
export default function StaffTabs() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? "tab active" : "tab";
    return (
        <div className="top-tabs">
            <Link to="/staff/dashboard" className={isActive('/staff/dashboard')}>Dashboard</Link>
            <Link to="/staff/process-requests" className={isActive('/staff/process-requests')}>Process Request</Link>
            <Link to="/staff/processing-calendar" className={isActive('/staff/processing-calendar')}>Processing Calendar</Link>
        </div>
    );
}