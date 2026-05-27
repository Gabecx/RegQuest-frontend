import React from "react";
export default function RequestModal({ request, status, setStatus, notes, setNotes, onUpdate, onClose, isUpdating }) {
    if (!request) return null;

    return (
        <div className="modal-overlay">
            <div className="request-modal">
                <div className="modal-header">
                    <h2>Process Request</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <p className="modal-subtitle">
                    Tracking Number: {request.tracking_number}
                </p>

                <div className="preview-grid">
                    <div>
                        <label>Student Name</label>
                        <div className="preview-box">{request.student_name}</div>
                    </div>
                    <div>
                        <label>User ID</label>
                        <div className="preview-box">{request.user}</div>
                    </div>
                    <div>
                        <label>Document Type</label>
                        <div className="preview-box">{request.document_name}</div>
                    </div>
                    <div>
                        <label>Copies</label>
                        <div className="preview-box">{request.quantity}</div>
                    </div>
                    <div>
                        <label>Total Price</label>
                        <div className="preview-box">₱{request.total_price}</div>
                    </div>
                    <div>
                        <label>Update Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="status-select"
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

                <div className="notes-section">
                    {/* Note: The 'notes' field is not in your Django model. */}
                    {/* Uncomment the textarea below if you add a 'notes' TextField to your Django Request model. */}
                    {/* <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="notes-textarea" placeholder="Add notes for the student..." /> */}
                </div>
                <div className="modal-actions">
                    <button className="back-btn" onClick={onClose}>Back</button>
                    <button
                        className="update-btn"
                        onClick={onUpdate}
                        disabled={isUpdating}
                    >
                        {isUpdating ? "Updating..." : "Update"}
                    </button>
                </div>
            </div>
        </div>
    );
}