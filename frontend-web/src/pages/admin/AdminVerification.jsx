import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { CheckCircle, XCircle, FileImage } from 'lucide-react';

const AdminVerification = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [selectedImage, setSelectedImage] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [rejectNotes, setRejectNotes] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('accounts/verifications/?status=PENDING');
      setVerifications(response.data.results || response.data);
      setError('');
    } catch (err) {
      setError('Failed to load pending verifications.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (id, status, notes = '') => {
    try {
      setProcessingId(id);
      await api.post(`accounts/verifications/${id}/verify/`, {
        verification_status: status,
        verification_notes: notes,
      });

      // Remove processed item from queue
      setVerifications(prev => prev.filter(v => v.id !== id));

      if (status === 'REJECTED') {
        setRejectModalOpen(false);
        setRejectNotes('');
      }
    } catch (err) {
      setActionError(`Failed to ${status.toLowerCase()} profile. Please try again.`);
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const banner = (
    <div
      className="w-full min-h-[180px] flex items-center text-white overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage:
          'linear-gradient(to right, #060521 35%, rgba(6,5,33,0.8) 55%, rgba(122,133,198,0.15) 85%), url("/bg-ustp.jpg")',
        backgroundBlendMode: 'multiply',
      }}
    >
      <div className="max-w-7xl w-full mx-auto px-8 flex flex-col gap-2">
        <h2 className="text-4xl font-extrabold tracking-tight leading-tight m-0">
          ID Verification <span className="text-[#FEC956]">Queue</span>
        </h2>
        <p className="text-indigo-200 font-semibold m-0">
          Review and approve pending student registrations.
        </p>
      </div>
    </div>
  );

  return (
    <AdminLayout banner={banner}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center space-x-2">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold text-sm">{error}</span>
            <button
              onClick={fetchPendingVerifications}
              className="ml-auto underline text-red-600 hover:text-red-800 text-sm font-bold cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Action Error Banner */}
        {actionError && (
          <div className="mb-6 p-4 bg-orange-50 text-orange-700 rounded-xl border border-orange-100 flex items-center space-x-2">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold text-sm">{actionError}</span>
            <button
              onClick={() => setActionError('')}
              className="ml-auto text-orange-500 hover:text-orange-700 font-bold text-sm cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          </div>
        ) : verifications.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
            <p className="text-gray-500 mt-1">There are no pending registrations to review.</p>
          </div>
        ) : (
          /* Data Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3 rounded-tl-xl">Student Name</th>
                  <th className="px-4 py-3">Email &amp; Univ ID</th>
                  <th className="px-4 py-3">Program / Year</th>
                  <th className="px-4 py-3">ID Document</th>
                  <th className="px-4 py-3 rounded-tr-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {verifications.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50/60 transition-colors group">
                    {/* Name */}
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      {profile.first_name} {profile.last_name}
                    </td>

                    {/* Email + ID */}
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 font-medium">{profile.email}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {profile.univ_id || 'No University ID'}
                      </div>
                    </td>

                    {/* Program + Year */}
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {profile.course || '—'}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {profile.year_level ? `Year ${profile.year_level}` : '—'}
                      </div>
                    </td>

                    {/* ID Image */}
                    <td className="px-4 py-4">
                      {profile.id_image_url ? (
                        <button
                          onClick={() => setSelectedImage(profile.id_image_url)}
                          className="flex items-center space-x-1.5 text-indigo-600 hover:text-indigo-800 text-sm font-semibold bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <FileImage className="w-4 h-4" />
                          <span>View ID</span>
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400 italic">No Image</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          disabled={processingId === profile.id}
                          onClick={() => handleDecision(profile.id, 'APPROVED')}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        >
                          {processingId === profile.id ? 'Processing…' : 'Approve'}
                        </button>
                        <button
                          disabled={processingId === profile.id}
                          onClick={() => {
                            setSelectedProfileId(profile.id);
                            setRejectModalOpen(true);
                          }}
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Fullscreen Image Viewer Modal ── */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-full">
            <button
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors cursor-pointer"
              onClick={() => setSelectedImage(null)}
            >
              <XCircle className="w-8 h-8" />
            </button>
            <img
              src={selectedImage}
              alt="Student ID"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* ── Rejection Notes Modal ── */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Reject Application</h3>
                <p className="text-xs text-gray-500">This note will be visible to the student.</p>
              </div>
            </div>

            <textarea
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="e.g., Image is blurry, ID appears expired, photo does not match…"
              className="w-full border border-gray-200 rounded-xl p-3 mb-4 h-32 text-sm text-gray-800 focus:ring-2 focus:ring-red-300 focus:border-red-400 outline-none resize-none"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setRejectModalOpen(false);
                  setRejectNotes('');
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={processingId === selectedProfileId || !rejectNotes.trim()}
                onClick={() => handleDecision(selectedProfileId, 'REJECTED', rejectNotes)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {processingId === selectedProfileId ? 'Processing…' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminVerification;
