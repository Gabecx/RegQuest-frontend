import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import api from "../../api/axios";
import RequestModal from "../../components/staff/RequestModal";
import "../../styles/RequestProcess.css"; 

export default function RequestPreview({ requests = [], loading, error, refetchRequests }) {
    const latestRequests = Array.isArray(requests) ? requests.slice(0, 5) : [];
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [status, setStatus] = useState("");
    const [notes, setNotes] = useState("");
    const [isUpdating, setIsUpdating] = useState(false); 
    const [updateError, setUpdateError] = useState(null); 

    useEffect(() => {
        if (selectedRequest) {
            setStatus(selectedRequest.status);
            setNotes(selectedRequest.notes || ""); 
        }
    }, [selectedRequest]);

    const handleUpdate = async () => {
        if (!selectedRequest) return;
        setIsUpdating(true);
        setUpdateError(null);
        try {
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

    return (
        <div className="dashboard-preview-card">
            <div className="preview-header">
                <h3>Latest Requests</h3>
                <Link to="/staff/process-requests">View All</Link>
            </div>
            <table className="mini-request-table">
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
                    {latestRequests.length > 0 ? (
                        latestRequests.map((req) => (
                            <tr key={req.id}>
                                <td>{req.tracking_number}</td>
                                <td>
                                    <div className="student-cell">
                                        <strong>{req.student_name}</strong>
                                        <span>ID: {req.user}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="document-cell">
                                        <strong>{req.document_name}</strong>
                                        <span>{req.quantity} copy</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-badge ${req.status}`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td>
                                    {req.created_at ? new Date(req.created_at).toLocaleDateString() : "N/A"}
                                </td>
                                <td>
                                    {req.est_release_date ? new Date(req.est_release_date).toLocaleDateString() : "N/A"}
                                </td>
                                <td>
                                    <button className="view-btn" onClick={() => setSelectedRequest(req)}>
                                        <Eye size={14} />View
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '1rem' }}>
                                No recent requests to display.
                            </td>
                        </tr>
                    )}
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
        </div>
    );
}