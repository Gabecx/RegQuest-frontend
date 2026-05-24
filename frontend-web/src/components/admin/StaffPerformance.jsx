import React from 'react';

const StaffPerformance = () => {
  const staffData = [
    {
      name: 'Maria Santos',
      completed: 45,
      pending: 3,
      avgTime: '2.1 days',
      avatarColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      name: 'Juan Dela Cruz',
      completed: 38,
      pending: 4,
      avgTime: '2.4 days',
      avatarColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900">Staff Performance Metrics</h3>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Productivity analysis</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="pb-3 text-left">Staff Members</th>
                <th className="pb-3 text-center">Completed</th>
                <th className="pb-3 text-center">Pending</th>
                <th className="pb-3 text-right">Avg. Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {staffData.map((staff, idx) => (
                <tr key={idx} className="group hover:bg-gray-50/40 transition-colors">
                  <td className="py-4 pr-3 flex items-center space-x-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border ${staff.avatarColor}`}>
                      {staff.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-semibold text-gray-800 group-hover:text-blue-900 transition-colors">
                      {staff.name}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-center font-extrabold text-emerald-600">
                    {staff.completed}
                  </td>
                  <td className="py-4 px-3 text-center font-extrabold text-red-500">
                    {staff.pending}
                  </td>
                  <td className="py-4 pl-3 text-right font-bold text-gray-500">
                    {staff.avgTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
        <span>Updated 5 mins ago</span>
        <span className="font-semibold text-blue-950">Active Shifts</span>
      </div>
    </div>
  );
};

export default StaffPerformance;
