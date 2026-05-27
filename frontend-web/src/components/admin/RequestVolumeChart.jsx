import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';


const DOC_COLORS = [
  '#0000D8', 
  '#FEC956', 
  '#F97316', 
  '#EF4444', 
  '#6D82F4', 
  '#10B981', 
  '#8B5CF6', 
  '#EC4899', 
];
const TOTAL_COLOR = '#1F2937';

const colorFor = (name, index) => DOC_COLORS[index % DOC_COLORS.length];

const RequestVolumeChart = ({ dailyData = [], weeklyData = [], loading = false }) => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('daily');

  const data = timeframe === 'daily' ? dailyData : weeklyData;

  const allDocTypes = Array.from(
    new Set(data.flatMap(d => Object.keys(d.breakdown || {})))
  );

  const legendItems = [
    ...allDocTypes.map((name, i) => ({ name, color: colorFor(name, i) })),
    { name: 'Total (line)', color: TOTAL_COLOR, isLine: true },
  ];

  const chartHeight = 200;
  const chartWidth = 1000;
  const paddingLeft = 45;
  const paddingTop = 20;

  const maxTotal = Math.max(...data.map(d => d.total || 0), 10);
  const yMax = Math.ceil(maxTotal / 5) * 5 || 10;
  const yStep = yMax / 5;
  const yLevels = Array.from({ length: 6 }, (_, i) => yMax - i * yStep);

  const getX = (index) => paddingLeft + (chartWidth / data.length) * (index + 0.5);
  const getY = (val) => paddingTop + chartHeight - (val / yMax) * chartHeight;

  const linePoints = data
    .map((d, i) => `${getX(i)},${getY(d.total || 0)}`)
    .join(' ');

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-pulse">
        <div className="h-6 bg-gray-100 rounded w-1/3 mb-4" />
        <div className="h-[280px] bg-gray-50 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
   
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Request Volume</h3>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
            Live from database
          </p>
        </div>
        <div className="flex bg-gray-50 border border-gray-100 rounded-xl p-1">
          {['daily', 'weekly'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-200 cursor-pointer capitalize ${
                timeframe === tf
                  ? 'bg-blue-950 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              {tf === 'daily' ? 'Daily' : 'Weekly'}
            </button>
          ))}
        </div>
      </div>

      
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
        {legendItems.map((item) => (
          <div key={item.name} className="flex items-center space-x-1.5">
            {item.isLine ? (
              <div className="flex items-center space-x-1">
                <span className="w-5 h-[2px] bg-gray-400 inline-block" />
                <span className="w-2 h-2 rounded-full bg-gray-950 inline-block -ml-3.5" />
              </div>
            ) : (
              <span
                className="w-3.5 h-3.5 rounded-[4px] inline-block"
                style={{ backgroundColor: item.color }}
              />
            )}
            <span>{item.name}</span>
          </div>
        ))}
      </div>

     
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth + 60} ${chartHeight + 60}`}
          className="w-full min-w-[800px] h-auto max-h-[280px]"
        >
         
          {yLevels.map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingLeft} y1={y}
                  x2={paddingLeft + chartWidth} y2={y}
                  stroke="#F3F4F6" strokeWidth="1.5"
                />
                <text
                  x={paddingLeft - 8} y={y + 4}
                  textAnchor="end"
                  className="text-[11px] font-bold fill-gray-400"
                  fontSize="11"
                  fill="#9CA3AF"
                >
                  {Math.round(val)}
                </text>
              </g>
            );
          })}

         
          {data.map((d, idx) => {
            const x = getX(idx);
            const barWidth = Math.max(20, Math.min(40, chartWidth / data.length / 2));
            let currentY = getY(0);
            const breakdown = d.breakdown || {};

            return (
              <g key={d.label}>
                {allDocTypes.map((docName, barIdx) => {
                  const val = breakdown[docName] || 0;
                  if (val === 0) return null;
                  const barH = (val / yMax) * chartHeight;
                  const y = currentY - barH;
                  const rect = (
                    <rect
                      key={barIdx}
                      x={x - barWidth / 2}
                      y={y}
                      width={barWidth}
                      height={barH}
                      fill={colorFor(docName, barIdx)}
                      rx="2"
                    >
                      <title>{`${docName}: ${val}`}</title>
                    </rect>
                  );
                  currentY = y;
                  return rect;
                })}

             
                <text
                  x={x} y={paddingTop + chartHeight + 20}
                  textAnchor="middle"
                  fontSize="11" fill="#6B7280"
                >
                  {d.label}
                </text>
              </g>
            );
          })}

         
          {data.length > 1 && (
            <polyline
              fill="none"
              stroke={TOTAL_COLOR}
              strokeWidth="2.5"
              points={linePoints}
              className="transition-all duration-500"
            />
          )}

        
          {data.map((d, i) => {
            const x = getX(i);
            const y = getY(d.total || 0);
            return (
              <g key={`dot-${d.label}`} className="group cursor-pointer">
                <circle cx={x} cy={y} r="5.5" fill="#000000" stroke="#ffffff" strokeWidth="2" />
                <circle cx={x} cy={y} r="12" fill="transparent" />
                <title>{`Total: ${d.total} requests`}</title>
              </g>
            );
          })}
        </svg>
      </div>

     
      {data.every(d => d.total === 0) && (
        <div className="text-center py-6 text-gray-400 text-sm font-semibold">
          No requests recorded in this period.
        </div>
      )}

     
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
