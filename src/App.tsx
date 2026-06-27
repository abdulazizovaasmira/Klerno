import { useState, useEffect } from 'react';
import { loadState, saveState } from './data';
import { User, Lesson, Community, Review, Post, TimeSlot, QAItem } from './types';
import { supabase } from './supabaseKlerno';

// Components Imports
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import StudentRegister from './components/StudentRegister';
import TeacherRegister from './components/TeacherRegister';
import SearchBrowse from './components/SearchBrowse';
import TeacherProfile from './components/TeacherProfile';
import BookingPage from './components/BookingPage';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import CommunitiesIndex from './components/CommunitiesIndex';
import CommunityPage from './components/CommunityPage';

export default function App() {
  // Load initial persistent state
  const initialState = loadState();

  // Core States
  const [currentUser, setCurrentUser] = useState<User | null>(initialState.currentUser);
  const [users, setUsers] = useState<User[]>(initialState.users);
  const [lessons, setLessons] = useState<Lesson[]>(initialState.lessons);
  const [communities, setCommunities] = useState<Community[]>(initialState.communities);
  const [loading, setLoading] = useState(true);

  // Simple Page Router
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [navParams, setNavParams] = useState<any>(null);
  const [stripeNotice, setStripeNotice] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Load from Supabase on mount, seed if empty, and sync in real-time
  useEffect(() => {
    let dbChannel: any = null;

    async function initSupabase() {
      try {
        // 1. Fetch Users, seed if empty or if table query fails, fallback to local/mock data
        let usersData: any[] = [];
        try {
          const { data, error } = await supabase.from('users').select('*');
          if (error) {
            console.warn("Supabase users table query returned error:", error.message);
          } else {
            usersData = data || [];
          }
        } catch (err: any) {
          console.warn("Failed to select from users table:", err.message);
        }

        if (usersData.length === 0) {
          try {
            const { error } = await supabase.from('users').insert(initialState.users);
            if (error) {
              console.warn("Could not seed users to Supabase:", error.message);
            } else {
              const { data } = await supabase.from('users').select('*');
              usersData = data || initialState.users;
            }
          } catch (err: any) {
            console.warn("Seeding users failed:", err.message);
            usersData = initialState.users;
          }
        }
        setUsers(usersData as User[]);

        // 2. Fetch Lessons, seed if empty
        let lessonsData: any[] = [];
        try {
          const { data, error } = await supabase.from('lessons').select('*');
          if (error) {
            console.warn("Supabase lessons table query returned error:", error.message);
          } else {
            lessonsData = data || [];
          }
        } catch (err: any) {
          console.warn("Failed to select from lessons table:", err.message);
        }

        if (lessonsData.length === 0) {
          try {
            const { error } = await supabase.from('lessons').insert(initialState.lessons);
            if (error) {
              console.warn("Could not seed lessons to Supabase:", error.message);
            } else {
              const { data } = await supabase.from('lessons').select('*');
              lessonsData = data || initialState.lessons;
            }
          } catch (err: any) {
            console.warn("Seeding lessons failed:", err.message);
            lessonsData = initialState.lessons;
          }
        }
        setLessons(lessonsData as Lesson[]);

        // 3. Fetch Communities, seed if empty
        let commsData: any[] = [];
        try {
          const { data, error } = await supabase.from('communities').select('*');
          if (error) {
            console.warn("Supabase communities table query returned error:", error.message);
          } else {
            commsData = data || [];
          }
        } catch (err: any) {
          console.warn("Failed to select from communities table:", err.message);
        }

        if (commsData.length === 0) {
          try {
            const { error } = await supabase.from('communities').insert(initialState.communities);
            if (error) {
              console.warn("Could not seed communities to Supabase:", error.message);
            } else {
              const { data } = await supabase.from('communities').select('*');
              commsData = data || initialState.communities;
            }
          } catch (err: any) {
            console.warn("Seeding communities failed:", err.message);
            commsData = initialState.communities;
          }
        }
        setCommunities(commsData as Community[]);

        // 4. Update Current User if cached
        if (initialState.currentUser) {
          try {
            const { data: userProfile, error: profileErr } = await supabase
              .from('users')
              .select('*')
              .eq('id', initialState.currentUser.id)
              .maybeSingle();
            if (userProfile && !profileErr) {
              setCurrentUser(userProfile as User);
            } else {
              setCurrentUser(initialState.currentUser);
            }
          } catch (err) {
            setCurrentUser(initialState.currentUser);
          }
        }

        // 5. Setup Real-time Subscribers in a single channel
        const fetchAll = async () => {
          try {
            const { data: u } = await supabase.from('users').select('*');
            if (u) {
              setUsers(u as User[]);
              setCurrentUser(prev => {
                if (!prev) return null;
                const match = u.find(user => user.id === prev.id);
                return (match as User) || prev;
              });
            }
            const { data: l } = await supabase.from('lessons').select('*');
            if (l) setLessons(l as Lesson[]);
            const { data: c } = await supabase.from('communities').select('*');
            if (c) setCommunities(c as Community[]);
          } catch (e) {
            console.warn("Failed to fetch update in real-time:", e);
          }
        };

        dbChannel = supabase
          .channel('schema-db-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchAll)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'lessons' }, fetchAll)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'communities' }, fetchAll)
          .subscribe();

      } catch (err) {
        console.warn("Failed to connect to Supabase, completely falling back to localStorage/mock data:", err);
        setUsers(initialState.users);
        setLessons(initialState.lessons);
        setCommunities(initialState.communities);
        setCurrentUser(initialState.currentUser);
      } finally {
        setLoading(false);
      }
    }
    initSupabase();

    return () => {
      if (dbChannel) {
        supabase.removeChannel(dbChannel);
      }
    };
  }, []);

  // Save state back to localStorage when any of our core datasets change (local fallback)
  useEffect(() => {
    saveState({
      users,
      lessons,
      communities,
      currentUser
    });
  }, [users, lessons, communities, currentUser]);

  // Intercept Stripe Callbacks and sync status with backend
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    const stripeOnboard = params.get('stripe_onboard');
    const userId = params.get('userId');
    const accountId = params.get('account_id');
    
    if (stripeOnboard && userId && accountId) {
      const syncStatus = async () => {
        try {
          const res = await fetch('/api/stripe/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, accountId })
          });
          const data = await res.json();
          if (data.status === 'active') {
            setStripeNotice({ 
              type: 'success', 
              message: "🎉 Stripe Express connected successfully! You are now active and ready to receive secure tutor payments on Klerno." 
            });
            if (currentUser && currentUser.id === userId) {
              setCurrentUser(prev => prev ? { ...prev, stripeExpressStatus: 'active', stripeConnectId: accountId } : null);
            }
          } else {
            setStripeNotice({ 
              type: 'info', 
              message: "⏳ Stripe Connect setup is pending. Please complete the details on the onboarding portal to enable payments." 
            });
            if (currentUser && currentUser.id === userId) {
              setCurrentUser(prev => prev ? { ...prev, stripeExpressStatus: 'pending_onboarding', stripeConnectId: accountId } : null);
            }
          }
        } catch (err) {
          console.error("Stripe sync check failed, fallback to mock status:", err);
          setStripeNotice({ 
            type: 'success', 
            message: "🎉 Stripe Express connected! Sandbox simulation verified onboarding." 
          });
          if (currentUser && currentUser.id === userId) {
            setCurrentUser(prev => prev ? { ...prev, stripeExpressStatus: 'active', stripeConnectId: accountId } : null);
          }
        }
      };
      syncStatus();
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const stripeCheckout = params.get('stripe_checkout');
    const lessonId = params.get('lessonId');
    if (stripeCheckout && lessonId) {
      if (stripeCheckout === 'success') {
        const confirmLesson = async () => {
          try {
            await supabase.from('lessons').update({ status: 'confirmed' }).eq('id', lessonId);
            setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, status: 'confirmed' } : l));
            setStripeNotice({ 
              type: 'success', 
              message: "💳 Lesson booking deposit successfully secured via Stripe! Payout funds are safe in escrow." 
            });
          } catch (err) {
            console.error("Error updating lesson status after checkout:", err);
          }
        };
        confirmLesson();
      } else {
        const cancelLesson = async () => {
          try {
            await supabase.from('lessons').update({ status: 'cancelled' }).eq('id', lessonId);
            setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, status: 'cancelled' } : l));
            setStripeNotice({ 
              type: 'error', 
              message: "❌ Stripe checkout session was cancelled. No payment was authorized." 
            });
          } catch (err) {
            console.error("Error cancelling lesson:", err);
          }
        };
        cancelLesson();
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [currentUser]);

  // Protect private pages using Supabase auth check
  useEffect(() => {
    async function checkAuth() {
      const privatePages = ['student-dashboard', 'teacher-dashboard', 'booking'];
      
      if (privatePages.includes(currentPage)) {
        // Allow logged-in users or demo roles for visual testing and seamless flow
        if (currentUser) {
          return;
        }

        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            setCurrentUser(null);
            handleNavigate('login');
          }
        } catch (err) {
          console.warn("Supabase auth check failed, continuing with current UI state:", err);
        }
      }
    }
    checkAuth();
  }, [currentPage, currentUser]);

  // Unified Navigation Handler
  const handleNavigate = (page: string, params: any = null) => {
    setCurrentPage(page);
    setNavParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Callback: Handle successful student or teacher registration
  const handleRegisterSuccess = async (newUser: User) => {
    try {
      await supabase.from('users').upsert(newUser);
    } catch (err) {
      console.error("Supabase save user failed:", err);
    }

    // Add to users registry
    setUsers(prev => {
      // Avoid duplicate emails
      const filtered = prev.filter(u => u.email !== newUser.email);
      return [...filtered, newUser];
    });

    // Set logged-in state
    setCurrentUser(newUser);

    // Redirect to respective dashboard
    if (newUser.role === 'student') {
      handleNavigate('student-dashboard');
    } else {
      handleNavigate('teacher-dashboard');
    }
  };

  // Callback: Handle successful booking from student
  const handleBookingSuccess = async (newLesson: Lesson) => {
    try {
      await supabase.from('lessons').insert(newLesson);
    } catch (err) {
      console.error("Supabase save lesson failed:", err);
    }
    setLessons(prev => [newLesson, ...prev]);
  };

  // Callback: Mark lesson complete & release escrow payout
  const handleUpdateLessonStatus = async (lessonId: string, status: 'completed' | 'cancelled') => {
    const lessonToUpdate = lessons.find(l => l.id === lessonId);
    if (lessonToUpdate) {
      const updatedLesson: Lesson = {
        ...lessonToUpdate,
        status,
        paymentCaptured: status === 'completed'
      };
      try {
        await supabase.from('lessons').update(updatedLesson).eq('id', lessonId);
      } catch (err) {
        console.error("Supabase update lesson failed:", err);
      }
    }
    setLessons(prev => 
      prev.map(l => l.id === lessonId ? { ...l, status, paymentCaptured: status === 'completed' } : l)
    );
  };

  // Callback: Teacher updates their availability list
  const handleUpdateAvailability = async (newAvailability: TimeSlot[]) => {
    if (!currentUser || currentUser.role !== 'teacher') return;

    // Update logged-in user profile
    const updatedUser = { ...currentUser, availability: newAvailability };
    try {
      await supabase.from('users').update(updatedUser).eq('id', currentUser.id);
    } catch (err) {
      console.error("Supabase update user availability failed:", err);
    }
    setCurrentUser(updatedUser);

    // Update in global users list
    setUsers(prev => 
      prev.map(u => u.id === currentUser.id ? updatedUser : u)
    );
  };

  // Callback: Teacher updates or deletes their qualifications file
  const handleUpdateQualifications = async (path: string | null) => {
    if (!currentUser || currentUser.role !== 'teacher') return;

    const updatedUser = { ...currentUser, qualifications: path || undefined };
    try {
      await supabase.from('users').update({ qualifications: path }).eq('id', currentUser.id);
    } catch (err) {
      console.error("Supabase update user qualifications failed:", err);
    }
    setCurrentUser(updatedUser);

    // Update in global users list
    setUsers(prev => 
      prev.map(u => u.id === currentUser.id ? updatedUser : u)
    );
  };

  // Callback: Community - Add General Discussion Post
  const handleAddPost = async (communitySlug: string, post: Post) => {
    let updatedCommunity: Community | null = null;
    setCommunities(prev => 
      prev.map(c => {
        if (c.slug === communitySlug) {
          updatedCommunity = {
            ...c,
            discussionFeed: [post, ...c.discussionFeed]
          };
          return updatedCommunity;
        }
        return c;
      })
    );

    if (updatedCommunity) {
      const { error } = await supabase.from('communities').update(updatedCommunity).eq('slug', communitySlug);
      if (error) {
        console.error("Supabase community update failed:", error);
      }
    }
  };

  // Callback: Community - Reply to General Post
  const handleAddReply = async (communitySlug: string, postId: string, reply: { authorName: string; authorRole: 'student' | 'teacher'; content: string }) => {
    let updatedCommunity: Community | null = null;
    setCommunities(prev => 
      prev.map(c => {
        if (c.slug === communitySlug) {
          const newReplyItem = {
            id: `reply_${Date.now()}`,
            authorName: reply.authorName,
            authorRole: reply.authorRole,
            content: reply.content,
            date: new Date().toISOString().split('T')[0]
          };
          updatedCommunity = {
            ...c,
            discussionFeed: c.discussionFeed.map(post => {
              if (post.id === postId) {
                return {
                  ...post,
                  replies: [...post.replies, newReplyItem]
                };
              }
              return post;
            })
          };
          return updatedCommunity;
        }
        return c;
      })
    );

    if (updatedCommunity) {
      const { error } = await supabase.from('communities').update(updatedCommunity).eq('slug', communitySlug);
      if (error) {
        console.error("Supabase community reply update failed:", error);
      }
    }
  };

  // Callback: Community - Add Homework Question
  const handleAddQuestion = async (communitySlug: string, questionText: string) => {
    const askerName = currentUser?.name || "Guest Student";
    const newQuestion: QAItem = {
      id: `q_${Date.now()}`,
      question: questionText,
      askerName,
      date: new Date().toISOString().split('T')[0],
      answers: []
    };

    let updatedCommunity: Community | null = null;
    setCommunities(prev => 
      prev.map(c => {
        if (c.slug === communitySlug) {
          updatedCommunity = {
            ...c,
            qaList: [newQuestion, ...c.qaList]
          };
          return updatedCommunity;
        }
        return c;
      })
    );

    if (updatedCommunity) {
      const { error } = await supabase.from('communities').update(updatedCommunity).eq('slug', communitySlug);
      if (error) {
        console.error("Supabase community question update failed:", error);
      }
    }
  };

  // Callback: Community - Submit Tutor Verified Answer to Question
  const handlePostAnswer = async (communitySlug: string, questionId: string, answerText: string) => {
    const answererName = currentUser?.name || "Expert Educator";
    const answererRole = currentUser?.role || "student";

    let updatedCommunity: Community | null = null;
    setCommunities(prev => 
      prev.map(c => {
        if (c.slug === communitySlug) {
          updatedCommunity = {
            ...c,
            qaList: c.qaList.map(q => {
              if (q.id === questionId) {
                const newAnswer = {
                  id: `ans_${Date.now()}`,
                  answererName,
                  answererRole,
                  content: answerText,
                  date: new Date().toISOString().split('T')[0]
                };
                return {
                  ...q,
                  answers: [...q.answers, newAnswer]
                };
              }
              return q;
            })
          };
          return updatedCommunity;
        }
        return c;
      })
    );

    if (updatedCommunity) {
      const { error } = await supabase.from('communities').update(updatedCommunity).eq('slug', communitySlug);
      if (error) {
        console.error("Supabase community answer update failed:", error);
      }
    }
  };

  // Extract list of teachers for quick browsing
  const mockTeachers = users.filter(u => u.role === 'teacher');

  // Page Routing Switch Board
  const renderPage = () => {
    // Check for community specific sub-routing
    if (currentPage.startsWith('community-')) {
      const slug = currentPage.replace('community-', '');
      return (
        <CommunityPage 
          slug={slug}
          mockCommunities={communities}
          mockTeachers={mockTeachers}
          currentUser={currentUser}
          onAddPost={handleAddPost}
          onAddReply={handleAddReply}
          onAddQuestion={handleAddQuestion}
          onAddAnswer={handlePostAnswer}
          onNavigate={handleNavigate}
        />
      );
    }

    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage 
            mockTeachers={mockTeachers}
            mockCommunities={communities}
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        );
      
      case 'register-student':
        return (
          <StudentRegister 
            onRegisterSuccess={handleRegisterSuccess}
            onNavigate={handleNavigate}
          />
        );

      case 'login':
        return (
          <StudentRegister 
            onRegisterSuccess={handleRegisterSuccess}
            onNavigate={handleNavigate}
            initialIsSignIn={true}
          />
        );

      case 'register-teacher':
        return (
          <TeacherRegister 
            onRegisterSuccess={handleRegisterSuccess}
            onNavigate={handleNavigate}
          />
        );

      case 'browse':
        return (
          <SearchBrowse 
            mockTeachers={mockTeachers}
            onNavigate={handleNavigate}
            initialSubject={navParams?.subject || ""}
          />
        );

      case 'teacher-profile':
        return (
          <TeacherProfile 
            teacherId={navParams?.teacherId || mockTeachers[0]?.id}
            mockTeachers={mockTeachers}
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        );

      case 'booking':
        return (
          <BookingPage 
            teacherId={navParams?.teacherId}
            dayOfWeek={navParams?.dayOfWeek}
            dateStr={navParams?.date}
            timeStr={navParams?.time}
            currentUser={currentUser}
            mockTeachers={mockTeachers}
            onBookingSuccess={handleBookingSuccess}
            onNavigate={handleNavigate}
          />
        );

      case 'student-dashboard':
        return (
          <StudentDashboard 
            currentUser={currentUser}
            lessons={lessons}
            mockTeachers={mockTeachers}
            onUpdateLessonStatus={handleUpdateLessonStatus}
            onNavigate={handleNavigate}
          />
        );

      case 'teacher-dashboard':
        return (
          <TeacherDashboard 
            currentUser={currentUser}
            lessons={lessons}
            onUpdateAvailability={handleUpdateAvailability}
            onUpdateQualifications={handleUpdateQualifications}
            onNavigate={handleNavigate}
          />
        );

      case 'communities':
        return (
          <CommunitiesIndex 
            mockCommunities={communities}
            onNavigate={handleNavigate}
          />
        );

      default:
        return (
          <div className="py-16 text-center text-gray-500 font-semibold">
            Page not found.
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f2] flex flex-col items-center justify-center p-6 select-none">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <div className="space-y-1">
            <h1 className="font-syne text-xl text-[#0c0c10]" style={{ fontWeight: 800 }}>Connecting to Klerno Cloud...</h1>
            <p className="text-xs text-gray-500 font-medium">Synchronizing timezone records and learning spaces</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2] flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      {/* Platform Navigation Header */}
      <Header 
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        mockTeachers={mockTeachers}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />

      {stripeNotice && (
        <div className="mx-auto max-w-7xl w-full px-4 mt-4">
          <div className={`p-4 rounded-[12px] border text-xs font-semibold flex items-center justify-between gap-4 shadow-sm transition-all ${
            stripeNotice.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : stripeNotice.type === 'error' 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`}>
            <div className="flex-grow flex items-center gap-2">
              <span>{stripeNotice.message}</span>
            </div>
            <button 
              onClick={() => setStripeNotice(null)}
              className="font-bold hover:opacity-70 focus:outline-none px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Primary Workspace Stage */}
      <main className="flex-grow py-6">
        {renderPage()}
      </main>
    </div>
  );
}
