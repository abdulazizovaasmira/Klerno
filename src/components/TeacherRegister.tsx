import React, { useState, useEffect } from 'react';
import { User, TimeSlot } from '../types';
import { COUNTRIES, SUBJECTS, WEEKDAYS, AVAILABLE_HOURS } from '../data';
import { 
  ShieldCheck, Globe, Check, Calendar, Plus, Trash2, 
  Upload, FileText, ArrowRight, Sparkles, AlertCircle 
} from 'lucide-react';

interface TeacherRegisterProps {
  onRegisterSuccess: (newTeacher: User) => void;
  onNavigate: (page: string) => void;
}

export default function TeacherRegister({ onRegisterSuccess, onNavigate }: TeacherRegisterProps) {
  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("Germany");
  const [preferredSubjects, setPreferredSubjects] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState<number>(35);
  const [bio, setBio] = useState("");
  const [timezone, setTimezone] = useState("");
  const [qualFile, setQualFile] = useState<string>("");
  const [qualFileName, setQualFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Stripe Onboarding States
  const [stripeStatus, setStripeStatus] = useState<'unlinked' | 'pending' | 'active'>('unlinked');
  const [isLinkingStripe, setIsLinkingStripe] = useState(false);

  // Availability state
  const [availability, setAvailability] = useState<TimeSlot[]>([
    { dayOfWeek: "Monday", time: "10:00" },
    { dayOfWeek: "Wednesday", time: "14:00" },
    { dayOfWeek: "Friday", time: "11:00" }
  ]);
  const [newDay, setNewDay] = useState("Monday");
  const [newTime, setNewTime] = useState("10:00");

  useEffect(() => {
    try {
      const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(detectedTz || "Europe/Berlin");
    } catch (e) {
      setTimezone("Europe/Berlin");
    }
  }, []);

  const handleCountryChange = (countryName: string) => {
    setCountry(countryName);
    const foundCountry = COUNTRIES.find(c => c.name === countryName);
    if (foundCountry) {
      setTimezone(foundCountry.timezone);
    }
  };

  const toggleSubject = (subject: string) => {
    if (preferredSubjects.includes(subject)) {
      setPreferredSubjects(preferredSubjects.filter(s => s !== subject));
    } else {
      setPreferredSubjects([...preferredSubjects, subject]);
    }
  };

  // Availability Management
  const addSlot = () => {
    const exists = availability.some(slot => slot.dayOfWeek === newDay && slot.time === newTime);
    if (exists) {
      setErrorMsg("This slot is already in your availability list.");
      return;
    }
    setAvailability([...availability, { dayOfWeek: newDay, time: newTime }]);
    setErrorMsg("");
  };

  const removeSlot = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  // Drag-and-drop file mock
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setQualFileName(file.name);
      setQualFile(`${file.name} (Verified)`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setQualFileName(file.name);
      setQualFile(`${file.name} (Verified)`);
    }
  };

  // Simulate Stripe express Connect onboarding
  const handleStripeLink = () => {
    setIsLinkingStripe(true);
    setStripeStatus('pending');
    
    setTimeout(() => {
      setStripeStatus('active');
      setIsLinkingStripe(false);
    }, 2500); // 2.5 seconds visual spinner
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    if (preferredSubjects.length === 0) {
      setErrorMsg("Please select at least one teaching subject.");
      return;
    }
    if (hourlyRate <= 0) {
      setErrorMsg("Please specify a valid hourly tutoring rate.");
      return;
    }
    if (!bio.trim() || bio.length < 20) {
      setErrorMsg("Please write a short biography of at least 20 characters.");
      return;
    }
    if (!qualFile) {
      setErrorMsg("Please select or drag in a qualifications PDF/Image.");
      return;
    }
    if (stripeStatus !== 'active') {
      setErrorMsg("Please connect your Stripe Express payout account first.");
      return;
    }
    if (availability.length === 0) {
      setErrorMsg("Please specify at least one availability slot for scheduling.");
      return;
    }

    const selectedCountryObj = COUNTRIES.find(c => c.name === country) || COUNTRIES[0];

    const newTeacher: User = {
      id: `teacher_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role: 'teacher',
      country: country,
      countryCode: selectedCountryObj.code,
      timezone: timezone,
      preferredSubjects: preferredSubjects,
      bio: bio.trim(),
      hourlyRate: hourlyRate,
      qualifications: qualFile,
      rating: 5.0,
      reviews: [],
      availability: availability,
      stripeExpressStatus: stripeStatus,
      joinedCommunities: preferredSubjects.map(sub => sub.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')),
      languages: ["English", "Conversational"],
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 50000)}?auto=format&fit=crop&q=80&w=200&h=200`
    };

    onRegisterSuccess(newTeacher);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" id="teacher-register-root">
      
      {/* Visual Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          Teacher Portal Registration
        </div>
        <h2 className="text-3xl font-syne text-[#0c0c10]">Teach Globally. Keep 90%.</h2>
        <p className="text-gray-500 font-medium text-sm md:text-base">We charge only 10% commission. Onboard in minutes, host lesson slots, and receive payouts securely.</p>
      </div>

      <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-6 md:p-8 shadow-sm space-y-8">
        
        {/* Detected Timezone Badge */}
        <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-3.5 flex items-start gap-3">
          <Globe className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">Auto-Detected Timezone</span>
            <div className="text-sm font-bold text-[#0c0c10] flex items-center gap-1.5">
              <span>{timezone || "Detecting..."}</span>
              <span className="bg-primary text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">Verified DST</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-normal font-medium">All student calendar appointments will automatically synchronize from this base setting.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-alert/10 border border-alert/20 text-alert font-semibold text-sm rounded-[8px] p-3">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
            <h3 className="font-syne text-lg text-[#0c0c10] border-b border-[#e5e5e1] pb-2">1. Profile credentials</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Evelyn Vance"
                  className="w-full bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-2.5 text-sm font-semibold shadow-sm focus:border-primary focus:outline-none"
                  id="teacher-reg-name"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="evelyn@university.edu"
                  className="w-full bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-2.5 text-sm font-semibold shadow-sm focus:border-primary focus:outline-none"
                  id="teacher-reg-email"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-2.5 text-sm font-semibold shadow-sm focus:border-primary focus:outline-none"
                  id="teacher-reg-password"
                />
              </div>

              {/* Country */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Country of Residence</label>
                <select 
                  value={country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-2.5 text-sm font-semibold shadow-sm focus:border-primary focus:outline-none"
                  id="teacher-reg-country"
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>

              {/* Hourly Rate */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Hourly Rate (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-[#0c0c10] text-sm">$</span>
                  <input 
                    type="number" 
                    required
                    min="10"
                    max="150"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] pl-7 pr-3 py-2.5 text-sm font-semibold shadow-sm focus:border-primary focus:outline-none"
                    id="teacher-reg-rate"
                  />
                  <span className="absolute right-3 top-2.5 font-bold text-gray-400 text-xs">/hr</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="font-syne text-lg text-[#0c0c10] border-b border-[#e5e5e1] pb-2">2. Subjects & Professional Bio</h3>
            
            {/* Preferred Subjects multi-select */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Subjects you teach (Select multiple)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SUBJECTS.map(subject => {
                  const isSelected = preferredSubjects.includes(subject);
                  return (
                    <button 
                      type="button"
                      key={subject}
                      toggle-id={`subject-${subject}`}
                      onClick={() => toggleSubject(subject)}
                      className={`p-2.5 border rounded-[8px] text-xs font-bold transition-all text-left flex items-center justify-between ${isSelected ? 'bg-secondary/10 border-secondary text-[#0c0c10]' : 'bg-[#f7f6f2] border-[#e5e5e1] text-gray-600 hover:border-gray-300'}`}
                    >
                      <span>{subject}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#01c9a8]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Professional Biography (Explain your teaching methodology)</label>
              <textarea 
                required
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="PhD in Mathematics. I help students develop clear, visual models of complex topics rather than memorizing dry rules..."
                className="w-full bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-2.5 text-sm font-semibold leading-relaxed shadow-sm focus:border-primary focus:outline-none"
                id="teacher-reg-bio"
              />
            </div>

            {/* Qualifications File Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Qualifications Document (PDF, PNG, or JPG)</label>
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border border-dashed rounded-[8px] p-6 text-center transition-colors cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : 'border-[#e5e5e1] bg-[#f7f6f2] hover:bg-[#f7f6f2]/60'}`}
                id="qual-uploader"
              >
                <input 
                  type="file" 
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden" 
                  onChange={handleFileChange}
                  id="teacher-file-input"
                />
                
                <label htmlFor="teacher-file-input" className="cursor-pointer space-y-2 block">
                  <div className="w-12 h-12 rounded-full bg-white border border-[#e5e5e1] flex items-center justify-center mx-auto shadow-sm">
                    <Upload className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-sm font-bold text-[#0c0c10]">
                    {qualFileName ? `Selected: ${qualFileName}` : 'Drag & Drop your qualification file here, or click to browse'}
                  </div>
                  <p className="text-xs text-gray-400 font-medium">Supports Master's/PhD certificates, teaching license, or university transcripts (PDF or image)</p>
                </label>
              </div>

              {qualFile && (
                <div className="bg-[#01c9a8]/10 border border-[#01c9a8]/30 rounded-[8px] p-2.5 flex items-center gap-2.5 mt-2 text-xs font-bold">
                  <FileText className="w-4 h-4 text-[#01c9a8]" />
                  <span>Document Uploaded and Registered: <span className="underline">{qualFileName}</span></span>
                  <Check className="w-4 h-4 text-green-600 ml-auto" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="font-syne text-lg text-[#0c0c10] border-b border-[#e5e5e1] pb-2">3. Stripe Connect Express Payout System</h3>
            <p className="text-xs text-gray-500 leading-normal font-medium">
              Klerno is powered by Stripe Connect. To host lesson calendars and receive 90% payouts, connect a payout profile.
            </p>

            {stripeStatus === 'unlinked' ? (
              <button 
                type="button"
                onClick={handleStripeLink}
                className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 px-4 rounded-[8px] text-sm flex items-center justify-center gap-2 shadow-sm"
                id="link-stripe-btn"
              >
                Connect with Stripe Express Account
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : stripeStatus === 'pending' || isLinkingStripe ? (
              <div className="border border-[#e5e5e1] rounded-[8px] p-4 bg-yellow-50 text-center space-y-2">
                <div className="w-6 h-6 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div className="text-xs font-bold text-yellow-800">Redirecting & Linking your Stripe Express wallet secure credentials...</div>
              </div>
            ) : (
              <div className="border border-green-600/30 bg-green-50 rounded-[8px] p-4 flex items-center gap-3 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">✓</div>
                <div>
                  <div className="text-xs font-bold uppercase text-green-800">Stripe Connect Account Verified</div>
                  <div className="text-xs font-medium text-green-700">Earnings automatically routes with 90% payout schedule directly to your checking account.</div>
                </div>
                <span className="bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded ml-auto uppercase tracking-wide">Connected</span>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center border-b border-[#e5e5e1] pb-2">
              <h3 className="font-syne text-lg text-[#0c0c10]">4. Standard Weekly Availability</h3>
              <span className="text-xs text-gray-400 font-mono font-bold">Timezone: {timezone}</span>
            </div>
            
            <p className="text-xs text-gray-500 leading-normal font-medium">
              Specify the recurring hours you are available to tutor. Students will see these converted to their own timezones instantly.
            </p>

            {/* List existing slots */}
            {availability.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {availability.map((slot, index) => (
                  <div key={index} className="bg-white border border-[#e5e5e1] rounded-[8px] px-3 py-1.5 text-xs font-bold flex items-center gap-2 shadow-sm">
                    <span>{slot.dayOfWeek} at {slot.time}</span>
                    <button 
                      type="button" 
                      onClick={() => removeSlot(index)}
                      className="text-alert hover:text-alert/80"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-400 italic font-medium bg-[#f7f6f2] p-4 text-center border border-dashed rounded-lg">
                No slots added yet. Please specify availability slots below.
              </div>
            )}

            {/* Add availability inputs */}
            <div className="flex flex-col sm:flex-row gap-3 bg-[#f7f6f2] p-4 rounded-[8px] border border-[#e5e5e1]">
              <div className="space-y-1 flex-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Day of Week</label>
                <select 
                  value={newDay} 
                  onChange={(e) => setNewDay(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded p-1.5 text-xs font-semibold"
                >
                  {WEEKDAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="space-y-1 flex-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Local Time (24h)</label>
                <select 
                  value={newTime} 
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded p-1.5 text-xs font-semibold"
                >
                  {AVAILABLE_HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <button 
                type="button" 
                onClick={addSlot}
                className="self-end bg-white border border-[#e5e5e1] hover:bg-gray-50 font-bold text-xs px-4 py-3 rounded-[8px] flex items-center gap-1 shrink-0 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Slot
              </button>
            </div>
          </div>

          {/* Secure Terms */}
          <div className="border-t border-gray-100 pt-5 text-xs text-gray-500 leading-normal font-medium flex gap-2">
            <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
            <span>
              By register, you certify that all your credentials are true and accurate. Klerno reserves the right to hold and audit payouts if qualification files are found falsified.
            </span>
          </div>

          {/* Register Button */}
          <button 
            type="submit"
            className="w-full bg-[#01c9a8] hover:bg-[#01c9a8]/90 text-[#0c0c10] font-bold py-3.5 rounded-[8px] text-sm transition-colors shadow-sm"
            id="teacher-reg-submit"
          >
            Create Professional Teacher Account
          </button>
        </form>
      </div>
    </div>
  );
}
