import { useState, useEffect } from 'react';
import { User, TimeSlot } from '../types';
import { COUNTRIES, getDualTimeDetails, formatInTimezone } from '../data';
import { 
  Award, Star, Clock, Calendar, ShieldCheck, Languages, 
  MapPin, Globe, CreditCard, ChevronRight, MessageSquare 
} from 'lucide-react';

interface TeacherProfileProps {
  teacherId: string;
  mockTeachers: User[];
  currentUser: User | null;
  onNavigate: (page: string, params?: any) => void;
}

export default function TeacherProfile({
  teacherId,
  mockTeachers,
  currentUser,
  onNavigate
}: TeacherProfileProps) {
  
  const [teacher, setTeacher] = useState<User | null>(null);
  const [studentTimezone, setStudentTimezone] = useState("America/New_York");

  useEffect(() => {
    const found = mockTeachers.find(t => t.id === teacherId);
    if (found) {
      setTeacher(found);
    }
  }, [teacherId, mockTeachers]);

  useEffect(() => {
    if (currentUser && currentUser.timezone) {
      setStudentTimezone(currentUser.timezone);
    } else {
      try {
        const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (detected) setStudentTimezone(detected);
      } catch (e) {
        setStudentTimezone("America/New_York");
      }
    }
  }, [currentUser]);

  if (!teacher) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-sm font-semibold text-gray-500">Retrieving teacher credentials...</p>
      </div>
    );
  }

  const countryObj = COUNTRIES.find(c => c.name === teacher.country) || COUNTRIES[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8" id="profile-page-root">
      
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('browse')}
        className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#0c0c10] flex items-center gap-1"
      >
        ← Back to Browse Tutors
      </button>

      {/* Main Layout Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Columns: Core Profile & Bio (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Main Card Header */}
          <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img 
                src={teacher.avatar} 
                alt={teacher.name} 
                className="w-20 h-20 rounded-full border border-[#e5e5e1] object-cover shadow-sm" 
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1">
                <h2 className="text-2xl font-syne text-[#0c0c10] flex items-center gap-2">
                  {teacher.name}
                  <span className="text-xl" title={teacher.country}>{countryObj?.flag || "🌍"}</span>
                </h2>
                
                <p className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {teacher.country} • Local Timezone: <span className="text-primary font-mono">{teacher.timezone}</span>
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className="text-xs font-bold text-[#01c9a8] bg-[#01c9a8]/10 border border-[#01c9a8]/20 px-2 py-0.5 rounded uppercase">
                    Vetted Partner
                  </div>
                </div>
              </div>
            </div>

            {/* Display subjects */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
              {teacher.preferredSubjects.map(sub => (
                <span key={sub} className="text-xs font-bold uppercase tracking-wider bg-primary/5 text-primary border border-primary/10 px-3 py-1 rounded">
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* Biography & Qualifications Details */}
          <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <h3 className="font-syne text-lg text-[#0c0c10]">Professional Biography</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {teacher.bio}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-5 space-y-3">
              <h3 className="font-syne text-sm text-[#0c0c10] uppercase tracking-wider text-gray-500">Verified Qualifications</h3>
              <div className="bg-secondary/5 border border-secondary/20 rounded-[8px] p-3.5 flex items-start gap-3">
                <Award className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#0c0c10]">Academic Credentials Verified</div>
                  <div className="text-sm font-semibold text-gray-700">{teacher.qualifications}</div>
                  <p className="text-[10px] text-gray-400 font-medium">Verified by Klerno Academic Verification Services. Background checks and transcript matching completed.</p>
                </div>
              </div>
            </div>

            {/* Languages and details */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
              <div className="space-y-1">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Languages Spoken</div>
                <div className="text-sm font-bold text-[#0c0c10] flex items-center gap-1">
                  <Languages className="w-4 h-4 text-primary" />
                  {teacher.languages?.join(", ") || "English"}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lesson Payout Connect</div>
                <div className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md w-fit border border-green-200 uppercase tracking-wider">
                  ✓ Stripe Verified
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Right Column: Timezone-aware Calendar & Booking Card (1 col) */}
        <div className="space-y-6">
          
          {/* Core Price & Escrow Booking Card */}
          <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-5 shadow-sm space-y-4">
            <div className="bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-4 text-center shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hourly Tuition</span>
              <div className="font-syne text-3xl text-[#0c0c10] mt-1" style={{ fontWeight: 800 }}>${teacher.hourlyRate} <span className="text-xs font-sans text-gray-500 font-semibold">/ hour</span></div>
              <p className="text-[10px] text-gray-400 font-medium mt-1">90% goes directly to tutor • 10% platform service fee included</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5 text-xs font-semibold text-gray-600">
                <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
                <span>Manual verification system: you confirm completed lesson before payout captures.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs font-semibold text-gray-600">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span>Automatic timezone scheduling: calendar displays converted slots matching your machine clock.</span>
              </div>
            </div>
          </div>

          {/* Timezone Translated Availability Slots Calendar */}
          <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-5 shadow-sm space-y-4">
            <div className="space-y-1 pb-3 border-b border-gray-100">
              <h3 className="font-syne text-sm text-[#0c0c10] uppercase tracking-wider">Lesson Availability</h3>
              <div className="bg-[#01c9a8]/10 text-[#0c0c10] text-[10px] font-bold py-1 px-2.5 rounded-[4px] flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-secondary" />
                <span>Slots shown in your local timezone:</span>
              </div>
              <div className="text-xs font-bold text-primary font-mono bg-primary/5 px-2.5 py-1 rounded-[4px] truncate">
                {studentTimezone}
              </div>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {teacher.availability && teacher.availability.length > 0 ? (
                teacher.availability.map((slot, index) => {
                  // Standard mapping of upcoming weekday (let's use next Sunday/Mon dates for simulation)
                  const dateMap: Record<string, string> = {
                    "Monday": "2026-06-29",
                    "Tuesday": "2026-06-30",
                    "Wednesday": "2026-07-01",
                    "Thursday": "2026-07-02",
                    "Friday": "2026-07-03",
                    "Saturday": "2026-07-04",
                    "Sunday": "2026-07-05"
                  };
                  
                  const targetDate = dateMap[slot.dayOfWeek] || "2026-06-29";
                  const dualTime = getDualTimeDetails(targetDate, slot.time, teacher.timezone, studentTimezone);

                  return (
                    <div 
                      key={index}
                      onClick={() => onNavigate('booking', { 
                        teacherId: teacher.id, 
                        dayOfWeek: slot.dayOfWeek,
                        date: targetDate,
                        time: slot.time 
                      })}
                      className="border border-[#e5e5e1] hover:border-primary hover:bg-primary/5 p-3 rounded-[8px] text-left cursor-pointer transition-all space-y-2 group shadow-sm hover:shadow-md"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[#0c0c10] uppercase tracking-wider">{slot.dayOfWeek} Session</span>
                        <span className="text-[10px] bg-primary text-white font-bold px-1.5 py-0.5 rounded-[4px] transition-colors group-hover:bg-[#0c0c10]">Book Slot</span>
                      </div>
                      
                      {/* Converted Time Display Grid */}
                      <div className="space-y-1 text-xs">
                        <div className="font-semibold text-gray-600 flex items-center gap-1">
                          <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>
                          <span>Student Local Time:</span>
                        </div>
                        <div className="font-bold text-[#0c0c10] bg-white border border-[#e5e5e1] p-1.5 rounded-[4px] text-[11px] font-mono leading-tight shadow-sm">
                          {dualTime.studentTime.split(' GMT')[0]}
                        </div>

                        <div className="font-semibold text-gray-500 flex items-center gap-1 pt-1">
                          <span className="w-2.5 h-2.5 bg-gray-400 rounded-full"></span>
                          <span>Tutor Time ({teacher.timezone.split('/').pop()?.replace('_', ' ')}):</span>
                        </div>
                        <div className="font-medium text-gray-500 text-[10px] font-mono pl-3.5">
                          {dualTime.teacherTime.split(' GMT')[0]}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-gray-400 italic text-center py-6">
                  No availability slots listed currently.
                </div>
              )}
            </div>

            <div className="text-[10px] text-gray-400 font-medium leading-relaxed text-center pt-2">
              Selecting an availability slot maps dates automatically relative to both student and tutor calendars.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
