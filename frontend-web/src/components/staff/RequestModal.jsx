import React from "react";

export default function RequestModal({ request, status, setStatus, notes, setNotes, onUpdate, onClose, isUpdating }) {
    if (!request) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden font-sans border border-gray-100 transform transition-all">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                    <h2 className="text-xl font-bold text-gray-900">Process Request</h2>
                    <button 
                        className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-colors" 
                        onClick={onClose}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-center mb-6 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                        <p className="text-sm font-semibold text-gray-600">
                            Tracking Number: <span className="text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md ml-2 border border-blue-200 shadow-sm">{request.tracking_number}</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Student Name</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-gray-900 font-medium shadow-sm">{request.student_name}</div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">User ID</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-gray-900 font-medium shadow-sm">{request.user}</div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Document Type</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-gray-900 font-medium shadow-sm">{request.document_name}</div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Copies</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-gray-900 font-medium shadow-sm">{request.quantity}</div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Total Price</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-gray-900 font-medium shadow-sm">₱{request.total_price}</div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Update Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-sm text-gray-900 font-bold focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer appearance-none"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="approved">Approved</option>
                                <option value="completed">Completed</option>
                                <option value="rejected">Rejected</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/80">
                    <button 
                        className="px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200/50 transition-all" 
                        onClick={onClose}
                    >
                        Back
                    </button>
                    <button
                        className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 border border-transparent rounded-xl shadow-md shadow-blue-600/20 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                        onClick={onUpdate}
                        disabled={isUpdating}
                    >
                        {isUpdating ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </>
                        ) : "Update Status"}
                    </button>
                </div>
            </div>
        </div>
    );
}