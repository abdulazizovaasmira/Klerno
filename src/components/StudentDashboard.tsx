import React, { useState } from 'react';
import { User, Lesson, Review } from '../types';
import { COUNTRIES } from '../data';
import { 
  Calendar, CheckSquare, Users, Star, Globe, Clock, 
  MessageSquare, Bell, ArrowUpRight, GraduationCap, Heart, CheckCircle2, ChevronRight
} from 'lucide-react';

interface StudentDashboardProps {
  currentUser: User | null;
  lessons: Lesson[];
  mockTeachers: User[];
  onUpdateLessonStatus: (lessonId: string, status: 'completed' | 'cancelled') => void;
  onNavigate: (page: string, params?: any) => void;
}

export default function StudentDashboard({
  currentUser,
  lessons,
  mockTeachers,
  onUpdateLessonStatus,
  onNavigate,
}: StudentDashboardProps) {
  


  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 font-semibold">Please join or log in as a student to view your learning dashboard.</p>
        <button 
          onClick={() => onNavigate('register-student')}
          className="mt-4 bg-primary hover:bg-primary/95 text-white font-bold px-5 py-2.5 rounded-[8px] transition-all shadow-sm hover:shadow-md"
        >
          Join Student Portal
        </button>
      </div>
    );
  }

  // Filter lessons for this student
  const studentLessons = lessons.filter(l => l.studentId === currentUser.id);
  const upcomingLessons = studentLessons.filter(l => l.status === 'confirmed' || l.status === 'pending');
  const pastLessons = studentLessons.filter(l => l.status === 'completed');

  // Find saved teachers
  const savedTeachers = mockTeachers.filter(t => currentUser.savedTeachers?.includes(t.id));

  // Handle lesson completion
  const handleMarkComplete = (lesson: Lesson) => {
    onUpdateLessonStatus(lesson.id, 'completed');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8" id="student-dashboard-root">
      
      {/* Dashboard Greetings Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-[#e5e5e1] rounded-[14px] p-6 shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Student Workspace</span>
          <h2 className="text-2xl font-syne text-[#0c0c10]">Welcome Back, {currentUser.name}!</h2>
          <div className="text-xs font-bold text-gray-500 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-primary" />
            Active timezone: <span className="text-[#0c0c10] font-mono">{currentUser.timezone}</span>
          </div>
        </div>

        {/* Short Mini Metrics list */}
        <div className="flex gap-4 border-t border-gray-100 pt-4 md:pt-0 md:border-t-0 md:border-l border-gray-100 md:pl-6">
          <div className="text-center">
            <div className="font-syne text-xl text-[#0c0c10]">{upcomingLessons.length}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase">Upcoming</div>
          </div>
          <div className="text-center border-l border-gray-100 pl-4">
            <div className="font-syne text-xl text-[#0c0c10]">{pastLessons.length}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase">Completed</div>
          </div>
          <div className="text-center border-l border-gray-100 pl-4">
            <div className="font-syne text-xl text-secondary">{currentUser.joinedCommunities?.length || 0}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase">Clubs</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Classes + Sidebar widgets */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Hand: Core Lessons arrays */}
        <div className="lg:col-span-2 space-y-8">
          


          {/* Upcoming lessons list */}
          <div className="space-y-4">
            <h3 className="font-syne text-lg text-[#0c0c10] flex items-center gap-1.5">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Scheduled Sessions
            </h3>

            {upcomingLessons.length > 0 ? (
              <div className="space-y-4">
                {upcomingLessons.map(lesson => (
                  <div 
                    key={lesson.id}
                    className="bg-white border border-[#e5e5e1] rounded-[14px] p-5 shadow-sm flex flex-col md:flex-row justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary text-[9px] font-extrabold px-2 py-0.5 rounded uppercase border border-primary/20">
                          {lesson.subject}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase font-mono">ID: {lesson.id}</span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-syne text-base text-[#0c0c10]">{lesson.teacherName}</h4>
                        
                        {/* Interactive Double Time display */}
                        <div className="space-y-1.5 pt-1 text-xs">
                          <div className="font-bold text-[#0c0c10] bg-[#f7f6f2] p-2 rounded-[4px] border border-[#e5e5e1] font-mono w-fit shadow-sm">
                            📅 {lesson.studentLocalTime} (Your Local Time)
                          </div>
                          <div className="text-[10px] text-gray-400 font-medium font-mono pl-2">
                            Tutor local time: {lesson.teacherLocalTime} ({lesson.teacherTimezone.split('/').pop()?.replace('_', ' ')})
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-between items-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-5">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Security Escrow</span>
                        <span className="text-xs font-bold text-gray-500 uppercase">Funds Authorized</span>
                      </div>

                      <button 
                        onClick={() => handleMarkComplete(lesson)}
                        className="bg-[#01c9a8] hover:bg-[#01c9a8]/90 text-[#0c0c10] font-bold text-xs px-4 py-2 rounded-[8px] transition-colors shadow-sm"
                        id={`mark-complete-${lesson.id}`}
                      >
                        Confirm Lesson Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-8 text-center space-y-3 shadow-sm">
                <p className="text-sm text-gray-500 italic font-medium">No upcoming lessons scheduled currently.</p>
                <button 
                  onClick={() => onNavigate('browse')}
                  className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-[8px] transition-colors shadow-sm"
                >
                  Book a Trial Lesson Now
                </button>
              </div>
            )}
          </div>

          {/* Past lessons list */}
          <div className="space-y-4">
            <h3 className="font-syne text-lg text-gray-500 uppercase tracking-wider">Past Completed Lessons</h3>
            {pastLessons.length > 0 ? (
              <div className="space-y-3">
                {pastLessons.map(lesson => (
                  <div key={lesson.id} className="bg-white border border-[#e5e5e1] rounded-[14px] p-4 flex justify-between items-center text-xs shadow-sm">
                    <div>
                      <div className="font-bold text-[#0c0c10]">{lesson.teacherName} • <span className="text-gray-400 font-medium">{lesson.subject}</span></div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">{lesson.studentLocalTime}</div>
                    </div>
                    <span className="text-green-700 bg-green-50 border border-green-200 font-bold px-2 py-1 rounded-[4px]">
                      Payout Released
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic font-medium">No past lessons recorded.</p>
            )}
          </div>
        </div>

        {/* Right Hand Sidebar: saved tutors, joined communities, logs */}
        <div className="space-y-6">
          
          {/* Saved Tutors List */}
          <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-5 shadow-sm space-y-4">
            <h3 className="font-syne text-sm text-[#0c0c10] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <Heart className="w-4 h-4 text-[#f0516e] fill-[#f0516e]" />
              Saved Tutors
            </h3>

            {savedTeachers.length > 0 ? (
              <div className="space-y-3">
                {savedTeachers.map(teacher => (
                  <div 
                    key={teacher.id}
                    onClick={() => onNavigate('teacher-profile', { teacherId: teacher.id })}
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={teacher.avatar} alt={teacher.name} className="w-9 h-9 rounded-full border border-gray-300 object-cover" />
                      <div>
                        <div className="text-xs font-bold text-[#0c0c10]">{teacher.name}</div>
                        <div className="text-[10px] text-gray-400 font-medium">${teacher.hourlyRate}/hr</div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic font-medium">No tutors saved yet. Browse tutors and click save!</p>
            )}
          </div>

          {/* Joined Communities Shortcut List */}
          <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-5 shadow-sm space-y-4">
            <h3 className="font-syne text-sm text-[#0c0c10] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <Users className="w-4 h-4 text-secondary" />
              My Study Clubs
            </h3>

            <div className="space-y-2">
              {currentUser.joinedCommunities && currentUser.joinedCommunities.length > 0 ? (
                currentUser.joinedCommunities.map(slug => {
                  const subjectName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                  return (
                    <button 
                      key={slug}
                      onClick={() => onNavigate(`community-${slug}`)}
                      className="w-full text-left p-2 border border-[#e5e5e1] hover:border-primary rounded-[8px] text-xs font-bold text-[#0c0c10] flex justify-between items-center transition-all shadow-sm hover:shadow-md"
                    >
                      <span>{subjectName} Club</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  );
                })
              ) : (
                <p className="text-xs text-gray-400 italic font-medium">You haven't joined any study clubs yet.</p>
              )}
            </div>
          </div>

          {/* Notification feed */}
          <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-5 shadow-sm space-y-3">
            <h3 className="font-syne text-xs text-[#0c0c10] uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-primary" />
              Real-time Logs & Alerts
            </h3>

            <div className="space-y-3 text-[10px] leading-relaxed font-semibold">
              <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 rounded-[4px]">
                ✓ Secured trial escrow holding setup for chosen teacher.
              </div>
              <div className="p-2.5 bg-primary/5 border border-primary/10 text-primary rounded-[4px]">
                ⏱️ Double Timezone engine completed standard DST calculations for your profile.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
