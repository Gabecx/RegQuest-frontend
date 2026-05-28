import React, {useEffect,useState} from "react";
import { CalendarDays } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import StaffHeader from "../../components/staff/StaffHeader";
import StaffTabs from "../../components/staff/StaffTabs";
import { WEEKDAYS } from "../../utils/constants";
import "../../styles/Calendar.css";
import api from "../../api/axios";
import "../../styles/Calendar.css";

export default function Calendar() {
    const { logout, user } = useAuth();
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response =await api.get( "/requests/");
            setRequests(response.data);
        } catch (error) {console.error(
                "Failed to fetch requests",
                error
            );
        }
    };

    const currentDate =new Date();
    const currentYear =currentDate.getFullYear();
    const currentMonth =currentDate.getMonth();
    const firstDay = new Date(currentYear,currentMonth,1).getDay();
    const daysInMonth =new Date(currentYear,currentMonth + 1,0).getDate();
    const calendarDays = [];

    let week = [];
    for (
        let i = 0;
        i < firstDay;
        i++
    ) {
        week.push("");

    }
    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {
        week.push(day);
        if (week.length === 7) {
            calendarDays.push(
                week
            );

            week = [];
        }
    }

    if (week.length > 0) {
        while (week.length < 7) {
            week.push("");
        }
        calendarDays.push(
            week
        );
    }
    const groupedRequests = {};
    requests.forEach((req) => {
        if (!req.est_release_date) return;
        const releaseDate = new Date(req.est_release_date);
        if (isNaN(releaseDate.getTime())) return;
        if (
            releaseDate.getMonth() === currentMonth &&
            releaseDate.getFullYear() === currentYear
        ) {
            const d = releaseDate.getDate();
            if (!groupedRequests[d]) {
                groupedRequests[d] = [];
            }
            groupedRequests[d].push(req);
        }
    });
    return (

        <div className="calendar-page">
            <StaffHeader />
            <StaffTabs />

            <section className="calendar-card-main">
                <div className="calendar-header">
                    <div className="calendar-icon">
                        <CalendarDays size={24} />
                    </div>
                    <div>
                        <p>
                            {new Date().toLocaleDateString(
                                "en-US",
                                {
                                    weekday:
                                        "long",
                                    month:
                                        "long",
                                    year:
                                        "numeric"
                                }
                            )}
                        </p>
                        <h2>
                            {new Date().toLocaleDateString(
                                "en-US",
                                {
                                    month:
                                        "long",
                                    year:
                                        "numeric"
                                }
                            )}
                        </h2>
                    </div>
                </div>

                <div className="calendar-grid weekday-header">
                    <div>Sunday</div>
                    <div>Monday</div>
                    <div>Tuesday</div>
                    <div>Wednesday</div>
                    <div>Thursday</div>
                    <div>Friday</div>
                    <div>Saturday</div>
                </div>

                {calendarDays.map((week,weekIndex) => (
                        <div key={weekIndex} className="calendar-grid">

                            {week.map((day,dayIndex) => (
                                    <div key={dayIndex} className="calendar-cell">
                                        <div className="day-number">{day}</div>
                                        
                                        {day !== "" &&
                                            (() => {
                                                const batchRequests = groupedRequests[day] || [];
                                                if (batchRequests.length ===0)
                                                    return null;
                                                const completed =
                                                    batchRequests.filter(
                                                        (
                                                            req
                                                        ) =>
                                                            req.status ===
                                                                "completed" ||
                                                            req.status ===
                                                                "approved"
                                                    ).length;
                                                const total =batchRequests.length;
                                                const percentage =
                                                    Math.round(
                                                        (
                                                            completed /
                                                            total
                                                        ) *
                                                            100
                                                    ) || 0;
                                                return (
                                                    <div className="batch-card">
                                                        <div className="batch-top">
                                                            <span className="batch-status">
                                                                {percentage ===
                                                                100
                                                                    ? "Completed"
                                                                    : "Processing"}
                                                            </span>
                                                        </div>
                                                        <p>Batch Release</p>
                                                        <small>
                                                            {total}
                                                            {" "}
                                                            Requests
                                                        </small>
                                                        <div className="batch-progress">
                                                            <div className="progress-top">
                                                                <span>
                                                                    {completed}
                                                                    {" / "}
                                                                    {total}</span>
                                                                <span>{percentage}%</span>
                                                            </div>
                                                            <div className="progress-bar">
                                                                <div
                                                                    className="progress-fill"
                                                                    style={{
                                                                        width: `${percentage}%`
                                                                    }}
                                                                />
                                                            </div>                                            
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                    </div>
                                )
                            )}

                        </div>
                    )
                )}
            </section>
        </div>
    );
}   