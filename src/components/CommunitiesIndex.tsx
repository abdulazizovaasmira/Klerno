import { Community } from '../types';
import { 
  Users, BookOpen, GraduationCap, Dna, FlaskConical, 
  Binary, Cpu, CodeXml, Atom, TrendingUp, Languages, HeartPulse 
} from 'lucide-react';

interface CommunitiesIndexProps {
  mockCommunities: Community[];
  onNavigate: (page: string, params?: any) => void;
}

export default function CommunitiesIndex({
  mockCommunities,
  onNavigate
}: CommunitiesIndexProps) {

  // Helper to render correct subject icon
  const getIcon = (name: string) => {
    const iconClass = "w-6 h-6 text-primary";
    if (name.includes("Biology")) return <Dna className={iconClass} />;
    if (name.includes("Chemistry")) return <FlaskConical className={iconClass} />;
    if (name.includes("Mathematics")) return <Binary className={iconClass} />;
    if (name.includes("Engineering")) return <Cpu className={iconClass} />;
    if (name.includes("IT & Coding") || name.includes("Coding")) return <CodeXml className={iconClass} />;
    if (name.includes("Physics")) return <Atom className={iconClass} />;
    if (name.includes("Economics")) return <TrendingUp className={iconClass} />;
    if (name.includes("Languages")) return <Languages className={iconClass} />;
    if (name.includes("History")) return <BookOpen className={iconClass} />;
    if (name.includes("Medicine")) return <HeartPulse className={iconClass} />;
    return <GraduationCap className={iconClass} />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8" id="communities-directory-root">
      
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          Student & Tutor Collaboration Forums
        </div>
        <h2 className="text-3xl md:text-4xl font-syne text-[#0c0c10]">Klerno Study Clubs</h2>
        <p className="text-gray-500 font-medium max-w-2xl">Join specialized peer forums. Ask questions, post homework, read tutor answers, and study with global peers.</p>
      </div>

      {/* Grid of all 10 communities */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id="communities-grid">
        {mockCommunities.map(comm => {
          return (
            <div 
              key={comm.slug}
              onClick={() => onNavigate(`community-${comm.slug}`)}
              className="bg-white border border-[#e5e5e1] rounded-[14px] p-6 shadow-sm cursor-pointer hover:shadow-md hover:border-primary transition-all duration-200 flex flex-col justify-between h-64"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] flex items-center justify-center">
                    {getIcon(comm.name)}
                  </div>
                  
                  <span className="text-[10px] bg-secondary/10 text-secondary border border-secondary/20 font-bold px-2.5 py-0.5 rounded-full">
                    {comm.memberCount} Members
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-syne text-base text-[#0c0c10]">{comm.name}</h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-3">
                    {comm.description}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs font-bold text-primary hover:underline mt-4">
                <span>Enter study room discussion</span>
                <span>→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
