import React from 'react';
import { RefreshCw } from 'lucide-react';

const AVATAR_COLORS = [
  'bg-emerald-100 text-emerald-800 border-emerald-200',
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-violet-100 text-violet-800 border-violet-200',
  'bg-amber-100 text-amber-800 border-amber-200',
  'bg-rose-100 text-rose-800 border-rose-200',
];

const getInitials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const StaffPerformance = ({ data = [], loading = false, lastUpdated = null }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between h-full animate-pulse">
        <div>
          <div className="h-5 bg-gray-100 rounded w-2/3 mb-2" />
          <div className="h-3 bg-gray-50 rounded w-1/2 mb-6" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-100" />
              <div className="flex-1 h-4 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const updatedText = lastUpdated
    ? `Updated ${new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Live data';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900">Staff Performance Metrics</h3>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
            Productivity analysis
          </p>
        </div>

        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm font-semibold">
            No staff activity recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 text-left">Staff Member</th>
                  <th className="pb-3 text-center">Completed</th>
                  <th className="pb-3 text-center">Pending</th>
                  <th className="pb-3 text-right">Avg. Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {data.map((staff, idx) => (
                  <tr key={staff.id} className="group hover:bg-gray-50/40 transition-colors">
                    <td className="py-4 pr-3 flex items-center space-x-3">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                          AVATAR_COLORS[idx % AVATAR_COLORS.length]
                        }`}
                      >
                        {getInitials(staff.name)}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800 group-hover:text-blue-900 transition-colors block">
                          {staff.name}
                        </span>
                        <span className="text-[11px] text-gray-400 capitalize">{staff.role}</span>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-center font-extrabold text-emerald-600">
                      {staff.completed}
                    </td>
                    <td className="py-4 px-3 text-center font-extrabold text-red-500">
                      {staff.pending}
                    </td>
                    <td className="py-4 pl-3 text-right font-bold text-gray-500">
                      {staff.avg_days !== null && staff.avg_days !== undefined
                        ? `${staff.avg_days}d`
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-1.5">
          <RefreshCw size={11} className="text-gray-300" />
          <span>{updatedText}</span>
        </div>
        <span className="font-semibold text-blue-950">Live</span>
      </div>
    </div>
  );
};

export default StaffPerformance;
