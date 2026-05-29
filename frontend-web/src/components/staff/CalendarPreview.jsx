import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ChevronDown } from "lucide-react";

export default function CalendarPreview({ requests = [], loading, error }) {
    const [calendarData, setCalendarData] = useState([]);

    useEffect(() => {
        const today = new Date();
        const next7Days = Array.from({length: 7}).map((_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            return d;
        });

        const formattedData = next7Days.map(date => {
            const dayStr = date.toDateString();
            
            // Filter requests that are estimated to be released on this day
            const dayRequests = requests.filter(req => {
                if (!req.est_release_date) return false;
                const reqDate = new Date(req.est_release_date);
                return !isNaN(reqDate.getTime()) && reqDate.toDateString() === dayStr;
            });
            
            const total = dayRequests.length;
            const pending = dayRequests.filter(r => r.status === 'pending').length;
            const completed = dayRequests.filter(r => r.status === 'completed' || r.status === 'approved').length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

            let oldestDate = null;
            if (total > 0) {
                const dates = dayRequests.map(r => new Date(r.created_at).getTime()).filter(t => !isNaN(t));
                if (dates.length > 0) {
                    oldestDate = new Date(Math.min(...dates));
                }
            }
            
            return {
                date,
                dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
                dayNumber: date.getDate(),
                newRequests: pending,
                processCount: total,
                completedPercentage: percentage,
                hasData: total > 0,
                oldestDate: oldestDate
            };
        });

        setCalendarData(formattedData);
    }, [requests]);

    const formattedToday = new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div className="bg-[#eff6ff] border border-blue-200 rounded-xl p-6 font-sans mt-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-blue-300 flex items-center justify-center text-blue-900 shadow-sm">
                    <CalendarDays size={28} />
                </div>
                <div>
                    <p className="text-gray-500 text-xs font-semibold">{formattedToday}</p>
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">Calendar</h3>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-7 bg-[#dbeafe] border-b border-gray-200">
                    {calendarData.map((item, idx) => (
                        <div key={idx} className={`py-3 text-center text-sm font-bold text-blue-900 ${idx !== 0 ? 'border-l border-gray-200' : ''}`}>
                            {item.dayName}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 bg-white min-h-[220px]">
                    {calendarData.map((item, idx) => (
                        <div key={idx} className={`p-3 relative ${idx !== 0 ? 'border-l border-gray-200' : ''}`}>
                            <div className="text-2xl font-normal text-gray-900 mb-2">{item.dayNumber}</div>
                            
                            {item.hasData && (
                                <div className="space-y-1.5 mt-4">
                                    <div className={`absolute top-3 right-3 text-white text-[9px] font-bold px-1.5 py-0.5 rounded ${item.completedPercentage === 100 ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                        {item.completedPercentage}%
                                    </div>
                                    <div className="bg-green-100 text-green-800 text-[9px] font-medium p-1.5 rounded truncate">
                                        Release documents from: {item.oldestDate ? item.oldestDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}) : "N/A"}
                                    </div>
                                    <div className="bg-blue-100 text-blue-800 text-[10px] font-medium p-1.5 rounded flex justify-between">
                                        <span>Process document:</span> <strong>{item.processCount}</strong>
                                    </div>
                                    <div className="bg-yellow-100 text-yellow-800 text-[10px] font-medium p-1.5 rounded flex justify-between">
                                        <span>New requests:</span> <strong>{item.newRequests}</strong>
                                    </div>
                                    <div className="w-full bg-gray-200 h-1 mt-2 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${item.completedPercentage === 100 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${item.completedPercentage}%` }}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center mt-5">
                <Link to="/staff/processing-calendar" className="inline-flex items-center gap-1 text-blue-900 font-bold text-sm hover:underline">
                    View All <ChevronDown size={16} />
                </Link>
            </div>
        </div>
    );
}