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
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm font-sans mt-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Latest Requests</h3>
                <Link to="/staff/process-requests" className="text-blue-600 font-semibold text-sm hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">REQUEST ID</th>
                            <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">STUDENT</th>
                            <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">DOCUMENT TYPE</th>
                            <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">STATUS</th>
                            <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">REQUEST DATE</th>
                            <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">RELEASE DATE</th>
                            <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {latestRequests.length > 0 ? (
                            latestRequests.map((req) => (
                                <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-4 text-sm text-gray-700 font-medium">{req.tracking_number}</td>
                                    <td className="py-4 px-4">
                                        <div className="flex flex-col">
                                            <strong className="text-gray-900 text-sm">{req.student_name}</strong>
                                            <span className="text-xs text-gray-500">ID: {req.user}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex flex-col">
                                            <strong className="text-gray-900 text-sm">{req.document_name}</strong>
                                            <span className="text-xs text-gray-500">{req.quantity} copy</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                                            req.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                                            req.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                            req.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600">
                                        {req.created_at ? new Date(req.created_at).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600">
                                        {req.est_release_date ? new Date(req.est_release_date).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="py-4 px-4">
                                        <button 
                                            className="inline-flex items-center gap-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                                            onClick={() => setSelectedRequest(req)}
                                        >
                                            <Eye size={14} /> View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-gray-500 text-sm">
                                    No recent requests to display.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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