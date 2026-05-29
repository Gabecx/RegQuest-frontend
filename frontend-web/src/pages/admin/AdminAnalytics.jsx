import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import AdminLayout from "../../components/admin/AdminLayout";
import "../../styles/Adminanalytics.css";

const COLORS = {
  transcript: "#1a237e",
  honorable: "#f9a825",
  evaluation: "#ef6c00",
  car: "#c62828",
  enrolled: "#b0bec5",
  line: "#1565c0",
};

function PageHeader({ view, setView }) {
  return (
    <div className="analytics-page-header">
      <div className="analytics-page-header__left">
        <div className="analytics-page-header__icon">↗</div>
        <div>
          <div className="analytics-page-header__title">Analytics & Graphs</div>
          <div className="analytics-page-header__sub">
            Document request trends and insights
          </div>
        </div>
      </div>

      <div className="analytics-view-toggle">
        <button
          onClick={() => setView("daily")}
          className={`analytics-view-toggle__btn ${view === "daily" ? "analytics-view-toggle__btn--active" : ""}`}
        >
          Daily
        </button>

        <button
          onClick={() => setView("monthly")}
          className={`analytics-view-toggle__btn ${view === "monthly" ? "analytics-view-toggle__btn--active" : ""}`}
        >
          Monthly
        </button>
      </div>
    </div>
  );
}

function CustomLegend() {
  const items = [
    { color: COLORS.transcript, label: "Transcript of records" },
    { color: COLORS.honorable, label: "Honorable Dismissal" },
    { color: COLORS.evaluation, label: "Evaluation" },
    { color: COLORS.car, label: "CAR" },
    { color: COLORS.enrolled, label: "Officially enrolled" },
  ];

  return (
    <div className="analytics-legend">
      {items.map((item) => (
        <div key={item.label} className="analytics-legend__item">
          <div className="analytics-legend__dot" style={{ background: item.color }} />
          <span className="analytics-legend__label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function RequestVolumeChart({ view, apiData }) {
  const raw =
    view === "daily"
      ? apiData?.request_volume?.daily || []
      : apiData?.request_volume?.monthly || [];

  const data = raw.map((item) => ({
    label: item.label,
    transcript: item.breakdown["Transcript of Record"] || 0,
    honorable: item.breakdown["Honorable Dismissal"] || 0,
    evaluation: item.breakdown["Evaluation"] || 0,
    car: item.breakdown["CAR"] || 0,
    enrolled: item.breakdown["Officially Enrolled"] || 0,
  }));

  return (
    <div className="analytics-card">
      <div className="analytics-card__title">Request Volume</div>

      <CustomLegend />

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />

          <Bar dataKey="transcript" stackId="a" fill={COLORS.transcript} />
          <Bar dataKey="honorable" stackId="a" fill={COLORS.honorable} />
          <Bar dataKey="evaluation" stackId="a" fill={COLORS.evaluation} />
          <Bar dataKey="car" stackId="a" fill={COLORS.car} />
          <Bar dataKey="enrolled" stackId="a" fill={COLORS.enrolled} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function TotalRequestChart({ view, apiData }) {
  const raw =
    view === "daily"
      ? apiData?.request_volume?.daily || []
      : apiData?.request_volume?.monthly || [];

  const data = raw.map((item) => ({
    label: item.label,
    total: item.total,
  }));

  return (
    <div className="analytics-card">
      <div className="analytics-card__title">
        {view === "daily" ? "Daily Total Request" : "Monthly Total Request"}
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="total"
            stroke={COLORS.line}
            strokeWidth={2.5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function BreakdownTable({ view, apiData }) {
  const rows =
    view === "daily"
      ? apiData?.request_volume?.daily || []
      : apiData?.request_volume?.monthly || [];

  const docTypes = [
    "Transcript of Record",
    "Honorable Dismissal",
    "Evaluation",
    "CAR",
    "Officially Enrolled",
  ];

  const totals = docTypes.map((type) =>
    rows.reduce((sum, r) => sum + (r.breakdown?.[type] || 0), 0)
  );

  const grandTotal = rows.reduce((sum, r) => sum + (r.total || 0), 0);

  return (
    <div className="analytics-card">
      <div className="analytics-card__title">
        Document Type Breakdown
      </div>

      <div className="analytics-table-wrapper">
        <table className="analytics-table">
          <thead>
            <tr>
              <th>{view === "daily" ? "Day" : "Month"}</th>

              {docTypes.map((t) => (
                <th key={t}>{t}</th>
              ))}

              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td>{row.label}</td>

                {docTypes.map((t) => (
                  <td key={t}>{row.breakdown?.[t] || 0}</td>
                ))}

                <td>{row.total}</td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td><strong>Total</strong></td>

              {totals.map((t, i) => (
                <td key={i}><strong>{t}</strong></td>
              ))}

              <td><strong>{grandTotal}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

const AdminAnalytics = () => {
  const [view, setView] = useState("daily");
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("requests/dashboard/");
      setApiData(res.data);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="analytics-main">
          <div className="analytics-loading">
            <div className="analytics-loading__spinner" />
            <span>Loading analytics...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

    if (error) {
    return (
      <AdminLayout>
        <div className="analytics-main">
          <div className="analytics-error">
            <span>{error}</span>
            <button className="analytics-error__retry" onClick={fetchDashboard}>
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="analytics-main">
        <PageHeader view={view} setView={setView} />

        <RequestVolumeChart view={view} apiData={apiData} />
        <TotalRequestChart view={view} apiData={apiData} />
        <BreakdownTable view={view} apiData={apiData} />
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;