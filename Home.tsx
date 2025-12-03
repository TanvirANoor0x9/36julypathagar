import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Shared';
import { Calendar, Image as ImageIcon } from 'lucide-react';

const Home = () => {
  const { activities, settings } = useApp();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-white rounded-3xl shadow-sm border border-gray-100 px-4">
        {settings.logoUrl && (
          <img 
            src={settings.logoUrl} 
            alt="Logo" 
            className="w-24 h-24 mx-auto mb-6 rounded-full object-cover shadow-lg border-4 border-white"
          />
        )}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          {settings.orgName}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {settings.welcomeMessage}
        </p>
      </div>

      {/* Activities Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ImageIcon className="text-primary" />
          Recent Activities
        </h2>
        
        {activities.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            No activities posted yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <Card key={activity.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden bg-gray-100">
                  <img 
                    src={activity.imageUrl} 
                    alt={activity.title} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar size={16} />
                    {new Date(activity.date).toLocaleDateString()}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.title}</h3>
                  <p className="text-gray-600 flex-1">{activity.description}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
