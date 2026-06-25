import { User, UserRole } from '../types';
import { Globe, GraduationCap, Users, Search, BookOpen, LogIn, ChevronDown, UserCircle } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  mockTeachers: User[];
  onNavigate: (page: string, params?: any) => void;
  currentPage: string;
}

export default function Header({
  currentUser,
  setCurrentUser,
  mockTeachers,
  onNavigate,
  currentPage,
}: HeaderProps) {
  
  // Switcher to simulate different roles easily
  const handleRoleSwitch = (role: 'student' | 'teacher' | 'guest') => {
    if (role === 'guest') {
      setCurrentUser(null);
      onNavigate('landing');
    } else if (role === 'student') {
      setCurrentUser({
        id: "student_demo",
        name: "Demo Student",
        email: "demo@klerno.com",
        role: "student",
        country: "United States",
        countryCode: "US",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York",
        preferredSubjects: ["Mathematics", "IT & Coding"],
        joinedCommunities: ["mathematics", "it-coding"],
        savedTeachers: ["t1"]
      });
      onNavigate('student-dashboard');
    } else if (role === 'teacher') {
      // Login as Evelyn Vance (Teacher)
      const evelyn = mockTeachers.find(t => t.id === "t1") || mockTeachers[0];
      setCurrentUser(evelyn);
      onNavigate('teacher-dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e5e5e1] px-4 py-4 md:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Wordmark */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
          id="brand-logo"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[#f7f6f2] relative overflow-hidden">
            <Globe className="w-4 h-4 animate-[spin_20s_linear_infinite]" />
            {/* Meridian Line and Equator stylized */}
            <div className="absolute inset-0 border border-white/20 rounded-full"></div>
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/40"></div>
          </div>
          
          <span className="font-syne text-2xl tracking-tighter" style={{ fontWeight: 800 }}>
            <span className="text-[#0c0c10]">kl</span>
            <span className="text-primary">erno</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-wider text-[#666]">
          <button 
            onClick={() => onNavigate('browse')}
            className={`flex items-center gap-1.5 hover:text-primary transition-colors py-1 ${currentPage === 'browse' ? 'text-primary border-b-2 border-primary font-bold' : ''}`}
            id="nav-browse"
          >
            <Search className="w-4 h-4" />
            Find Tutors
          </button>
          
          <button 
            onClick={() => onNavigate('communities')}
            className={`flex items-center gap-1.5 hover:text-primary transition-colors py-1 ${currentPage === 'communities' || currentPage.startsWith('community-') ? 'text-primary border-b-2 border-primary font-bold' : ''}`}
            id="nav-communities"
          >
            <Users className="w-4 h-4" />
            Communities
          </button>

          {currentUser && (
            <button 
              onClick={() => onNavigate(currentUser.role === 'student' ? 'student-dashboard' : 'teacher-dashboard')}
              className={`flex items-center gap-1.5 hover:text-primary transition-colors py-1 ${currentPage.includes('dashboard') ? 'text-primary border-b-2 border-primary font-bold' : ''}`}
              id="nav-dashboard"
            >
              <GraduationCap className="w-4 h-4" />
              Dashboard
            </button>
          )}
        </nav>

        {/* Action Controls & Interactive Role Switcher */}
        <div className="flex items-center gap-4">
          
          {/* Visual Environment Role Switcher Widget */}
          <div className="flex items-center bg-white border border-[#e5e5e1] rounded-[8px] p-0.5 text-xs font-semibold shadow-sm" id="env-role-switcher">
            <span className="hidden lg:inline px-2 text-[#0c0c10]/50 uppercase tracking-wider text-[9px]">Testing:</span>
            <button 
              onClick={() => handleRoleSwitch('student')}
              className={`px-2 py-1 rounded-[6px] transition-colors ${currentUser?.role === 'student' ? 'bg-primary text-white' : 'text-[#0c0c10]/75 hover:bg-gray-100'}`}
              title="Switch to Demo Student"
              id="switch-student"
            >
              Student
            </button>
            <button 
              onClick={() => handleRoleSwitch('teacher')}
              className={`px-2 py-1 rounded-[6px] transition-colors ${currentUser?.role === 'teacher' ? 'bg-[#01c9a8] text-[#0c0c10]' : 'text-[#0c0c10]/75 hover:bg-gray-100'}`}
              title="Switch to Demo Teacher (Evelyn)"
              id="switch-teacher"
            >
              Teacher
            </button>
            <button 
              onClick={() => handleRoleSwitch('guest')}
              className={`px-2 py-1 rounded-[6px] transition-colors ${!currentUser ? 'bg-gray-700 text-white' : 'text-[#0c0c10]/75 hover:bg-gray-100'}`}
              title="Switch to Unregistered Guest"
              id="switch-guest"
            >
              Guest
            </button>
          </div>

          {/* User Profile / Registration Buttons */}
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div 
                className="hidden sm:flex flex-col items-end text-right leading-tight cursor-pointer"
                onClick={() => onNavigate(currentUser.role === 'student' ? 'student-dashboard' : 'teacher-dashboard')}
              >
                <span className="text-sm font-semibold text-[#0c0c10]">{currentUser.name}</span>
                <span className="text-[10px] font-bold text-[#666] uppercase tracking-wider">
                  {currentUser.role}
                </span>
              </div>
              <button 
                onClick={() => onNavigate(currentUser.role === 'student' ? 'student-dashboard' : 'teacher-dashboard')}
                className="w-9 h-9 rounded-full overflow-hidden border border-[#e5e5e1] shadow-sm hover:border-primary transition-colors"
                id="user-profile-button"
              >
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onNavigate('register-student')}
                className="hidden sm:block text-sm font-semibold uppercase tracking-wider text-[#666] hover:text-[#0c0c10] transition-colors"
                id="nav-login-btn"
              >
                Login
              </button>
              <button 
                onClick={() => onNavigate('register-student')}
                className="bg-primary hover:bg-primary/95 text-white px-5 py-2.5 rounded-[8px] text-xs md:text-sm font-bold uppercase tracking-tight transition-colors shadow-sm"
                id="nav-register-btn"
              >
                Start Learning
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
