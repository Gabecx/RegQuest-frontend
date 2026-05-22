import React from 'react';

const RecentDocumentsTable = () => {
  const documents = [
    {
      trackingNo: 'RQ-2026-0081',
      docType: 'Transcript of Records',
      studentName: 'Maria Isabella Cruz',
      status: 'Pending',
      date: 'May 22, 2026',
    },
    {
      trackingNo: 'RQ-2026-0080',
      docType: 'Honorable Dismissal',
      studentName: 'John Mark Santos',
      status: 'Released',
      date: 'May 21, 2026',
    },
    {
      trackingNo: 'RQ-2026-0079',
      docType: 'Certificate of Enrollment',
      studentName: 'Angela Mae Flores',
      status: 'Released',
      date: 'May 21, 2026',
    },
    {
      trackingNo: 'RQ-2026-0078',
      docType: 'Evaluation Report',
      studentName: 'Joshua David King',
      status: 'In Progress',
      date: 'May 20, 2026',
    },
    {
      trackingNo: 'RQ-2026-0077',
      docType: 'Transcript of Records',
      studentName: 'Patricia Anne Lim',
      status: 'Rejected',
      date: 'May 19, 2026',
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Released':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            Released
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
            Pending
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
            In Progress
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-700 border border-gray-100">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Recent Documents Requested</h3>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Real-time request queue</p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-6">
        <div className="inline-block min-w-full align-middle px-6">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="pb-3 text-left">Tracking No.</th>
                <th className="pb-3 text-left">Document Type</th>
                <th className="pb-3 text-left">Student Name</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {documents.map((doc, idx) => (
                <tr key={idx} className="group hover:bg-gray-50/40 transition-colors">
                  <td className="py-4 pr-3 text-left font-extrabold text-blue-900 tracking-tight">
                    {doc.trackingNo}
                  </td>
                  <td className="py-4 px-3 text-left font-semibold text-gray-800">
                    {doc.docType}
                  </td>
                  <td className="py-4 px-3 text-left font-semibold text-gray-600">
                    {doc.studentName}
                  </td>
                  <td className="py-4 px-3 text-center">
                    {getStatusBadge(doc.status)}
                  </td>
                  <td className="py-4 pl-3 text-right font-semibold text-gray-500">
                    {doc.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentDocumentsTable;
