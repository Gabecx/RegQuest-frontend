import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DocumentTypeDistribution from '../../components/admin/DocumentTypeDistribution';
import StaffPerformance from '../../components/admin/StaffPerformance';
import RequestVolumeChart from '../../components/admin/RequestVolumeChart';
import UserRoleManagement from '../../components/admin/UserRoleManagement';

const AdminDashboard = () => {
  const bannerStyle = {
    backgroundImage: 'linear-gradient(to right, #060521 35%, rgba(6, 5, 33, 0.8) 55%, rgba(122, 133, 198, 0.15) 85%), url("/bg-ustp.jpg")',
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
          System Analytics & User Management
        </p>
      </div>
    </div>
  );


  return (
    <AdminLayout banner={banner}>
      <div className="space-y-12">
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Request Logs & Reports</h3>
            <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
              Transaction logs and historical analysis
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DocumentTypeDistribution />
            <StaffPerformance />
          </div>
        </div>

        <RequestVolumeChart />

        <UserRoleManagement />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
