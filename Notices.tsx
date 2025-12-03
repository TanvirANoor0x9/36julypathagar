import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Shared';
import { Bell, AlertTriangle, Calendar } from 'lucide-react';

const Notices = () => {
  const { notices } = useApp();

  // Sort by date descending
  const sortedNotices = [...notices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="text-primary" />
          Notice Board
        </h2>
      </div>

      <div className="space-y-6">
        {sortedNotices.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
            No notices at the moment.
          </div>
        ) : (
          sortedNotices.map((notice) => (
            <Card key={notice.id} className={`p-6 transition-all hover:shadow-md ${notice.isUrgent ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} />
                  {new Date(notice.date).toLocaleDateString()}
                  {notice.isUrgent && (
                    <span className="flex items-center gap-1 text-red-600 bg-red-100 px-2 py-0.5 rounded-full text-xs font-bold">
                      <AlertTriangle size={10} />
                      URGENT
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{notice.title}</h3>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
                {notice.content}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notices;
