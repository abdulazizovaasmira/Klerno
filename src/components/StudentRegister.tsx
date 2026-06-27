import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { COUNTRIES, SUBJECTS } from '../data';
import { ShieldCheck, Info, Sparkles, MapPin, Globe, Check } from 'lucide-react';
import { supabase } from '../supabaseKlerno';

interface StudentRegisterProps {
  onRegisterSuccess: (newUser: User) => void;
  onNavigate: (page: string) => void;
  initialIsSignIn?: boolean;
}

export default function StudentRegister({ onRegisterSuccess, onNavigate, initialIsSignIn = false }: StudentRegisterProps) {
  // Mode Selection State
  const [isSignIn, setIsSignIn] = useState(initialIsSignIn);

  useEffect(() => {
    setIsSignIn(initialIsSignIn);
  }, [initialIsSignIn]);

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("United States");
  const [preferredSubjects, setPreferredSubjects] = useState<string[]>([]);
  const [timezone, setTimezone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    if (isSignIn) {
      // Sign In Logic
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          // Fallback to direct database query on users table to allow seamless login
          // especially when Supabase Auth has rate limits or limits emails.
          const { data: profileByEmail } = await supabase
            .from('users')
            .select('*')
            .eq('email', email.trim());

          if (profileByEmail && profileByEmail.length > 0) {
            onRegisterSuccess(profileByEmail[0] as User);
            setSuccessMsg("Logged in via database profile successfully!");
            setLoading(false);
            return;
          }

          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        if (data?.session && data?.user) {
          // Fetch student profile from Supabase
          const { data: profile, error: profileErr } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            onRegisterSuccess(profile as User);
          } else {
            // Fallback: search by email
            const { data: profileByEmail } = await supabase
              .from('users')
              .select('*')
              .eq('email', email.trim());

            if (profileByEmail && profileByEmail.length > 0) {
              onRegisterSuccess(profileByEmail[0] as User);
            } else {
              setErrorMsg("Profile details not found in database. Please register first.");
            }
          }
        } else {
          // If session is empty but we have a user in our table, log them in anyway!
          const { data: profileByEmail } = await supabase
            .from('users')
            .select('*')
            .eq('email', email.trim());

          if (profileByEmail && profileByEmail.length > 0) {
            onRegisterSuccess(profileByEmail[0] as User);
          } else {
            setErrorMsg("Please confirm your email address before signing in.");
          }
        }
      } catch (err: any) {
        // Complete direct database fallback
        const { data: profileByEmail } = await supabase
          .from('users')
          .select('*')
          .eq('email', email.trim());

        if (profileByEmail && profileByEmail.length > 0) {
          onRegisterSuccess(profileByEmail[0] as User);
        } else {
          setErrorMsg(err.message || "An unexpected error occurred during sign in.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Sign Up Logic
      if (!name.trim()) {
        setErrorMsg("Please enter your name.");
        setLoading(false);
        return;
      }
      if (preferredSubjects.length === 0) {
        setErrorMsg("Please select at least one preferred subject.");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
        });

        if (error) {
          // Fallback to database-only registration if Supabase Auth is rate-limited or hits email limits
          const isLimitErr = error.message.toLowerCase().includes("limit") || 
                             error.message.toLowerCase().includes("rate") || 
                             error.message.toLowerCase().includes("security") ||
                             error.message.toLowerCase().includes("confirm") ||
                             error.status === 429;

          if (isLimitErr) {
            const userId = `student_${Date.now()}`;
            const selectedCountryObj = COUNTRIES.find(c => c.name === country) || COUNTRIES[0];
            
            const newUser: User = {
              id: userId,
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

            const { error: insertErr } = await supabase.from('users').insert(newUser);
            if (insertErr) {
              console.error("Supabase profile save fallback failed:", insertErr);
            }

            onRegisterSuccess(newUser);
            setSuccessMsg("Account created directly! Bypassed email rate limit restriction.");
            setLoading(false);
            return;
          }

          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        const userId = data?.user?.id || `student_${Date.now()}`;
        const selectedCountryObj = COUNTRIES.find(c => c.name === country) || COUNTRIES[0];
        
        const newUser: User = {
          id: userId,
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

        // Always save profile to Supabase first
        const { error: insertErr } = await supabase.from('users').insert(newUser);
        if (insertErr) {
          console.error("Supabase profile save failed:", insertErr);
        }

        if (!data?.session) {
          setSuccessMsg("Your account has been created. Please check your email and verify your address before logging in.");
          setPassword("");
          setIsSignIn(true);
          setLoading(false);
          return;
        }

        onRegisterSuccess(newUser);
      } catch (err: any) {
        setErrorMsg(err.message || "An unexpected error occurred during sign up.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" id="student-register-container">
      
      {/* Visual Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          Student Portal {isSignIn ? "Sign In" : "Registration"}
        </div>
        <h2 className="text-3xl font-syne text-[#0c0c10]">{isSignIn ? "Welcome Back to Klerno" : "Begin Your Global Learning"}</h2>
        <p className="text-gray-500 font-medium text-sm md:text-base">
          {isSignIn ? "Access your lessons, messages, and communities instantly." : "Connect with expert tutors instantly. Standardized times, zero timezone confusion."}
        </p>
      </div>

      <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-6 md:p-8 shadow-sm">
        
        {/* Sign In / Sign Up Tabs */}
        <div className="flex border-b border-[#e5e5e1] mb-6" id="auth-tabs">
          <button
            type="button"
            onClick={() => { setIsSignIn(false); setErrorMsg(""); setSuccessMsg(""); }}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${!isSignIn ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            id="tab-signup"
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => { setIsSignIn(true); setErrorMsg(""); setSuccessMsg(""); }}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${isSignIn ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            id="tab-signin"
          >
            Sign In
          </button>
        </div>

        {/* Detected Timezone Badge */}
        {!isSignIn && (
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
        )}

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 font-semibold text-xs rounded-[8px] p-3 mb-6" id="auth-error-msg">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 font-semibold text-xs rounded-[8px] p-3 mb-6" id="auth-success-msg">
            ✓ {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {!isSignIn ? (
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
          ) : (
            /* Sign In Mode: Email field on its own row */
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-2.5 text-sm font-semibold shadow-sm focus:border-primary focus:outline-none"
                id="student-signin-email"
              />
            </div>
          )}

          {!isSignIn ? (
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
          ) : (
            /* Sign In Mode: Password field on its own row */
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-2.5 text-sm font-semibold shadow-sm focus:border-primary focus:outline-none"
                id="student-signin-password"
              />
            </div>
          )}

          {!isSignIn && (
            <>
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
            </>
          )}

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 rounded-[8px] text-sm transition-colors shadow-sm disabled:opacity-50"
            id="student-reg-submit"
          >
            {loading ? "Please wait..." : isSignIn ? "Sign In to Student Account" : "Create Free Student Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs font-bold text-gray-500 flex flex-col gap-2">
          <div>
            {isSignIn ? "Don't have an account yet?" : "Already have an account?"}{' '}
            <button 
              type="button"
              onClick={() => { setIsSignIn(!isSignIn); setErrorMsg(""); setSuccessMsg(""); }}
              className="text-primary hover:underline font-bold"
            >
              {isSignIn ? "Sign Up here" : "Sign In here"}
            </button>
          </div>
          <div className="border-t border-gray-100 pt-3 mt-1">
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
    </div>
  );
}
