import React, { useEffect, useState } from "react";
import { Brain, FileBox, AlertCircle, Clock, CheckCircle } from "lucide-react";
import StaffLayout from "../../components/staff/StaffLayout";
import CalendarPreview from "../../components/staff/CalendarPreview";
import RequestPreview from "./RequestPreview";
import { useRequests } from "../../hooks/useRequests";

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

  const documentCounts = {};
  requests.forEach(req => {
    const name = req.document_name || 'Other';
    documentCounts[name] = (documentCounts[name] || 0) + 1;
  });
  const dynamicDocs = Object.keys(documentCounts).map(name => ({
    name,
    count: documentCounts[name]
  }));

  if (loading) {
    return (
      <StaffLayout>
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading dashboard data...</p>
      </StaffLayout>
    );
  }

  if (error) {
    return (
      <StaffLayout>
        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>Error: {error}</p>
      </StaffLayout>
    );
  }

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const bannerStyle = {
    backgroundImage:
      'linear-gradient(to right, #060521 35%, rgba(6, 5, 33, 0.8) 55%, rgba(122, 133, 198, 0.15) 85%), url("/bg-ustp.jpg")',
    backgroundBlendMode: 'multiply',
  };

  const banner = (
    <div
      className="w-full min-h-[220px] flex items-center text-white overflow-hidden bg-[#7A85C6] bg-cover bg-right-center bg-no-repeat"
      style={bannerStyle}
    >
      <div className="max-w-7xl w-full mx-auto px-8 flex flex-col gap-2">
        <h2 className="text-5xl font-extrabold tracking-tight leading-tight m-0">
          Registrar Staff <span className="text-[#FEC956]">Dashboard</span>
        </h2>
        <p className="text-base font-semibold text-indigo-200 m-0">
          Manage and process student document requests
        </p>
      </div>
    </div>
  );

  return (
    <StaffLayout banner={banner}>

      <div className="space-y-6 font-sans">
        
        {/* Documents Overview */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{formattedDate}</p>
              <h2 className="text-[32px] font-extrabold text-gray-900 mt-0.5 leading-tight">{totalRequests} Documents</h2>
              <p className="text-gray-500 text-sm font-medium">Targeted for completion today</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dynamicDocs.length === 0 ? (
              <p className="text-gray-500">No documents requested yet.</p>
            ) : (
              dynamicDocs.map((doc, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl p-5">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-gray-700 font-semibold text-sm w-3/4">{doc.name}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold text-white ${doc.count > 5 ? 'bg-red-500' : 'bg-orange-500'}`}>
                      {doc.count > 5 ? 'High' : 'Medium'}
                    </span>
                  </div>
                  <h3 className="text-4xl font-extrabold text-gray-900">{doc.count}</h3>
                  <p className="text-gray-400 text-xs font-semibold mt-1">copies</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Requests */}
          <div className="bg-white border border-gray-200 border-l-[6px] border-l-gray-400 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-gray-900 font-bold text-sm">Total Requests</p>
              <FileBox className="text-gray-400" size={18} />
            </div>
            <h3 className="text-4xl font-extrabold text-gray-900 mt-3 mb-1">{totalRequests}</h3>
            <p className="text-gray-400 text-xs font-semibold">All Time</p>
          </div>
          
          {/* Pending */}
          <div className="bg-white border border-gray-200 border-l-[6px] border-l-orange-400 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-gray-900 font-bold text-sm">Pending</p>
              <AlertCircle className="text-orange-400" size={18} />
            </div>
            <h3 className="text-4xl font-extrabold text-gray-900 mt-3 mb-1">{pendingRequests}</h3>
            <p className="text-gray-400 text-xs font-semibold">Need Attention</p>
          </div>

          {/* Processing */}
          <div className="bg-white border border-gray-200 border-l-[6px] border-l-[#6366f1] rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-gray-900 font-bold text-sm">Processing</p>
              <Clock className="text-[#6366f1]" size={18} />
            </div>
            <h3 className="text-4xl font-extrabold text-gray-900 mt-3 mb-1">{processingRequests}</h3>
            <p className="text-gray-400 text-xs font-semibold">In progress</p>
          </div>

          {/* Completed */}
          <div className="bg-white border border-gray-200 border-l-[6px] border-l-[#4ade80] rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-gray-900 font-bold text-sm">Completed Today</p>
              <CheckCircle className="text-[#4ade80]" size={18} />
            </div>
            <h3 className="text-4xl font-extrabold text-gray-900 mt-3 mb-1">{completedRequests}</h3>
            <p className="text-gray-400 text-xs font-semibold">Released</p>
          </div>
        </div>

        {/* Predicted Insight */}
        <div className="bg-[#DCE4FE] rounded-xl p-6 shadow-sm border border-indigo-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-[#A4B5F9] text-[#00007F] p-2 rounded-lg">
              <Brain size={24} />
            </div>
            <h3 className="text-[#00007F] text-2xl font-bold tracking-tight">Predicted Insight this week</h3>
          </div>
          <div className="bg-[#7D91E1] rounded-md p-5 border border-indigo-400">
            <ul className="space-y-4">
              <li className="flex items-center space-x-4 text-gray-900 text-sm font-medium">
                <span className="w-2 h-2 bg-[#00007F] rounded-full flex-shrink-0"></span>
                <span>Request volume is expected to peak <strong className="font-extrabold text-black">this week</strong> with approximately <strong className="font-extrabold text-black">25 requests</strong></span>
              </li>
              <li className="flex items-center space-x-4 text-gray-900 text-sm font-medium">
                <span className="w-2 h-2 bg-[#00007F] rounded-full flex-shrink-0"></span>
                <span>Transcript of records requests show <strong className="font-extrabold text-black">+8% growth trend</strong></span>
              </li>
              <li className="flex items-center space-x-4 text-gray-900 text-sm font-medium">
                <span className="w-2 h-2 bg-[#00007F] rounded-full flex-shrink-0"></span>
                <span>Model accuracy based on last 4 weeks: <strong className="font-extrabold text-black">87% confidence</strong></span>
              </li>
            </ul>
          </div>
        </div>

        <CalendarPreview requests={requests} loading={loading} error={error} />
        <RequestPreview requests={requests} loading={loading} error={error} refetchRequests={refetchRequests} />
      </div>
    </StaffLayout>
  );
}