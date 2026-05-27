import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import StaffHeader from "../../components/staff/StaffHeader";
import RequestModal from "../../components/staff/RequestModal";
import api from "../../api/axios";
import StaffTabs from "../../components/staff/StaffTabs";
import { useRequests } from "../../hooks/useRequests";
import "../../styles/RequestProcess.css";
export default function RequestProcess() {
    const { requests, loading, error, refetchRequests } = useRequests();
    const [searchTerm, setSearchTerm] = useState("");
    const [documentTypeFilter, setDocumentTypeFilter] = useState("Document Type");
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [status, setStatus] = useState("");
    const [notes, setNotes] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        if (selectedRequest) {
            setStatus(selectedRequest.status);
            setNotes(selectedRequest.notes || "");
        }
    }, [selectedRequest]);

    const handleUpdate = async () => {
        setIsUpdating(true);
        setUpdateError(null);
        try {
            // As per Django model, only 'status' is directly updatable via PATCH.
            // If 'notes' is needed, it must be added to the Django Request model.
            await api.patch(`/requests/${selectedRequest.id}/`, {
                status: status,
            });
            setSelectedRequest(null);
            refetchRequests();
            console.log("Status updated successfully to:", status);
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Update failed:", err.response?.data);
            }
            const detail = err.response?.data?.detail || "Invalid data submitted.";
            setUpdateError(`Failed to update request: ${detail}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredRequests = requests.filter((req) => {
        const matchesSearch = 
            req.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.student_name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = documentTypeFilter === "Document Type" || req.document_name === documentTypeFilter;
        const matchesStatus = statusFilter === "All Statuses" || req.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    if (loading) return (
        <div className="process-page">
            <StaffHeader /><StaffTabs />
            <p style={{ textAlign: 'center', padding: '2rem' }}>Loading requests...</p>
        </div>
    );

    if (error) return (
        <div className="process-page">
            <StaffHeader /><StaffTabs />
            <p style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>{error}</p>
        </div>
    );

  return (
    <div className="process-page">
        <StaffHeader />
        <StaffTabs />
      <section className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by ID, Student Name, or Student ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select value={documentTypeFilter} onChange={(e) => setDocumentTypeFilter(e.target.value)}>
            <option value="Document Type">Document Type</option>
            <option value="Transcript of Records">Transcript of Records</option>
            <option value="Honorable Dismissal">Honorable Dismissal</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All Statuses">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </section>
      {updateError && <p style={{ color: 'red', textAlign: 'center', margin: '1rem 0' }}>{updateError}</p>}
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
            {filteredRequests.map((req) => (<tr key={req.id}>
                <td>{req.tracking_number}</td>
                <td>
                  <div className="student-cell">
                    <strong>{req.student_name}</strong>
                    <span>ID: {req.user}</span>
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
                    className={`status-badge ${req.status}`}>{req.status}
                  </span>
                </td>
                <td>
                  {req.created_at ? new Date(req.created_at).toLocaleDateString() : "N/A"}
                </td>
                <td>
                  {req.est_release_date? new Date(req.est_release_date).toLocaleDateString(): "N/A"}
                </td>
                <td>
                  <button className="view-btn" onClick={() => setSelectedRequest(req)}>
                    <Eye size={14} />View
                  </button>
                </td>
              </tr>))}
          </tbody>
        </table>
        <RequestModal
            request={selectedRequest}
            status={status}
            setStatus={setStatus}
            notes={notes}
            setNotes={setNotes}
            onUpdate={handleUpdate}
            onClose={() => setSelectedRequest(null)}
            isUpdating={isUpdating}
        />
      </section>
    </div>
  );
}