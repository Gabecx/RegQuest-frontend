import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import "../../styles/RequestProcess.css";

export default function RequestProcess() {
    const { logout, user } = useAuth();
    const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get("/requests/" );
      setRequests(response.data);
    } catch (error) {console.error(
        "Failed to fetch requests",
        error
      );
    }
  };

  return (
    <div className="process-page">
        
        <nav className="process-navbar">
          <div>
            <h1 className="process-logo">RegQuest Staff</h1>
            <span className="process-subtitle">Registrar Portal</span>
          </div>
            <div className="process-nav-right">
            <span className="process-user">
                {user?.first_name || "Staff"}
            </span>
            <button className="logout-btn" onClick={logout}>Log out</button>
            </div>
        </nav>

       <div className="top-tabs">
            <a href="/staff/dashboard" className="tab">Dashboard</a>
            <a href="/staff/process-requests"  className="tab active">Process Request</a>
            <a href="/staff/processing-calendar" className="tab">Processing Calendar</a>
            <a href="/staff/analytics" className="tab">Analytics</a>
            <a href="/staff/history" className="tab">History</a>
        </div>

      <section className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by ID, Student Name, or Student ID"/>
        </div>
        <div className="filter-group">
          <select>
            <option> Document Type</option>
          </select>
          <select>
            <option>All Statuses </option>
          </select>
        </div>
      </section>
      <section className="process-table-card">
        <div className="table-top">
          <div>
            <h2>Requests</h2>
            <p>Latest document requests from students</p>
          </div>
        </div>
        <table className="process-table">
          <thead>
            <tr>
              <th>REQUEST ID</th>
              <th>STUDENT</th>
              <th>DOCUMENT TYPE</th>
              <th>STATUS</th>
              <th>REQUEST DATE</th>
              <th>RELEASE DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.tracking_number}</td>
                <td>
                  <div className="student-cell">
                    <strong>{req.student_name}</strong>
                    <span>{req.user}</span>
                  </div>
                </td>
                <td>
                  <div className="document-cell">
                    <strong>{req.document_name} </strong>
                    <span>{req.quantity} copy </span>
                  </div>
                </td>
                <td>
                  <span
                    className={`status-badge ${req.status}`}>
                    {req.status}
                  </span>
                </td>
                <td>
                  {new Date( req.created_at).toLocaleDateString()}
                </td>
                <td>
                  {req.est_release_date? new Date(req.est_release_date).toLocaleDateString(): "N/A"}
                </td>
                <td>
                  <button className="view-btn">View </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}