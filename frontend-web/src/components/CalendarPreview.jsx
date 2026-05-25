import React from "react";

export default function CalendarPreview() {

    return (

        <section className="preview-card">

            <div className="preview-top">

                <h3>
                    Calendar
                </h3>

                <a href="/staff/calendar">
                    View All
                </a>

            </div>

            <div className="calendar-preview-grid">

                <div className="calendar-preview-day">

                    <strong>
                        4
                    </strong>

                    <span>
                        3 Batches
                    </span>

                </div>

                <div className="calendar-preview-day">

                    <strong>
                        5
                    </strong>

                    <span>
                        2 Batches
                    </span>

                </div>

                <div className="calendar-preview-day">

                    <strong>
                        6
                    </strong>

                    <span>
                        5 Batches
                    </span>

                </div>

            </div>

        </section>

    );
}