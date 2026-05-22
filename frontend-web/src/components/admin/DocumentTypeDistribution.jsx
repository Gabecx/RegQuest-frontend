import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const DocumentTypeDistribution = () => {
  const [showAll, setShowAll] = useState(false);

  const initialItems = [
    { name: 'Transcript of records', count: 45, percentage: 36, color: 'bg-blue-600' },
    { name: 'Honorable Dismissal', count: 12, percentage: 9, color: 'bg-blue-400' },
    { name: 'Evaluation', count: 11, percentage: 9, color: 'bg-blue-500' },
    { name: 'Certificate of Enrollment', count: 9, percentage: 4, color: 'bg-blue-300' },
  ];

  const extraItems = [
    { name: 'Authentication Services', count: 7, percentage: 3, color: 'bg-indigo-400' },
    { name: 'Cumulative Academic Record (CAR)', count: 5, percentage: 2, color: 'bg-indigo-300' },
  ];

  const items = showAll ? [...initialItems, ...extraItems] : initialItems;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Document Type Distribution</h3>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Historical request breakdown</p>
          </div>
        </div>

        <div className="space-y-5">
          {items.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-sm font-semibold text-gray-700">
                <span className="text-gray-800">{item.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 font-medium">{item.count} requests</span>
                  <span className="text-blue-600 font-bold">{item.percentage}%</span>
                </div>
              </div>
              <div className="w-full bg-blue-50/50 h-2.5 rounded-full overflow-hidden border border-blue-50">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${item.color}`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-50">
        <button 
          onClick={() => setShowAll(!showAll)}
          className="w-full py-1.5 flex items-center justify-center space-x-1.5 text-sm font-bold text-blue-900 hover:text-blue-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 cursor-pointer"
        >
          <span>{showAll ? 'See less' : 'See more'}</span>
          {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
    </div>
  );
};

export default DocumentTypeDistribution;
