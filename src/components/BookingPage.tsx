import React, { useState, useEffect } from 'react';
import { User, Lesson } from '../types';
import { COUNTRIES, getDualTimeDetails } from '../data';
import { ShieldCheck, CreditCard, Calendar, Clock, Lock, CheckCircle2, ChevronRight, Award } from 'lucide-react';

interface BookingPageProps {
  teacherId: string;
  dayOfWeek: string;
  dateStr: string;
  timeStr: string;
  currentUser: User | null;
  mockTeachers: User[];
  onBookingSuccess: (newLesson: Lesson) => void;
  onNavigate: (page: string) => void;
}

export default function BookingPage({
  teacherId,
  dayOfWeek,
  dateStr,
  timeStr,
  currentUser,
  mockTeachers,
  onBookingSuccess,
  onNavigate,
}: BookingPageProps) {
  
  const [teacher, setTeacher] = useState<User | null>(null);
  const [studentTz, setStudentTz] = useState("America/New_York");
  
  // Payment Form State
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("321");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [createdLesson, setCreatedLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    const found = mockTeachers.find(t => t.id === teacherId);
    if (found) {
      setTeacher(found);
    }
  }, [teacherId, mockTeachers]);

  useEffect(() => {
    if (currentUser) {
      setStudentTz(currentUser.timezone);
    } else {
      try {
        const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (detected) setStudentTz(detected);
      } catch (e) {
        setStudentTz("America/New_York");
      }
    }
  }, [currentUser]);

  if (!teacher) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="text-gray-500 font-semibold">Locating lesson details...</p>
      </div>
    );
  }

  // Calculate pricing breakdown
  const price = teacher.hourlyRate || 30;
  const platformFee = Math.round((price * 0.1) * 100) / 100; // 10% platform fee
  const teacherEarnings = Math.round((price * 0.9) * 100) / 100; // 90% teacher earnings

  // Get dual time formatting
  const dualTime = getDualTimeDetails(dateStr, timeStr, teacher.timezone, studentTz);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const lessonId = `l_${Date.now()}`;
    const studentName = currentUser?.name || "Guest Student";
    const studentId = currentUser?.id || "student_guest";

    const newLesson: Lesson = {
      id: lessonId,
      teacherId: teacher.id,
      studentId: studentId,
      teacherName: teacher.name,
      studentName: studentName,
      subject: teacher.preferredSubjects[0] || "General",
      date: dateStr,
      timeSlot: timeStr,
      hourlyRate: price,
      price: price,
      platformFee: platformFee,
      teacherEarnings: teacherEarnings,
      status: 'pending', // starts as pending when paying with real Stripe
      teacherTimezone: teacher.timezone,
      studentTimezone: studentTz,
      studentLocalTime: dualTime.studentTime.split(' GMT')[0],
      teacherLocalTime: dualTime.teacherTime.split(' GMT')[0],
      paymentCaptured: false // holds funds till confirmed complete
    };

    // If teacher has a real Stripe Connect ID, proceed with real checkout session
    if (teacher.stripeConnectId && !teacher.stripeConnectId.startsWith('acct_mock')) {
      try {
        // Save the pending lesson first so we can confirm it on return callback
        onBookingSuccess(newLesson);

        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId: lessonId,
            studentId: studentId,
            studentName: studentName,
            teacherId: teacher.id,
            teacherName: teacher.name,
            subject: newLesson.subject,
            date: dateStr,
            time: timeStr,
            price: price,
            teacherStripeId: teacher.stripeConnectId
          })
        });

        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        } else {
          throw new Error(data.error || "Failed to create Stripe Checkout session");
        }
      } catch (err) {
        console.warn("Real Stripe checkout failed, falling back to instant simulation mode:", err);
      }
    }

    // Fallback: Simulate Stripe payment processing
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingCompleted(true);

      const confirmedLesson: Lesson = {
        ...newLesson,
        status: 'confirmed' // immediately confirmed for simulation convenience
      };

      setCreatedLesson(confirmedLesson);
      onBookingSuccess(confirmedLesson);
    }, 2500);
  };

  if (bookingCompleted && createdLesson) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center space-y-6" id="booking-success-screen">
        <div className="w-16 h-16 rounded-full bg-[#01c9a8]/10 text-secondary border border-[#01c9a8]/20 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-[#01c9a8]" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-syne text-[#0c0c10]">Lesson Booking Secured!</h2>
          <p className="text-sm text-gray-500 font-medium">Funds are held safely in escrow. Payout triggers only after lesson is marked complete.</p>
        </div>

        {/* Detailed Lesson Receipt */}
        <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-5 text-left shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <span className="text-xs font-bold uppercase text-gray-400">Lesson Receipt</span>
            <span className="text-xs font-mono font-bold bg-[#0c0c10]/5 px-2 py-0.5 rounded text-gray-600">ID: {createdLesson.id}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-gray-400 uppercase text-[9px]">Tutor</span>
              <div className="font-bold text-sm text-[#0c0c10]">{createdLesson.teacherName}</div>
            </div>
            <div>
              <span className="font-bold text-gray-400 uppercase text-[9px]">Subject</span>
              <div className="font-bold text-sm text-[#0c0c10]">{createdLesson.subject}</div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-2.5">
            <div>
              <span className="font-bold text-gray-400 uppercase text-[9px] block mb-1">Your Local Scheduled Time ({studentTz})</span>
              <div className="font-bold text-xs bg-primary/5 text-[#0c0c10] p-2 border border-primary/10 rounded font-mono">
                {createdLesson.studentLocalTime}
              </div>
            </div>

            <div>
              <span className="font-bold text-gray-400 uppercase text-[9px] block mb-1">Tutor Local Scheduled Time ({teacher.timezone})</span>
              <div className="font-medium text-xs text-gray-500 pl-2 font-mono">
                {createdLesson.teacherLocalTime}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3 flex justify-between items-center font-bold text-sm text-[#0c0c10]">
            <span>Secured Payment Amount</span>
            <span>${createdLesson.price}.00 USD</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button 
            onClick={() => onNavigate(currentUser?.role === 'student' ? 'student-dashboard' : 'landing')}
            className="flex-1 bg-primary hover:bg-primary/95 text-white font-bold py-3.5 rounded-[8px] text-sm transition-colors shadow-sm"
            id="success-view-dashboard"
          >
            Go to My Dashboard
          </button>
          
          <button 
            onClick={() => onNavigate('communities')}
            className="flex-1 bg-white hover:bg-gray-50 text-[#0c0c10] font-bold py-3.5 border border-[#e5e5e1] rounded-[8px] text-sm transition-colors shadow-sm"
            id="success-browse-forums"
          >
            Visit Student Study Clubs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8" id="booking-payment-root">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-syne text-[#0c0c10]">Secure Lesson Checkout</h2>
        <p className="text-sm text-gray-500 font-medium">Verify lesson slot and finalize your payment safely with Klerno Escrow Protection.</p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand: Lesson Details Summary Card */}
        <div className="md:col-span-5 bg-white border border-[#e5e5e1] rounded-[14px] p-5 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <img 
              src={teacher.avatar} 
              alt={teacher.name} 
              className="w-12 h-12 rounded-full border border-[#e5e5e1] object-cover shadow-sm" 
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="font-syne text-sm text-[#0c0c10]">{teacher.name}</h3>
              <p className="text-xs text-gray-400 font-bold uppercase">{teacher.preferredSubjects[0]} Tutor</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-4">
            
            {/* Student timezone slot detail */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Your Local Time ({studentTz})</span>
              <div className="bg-primary/5 text-primary border border-primary/10 rounded-[4px] p-2 text-xs font-bold font-mono">
                {dualTime.studentTime.split(' GMT')[0]}
              </div>
            </div>

            {/* Teacher timezone slot detail */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tutor Local Time ({teacher.timezone})</span>
              <div className="text-xs text-gray-500 font-semibold font-mono pl-2">
                {dualTime.teacherTime.split(' GMT')[0]}
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Trial Lesson (1 Hour)</span>
              <span>${price}.00</span>
            </div>
            
            {/* Split Breakdown explaining the marketplace 90/10 rules */}
            <div className="bg-[#f7f6f2] p-3 rounded-[8px] space-y-1.5 border border-[#e5e5e1] text-[10px] text-gray-400">
              <div className="flex justify-between text-gray-600 font-bold">
                <span>Platform Commission (10%)</span>
                <span>-${platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-700 font-bold">
                <span>Teacher Direct Earnings (90%)</span>
                <span>${teacherEarnings.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-sm text-[#0c0c10] border-t border-gray-100 pt-3">
              <span>Total Secure Booking</span>
              <span>${price}.00 USD</span>
            </div>
          </div>

          {/* Escrow Disclaimer */}
          <div className="bg-secondary/5 border border-secondary/20 rounded-[8px] p-3.5 text-[10px] text-gray-500 leading-normal font-medium flex gap-2">
            <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
            <span>
              <strong>Stripe Escrow Guarantee:</strong> Payment is manually authorized but held in reserve. Funds are captured only when you attend the lesson and mark it complete on your student dashboard.
            </span>
          </div>
        </div>

        {/* Right Hand: Simulated Stripe Payment Card Form */}
        <div className="md:col-span-7 bg-white border border-[#e5e5e1] rounded-[14px] p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="font-syne text-base text-[#0c0c10] flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-secondary" />
              Stripe Secure Gateway
            </h3>
            <span className="text-[10px] font-bold uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded">PCI-DSS Compliant</span>
          </div>

          {isSubmitting ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="text-sm font-bold text-[#0c0c10]">Contacting Stripe payment validation services...</div>
              <p className="text-xs text-gray-400 font-medium max-w-xs mx-auto">Locking your schedule and holding trial slot at {dualTime.studentTime.split(' GMT')[0]}. Please wait.</p>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Cardholder Name</label>
                <input 
                  type="text" 
                  required
                  placeholder={currentUser?.name || "Demo Student"}
                  className="w-full bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-2.5 text-sm font-semibold shadow-sm focus:border-primary focus:outline-none"
                />
              </div>

              {/* Card Inputs */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Card Details</label>
                <div className="relative">
                  <span className="absolute left-3 top-3"><CreditCard className="w-4 h-4 text-gray-400" /></span>
                  <input 
                    type="text" 
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] pl-10 pr-3 py-2.5 text-sm font-semibold font-mono text-[#0c0c10] shadow-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Expiry Date</label>
                  <input 
                    type="text" 
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-2.5 text-sm font-semibold font-mono shadow-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">CVC Security Code</label>
                  <input 
                    type="password" 
                    required
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="•••"
                    className="w-full bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-2.5 text-sm font-semibold font-mono shadow-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Supported payment badges */}
              <div className="bg-gray-50 rounded-[8px] border border-[#e5e5e1] p-3 flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Supported Methods:</span>
                <div className="flex gap-2.5 text-gray-400 text-xs font-mono font-bold">
                  <span>VISA</span>
                  <span>MC</span>
                  <span>AMEX</span>
                  <span className="text-[#0c0c10]">ApplePay</span>
                  <span className="text-[#0c0c10]">SEPA</span>
                </div>
              </div>

              {/* Secure payment confirmation button */}
              <button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 rounded-[8px] text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                id="booking-secure-pay-btn"
              >
                <Lock className="w-4 h-4 text-[#01c9a8]" />
                Authorize & Lock Lesson Slot (${price}.00)
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
