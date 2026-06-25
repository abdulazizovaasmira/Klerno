import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { COUNTRIES, SUBJECTS } from '../data';
import { ShieldCheck, Info, Sparkles, MapPin, Globe, Check } from 'lucide-react';

interface StudentRegisterProps {
  onRegisterSuccess: (newUser: User) => void;
  onNavigate: (page: string) => void;
}

export default function StudentRegister({ onRegisterSuccess, onNavigate }: StudentRegisterProps) {
  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("United States");
  const [preferredSubjects, setPreferredSubjects] = useState<string[]>([]);
  const [timezone, setTimezone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Auto-detect timezone on mount
  useEffect(() => {
    try {
      const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detectedTz) {
        setTimezone(detectedTz);
      } else {
        setTimezone("America/New_York");
      }
    } catch (e) {
      setTimezone("America/New_York");
    }
  }, []);

  // Set default timezone when country changes to keep it convenient
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
      setErrorMsg("Please select at least one preferred subject.");
      return;
    }

    // Success registration
    const selectedCountryObj = COUNTRIES.find(c => c.name === country) || COUNTRIES[0];
    
    const newUser: User = {
      id: `student_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role: 'student',
      country: country,
      countryCode: selectedCountryObj.code,
      timezone: timezone,
      preferredSubjects: preferredSubjects,
      joinedCommunities: preferredSubjects.map(sub => sub.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')),
      savedTeachers: [],
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?auto=format&fit=crop&q=80&w=200&h=200`
    };

    onRegisterSuccess(newUser);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" id="student-register-container">
      
      {/* Visual Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          Student Portal Registration
        </div>
        <h2 className="text-3xl font-syne text-[#0c0c10]">Begin Your Global Learning</h2>
        <p className="text-gray-500 font-medium text-sm md:text-base">Connect with expert tutors instantly. Standardized times, zero timezone confusion.</p>
      </div>

      <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-6 md:p-8 shadow-sm">
        
        {/* Detected Timezone Badge */}
        <div className="bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-3.5 mb-6 flex items-start gap-3">
          <Globe className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Auto-Detected Timezone</span>
            <div className="text-sm font-bold text-[#0c0c10] flex items-center gap-1.5">
              <span>{timezone || "Detecting..."}</span>
              <span className="bg-[#01c9a8] text-[#0c0c10] text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">DST Synced</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-normal font-medium">All scheduling displays will match this setting. You can change your timezone region any time.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-alert/10 border border-alert/20 text-alert font-semibold text-sm rounded-[8px] p-3 mb-4">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-2.5 text-sm font-semibold shadow-sm focus:border-primary focus:outline-none"
                id="student-reg-name"
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
                placeholder="alex@example.com"
                className="w-full bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-2.5 text-sm font-semibold shadow-sm focus:border-primary focus:outline-none"
                id="student-reg-email"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
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
                id="student-reg-password"
              />
            </div>

            {/* Country Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Country of Residence</label>
              <select 
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-2.5 text-sm font-semibold shadow-sm focus:border-primary focus:outline-none"
                id="student-reg-country"
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Timezone (Can be adjusted manual) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Confirm Your Target Timezone</label>
            <select 
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-2.5 text-sm font-semibold text-gray-700 shadow-sm focus:border-primary focus:outline-none"
              id="student-reg-timezone"
            >
              {COUNTRIES.map(c => (
                <option key={`tz-${c.code}`} value={c.timezone}>{c.name} ({c.timezone})</option>
              ))}
              {/* Also include common list fallback if not in country */}
              <option value="Asia/Tokyo">Tokyo, Japan (Asia/Tokyo)</option>
              <option value="Europe/London">London, UK (Europe/London)</option>
              <option value="America/New_York">New York, USA (America/New_York)</option>
              <option value="Australia/Sydney">Sydney, Australia (Australia/Sydney)</option>
            </select>
          </div>

          {/* Multi-Select Preferred Subjects */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Preferred Subjects (Select at least one)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SUBJECTS.map(subject => {
                const isSelected = preferredSubjects.includes(subject);
                return (
                  <button 
                    type="button"
                    key={subject}
                    onClick={() => toggleSubject(subject)}
                    className={`p-2.5 border rounded-[8px] text-xs font-bold transition-all text-left flex items-center justify-between ${isSelected ? 'bg-primary/10 border-primary text-[#0c0c10]' : 'bg-[#f7f6f2] border-[#e5e5e1] text-gray-600 hover:border-gray-300'}`}
                  >
                    <span>{subject}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secure Terms Disclaimer */}
          <div className="border-t border-gray-100 pt-5 text-xs text-gray-500 leading-normal font-medium flex gap-2">
            <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
            <span>
              By creating an account, you agree to secure lesson scheduling and payments via Stripe Connect. Lessons are fully covered by Klerno's completed escrow protection guarantees.
            </span>
          </div>

          {/* Register Button */}
          <button 
            type="submit"
            className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 rounded-[8px] text-sm transition-colors shadow-sm"
            id="student-reg-submit"
          >
            Create Free Student Account
          </button>
        </form>

        <div className="mt-6 text-center text-xs font-bold text-gray-500">
          Looking to teach?{' '}
          <button 
            onClick={() => onNavigate('register-teacher')}
            className="text-primary hover:underline font-bold"
          >
            Register as a teacher instead
          </button>
        </div>
      </div>
    </div>
  );
}
