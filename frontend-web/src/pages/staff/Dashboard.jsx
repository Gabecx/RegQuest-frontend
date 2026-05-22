import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/StaffDashboard.css";
import { useAuth } from "../../context/AuthContext";

export default function StaffDashboard() {

  const [requests, setRequests] = useState([]);

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

  const { logout } = useAuth();

  return (
    <div className="staff-dashboard">

      <nav className="staff-navbar">
        <h1 className="staff-logo">RegQuest Staff</h1>
        <button className="logout-btn" onClick={logout}>
          Log out
        </button>
      </nav>

      <header className="staff-header">
        <h2>
          Registrar Staff <span>Dashboard</span>
        </h2>

        <p>Manage and process student document requests</p>
      </header>

      <main className="staff-main">

        {/* Summary */}
        <section className="staff-card">
          <h3>Documents</h3>
          <p className="section-subtitle">
            Summary of request status
          </p>

          <div className="summary-grid">

            <div className="summary-box">
              <p>Total Requests</p>
              <h4>{requests.length}</h4>
            </div>

            <div className="summary-box">
              <p>Pending</p>
              <h4>
                {
                  requests.filter(
                    (req) => req.status === "Pending"
                  ).length
                }
              </h4>
            </div>

            <div className="summary-box">
              <p>Processing</p>
              <h4>
                {
                  requests.filter(
                    (req) => req.status === "Processing"
                  ).length
                }
              </h4>
            </div>

            <div className="summary-box">
              <p>Released</p>
              <h4>
                {
                  requests.filter(
                    (req) => req.status === "Released"
                  ).length
                }
              </h4>
            </div>

          </div>
        </section>

        {/* Requests Table */}
        <section className="staff-card">

          <div className="table-header">
            <div>
              <h3>Requests</h3>

              <p className="section-subtitle">
                Latest document requests
              </p>
            </div>

            <button className="view-btn">
              View All
            </button>
          </div>

          <table className="request-table">

            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Student</th>
                <th>Document</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {requests.map((req, index) => (

                <tr key={index}>

                  <td>{req.tracking_number}</td>

                  <td>{req.student_name}</td>

                  <td>{req.document_name}</td>

                  <td>
                    <span className="status-badge">
                      {req.status}
                    </span>
                  </td>

                  <td>
                    <button className="small-btn">
                      View
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </section>

      </main>

    </div>
  );
}