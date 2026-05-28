import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "../../styles/StaffLayout.css";
export default function StaffHeader() {
    const { logout, user } = useAuth();
    return (
        <nav className="staff-navbar">
            <div>
                <h1 className="staff-logo">
                    RegQuest Staff
                </h1>
                <span className="staff-subtitle">
                    Registrar Portal
                </span>
            </div>
            <div className="staff-nav-right">
                <span className="staff-user">{user?.first_name || "Staff"}</span>
                <button className="logout-btn" onClick={logout}>Log out</button>
            </div>
        </nav>
    );
}