import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const RequestVolumeChart = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('daily'); // 'daily' or 'monthly'

  // Colors mapping matching the screenshot
  const colors = {
    transcript: '#0000D8', // dark blue
    dismissal: '#FEC956', // yellow
    evaluation: '#F97316', // orange
    car: '#EF4444', // red
    enrolled: '#6D82F4', // light blue
    total: '#1F2937', // dark grey/black
  };

  const legendItems = [
    { name: 'Transcript of records', color: colors.transcript },
    { name: 'Honorable Dismissal', color: colors.dismissal },
    { name: 'Evaluation', color: colors.evaluation },
    { name: 'CAR', color: colors.car },
    { name: 'Officially enrolled', color: colors.enrolled },
    { name: 'Total (line)', color: colors.total, isLine: true },
  ];

  // Grid levels for Y axis (0 to 45)
  const yLevels = [45, 40, 35, 30, 25, 20, 15, 10, 5, 0];

  // Coordinates mapping
  const chartHeight = 200; // max Y pixel coordinate range
  const chartWidth = 1000;
  const paddingLeft = 40;
  const paddingTop = 20;

  const getX = (index) => paddingLeft + (chartWidth / 7) * (index + 0.5);
  const getY = (val) => paddingTop + chartHeight - (val / 45) * chartHeight;

  // Data matching the screenshot:
  // Bars values: [Transcript, Dismissal, Evaluation, CAR, Enrolled]
  const dailyData = [
    { day: 'Mon', bars: [2.0, 1.2, 1.2, 1.2, 2.5], lineVal: 23 },
    { day: 'Tue', bars: [1.2, 2.5, 2.5, 2.5, 3.8], lineVal: 34 },
    { day: 'Wed', bars: [2.0, 2.5, 2.5, 2.5, 5.0], lineVal: 42 },
    { day: 'Thu', bars: [3.5, 1.8, 2.2, 2.2, 1.8], lineVal: 34 },
    { day: 'Fri', bars: [0, 0, 0, 0, 0], lineVal: 1 },
    { day: 'Sat', bars: [0, 0, 0, 0, 0], lineVal: 1 },
    { day: 'Sun', bars: [0, 0, 0, 0, 0], lineVal: 1 },
  ];

  const monthlyData = [
    { day: 'Week 1', bars: [12, 8, 10, 9, 15], lineVal: 54 },
    { day: 'Week 2', bars: [15, 12, 14, 11, 20], lineVal: 72 },
    { day: 'Week 3', bars: [22, 14, 18, 15, 28], lineVal: 97 },
    { day: 'Week 4', bars: [18, 10, 12, 10, 18], lineVal: 68 },
    { day: 'Week 5', bars: [8, 4, 6, 5, 10], lineVal: 33 },
    { day: 'Week 6', bars: [0, 0, 0, 0, 0], lineVal: 1 },
    { day: 'Week 7', bars: [0, 0, 0, 0, 0], lineVal: 1 },
  ];

  const data = timeframe === 'daily' ? dailyData : monthlyData;

  // Draw line path
  const linePoints = data.map((d, i) => `${getX(i)},${getY(timeframe === 'daily' ? d.lineVal : (d.lineVal / 100) * 45)}`).join(' ');

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      {/* Chart Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Request Volume</h3>
        </div>
        <div className="flex bg-gray-50 border border-gray-100 rounded-xl p-1">
          <button
            onClick={() => setTimeframe('daily')}
            className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              timeframe === 'daily'
                ? 'bg-blue-950 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              timeframe === 'monthly'
                ? 'bg-blue-950 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Legends */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
        {legendItems.map((item) => (
          <div key={item.name} className="flex items-center space-x-1.5">
            {item.isLine ? (
              <div className="flex items-center space-x-1">
                <span className="w-5 h-[2px] bg-gray-400 inline-block"></span>
                <span className="w-2 h-2 rounded-full bg-gray-950 inline-block -ml-3.5"></span>
              </div>
            ) : (
              <span 
                className="w-3.5 h-3.5 rounded-[4px] inline-block"
                style={{ backgroundColor: item.color }}
              ></span>
            )}
            <span>{item.name}</span>
          </div>
        ))}
      </div>

      {/* SVG Chart */}
      <div className="w-full overflow-x-auto">
        <svg 
          viewBox={`0 0 ${chartWidth + 60} ${chartHeight + 60}`} 
          className="w-full min-w-[800px] h-auto max-h-[280px]"
        >
          {/* Grid lines & Y Axis labels */}
          {yLevels.map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                {/* Grid Line */}
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={paddingLeft + chartWidth} 
                  y2={y} 
                  stroke="#F3F4F6" 
                  strokeWidth="1.5" 
                />
                {/* Y label */}
                <text 
                  x={paddingLeft - 12} 
                  y={y + 4} 
                  textAnchor="end" 
                  className="text-[11px] font-bold fill-gray-400"
                >
                  {timeframe === 'daily' ? val : `${val * 2}%`}
                </text>
              </g>
            );
          })}

          {/* Stacked Bars & X axis labels */}
          {data.map((d) => {
            const x = getX(data.indexOf(d));
            const barWidth = 32;
            let currentY = getY(0);

            // Scale factor if monthly (bars are larger)
            const scale = timeframe === 'daily' ? 1.5 : 0.8;

            return (
              <g key={d.day}>
                {/* Draw stacked bars */}
                {d.bars.map((heightVal, barIdx) => {
                  if (heightVal === 0) return null;
                  const barHeight = heightVal * scale * 5.7; // scaled height
                  const y = currentY - barHeight;
                  const rect = (
                    <rect
                      key={barIdx}
                      x={x - barWidth / 2}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill={
                        barIdx === 0 ? colors.transcript :
                        barIdx === 1 ? colors.dismissal :
                        barIdx === 2 ? colors.evaluation :
                        barIdx === 3 ? colors.car : colors.enrolled
                      }
                      rx="2"
                    />
                  );
                  currentY = y;
                  return rect;
                })}

                {/* X axis Label */}
                <text 
                  x={x} 
                  y={paddingTop + chartHeight + 20} 
                  textAnchor="middle" 
                  className="text-[12px] font-bold fill-gray-500"
                >
                  {d.day}
                </text>
              </g>
            );
          })}

          {/* Total Line Connection */}
          <polyline
            fill="none"
            stroke={colors.total}
            strokeWidth="2.5"
            points={linePoints}
            className="transition-all duration-500"
          />

          {/* Total Line Dots */}
          {data.map((d) => {
            const i = data.indexOf(d);
            const x = getX(i);
            const y = getY(timeframe === 'daily' ? d.lineVal : (d.lineVal / 100) * 45);
            return (
              <g key={d.day} className="group cursor-pointer">
                <circle
                  cx={x}
                  cy={y}
                  r="5.5"
                  fill="#000000"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all duration-200 group-hover:r-7"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill="transparent"
                />
                {/* Tooltip on hover */}
                <title>{`Total: ${d.lineVal} requests`}</title>
              </g>
            );
          })}
        </svg>
      </div>

      {/* View All Details */}
      <div className="mt-4 pt-4 border-t border-gray-50 flex flex-col items-center">
        <button 
          onClick={() => navigate('/admin/analytics')}
          className="py-1.5 px-6 flex items-center space-x-1 text-sm font-bold text-blue-900 hover:text-blue-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 cursor-pointer"
        >
          <span>View All</span>
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
};

export default RequestVolumeChart;
