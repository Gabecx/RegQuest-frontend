import React from "react";

export default function RequestPreview({
    requests
}) {

    return (

        <section className="preview-card">

            <div className="preview-top">

                <h3>
                    Requests
                </h3>

                <a href="/staff/process-requests">
                    View All
                </a>

            </div>

            <table className="preview-table">

                <thead>

                    <tr>

                        <th>
                            Student
                        </th>

                        <th>
                            Document
                        </th>

                        <th>
                            Status
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {requests
                        .slice(0, 5)
                        .map((req) => (

                            <tr key={req.id}>

                                <td>
                                    {req.student_name}
                                </td>

                                <td>
                                    {req.document_name}
                                </td>

                                <td>
                                    {req.status}
                                </td>

                            </tr>

                        ))}

                </tbody>

            </table>

        </section>

    );
}