import React, { useState, useEffect, useMemo } from "react";
import axios from "../../api/axios";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import AdminLayout from "../../components/admin/AdminLayout";
import "../../styles/Adminanalytics.css";

// Dynamic color palette generator
const PALETTE = [
  "#1a237e", "#f9a825", "#ef6c00", "#c62828", "#b0bec5",
  "#2e7d32", "#6a1b9a", "#00838f", "#d84315", "#4e342e"
];

function useDynamicDocTypes(apiData) {
  return useMemo(() => {
    if (!apiData?.document_type_distribution) return { docTypes: [], colorMap: {} };
    
    const types = apiData.document_type_distribution.map(d => d.name);
    const colorMap = {};
    types.forEach((type, index) => {
      colorMap[type] = PALETTE[index % PALETTE.length];
    });
    
    return { docTypes: types, colorMap };
  }, [apiData]);
}

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
          onClick={() => setView("weekly")}
          className={`analytics-view-toggle__btn ${view === "weekly" ? "analytics-view-toggle__btn--active" : ""}`}
        >
          Weekly
        </button>
      </div>
    </div>
  );
}

function CustomLegend({ docTypes, colorMap }) {
  return (
    <div className="analytics-legend">
      {docTypes.map((type) => (
        <div key={type} className="analytics-legend__item">
          <div className="analytics-legend__dot" style={{ background: colorMap[type] }} />
          <span className="analytics-legend__label">{type}</span>
        </div>
      ))}
    </div>
  );
}

function RequestVolumeChart({ view, apiData, docTypes, colorMap }) {
  const raw =
    view === "daily"
      ? apiData?.request_volume?.daily || []
      : apiData?.request_volume?.weekly || [];

  const data = raw.map((item) => {
    const formattedItem = { label: item.label };
    docTypes.forEach(type => {
      formattedItem[type] = item.breakdown?.[type] || 0;
    });
    return formattedItem;
  });

  return (
    <div className="analytics-card">
      <div className="analytics-card__title">Request Volume</div>

      <CustomLegend docTypes={docTypes} colorMap={colorMap} />

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />

          {docTypes.map(type => (
            <Bar key={type} dataKey={type} stackId="a" fill={colorMap[type]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function TotalRequestChart({ view, apiData }) {
  const raw =
    view === "daily"
      ? apiData?.request_volume?.daily || []
      : apiData?.request_volume?.weekly || [];

  const data = raw.map((item) => ({
    label: item.label,
    total: item.total,
  }));

  return (
    <div className="analytics-card">
      <div className="analytics-card__title">
        {view === "daily" ? "Daily Total Request" : "Weekly Total Request"}
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
            stroke="#1565c0"
            strokeWidth={2.5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function BreakdownTable({ view, apiData, docTypes }) {
  const rows =
    view === "daily"
      ? apiData?.request_volume?.daily || []
      : apiData?.request_volume?.weekly || [];

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
              <th>{view === "daily" ? "Day" : "Week"}</th>

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

  const { docTypes, colorMap } = useDynamicDocTypes(apiData);

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

        <RequestVolumeChart view={view} apiData={apiData} docTypes={docTypes} colorMap={colorMap} />
        <TotalRequestChart view={view} apiData={apiData} />
        <BreakdownTable view={view} apiData={apiData} docTypes={docTypes} />
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;