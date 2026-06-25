import React, { useState, useEffect } from 'react';
import { User, Community } from '../types';
import { SUBJECTS, COUNTRIES, formatInTimezone, getDualTimeDetails } from '../data';
import { 
  ArrowRight, Check, Shield, Globe, Award, Sparkles, Code, 
  Dna, BookOpen, Binary, CreditCard, Apple, Calendar, Users, Cpu, Clock, GraduationCap
} from 'lucide-react';

interface LandingPageProps {
  mockTeachers: User[];
  mockCommunities: Community[];
  onNavigate: (page: string, params?: any) => void;
  currentUser: User | null;
}

export default function LandingPage({
  mockTeachers,
  mockCommunities,
  onNavigate,
  currentUser
}: LandingPageProps) {
  
  // States for Timezone Demo Widget
  const [studentDemoTz, setStudentDemoTz] = useState("America/New_York");
  const [teacherDemoTz, setTeacherDemoTz] = useState("Europe/London");
  const [demoHour, setDemoHour] = useState(14); // 2:00 PM (14:00)

  // Computed times for Timezone Demo
  const [computedTimes, setComputedTimes] = useState({
    studentTime: "",
    teacherTime: "",
    difference: 0
  });

  useEffect(() => {
    // Generate an offset calculation
    const baseDate = new Date();
    baseDate.setHours(demoHour, 0, 0, 0);

    const studentStr = formatInTimezone(baseDate, studentDemoTz, 'short');
    const teacherStr = formatInTimezone(baseDate, teacherDemoTz, 'short');

    // Calculate absolute difference in hours
    try {
      const studentLocalStr = baseDate.toLocaleString('en-US', { timeZone: studentDemoTz });
      const teacherLocalStr = baseDate.toLocaleString('en-US', { timeZone: teacherDemoTz });
      const diffMs = Date.parse(teacherLocalStr) - Date.parse(studentLocalStr);
      const diffHours = Math.round(diffMs / (1000 * 60 * 60));
      setComputedTimes({
        studentTime: studentStr,
        teacherTime: teacherStr,
        difference: diffHours
      });
    } catch (e) {
      setComputedTimes({
        studentTime: studentStr,
        teacherTime: teacherStr,
        difference: 0
      });
    }
  }, [studentDemoTz, teacherDemoTz, demoHour]);

  return (
    <div className="space-y-16 pb-20" id="landing-page-root">
      
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 pt-12 text-center space-y-6" id="hero-section">
        <div className="inline-flex items-center gap-2 bg-[#01c9a8]/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
          The Fair Marketplace for Global Tutors
        </div>
        
        <h1 className="text-4xl md:text-6xl tracking-tight leading-none text-[#0c0c10] max-w-4xl mx-auto font-syne" style={{ fontWeight: 800 }}>
          Global tutoring.<br className="hidden sm:inline" />
          <span className="text-primary font-syne">Fair for everyone.</span>
        </h1>
        
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto font-medium">
          Klerno connects elite teachers and eager learners worldwide. 
          By keeping platform commissions to just <span className="text-[#0c0c10] font-bold">10%</span>, teachers retain 90% of their earnings while students access world-class minds.
        </p>

        {/* Dual Call-to-Actions */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <button 
            onClick={() => onNavigate('browse')}
            className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white font-bold px-8 py-4 rounded-[8px] text-base transition-all flex items-center justify-center gap-2 shadow-sm"
            id="hero-cta-browse"
          >
            Find a Tutor
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onNavigate('register-teacher')}
            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-[#0c0c10] border border-[#e5e5e1] hover:border-gray-400 font-bold px-8 py-4 rounded-[8px] text-base transition-all flex items-center justify-center gap-2 shadow-sm"
            id="hero-cta-teacher"
          >
            Apply to Teach
          </button>
        </div>
      </section>

      {/* 2. Flat Stats Bar */}
      <section className="bg-white border-y border-[#e5e5e1] py-8" id="stats-section">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl md:text-4xl font-syne text-primary" style={{ fontWeight: 800 }}>90%</div>
            <div className="text-xs md:text-sm text-gray-500 font-semibold uppercase tracking-wider">Teacher Payout Rate</div>
          </div>
          <div className="space-y-1 border-l border-[#e5e5e1]">
            <div className="text-3xl md:text-4xl font-syne text-[#0c0c10]" style={{ fontWeight: 800 }}>10%</div>
            <div className="text-xs md:text-sm text-gray-500 font-semibold uppercase tracking-wider">Flat Platform Fee</div>
          </div>
          <div className="space-y-1 border-l border-[#e5e5e1]">
            <div className="text-3xl md:text-4xl font-syne text-secondary" style={{ fontWeight: 800 }}>Dual-TZ</div>
            <div className="text-xs md:text-sm text-gray-500 font-semibold uppercase tracking-wider">Automatic DST Synced</div>
          </div>
          <div className="space-y-1 border-l border-[#e5e5e1]">
            <div className="text-3xl md:text-4xl font-syne text-[#f0516e]" style={{ fontWeight: 800 }}>No Fees</div>
            <div className="text-xs md:text-sm text-gray-500 font-semibold uppercase tracking-wider">For Students</div>
          </div>
        </div>
      </section>

      {/* 3. Commission Comparison Segment */}
      <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center" id="comparison-section">
        <div className="space-y-6">
          <div className="inline-flex bg-alert/10 text-alert border border-alert/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            Fairness Comparison
          </div>
          <h2 className="text-3xl md:text-4xl font-syne tracking-tight leading-tight text-[#0c0c10]">
            Why we only charge a flat 10%
          </h2>
          <p className="text-gray-600 font-medium leading-relaxed">
            Tutoring platforms often take up to <span className="font-bold text-alert">33%</span> of a teacher's hard-earned lesson rate, forcing tutors to raise their prices and making learning expensive. 
          </p>
          <p className="text-gray-600 font-medium leading-relaxed">
            At Klerno, we operate a lean infrastructure. We charge a flat <span className="font-bold text-primary">10% platform fee</span> to host the dual-timezone scheduling engine, security integrations, and discussion forums, allowing teachers to keep 90% and charge fair, competitive prices.
          </p>
          
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2.5 text-sm font-semibold text-gray-700">
              <Check className="w-5 h-5 text-secondary border-2 border-secondary rounded-full p-0.5 bg-secondary/10" />
              Tutors keep 90% of every lesson instantly
            </div>
            <div className="flex items-center gap-2.5 text-sm font-semibold text-gray-700">
              <Check className="w-5 h-5 text-secondary border-2 border-secondary rounded-full p-0.5 bg-secondary/10" />
              Lower lesson costs for students worldwide
            </div>
            <div className="flex items-center gap-2.5 text-sm font-semibold text-gray-700">
              <Check className="w-5 h-5 text-secondary border-2 border-secondary rounded-full p-0.5 bg-secondary/10" />
              Verified qualifications and trial bookings
            </div>
          </div>
        </div>

        {/* Flat Visual Comparison Chart */}
        <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-6 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
            <span className="font-syne text-lg text-[#0c0c10]">Platform Commissions Compared</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded font-semibold uppercase tracking-wider">Fee taken</span>
          </div>

          <div className="space-y-4">
            {/* Klerno Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm font-bold text-primary">
                <span>Klerno (Our Marketplace)</span>
                <span>10% Fee</span>
              </div>
              <div className="w-full bg-gray-100 h-6 rounded-[6px] overflow-hidden">
                <div className="bg-primary h-full rounded-r" style={{ width: '10%' }}></div>
              </div>
            </div>

            {/* Preply Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm font-semibold text-gray-600">
                <span>Preply</span>
                <span>18% - 33% Fee</span>
              </div>
              <div className="w-full bg-gray-100 h-6 rounded-[6px] overflow-hidden">
                <div className="bg-alert h-full rounded-r" style={{ width: '33%' }}></div>
              </div>
            </div>

            {/* Italki Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm font-semibold text-gray-600">
                <span>iTalki</span>
                <span>15% Fee</span>
              </div>
              <div className="w-full bg-gray-100 h-6 rounded-[6px] overflow-hidden">
                <div className="bg-gray-400 h-full rounded-r" style={{ width: '15%' }}></div>
              </div>
            </div>

            {/* Verbling Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm font-semibold text-gray-600">
                <span>Verbling</span>
                <span>15% Fee</span>
              </div>
              <div className="w-full bg-gray-100 h-6 rounded-[6px] overflow-hidden">
                <div className="bg-gray-400 h-full rounded-r" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 font-medium text-center pt-2">
            Tutors keeping 90% leads to higher motivation, longer-term lessons, and a truly professional community.
          </div>
        </div>
      </section>

      {/* 4. Live Interactive Timezone Demo */}
      <section className="bg-white border-y border-[#e5e5e1] py-16" id="timezone-demo-section">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-12 gap-12 items-center">
          
          <div className="md:col-span-5 space-y-6">
            <div className="inline-flex bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              Automatic Timezone Synchronization
            </div>
            <h2 className="text-3xl font-syne tracking-tight leading-tight text-[#0c0c10]">
              No more timezone math. Ever.
            </h2>
            <p className="text-gray-600 font-medium leading-relaxed">
              When scheduling on Klerno, all class options are presented in both the student's and teacher's respective local times. 
            </p>
            <p className="text-gray-600 font-medium leading-relaxed">
              Our scheduling engine automatically resolves regional Daylight Saving Time (DST) changes, showing you exactly what hour it will be in both cities at the moment of the lesson.
            </p>
          </div>

          {/* Interactive Widget */}
          <div className="md:col-span-7 bg-white border border-[#e5e5e1] rounded-[14px] p-6 shadow-sm space-y-6" id="tz-demo-widget">
            <div className="flex items-center gap-2 border-b border-[#e5e5e1] pb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-syne text-lg text-[#0c0c10]">Live Dual-Time Simulator</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Student Timezone Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Student Timezone</label>
                <select 
                  value={studentDemoTz} 
                  onChange={(e) => setStudentDemoTz(e.target.value)}
                  className="w-full bg-white border border-[#e5e5e1] rounded-[8px] p-2.5 text-sm font-semibold shadow-sm"
                >
                  {COUNTRIES.map(c => (
                    <option key={`student-${c.code}`} value={c.timezone}>{c.flag} {c.name} ({c.timezone.split('/').pop()?.replace('_', ' ')})</option>
                  ))}
                </select>
              </div>

              {/* Teacher Timezone Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Teacher Timezone</label>
                <select 
                  value={teacherDemoTz} 
                  onChange={(e) => setTeacherDemoTz(e.target.value)}
                  className="w-full bg-white border border-[#e5e5e1] rounded-[8px] p-2.5 text-sm font-semibold shadow-sm"
                >
                  {COUNTRIES.map(c => (
                    <option key={`teacher-${c.code}`} value={c.timezone}>{c.flag} {c.name} ({c.timezone.split('/').pop()?.replace('_', ' ')})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Slider to adjust hours */}
            <div className="space-y-2 bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-4">
              <div className="flex justify-between text-xs font-bold text-gray-500">
                <span>MIDNIGHT</span>
                <span>NOON</span>
                <span>NIGHT</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="23" 
                value={demoHour} 
                onChange={(e) => setDemoHour(parseInt(e.target.value, 10))}
                className="w-full accent-primary cursor-ew-resize h-2 bg-gray-200 rounded-lg appearance-none"
              />
              <div className="text-center text-sm font-bold text-primary">
                Selected baseline hour: {demoHour.toString().padStart(2, '0')}:00
              </div>
            </div>

            {/* Simulated Live Results Card */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-4 space-y-1 text-center">
                <div className="text-xs font-bold uppercase tracking-wider text-primary">Student Local Lesson Time</div>
                <div className="font-syne text-base text-[#0c0c10]" style={{ fontWeight: 800 }}>
                  {computedTimes.studentTime.split(' GMT')[0]}
                </div>
                <div className="text-[10px] text-gray-400 font-mono font-medium">{studentDemoTz}</div>
              </div>

              <div className="bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-4 space-y-1 text-center">
                <div className="text-xs font-bold uppercase tracking-wider text-secondary">Teacher Local Lesson Time</div>
                <div className="font-syne text-base text-[#0c0c10]" style={{ fontWeight: 800 }}>
                  {computedTimes.teacherTime.split(' GMT')[0]}
                </div>
                <div className="text-[10px] text-gray-400 font-mono font-medium">{teacherDemoTz}</div>
              </div>
            </div>

            <div className="text-center text-xs text-gray-500 font-bold bg-[#0c0c10]/5 py-2.5 rounded-lg">
              Time offset difference: {computedTimes.difference === 0 ? "Same timezone" : `${Math.abs(computedTimes.difference)} hours ${computedTimes.difference > 0 ? "ahead" : "behind"}`}
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works Steps */}
      <section className="max-w-7xl mx-auto px-4 space-y-12" id="how-it-works-section">
        <div className="text-center space-y-3">
          <div className="inline-flex bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            Step-by-step
          </div>
          <h2 className="text-3xl md:text-4xl font-syne tracking-tight text-[#0c0c10]">How Klerno works</h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">A seamless and completely transparent workflow for both teachers and global students.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white border border-[#e5e5e1] p-6 rounded-[14px] shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-[8px] bg-primary/10 border border-primary/20 flex items-center justify-center font-syne text-lg text-primary" style={{ fontWeight: 800 }}>1</div>
            <h3 className="font-syne text-lg text-[#0c0c10]">Join & Detect</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              Create an account. Our system auto-detects your country and timezone, then configures your profile preferences.
            </p>
          </div>

          <div className="bg-white border border-[#e5e5e1] p-6 rounded-[14px] shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-[8px] bg-secondary/10 border border-secondary/20 flex items-center justify-center font-syne text-lg text-secondary" style={{ fontWeight: 800 }}>2</div>
            <h3 className="font-syne text-lg text-[#0c0c10]">Filter Tutors</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              Filter elite teachers by subjects, verified qualifications, pricing, languages, and interactive timezone-overlapping availability.
            </p>
          </div>

          <div className="bg-white border border-[#e5e5e1] p-6 rounded-[14px] shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-[8px] bg-[#f0516e]/10 border border-[#f0516e]/20 flex items-center justify-center font-syne text-lg text-[#f0516e]" style={{ fontWeight: 800 }}>3</div>
            <h3 className="font-syne text-lg text-[#0c0c10]">Secure Booking</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              Select an available slot. View exactly how it corresponds to both parties local hours. Book trial instantly via Stripe Connect.
            </p>
          </div>

          <div className="bg-white border border-[#e5e5e1] p-6 rounded-[14px] shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-[8px] bg-gray-100 border border-[#e5e5e1] flex items-center justify-center font-syne text-lg text-[#0c0c10]" style={{ fontWeight: 800 }}>4</div>
            <h3 className="font-syne text-lg text-[#0c0c10]">Learn & Earn</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              Attend the class. Once finished, student confirms the class is complete. Funds are captured and 90% goes straight to teacher!
            </p>
          </div>
        </div>
      </section>

      {/* 6. Communities Grid */}
      <section className="bg-white border-y border-[#e5e5e1] py-16" id="landing-communities-section">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="space-y-3">
              <div className="inline-flex bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                Peer Discussion & Q&A
              </div>
              <h2 className="text-3xl font-syne tracking-tight text-[#0c0c10]">Subject Study Clubs</h2>
              <p className="text-gray-500 font-medium max-w-xl">Join high-quality subject communities, interact with tutors, ask questions, and read detailed feedback.</p>
            </div>
            <button 
              onClick={() => onNavigate('communities')}
              className="text-primary hover:text-primary/95 font-bold flex items-center gap-1.5 hover:underline"
            >
              Browse all subject clubs
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {mockCommunities.slice(0, 5).map(community => {
              return (
                <div 
                  key={community.slug}
                  onClick={() => onNavigate(`community-${community.slug}`)}
                  className="bg-white border border-[#e5e5e1] p-5 rounded-[14px] cursor-pointer hover:shadow-md hover:border-primary transition-all duration-200 flex flex-col justify-between h-40 shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-[8px] bg-[#f7f6f2] border border-[#e5e5e1] flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-syne text-sm text-[#0c0c10] line-clamp-1">{community.name}</h3>
                  </div>
                  <div className="text-xs text-gray-500 font-bold">
                    {community.memberCount} members
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Featured Teachers */}
      <section className="max-w-7xl mx-auto px-4 space-y-12" id="featured-teachers-section">
        <div className="text-center space-y-3">
          <div className="inline-flex bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            Elite Educators
          </div>
          <h2 className="text-3xl md:text-4xl font-syne tracking-tight text-[#0c0c10]">Featured Tutors</h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">Vetted professionals with verified university degrees and teaching qualifications.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {mockTeachers.slice(0, 3).map(teacher => {
            return (
              <div 
                key={teacher.id}
                onClick={() => onNavigate('teacher-profile', { teacherId: teacher.id })}
                className="bg-white border border-[#e5e5e1] rounded-[14px] p-5 shadow-sm cursor-pointer hover:shadow-md hover:border-primary transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={teacher.avatar} 
                      alt={teacher.name} 
                      className="w-14 h-14 rounded-full border border-[#e5e5e1] object-cover shadow-sm" 
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="font-syne text-base text-[#0c0c10] flex items-center gap-1.5">
                        {teacher.name}
                        <span className="text-sm" title={teacher.country}>{COUNTRIES.find(c => c.name === teacher.country)?.flag || "🌍"}</span>
                      </h3>
                      <p className="text-xs text-gray-500 font-semibold">{teacher.timezone.split('/').pop()?.replace('_', ' ')} (UTC{teacher.timezone === 'America/New_York' ? '-4' : teacher.timezone === 'Europe/Berlin' ? '+2' : '+1'})</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {teacher.preferredSubjects.map(sub => (
                      <span key={sub} className="text-[10px] font-bold uppercase bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded">
                        {sub}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed font-medium">
                    {teacher.bio}
                  </p>
                </div>

                <div className="border-t border-[#f0f0f0] pt-4 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase">Hourly Rate</span>
                    <div className="font-syne text-lg text-[#0c0c10]" style={{ fontWeight: 800 }}>${teacher.hourlyRate}/hr</div>
                  </div>
                  
                  <div className="bg-primary hover:bg-primary/95 text-white text-xs font-bold px-3 py-2 rounded-[8px] shadow-sm">
                    View Profile
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Stripe Payment Methods Banner */}
      <section className="bg-white border-y border-[#e5e5e1] py-10 shadow-sm" id="payment-methods-section">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Secure Global Payouts & Payments Powered by Stripe Connect</div>
          <div className="flex flex-wrap justify-center items-center gap-6 opacity-80">
            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
              <CreditCard className="w-5 h-5 text-primary" />
              Visa / Mastercard
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
              <Apple className="w-5 h-5" />
              Apple Pay / Google Pay
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700 font-mono">
              SEPA Direct Debit
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
              <Globe className="w-5 h-5 text-secondary" />
              135+ Currencies Supported
            </div>
          </div>
        </div>
      </section>

      {/* 9. Dual Registration CTA Block */}
      <section className="max-w-7xl mx-auto px-4" id="dual-registration-ctas">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Student CTA */}
          <div className="bg-white border border-[#e5e5e1] p-8 rounded-[14px] shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-primary">For Learners</div>
              <h3 className="font-syne text-2xl text-[#0c0c10]">Learn from the world's best minds</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                Access verified educators across STEM, Humanities, Languages, and Medicine. Schedule in your own timezone, pay securely via cards or digital wallets, and join active peer-study forums.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('register-student')}
              className="mt-6 w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 rounded-[8px] text-sm transition-colors shadow-sm"
              id="cta-join-student"
            >
              Register as Student
            </button>
          </div>

          {/* Teacher CTA */}
          <div className="bg-white border border-[#e5e5e1] p-8 rounded-[14px] shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-secondary">For Instructors</div>
              <h3 className="font-syne text-2xl text-[#0c0c10]">Keep 90% of what you earn</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                No subscription. No sliding commission traps. We only take a flat 10% platform fee. Connect your Stripe Express account, set your hours, upload qualifications, and instantly reach global students.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('register-teacher')}
              className="mt-6 w-full bg-white hover:bg-gray-50 text-[#0c0c10] border border-[#e5e5e1] hover:border-gray-400 font-bold py-3.5 rounded-[8px] text-sm transition-all shadow-sm hover:shadow-md"
              id="cta-join-teacher"
            >
              Become a Klerno Teacher
            </button>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="max-w-7xl mx-auto px-4 border-t border-[#e5e5e1] pt-10 pb-10 text-center space-y-4">
        <div className="flex justify-center items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <span className="font-syne text-lg text-[#0c0c10]" style={{ fontWeight: 800 }}>klerno</span>
        </div>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
          © 2026 Klerno Inc. • Global tutoring. Fair for everyone. • Terms • Privacy
        </p>
      </footer>
    </div>
  );
}
