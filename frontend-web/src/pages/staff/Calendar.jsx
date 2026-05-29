import React, { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import StaffLayout from "../../components/staff/StaffLayout";
import { useRequests } from "../../hooks/useRequests";

export default function Calendar() {
    const { logout, user } = useAuth();
    const { requests, loading, error } = useRequests();
    
    // Add simple month navigation state
    const [currentDate, setCurrentDate] = useState(new Date());

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const calendarDays = [];
    let week = [];
    for (let i = 0; i < firstDay; i++) {
        week.push("");
    }
    for (let day = 1; day <= daysInMonth; day++) {
        week.push(day);
        if (week.length === 7) {
            calendarDays.push(week);
            week = [];
        }
    }
    if (week.length > 0) {
        while (week.length < 7) {
            week.push("");
        }
        calendarDays.push(week);
    }

    const groupedRequests = {};
    requests.forEach((req) => {
        if (!req.est_release_date) return;
        const releaseDate = new Date(req.est_release_date);
        if (isNaN(releaseDate.getTime())) return;
        if (releaseDate.getMonth() === currentMonth && releaseDate.getFullYear() === currentYear) {
            const d = releaseDate.getDate();
            if (!groupedRequests[d]) {
                groupedRequests[d] = [];
            }
            groupedRequests[d].push(req);
        }
    });

    const formattedToday = new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const formattedMonth = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    if (loading) return (
        <StaffLayout>
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        </StaffLayout>
    );

    if (error) return (
        <StaffLayout>
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-200 shadow-sm">
                    <p className="font-semibold">{error}</p>
                </div>
            </div>
        </StaffLayout>
    );

    return (
        <StaffLayout>
            <div className="bg-[#eff6ff] border border-blue-200 rounded-xl p-6 font-sans mx-auto max-w-7xl mt-2 mb-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-blue-300 flex items-center justify-center text-blue-900 shadow-sm">
                            <CalendarDays size={28} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs font-semibold">{formattedToday}</p>
                            <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                                {formattedMonth}
                            </h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handlePrevMonth} className="p-2 rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors shadow-sm">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={handleNextMonth} className="p-2 rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors shadow-sm">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="grid grid-cols-7 bg-[#dbeafe] border-b border-gray-200">
                        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, idx) => (
                            <div key={idx} className={`py-3 text-center text-sm font-bold text-blue-900 ${idx !== 0 ? 'border-l border-gray-200' : ''}`}>
                                {day}
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex flex-col">
                        {calendarDays.map((week, weekIndex) => (
                            <div key={weekIndex} className={`grid grid-cols-7 bg-white ${weekIndex !== calendarDays.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                {week.map((day, dayIndex) => {
                                    const batchRequests = day !== "" ? (groupedRequests[day] || []) : [];
                                    const hasData = batchRequests.length > 0;
                                    const completed = batchRequests.filter(req => req.status === "completed" || req.status === "approved").length;
                                    const pending = batchRequests.filter(req => req.status === "pending").length;
                                    const total = batchRequests.length;
                                    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
                                    
                                    return (
                                        <div key={dayIndex} className={`p-3 min-h-[160px] relative ${dayIndex !== 0 ? 'border-l border-gray-200' : ''} ${day === "" ? 'bg-gray-50' : ''}`}>
                                            {day !== "" && (
                                                <>
                                                    <div className="text-2xl font-normal text-gray-900 mb-2">{day}</div>
                                                    
                                                    {hasData && (
                                                        <div className="space-y-1.5 mt-2">
                                                            <div className={`absolute top-3 right-3 text-white text-[9px] font-bold px-1.5 py-0.5 rounded ${percentage === 100 ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                                                {percentage}%
                                                            </div>
                                                            <div className="bg-green-100 text-green-800 text-[9px] font-medium p-1.5 rounded truncate">
                                                                Release documents from: {
                                                                    batchRequests[0]?.created_at && !isNaN(new Date(batchRequests[0].created_at).getTime())
                                                                        ? new Date(batchRequests[0].created_at).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})
                                                                        : "N/A"
                                                                }
                                                            </div>
                                                            <div className="bg-blue-100 text-blue-800 text-[10px] font-medium p-1.5 rounded flex justify-between">
                                                                <span>Process document:</span> <strong>{total}</strong>
                                                            </div>
                                                            <div className="bg-yellow-100 text-yellow-800 text-[10px] font-medium p-1.5 rounded flex justify-between">
                                                                <span>New requests:</span> <strong>{pending}</strong>
                                                            </div>
                                                            <div className="w-full bg-gray-200 h-1 mt-2 rounded-full overflow-hidden">
                                                                <div className={`h-full rounded-full ${percentage === 100 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${percentage}%` }}></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}   