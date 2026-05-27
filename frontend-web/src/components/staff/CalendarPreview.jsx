import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {CalendarDays} from "lucide-react";
import { WEEKDAYS } from "../../utils/constants";
import "../../styles/Calendar.css";

export default function CalendarPreview({ requests = [], loading, error }) {
    const [calendarData, setCalendarData] = useState([]);

    useEffect(() => {
        const groupedData = Object.create(null);
        
        requests.forEach((req) => {
            if (!req?.scheduled_date) return;
            const reqDate = new Date(req.scheduled_date);
            if (isNaN(reqDate.getTime())) return;

            const day = reqDate.getDate();
            if (!groupedData[day]) {
                groupedData[day] = [];
            }
            groupedData[day].push(req);
        });

        const formattedData = Object.entries(groupedData)
            .slice(0, 7)
            .map(([day, reqs]) => ({
                day,
                total: reqs.length,
            }));

        setCalendarData(formattedData);
    }, [requests]);

    return (
        <div className="dashboard-calendar-preview">
            <section className="calendar-card-main">
                <div className="calendar-header">
                    <div className="calendar-icon">
                        <CalendarDays size={24} />
                    </div>

                    <div>
                        <h2>Calendar</h2>
                        <p>
                            Upcoming request batches
                        </p>
                    </div>
                </div>

                <div className="calendar-grid weekday-header">
                    {WEEKDAYS.map((day) => (
                        <div key={day}>
                            {day}
                        </div>
                    ))}
                </div>

                <div className="calendar-grid">
                    {calendarData.map((item, index) => (
                        <div
                            className="calendar-cell"
                            key={index}
                        >

                            <div className="day-number">
                                {item.day}
                            </div>

                            <div className="batch-card">

                                <div className="batch-top">

                                    <span className="batch-status">
                                        Active {/* This is hardcoded. Consider making it dynamic based on request status. */}
                                    </span>

                                </div>

                                <p>Batch #{item.day}</p>
                                <small>{item.total} Requests</small>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="calendar-preview-footer">
                    <Link
                        to="/staff/processing-calendar"
                        className="view-all-link"
                    >
                        View Full Calendar
                    </Link>
                </div>
            </section>
        </div>
    );
}