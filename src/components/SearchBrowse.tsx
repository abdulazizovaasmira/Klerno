import { useState, useEffect } from 'react';
import { User } from '../types';
import { SUBJECTS, COUNTRIES } from '../data';
import { Filter, Search, Globe, DollarSign, Award, ChevronRight, SlidersHorizontal, BookOpen } from 'lucide-react';

interface SearchBrowseProps {
  mockTeachers: User[];
  onNavigate: (page: string, params?: any) => void;
  initialSubject?: string;
}

export default function SearchBrowse({
  mockTeachers,
  onNavigate,
  initialSubject = ""
}: SearchBrowseProps) {
  
  // Filter States
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [maxPrice, setMaxPrice] = useState<number>(80);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [timezoneRegion, setTimezoneRegion] = useState(""); // "Americas", "Europe", "Asia"

  // Sync with initial subject if provided
  useEffect(() => {
    if (initialSubject) {
      setSelectedSubject(initialSubject);
    }
  }, [initialSubject]);

  // Filters logic
  const filteredTeachers = mockTeachers.filter(teacher => {
    // Subject filter
    if (selectedSubject && !teacher.preferredSubjects.includes(selectedSubject)) {
      return false;
    }

    // Price filter
    if (teacher.hourlyRate && teacher.hourlyRate > maxPrice) {
      return false;
    }

    // Language filter
    if (selectedLanguage && teacher.languages && !teacher.languages.includes(selectedLanguage)) {
      return false;
    }

    // Timezone Region group filter
    if (timezoneRegion) {
      const tz = teacher.timezone.toLowerCase();
      if (timezoneRegion === "Americas" && !tz.includes("america") && !tz.includes("toronto") && !tz.includes("sao_paulo")) {
        return false;
      }
      if (timezoneRegion === "Europe" && !tz.includes("europe") && !tz.includes("london") && !tz.includes("berlin") && !tz.includes("paris")) {
        return false;
      }
      if (timezoneRegion === "Asia" && !tz.includes("asia") && !tz.includes("tokyo") && !tz.includes("kolkata") && !tz.includes("singapore") && !tz.includes("australia") && !tz.includes("sydney")) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8" id="browse-page-root">
      
      {/* Visual Page Header */}
      <div className="space-y-3">
        <h2 className="text-3xl md:text-4xl font-syne text-[#0c0c10]">Professional Tutors</h2>
        <p className="text-gray-500 font-medium max-w-2xl">Browse elite, vetted tutors around the globe. Our platform auto-synchronizes lesson hours to your exact timezone.</p>
      </div>

      {/* Main Grid: Filters Sidebar + Results */}
      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* Left Side: Filter Control Board */}
        <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-5 shadow-sm h-fit space-y-6" id="filters-sidebar">
          <div className="flex items-center gap-2 border-b border-[#e5e5e1] pb-3">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            <span className="font-syne text-base text-[#0c0c10]">Search Filters</span>
          </div>

          {/* Subject Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Subject Specialty</label>
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-2.5 text-xs font-semibold focus:border-primary focus:outline-none shadow-sm"
              id="filter-subject"
            >
              <option value="">All Subjects</option>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Price Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Max Price per Hour</label>
              <span className="font-syne text-sm font-bold text-primary">${maxPrice}/hr</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="100" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              className="w-full accent-primary h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              id="filter-price"
            />
          </div>

          {/* Timezone Group Region */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tutor Timezone Region</label>
            <div className="flex flex-col gap-1.5">
              {[
                { label: "All Regions", value: "" },
                { label: "Americas (EST, PST, BRT)", value: "Americas" },
                { label: "Europe & Africa (GMT, CET)", value: "Europe" },
                { label: "Asia & Pacific (IST, JST, AEST)", value: "Asia" }
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input 
                    type="radio" 
                    name="tzRegion"
                    checked={timezoneRegion === opt.value}
                    onChange={() => setTimezoneRegion(opt.value)}
                    className="accent-primary w-4 h-4"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>



          {/* Languages */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Languages Spoken</label>
            <select 
              value={selectedLanguage} 
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-2.5 text-xs font-semibold focus:border-primary focus:outline-none shadow-sm"
              id="filter-language"
            >
              <option value="">Any Language</option>
              <option value="English">English</option>
              <option value="German">German</option>
              <option value="French">French</option>
              <option value="Japanese">Japanese</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button 
            onClick={() => {
              setSelectedSubject("");
              setMaxPrice(80);
              setSelectedLanguage("");
              setTimezoneRegion("");
            }}
            className="w-full text-center text-xs font-bold text-gray-500 hover:text-[#0c0c10] pt-2 border-t border-[#e5e5e1]"
          >
            Clear All Active Filters
          </button>
        </div>

        {/* Right Side: Tutor Search List Result */}
        <div className="lg:col-span-3 space-y-4" id="search-results-pane">
          <div className="flex justify-between items-center">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Found {filteredTeachers.length} elite {filteredTeachers.length === 1 ? 'tutor' : 'tutors'} matching your criteria
            </div>
          </div>

          {filteredTeachers.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredTeachers.map(teacher => {
                const countryObj = COUNTRIES.find(c => c.name === teacher.country) || COUNTRIES[0];
                return (
                  <div 
                    key={teacher.id}
                    onClick={() => onNavigate('teacher-profile', { teacherId: teacher.id })}
                    className="bg-white border border-[#e5e5e1] rounded-[14px] p-5 shadow-sm cursor-pointer hover:shadow-md hover:border-primary transition-all duration-200 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Photo and general name badge */}
                      <div className="flex items-start gap-3">
                        <img 
                          src={teacher.avatar} 
                          alt={teacher.name} 
                          className="w-14 h-14 rounded-full border border-[#e5e5e1] object-cover shadow-sm" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-0.5">
                          <h3 className="font-syne text-base text-[#0c0c10] flex items-center gap-1.5 leading-tight">
                            {teacher.name}
                            <span className="text-sm" title={teacher.country}>{countryObj?.flag || "🌍"}</span>
                          </h3>
                          <div className="text-[10px] font-bold text-primary uppercase bg-primary/5 px-2 py-0.5 rounded-full w-fit">
                            Verified Degree
                          </div>
                          <p className="text-[10px] font-mono text-gray-500">{teacher.timezone.split('/').pop()?.replace('_', ' ')} (DST Auto-Adjust)</p>
                        </div>
                      </div>

                      {/* Display subjects */}
                      <div className="flex flex-wrap gap-1.5">
                        {teacher.preferredSubjects.map(sub => (
                          <span key={sub} className="text-[9px] font-bold uppercase tracking-wider bg-gray-100 text-[#0c0c10] px-2.5 py-1 rounded-[4px] border border-[#e5e5e1]">
                            {sub}
                          </span>
                        ))}
                      </div>

                      {/* Bio preview */}
                      <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed font-medium">
                        {teacher.bio}
                      </p>
                    </div>

                    {/* Pricing, Reviews, and Book Trial buttons */}
                    <div className="border-t border-[#f0f0f0] pt-4 mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lesson Price</span>
                        <div className="font-syne text-base text-[#0c0c10]" style={{ fontWeight: 800 }}>${teacher.hourlyRate}/hour</div>
                      </div>

                      <div className="text-right flex items-center gap-3">
                        <div className="bg-primary hover:bg-primary/95 text-white p-2 rounded-[8px] shadow-sm flex items-center gap-1.5 text-xs font-bold px-3 py-2">
                          <span>View Profile</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-12 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 bg-[#f0516e]/10 border border-[#f0516e]/20 rounded-full flex items-center justify-center mx-auto text-alert font-bold text-xl">!</div>
              <h3 className="font-syne text-lg text-[#0c0c10]">No matching global tutors found</h3>
              <p className="text-sm text-gray-500 font-medium max-w-md mx-auto">Try widening your maximum price slider, checking a different subject area, or resetting the timezone region filter.</p>
              <button 
                onClick={() => {
                  setSelectedSubject("");
                  setMaxPrice(80);
                  setSelectedLanguage("");
                  setTimezoneRegion("");
                }}
                className="bg-primary hover:bg-primary/95 text-white text-xs font-bold px-4 py-2.5 rounded-[8px] shadow-sm"
              >
                Reset Filter Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
