import React, { useEffect, useState } from "react";
import {FileText} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import CalendarPreview from "../../components/CalendarPreview";
import RequestPreview from "../../components/RequestPreview";
import "../../styles/StaffDashboard.css";

export default function StaffDashboard() {
  const { logout, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const totalRequests = requests.length;
  const pendingRequests = requests.filter((req) => req.status === "pending").length;
  const processingRequests = requests.filter((req) => req.status === "processing").length;

  const completedRequests = requests.filter(
    (req) =>
      req.status === "completed" ||
      req.status === "approved"
  ).length;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get("/requests/");
      setRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  };

  return (
    <div className="staff-dashboard">

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
                    <span className="staff-user">
                        {user?.first_name || "Staff"}
                    </span>
                    <button className="logout-btn" onClick={logout}>Log out</button>
                </div>
            </nav>

      <div className="top-tabs">
        <a href="/staff/dashboard" className="tab active">Dashboard</a>
        <a href="/staff/process-requests"  className="tab">Process Request</a>
        <a href="/staff/processing-calendar" className="tab">Processing Calendar</a>
        <a href="/staff/analytics" className="tab">Analytics</a>
        <a href="/staff/history" className="tab">History</a>
      </div>

      <header className="staff-header">
        <h2>
          Registrar Staff <span>Dashboard</span>
        </h2>

        <p>Manage and process student document requests</p>
      </header>

      <section className="overview-wrapper">

        <div className="documents-overview">
          <div className="documents-header">
            <div className="document-icon">
              <FileText size={48} />
            </div>
            <div>
              <p className="documents-date">
                Monday, May 7, 2026
              </p>
              <h2>
                {totalRequests} Documents
              </h2>
              <span>
                Targeted for completion today
              </span>
            </div>
          </div>

          <div className="documents-grid">
            <div className="document-mini-card">
              <div className="mini-top">
                <p>Transcript of Records</p>
                <span className="priority high">High</span>
              </div>
              <h2>3</h2>
              <small>copies</small>
            </div>
            <div className="document-mini-card">
              <div className="mini-top">
                <p>Honorable Dismissal</p>
                <span className="priority medium">Medium</span>
              </div>
              <h2>1</h2>
              <small>copies</small>
            </div>
            <div className="document-mini-card">
              <div className="mini-top">
                <p>Evaluation</p>
                <span className="priority medium">Medium</span>
              </div>
              <h2>1</h2>
              <small>copies</small>
            </div>
            <div className="document-mini-card">
              <div className="mini-top">
                <p>Officially Enrolled</p>
                <span className="priority medium">Medium</span>
              </div>
              <h2>1</h2>
              <small>copies</small>
            </div>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stats-card total">
            <p>Total Requests</p>
            <h2>{totalRequests}</h2>
            <span>All Time</span>
          </div>
          <div className="stats-card pending">
            <p>Pending</p>
            <h2>{pendingRequests}</h2>
            <span>Need Attention</span>
          </div>
          <div className="stats-card processing">
            <p>Processing</p>
            <h2>{processingRequests}</h2>
            <span>In Progress</span>
          </div>
          <div className="stats-card completed">
            <p>Completed Today</p>
            <h2>{completedRequests}</h2>
            <span>Released</span>
          </div>
        </div>

        <section className="dashboard-preview-card">
            <div className="preview-header">
                <h3>Processing Calendar</h3>
                <a href="/staff/processing-calendar">View Full Calendar </a>
            </div>

            <div className="calendar-summary">
                <div className="summary-item">
                    <strong>5</strong>
                    <span>Active Batches </span>
                </div>
                <div className="summary-item">
                    <strong>18</strong>
                    <span>Requests Scheduled</span>
                </div>
                <div className="summary-item">
                    <strong>75%</strong>
                    <span>Completion Rate </span>
                </div>
            </div>
        </section>

        <section className="dashboard-preview-card">
            <div className="preview-header">
                <h3>Recent Requests</h3>
                <a href="/staff/process-requests">View All</a>
            </div>

            <table className="mini-request-table">

                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Document</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.slice(0, 5).map((req) => (
                        <tr key={req.id}>
                            <td>{req.student_name}</td>
                            <td>{req.document_name}</td>
                            <td>
                                <span className={`status-badge ${req.status}`}>{req.status}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
      </section>
    </div>
  );
}