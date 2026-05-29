import React, { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DocumentTypeDistribution from '../../components/admin/DocumentTypeDistribution';
import StaffPerformance from '../../components/admin/StaffPerformance';
import RequestVolumeChart from '../../components/admin/RequestVolumeChart';
import UserRoleManagement from '../../components/admin/UserRoleManagement';
import api from '../../api/axios';
import { RefreshCw, AlertCircle, Brain } from 'lucide-react';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('requests/dashboard/');
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load dashboard analytics:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(() => fetchAnalytics(true), 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

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
          Registrar Admin <span className="text-[#FEC956]">Dashboard</span>
        </h2>
        <p className="text-base font-semibold text-indigo-200 m-0">
          System Analytics &amp; User Management
        </p>
      </div>
    </div>
  );

  return (
    <AdminLayout banner={banner}>
      <div className="space-y-12">
        <div className="space-y-6">
          <div className="bg-[#DCE4FE] rounded-xl p-6 shadow-sm border border-indigo-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-[#A4B5F9] text-[#00007F] p-2 rounded-lg">
                <Brain size={24} />
              </div>
              <h3 className="text-[#00007F] text-2xl font-bold">Predicted Insight this week</h3>
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

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Request Logs &amp; Reports</h3>
              <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
                Transaction logs and historical analysis
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {analytics?.meta?.generated_at && (
                <span className="text-xs text-gray-400 font-medium hidden sm:block">
                  Last updated:{' '}
                  {new Date(analytics.meta.generated_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
              <button
                onClick={() => fetchAnalytics(true)}
                disabled={refreshing || loading}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
                <span>{refreshing ? 'Refreshing…' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-3 bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold">
              <AlertCircle size={16} />
              <span>{error}</span>
              <button
                onClick={() => fetchAnalytics()}
                className="ml-auto underline text-red-600 hover:text-red-800 cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DocumentTypeDistribution
              data={analytics?.document_type_distribution ?? []}
              loading={loading}
            />
            <StaffPerformance
              data={analytics?.staff_performance ?? []}
              loading={loading}
              lastUpdated={analytics?.meta?.generated_at}
            />
          </div>
        </div>

        <RequestVolumeChart
          dailyData={analytics?.request_volume?.daily ?? []}
          weeklyData={analytics?.request_volume?.weekly ?? []}
          loading={loading}
        />

        <UserRoleManagement />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
