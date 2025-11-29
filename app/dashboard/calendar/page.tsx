'use client';

import { Calendar, Clock, Plus } from 'lucide-react';
import { useState } from 'react';

export default function CalendarPage() {
  const [currentDate] = useState(new Date());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Calendar</h1>
          <p className="text-gray-600 mt-1">
            Schedule and manage your content posts
          </p>
        </div>
        <button 
          onClick={() => alert('Schedule post functionality coming soon! This will open a scheduling modal.')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          Schedule Post
        </button>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => alert('Navigate to previous month')}
              className="px-3 py-1 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={() => alert('Navigate to today')}
              className="px-3 py-1 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              Today
            </button>
            <button 
              onClick={() => alert('Navigate to next month')}
              className="px-3 py-1 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              Next
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-600 pb-2">
              {day}
            </div>
          ))}

          {/* Calendar days - placeholder */}
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 3; // Start from previous month
            const isCurrentMonth = day > 0 && day <= 30;
            
            return (
              <div
                key={i}
                className={`min-h-[120px] border rounded-lg p-2 ${
                  isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                }`}
              >
                <div className={`text-sm ${isCurrentMonth ? 'font-semibold' : 'text-gray-400'}`}>
                  {day > 0 && day <= 30 ? day : ''}
                </div>
                {/* Scheduled posts would go here */}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Posts */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Posts</h3>
        
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No scheduled posts yet</p>
          <p className="text-sm mt-2">
            Create content and schedule it to see it here
          </p>
        </div>
      </div>
    </div>
  );
}
