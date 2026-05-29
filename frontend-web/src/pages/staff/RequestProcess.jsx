import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, Search, Filter } from "lucide-react";
import StaffLayout from "../../components/staff/StaffLayout";
import RequestModal from "../../components/staff/RequestModal";
import api from "../../api/axios";
import { useRequests } from "../../hooks/useRequests";

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
        if (!selectedRequest) return;
        setIsUpdating(true);
        setUpdateError(null);
        try {
            await api.patch(`/requests/${selectedRequest.id}/`, {
                status: status,
            });
            setSelectedRequest(null);
            refetchRequests();
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

    const uniqueDocumentTypes = [...new Set(requests.map(req => req.document_name).filter(Boolean))];

    const filteredRequests = requests.filter((req) => {
        const matchesSearch = 
            req.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.student_name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = documentTypeFilter === "Document Type" || req.document_name === documentTypeFilter;
        const matchesStatus = statusFilter === "All Statuses" || req.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    if (loading) return (
        <StaffLayout>
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        </StaffLayout>
    );

    if (error) return (
        <StaffLayout>
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-200 shadow-sm">
                    <p className="font-semibold">{error}</p>
                </div>
            </div>
        </StaffLayout>
    );

    return (
        <StaffLayout>
            <div className="font-sans max-w-7xl mx-auto py-6 space-y-6">
                <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by ID, Student Name, or Student ID"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 text-gray-500">
                            <Filter size={18} />
                        </div>
                        <select 
                            value={documentTypeFilter} 
                            onChange={(e) => setDocumentTypeFilter(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 min-w-[200px]"
                        >
                            <option value="Document Type">All Documents</option>
                            {uniqueDocumentTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 min-w-[150px]"
                        >
                            <option value="All Statuses">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="approved">Approved</option>
                            <option value="completed">Completed</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </section>

                {updateError && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-200">
                        {updateError}
                    </div>
                )}

                <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Requests</h2>
                            <p className="text-sm text-gray-500 mt-1">Latest document requests from students</p>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">REQUEST ID</th>
                                    <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">STUDENT</th>
                                    <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">DOCUMENT TYPE</th>
                                    <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">STATUS</th>
                                    <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">REQUEST DATE</th>
                                    <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">RELEASE DATE</th>
                                    <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.length > 0 ? (
                                    filteredRequests.map((req) => (
                                        <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 text-sm text-gray-700 font-medium whitespace-nowrap">{req.tracking_number}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <strong className="text-gray-900 text-sm whitespace-nowrap">{req.student_name}</strong>
                                                    <span className="text-xs text-gray-500 mt-0.5">ID: {req.user}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <strong className="text-gray-900 text-sm whitespace-nowrap">{req.document_name}</strong>
                                                    <span className="text-xs text-gray-500 mt-0.5">{req.quantity} copy</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize whitespace-nowrap ${
                                                    req.status === 'pending' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                                    req.status === 'processing' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                                    req.status === 'completed' ? 'bg-green-100 text-green-800 border border-green-200' :
                                                    'bg-gray-100 text-gray-800 border border-gray-200'
                                                }`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">
                                                {req.created_at ? new Date(req.created_at).toLocaleDateString() : "N/A"}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">
                                                {req.est_release_date ? new Date(req.est_release_date).toLocaleDateString() : "N/A"}
                                            </td>
                                            <td className="py-4 px-6">
                                                <button 
                                                    className="inline-flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-blue-600 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all whitespace-nowrap"
                                                    onClick={() => setSelectedRequest(req)}
                                                >
                                                    <Eye size={14} /> View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-12 text-center text-gray-500 text-sm font-medium">
                                            No requests found matching your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
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
        </StaffLayout>
    );
}