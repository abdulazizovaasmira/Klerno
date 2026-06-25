export type UserRole = 'student' | 'teacher';

export interface TimeSlot {
  dayOfWeek: string; // "Monday", "Tuesday", etc.
  time: string; // "09:00", "14:00", etc. (24h format)
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  country: string;
  countryCode: string; // e.g. "US", "DE", "FR", "JP", "IN"
  timezone: string;
  preferredSubjects: string[];
  bio?: string;
  hourlyRate?: number;
  qualifications?: string; // name of uploaded file
  rating?: number;
  reviews?: Review[];
  availability?: TimeSlot[];
  stripeExpressStatus?: 'unlinked' | 'pending' | 'active';
  joinedCommunities?: string[]; // community slugs
  savedTeachers?: string[]; // teacher ids
  languages?: string[]; // e.g., ["English", "Spanish"]
  avatar?: string;
}

export interface Post {
  id: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  date: string;
  likes: number;
  replies: Array<{
    id: string;
    authorName: string;
    authorRole: UserRole;
    content: string;
    date: string;
  }>;
}

export interface QAItem {
  id: string;
  question: string;
  askerName: string;
  date: string;
  answers: Array<{
    id: string;
    answererName: string;
    answererRole: UserRole;
    content: string;
    date: string;
  }>;
}

export interface Community {
  slug: string;
  name: string;
  description: string;
  iconName: string; // Lucide icon name
  memberCount: number;
  pinnedTeacherIds: string[];
  discussionFeed: Post[];
  qaList: QAItem[];
}

export interface Lesson {
  id: string;
  teacherId: string;
  studentId: string;
  teacherName: string;
  studentName: string;
  subject: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM
  hourlyRate: number;
  price: number;
  platformFee: number; // 10%
  teacherEarnings: number; // 90%
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  teacherTimezone: string;
  studentTimezone: string;
  studentLocalTime: string; // string formatted for student timezone
  teacherLocalTime: string; // string formatted for teacher timezone
  paymentCaptured?: boolean;
}
