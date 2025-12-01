'use client';

import { Calendar, Clock, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ToastContainer';
import SchedulePostModal from './SchedulePostModal';

interface ScheduledPost {
  id: string
  postText: string
  scheduledFor: string
  platform: string
  status: string
  socialAccount: {
    accountName: string
    profileImage: string | null
  }
}

export default function CalendarPage() {
  const toast = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScheduledPosts();
  }, [currentDate]);

  const fetchScheduledPosts = async () => {
    try {
      const response = await fetch('/api/social/posts?status=SCHEDULED');
      const data = await response.json();
      setScheduledPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to fetch scheduled posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get calendar grid data
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i)
      });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day)
      });
    }
    
    // Next month days
    const remainingDays = 35 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month + 1, day)
      });
    }
    
    return days;
  };

  const getPostsForDay = (date: Date) => {
    return scheduledPosts.filter(post => {
      const postDate = new Date(post.scheduledFor);
      return postDate.getDate() === date.getDate() &&
             postDate.getMonth() === date.getMonth() &&
             postDate.getFullYear() === date.getFullYear();
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="space-y-6">
      <SchedulePostModal 
        isOpen={showScheduleModal} 
        onClose={() => setShowScheduleModal(false)} 
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Calendar</h1>
          <p className="text-gray-600 mt-1">
            Schedule and manage your content posts
          </p>
        </div>
        <button 
          onClick={() => setShowScheduleModal(true)}
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
              onClick={goToPreviousMonth}
              className="px-3 py-1 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={goToToday}
              className="px-3 py-1 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              Today
            </button>
            <button 
              onClick={goToNextMonth}
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

          {/* Calendar days */}
          {calendarDays.map((dayInfo, i) => {
            const postsForDay = getPostsForDay(dayInfo.date);
            const isTodayDate = isToday(dayInfo.date);
            
            return (
              <div
                key={i}
                className={`min-h-[120px] border rounded-lg p-2 ${
                  dayInfo.isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                } ${isTodayDate ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className={`text-sm mb-1 ${
                  dayInfo.isCurrentMonth ? 'font-semibold text-gray-900' : 'text-gray-400'
                } ${isTodayDate ? 'text-blue-600 font-bold' : ''}`}>
                  {dayInfo.day}
                </div>
                
                {/* Scheduled posts for this day */}
                <div className="space-y-1">
                  {postsForDay.map((post) => (
                    <div
                      key={post.id}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate cursor-pointer hover:bg-blue-200"
                      title={post.postText}
                    >
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(post.scheduledFor).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </div>
                      <div className="truncate">{post.postText.substring(0, 30)}...</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Posts */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Posts</h3>
        
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p>Loading scheduled posts...</p>
          </div>
        ) : scheduledPosts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No scheduled posts yet</p>
            <p className="text-sm mt-2">
              Create content and schedule it to see it here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {scheduledPosts.slice(0, 5).map((post) => (
              <div key={post.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{post.postText}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(post.scheduledFor).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })} • {post.platform} • @{post.socialAccount.accountName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
