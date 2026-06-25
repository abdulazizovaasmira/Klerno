import { useState } from 'react';
import { User, Lesson, TimeSlot } from '../types';
import { WEEKDAYS, AVAILABLE_HOURS } from '../data';
import { 
  DollarSign, Calendar, Clock, Award, ShieldAlert, 
  Trash2, Plus, ArrowRight, Settings, ExternalLink, Globe, Bell 
} from 'lucide-react';

interface TeacherDashboardProps {
  currentUser: User | null;
  lessons: Lesson[];
  onUpdateAvailability: (newAvailability: TimeSlot[]) => void;
  onNavigate: (page: string, params?: any) => void;
}

export default function TeacherDashboard({
  currentUser,
  lessons,
  onUpdateAvailability,
  onNavigate,
}: TeacherDashboardProps) {
  
  // Local state for availability scheduler input
  const [newDay, setNewDay] = useState("Monday");
  const [newTime, setNewTime] = useState("10:00");
  const [schedulerError, setSchedulerError] = useState("");
  const [schedulerSuccess, setSchedulerSuccess] = useState("");

  // Payout configuration
  const [payoutSchedule, setPayoutSchedule] = useState<'weekly' | 'monthly'>('weekly');
  const [showStripeModal, setShowStripeModal] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 font-semibold">Please join or log in as a teacher to access your workspace dashboard.</p>
        <button 
          onClick={() => onNavigate('register-teacher')}
          className="mt-4 bg-[#01c9a8] hover:bg-[#01c9a8]/90 text-[#0c0c10] font-bold px-5 py-2.5 rounded-[8px] transition-all shadow-sm hover:shadow-md"
        >
          Join Teacher Portal
        </button>
      </div>
    );
  }

  // Filter lessons for this teacher
  const teacherLessons = lessons.filter(l => l.teacherId === currentUser.id);
  const upcomingLessons = teacherLessons.filter(l => l.status === 'confirmed' || l.status === 'pending');
  const pastLessons = teacherLessons.filter(l => l.status === 'completed');

  // Compute earnings metrics
  const totalEscrowPending = upcomingLessons.reduce((sum, l) => sum + l.teacherEarnings, 0);
  const totalCompletedEarnings = pastLessons.reduce((sum, l) => sum + l.teacherEarnings, 0);

  // Manage Availability slots
  const handleAddSlot = () => {
    setSchedulerError("");
    setSchedulerSuccess("");
    const currentList = currentUser.availability || [];
    
    const exists = currentList.some(slot => slot.dayOfWeek === newDay && slot.time === newTime);
    if (exists) {
      setSchedulerError("This slot is already listed in your weekly availability.");
      return;
    }

    const updated = [...currentList, { dayOfWeek: newDay, time: newTime }];
    onUpdateAvailability(updated);
    setSchedulerSuccess("New availability slot successfully appended to your public calendar!");
  };

  const handleRemoveSlot = (index: number) => {
    setSchedulerError("");
    setSchedulerSuccess("");
    const currentList = currentUser.availability || [];
    const updated = currentList.filter((_, i) => i !== index);
    onUpdateAvailability(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8" id="teacher-dashboard-root">
      
      {/* Dashboard Header Greetings card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-[#e5e5e1] rounded-[14px] p-6 shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Teacher Workspace</span>
          <h2 className="text-2xl font-syne text-[#0c0c10]">Greetings, {currentUser.name}</h2>
          <div className="text-xs font-bold text-gray-500 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-secondary" />
            Timezone profile: <span className="text-[#0c0c10] font-mono">{currentUser.timezone}</span>
          </div>
        </div>

        {/* Stripe Express Status Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Stripe Connect Express</span>
            <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded uppercase">Active Verified</span>
          </div>
          <button 
            onClick={() => setShowStripeModal(true)}
            className="bg-white hover:bg-gray-50 border border-[#e5e5e1] text-[#0c0c10] text-xs font-bold py-2 px-3.5 rounded-[8px] flex items-center gap-1.5 shadow-sm transition-colors"
            id="view-stripe-payouts-btn"
          >
            Stripe Dashboard
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Statistics board grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Completed Earnings (90% clear) */}
        <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-4 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Completed Earnings</span>
          <div className="font-syne text-2xl text-green-700" style={{ fontWeight: 800 }}>${totalCompletedEarnings.toFixed(2)}</div>
          <span className="text-[9px] text-gray-400 font-semibold uppercase">Net (90% clear)</span>
        </div>

        {/* Pending Escrow Hold (Upcoming classes) */}
        <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-4 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Escrow Holdings</span>
          <div className="font-syne text-2xl text-[#4a2fe0]" style={{ fontWeight: 800 }}>${totalEscrowPending.toFixed(2)}</div>
          <span className="text-[9px] text-gray-400 font-semibold uppercase">On hold till confirmed</span>
        </div>

        {/* Total Tutoring Hours */}
        <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-4 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Completed Hours</span>
          <div className="font-syne text-2xl text-[#0c0c10]" style={{ fontWeight: 800 }}>{pastLessons.length} hours</div>
          <span className="text-[9px] text-gray-400 font-semibold uppercase">Total lessons taught</span>
        </div>

        {/* Hourly Pricing Rate */}
        <div className="bg-[#01c9a8]/10 border border-[#01c9a8]/20 rounded-[14px] p-4 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Your Hourly Rate</span>
          <div className="font-syne text-2xl text-[#0c0c10]" style={{ fontWeight: 800 }}>${currentUser.hourlyRate}/hr</div>
          <span className="text-[9px] text-gray-500 font-semibold uppercase">Flat 10% platform commission</span>
        </div>
      </div>

      {/* Main workspace layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Hand Column: Scheduled lesson list (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="space-y-4">
            <h3 className="font-syne text-lg text-[#0c0c10] flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <Calendar className="w-5 h-5 text-primary" />
              Scheduled Student Lessons ({upcomingLessons.length})
            </h3>

            {upcomingLessons.length > 0 ? (
              <div className="space-y-4">
                {upcomingLessons.map(lesson => (
                  <div key={lesson.id} className="bg-white border border-[#e5e5e1] rounded-[14px] p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="bg-[#01c9a8]/10 text-[#0c0c10] border border-[#01c9a8]/20 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase">
                          {lesson.subject}
                        </span>
                        <h4 className="font-syne text-base text-[#0c0c10]">Student Name: {lesson.studentName}</h4>
                      </div>

                      <div className="text-right leading-tight">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Lesson value</span>
                        <span className="text-xs font-bold text-green-700 font-mono">${lesson.price}.00 (Earnings: ${lesson.teacherEarnings.toFixed(2)})</span>
                      </div>
                    </div>

                    {/* Timezone Synced Badge view */}
                    <div className="grid sm:grid-cols-2 gap-3 pt-2">
                      <div className="bg-gray-50 border border-[#e5e5e1] p-2.5 rounded-[8px] shadow-sm">
                        <span className="text-[9px] font-bold text-gray-400 uppercase block">Your Local Hour ({currentUser.timezone})</span>
                        <div className="text-xs font-bold text-primary font-mono mt-0.5">
                          {lesson.teacherLocalTime}
                        </div>
                      </div>

                      <div className="bg-gray-50 border border-[#e5e5e1] p-2.5 rounded-[8px] shadow-sm">
                        <span className="text-[9px] font-bold text-gray-400 uppercase block">Student Local Hour ({lesson.studentTimezone})</span>
                        <div className="text-xs font-semibold text-gray-600 font-mono mt-0.5">
                          {lesson.studentLocalTime}
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-gray-400 font-medium bg-[#f7f6f2] p-2 border border-[#e5e5e1] rounded-[4px] text-center">
                      Stripe Status: Funds held in secure escrow. Released immediately upon Student completion click.
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-8 text-center italic text-sm text-gray-400 font-medium shadow-sm">
                No active student lesson bookings on your calendar right now.
              </div>
            )}
          </div>

          {/* Past completed lessons payout registry */}
          <div className="space-y-4">
            <h3 className="font-syne text-base text-gray-500 uppercase tracking-wider">Completed Lesson History & Payouts</h3>
            {pastLessons.length > 0 ? (
              <div className="space-y-3">
                {pastLessons.map(lesson => (
                  <div key={lesson.id} className="bg-white border border-[#e5e5e1] rounded-[14px] p-4 flex justify-between items-center text-xs shadow-sm">
                    <div>
                      <div className="font-bold text-[#0c0c10]">{lesson.studentName} • <span className="text-gray-400 font-medium">{lesson.subject}</span></div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">{lesson.teacherLocalTime}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-green-700 bg-green-50 border border-green-200 font-bold px-2 py-1 rounded-[4px]">
                        ✓ Payout Released (+${lesson.teacherEarnings.toFixed(2)})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic font-medium">No completed lessons recorded in your payout ledger yet.</p>
            )}
          </div>
        </div>

        {/* Right Hand: Interactive Availability settings planner */}
        <div className="space-y-6 animate-fade-in">
          
          {/* Availability Slots Editor */}
          <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-5 shadow-sm space-y-4" id="availability-config-card">
            <div className="space-y-1 pb-3 border-b border-gray-100">
              <h3 className="font-syne text-sm text-[#0c0c10] uppercase tracking-wider flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-primary" />
                Availability Planner
              </h3>
              <p className="text-[11px] text-gray-400 leading-normal font-medium">Define the standard recurring times you are available to teach. These update your profile calendar dynamically.</p>
            </div>

            {schedulerError && <div className="text-xs font-bold text-alert bg-alert/5 p-2 rounded-lg border border-alert/20">⚠️ {schedulerError}</div>}
            {schedulerSuccess && <div className="text-xs font-bold text-green-700 bg-green-50 p-2 rounded-lg border border-green-200">✓ {schedulerSuccess}</div>}

            {/* List current active slots */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {currentUser.availability && currentUser.availability.length > 0 ? (
                currentUser.availability.map((slot, index) => (
                  <div key={index} className="flex justify-between items-center p-2.5 bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] text-xs font-bold">
                    <span>{slot.dayOfWeek} at {slot.time}</span>
                    <button 
                      onClick={() => handleRemoveSlot(index)}
                      className="text-alert hover:text-alert/80"
                      title="Delete slot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs italic text-gray-400 text-center py-4">No availability slots. Add slot below!</p>
              )}
            </div>

            {/* Add inputs */}
            <div className="space-y-3 bg-gray-50 p-3 rounded-[8px] border border-[#e5e5e1]">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Day</label>
                  <select 
                    value={newDay} 
                    onChange={(e) => setNewDay(e.target.value)}
                    className="w-full bg-white border border-[#e5e5e1] rounded p-1.5 text-[11px] font-semibold shadow-sm focus:border-primary focus:outline-none"
                  >
                    {WEEKDAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Local Time</label>
                  <select 
                    value={newTime} 
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-white border border-[#e5e5e1] rounded p-1.5 text-[11px] font-semibold shadow-sm focus:border-primary focus:outline-none"
                  >
                    {AVAILABLE_HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleAddSlot}
                className="w-full bg-[#0c0c10] hover:bg-black text-white font-bold text-xs py-2 rounded-[8px] flex items-center justify-center gap-1 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Slot
              </button>
            </div>
          </div>

          {/* Real-time system logs feed */}
          <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-5 shadow-sm space-y-3">
            <h3 className="font-syne text-xs text-[#0c0c10] uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-secondary" />
              Tutor Logs & Notifications
            </h3>

            <div className="space-y-3 text-[10px] leading-relaxed font-semibold">
              <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 rounded-[4px]">
                ✓ Stripe Express account linked successfully. Direct debit verified.
              </div>
              <div className="p-2.5 bg-primary/5 border border-primary/10 text-primary rounded-[4px]">
                ⏱️ Platform automatic DST offset sync matches London BST and Sydney AEDT rules.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Express Virtual Dashboard Modal Simulator */}
      {showStripeModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-6 max-w-lg w-full shadow-lg space-y-6 relative">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-blue-600 rounded-full"></span>
                <span className="font-syne text-base text-[#0c0c10]">Stripe Express Portal Simulator</span>
              </div>
              <button 
                onClick={() => setShowStripeModal(false)}
                className="text-gray-400 hover:text-[#0c0c10] font-bold text-base"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              This simulated Stripe Express dashboard displays direct payouts routed to your connected checking account. You keep 90% of every session, while Klerno retains a flat 10%.
            </p>

            {/* Payout Schedule Settings Selector */}
            <div className="space-y-2 bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-4">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Set Payout Schedule</label>
              
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input 
                    type="radio" 
                    name="payoutSchedule" 
                    checked={payoutSchedule === 'weekly'}
                    onChange={() => setPayoutSchedule('weekly')}
                    className="accent-primary w-4 h-4"
                  />
                  <span>Weekly Direct Deposits</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input 
                    type="radio" 
                    name="payoutSchedule" 
                    checked={payoutSchedule === 'monthly'}
                    onChange={() => setPayoutSchedule('monthly')}
                    className="accent-primary w-4 h-4"
                  />
                  <span>Monthly Settlement</span>
                </label>
              </div>

              <div className="text-[10px] text-gray-400 font-medium pt-1">
                Currently schedule set to: <strong>{payoutSchedule === 'weekly' ? 'Weekly (Deposited every Monday at 08:00 UTC)' : 'Monthly (Deposited on the 1st)'}</strong>
              </div>
            </div>

            {/* Mock deposits registry */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Recent Direct Deposits Ledger</span>
              
              <div className="space-y-2 max-h-[160px] overflow-y-auto">
                <div className="flex justify-between items-center p-2.5 border border-[#e5e5e1] rounded-[8px] text-xs shadow-sm">
                  <div>
                    <span className="font-bold text-[#0c0c10]">Deposit to Checking •••• 9812</span>
                    <p className="text-[10px] text-gray-400 font-medium">Completed on 2026-06-22</p>
                  </div>
                  <span className="text-green-700 font-bold">+${totalCompletedEarnings > 0 ? totalCompletedEarnings.toFixed(2) : '40.50'} USD</span>
                </div>

                <div className="flex justify-between items-center p-2.5 border border-[#e5e5e1] rounded-[8px] text-xs opacity-60 shadow-sm">
                  <div>
                    <span className="font-bold text-[#0c0c10]">Initial Verification Token Hold</span>
                    <p className="text-[10px] text-gray-400 font-medium">Completed on 2026-06-15</p>
                  </div>
                  <span className="text-gray-500 font-bold">+$1.00 USD</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowStripeModal(false)}
              className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3 rounded-[8px] text-sm transition-colors shadow-sm"
            >
              Close Secure Stripe Portal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
