import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DocumentTypeDistribution from '../../components/admin/DocumentTypeDistribution';
import StaffPerformance from '../../components/admin/StaffPerformance';
import RequestVolumeChart from '../../components/admin/RequestVolumeChart';
import UserRoleManagement from '../../components/admin/UserRoleManagement';

const AdminDashboard = () => {
  const banner = (
    <div 
      style={{
        width: '100%',
        minHeight: '220px',
        display: 'flex',
        alignItems: 'center',
        color: '#ffffff',
        overflow: 'hidden',
        backgroundColor: '#7A85C6',
        backgroundImage: 'linear-gradient(to right, #060521 35%, rgba(6, 5, 33, 0.8) 55%, rgba(122, 133, 198, 0.15) 85%), url("/bg-ustp.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'right center',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: 'multiply'
      }}
    >
      <div className="max-w-7xl w-full mx-auto px-8" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.025em', lineHeight: '1.2', margin: 0 }}>
          Registrar Admin <span style={{ color: '#FEC956' }}>Dashboard</span>
        </h2>
        <p style={{ fontSize: '16px', fontWeight: '600', color: '#C7D2FE', margin: 0 }}>
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
