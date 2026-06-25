import { useState, useEffect } from 'react';
import { loadState, saveState } from './data';
import { User, Lesson, Community, Review, Post, TimeSlot, QAItem } from './types';

// Firebase Imports
import { collection, doc, getDocs, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

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

  // Load from Firestore on mount, seed if empty, and sync in real-time
  useEffect(() => {
    let unsubUsers: (() => void) | null = null;
    let unsubLessons: (() => void) | null = null;
    let unsubComms: (() => void) | null = null;

    async function initFirebase() {
      try {
        // 1. Check if users empty, seed if so
        const usersSnap = await getDocs(collection(db, 'users'));
        if (usersSnap.empty) {
          for (const u of initialState.users) {
            await setDoc(doc(db, 'users', u.id), u);
          }
        }

        // 2. Check if lessons empty, seed if so
        const lessonsSnap = await getDocs(collection(db, 'lessons'));
        if (lessonsSnap.empty) {
          for (const l of initialState.lessons) {
            await setDoc(doc(db, 'lessons', l.id), l);
          }
        }

        // 3. Check if communities empty, seed if so
        const commsSnap = await getDocs(collection(db, 'communities'));
        if (commsSnap.empty) {
          for (const c of initialState.communities) {
            await setDoc(doc(db, 'communities', c.slug), c);
          }
        }

        // 4. Update Current User if cached
        if (initialState.currentUser) {
          const userDoc = await getDoc(doc(db, 'users', initialState.currentUser.id));
          if (userDoc.exists()) {
            setCurrentUser(userDoc.data() as User);
          } else {
            setCurrentUser(initialState.currentUser);
          }
        }

        // 5. Setup Real-time Subscribers
        unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
          const list: User[] = [];
          snap.forEach(doc => list.push(doc.data() as User));
          setUsers(list);
          
          // Keep current user object in sync with DB changes
          setCurrentUser(prev => {
            if (!prev) return null;
            const match = list.find(u => u.id === prev.id);
            return match || prev;
          });
        });

        unsubLessons = onSnapshot(collection(db, 'lessons'), (snap) => {
          const list: Lesson[] = [];
          snap.forEach(doc => list.push(doc.data() as Lesson));
          setLessons(list);
        });

        unsubComms = onSnapshot(collection(db, 'communities'), (snap) => {
          const list: Community[] = [];
          snap.forEach(doc => list.push(doc.data() as Community));
          setCommunities(list);
        });

      } catch (err) {
        console.error("Failed to connect to Firebase, falling back to localStorage/mock data:", err);
      } finally {
        setLoading(false);
      }
    }
    initFirebase();

    return () => {
      if (unsubUsers) unsubUsers();
      if (unsubLessons) unsubLessons();
      if (unsubComms) unsubComms();
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

  // Unified Navigation Handler
  const handleNavigate = (page: string, params: any = null) => {
    setCurrentPage(page);
    setNavParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Callback: Handle successful student or teacher registration
  const handleRegisterSuccess = async (newUser: User) => {
    try {
      await setDoc(doc(db, 'users', newUser.id), newUser);
    } catch (err) {
      console.error("Firebase save user failed:", err);
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
      await setDoc(doc(db, 'lessons', newLesson.id), newLesson);
    } catch (err) {
      console.error("Firebase save lesson failed:", err);
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
        await setDoc(doc(db, 'lessons', lessonId), updatedLesson);
      } catch (err) {
        console.error("Firebase update lesson failed:", err);
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
      await setDoc(doc(db, 'users', currentUser.id), updatedUser);
    } catch (err) {
      console.error("Firebase update user availability failed:", err);
    }
    setCurrentUser(updatedUser);

    // Update in global users list
    setUsers(prev => 
      prev.map(u => u.id === currentUser.id ? updatedUser : u)
    );
  };

  // Callback: Community - Add General Discussion Post
  const handleAddPost = async (communitySlug: string, post: Post) => {
    setCommunities(prev => 
      prev.map(c => {
        if (c.slug === communitySlug) {
          const updated = {
            ...c,
            discussionFeed: [post, ...c.discussionFeed]
          };
          setDoc(doc(db, 'communities', communitySlug), updated).catch(err => {
            console.error("Firebase community update failed:", err);
          });
          return updated;
        }
        return c;
      })
    );
  };

  // Callback: Community - Reply to General Post
  const handleAddReply = async (communitySlug: string, postId: string, reply: { authorName: string; authorRole: 'student' | 'teacher'; content: string }) => {
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
          const updated = {
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
          setDoc(doc(db, 'communities', communitySlug), updated).catch(err => {
            console.error("Firebase community reply update failed:", err);
          });
          return updated;
        }
        return c;
      })
    );
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

    setCommunities(prev => 
      prev.map(c => {
        if (c.slug === communitySlug) {
          const updated = {
            ...c,
            qaList: [newQuestion, ...c.qaList]
          };
          setDoc(doc(db, 'communities', communitySlug), updated).catch(err => {
            console.error("Firebase community question update failed:", err);
          });
          return updated;
        }
        return c;
      })
    );
  };

  // Callback: Community - Submit Tutor Verified Answer to Question
  const handlePostAnswer = async (communitySlug: string, questionId: string, answerText: string) => {
    const answererName = currentUser?.name || "Expert Educator";
    const answererRole = currentUser?.role || "student";

    setCommunities(prev => 
      prev.map(c => {
        if (c.slug === communitySlug) {
          const updated = {
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
          setDoc(doc(db, 'communities', communitySlug), updated).catch(err => {
            console.error("Firebase community answer update failed:", err);
          });
          return updated;
        }
        return c;
      })
    );
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

      {/* Primary Workspace Stage */}
      <main className="flex-grow py-6">
        {renderPage()}
      </main>
    </div>
  );
}
