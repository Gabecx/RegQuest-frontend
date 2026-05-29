import React, { useEffect, useState } from "react";
import {FileText} from "lucide-react";
import StaffHeader from "../../components/staff/StaffHeader";
import StaffTabs from "../../components/staff/StaffTabs";
import CalendarPreview from "../../components/staff/CalendarPreview";
import RequestPreview from "./RequestPreview";
import { useRequests } from "../../hooks/useRequests";
import "../../styles/StaffDashboard.css";

export default function StaffDashboard() {
  const { requests, loading, error, refetchRequests } = useRequests();

  const totalRequests = requests.length;
  const pendingRequests = requests.filter((req) => req.status === "pending").length;
  const processingRequests = requests.filter((req) => req.status === "processing").length;
  const completedRequests = requests.filter(
    (req) =>
      req.status === "completed" ||
      req.status === "approved"
  ).length;

  const torCount = requests.filter((req) => req.document_name === "Transcript of Records").length;
  const hdCount = requests.filter((req) => req.document_name === "Honorable Dismissal").length;
  const evalCount = requests.filter((req) => req.document_name === "Evaluation").length;
  const oeCount = requests.filter((req) => req.document_name === "Officially Enrolled").length;

  if (loading) {
    return (
      <div className="staff-dashboard">
        <StaffHeader />
        <StaffTabs />
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="staff-dashboard">
        <StaffHeader />
        <StaffTabs />
        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>Error: {error}</p>
      </div>
    );
  }

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="staff-dashboard">
      <StaffHeader />
      <StaffTabs />

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
                {formattedDate}
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
              <h2>{torCount}</h2>
              <small>copies</small>
            </div>
            <div className="document-mini-card">
              <div className="mini-top">
                <p>Honorable Dismissal</p>
                <span className="priority medium">Medium</span>
              </div>
              <h2>{hdCount}</h2>
              <small>copies</small>
            </div>
            <div className="document-mini-card">
              <div className="mini-top">
                <p>Evaluation</p>
                <span className="priority medium">Medium</span>
              </div>
              <h2>{evalCount}</h2>
              <small>copies</small>
            </div>
            <div className="document-mini-card">
              <div className="mini-top">
                <p>Officially Enrolled</p>
                <span className="priority medium">Medium</span>
              </div>
              <h2>{oeCount}</h2>
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
        <CalendarPreview requests={requests} loading={loading} error={error} />
        <RequestPreview requests={requests} loading={loading} error={error} refetchRequests={refetchRequests} />
      </section>
    </div>
  );
}