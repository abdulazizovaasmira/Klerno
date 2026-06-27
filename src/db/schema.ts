import { pgTable, text, integer, boolean, timestamp, jsonb, real } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Using string id to keep compatibility with existing UIDs and mock IDs
  name: text('name').notNull(),
  email: text('email').notNull(),
  role: text('role').notNull(), // 'student' | 'teacher'
  country: text('country').notNull(),
  countryCode: text('country_code').notNull(),
  timezone: text('timezone').notNull(),
  preferredSubjects: jsonb('preferred_subjects').$type<string[]>().default([]),
  bio: text('bio'),
  hourlyRate: real('hourly_rate'),
  qualifications: text('qualifications'),
  rating: real('rating'),
  reviews: jsonb('reviews').default([]),
  availability: jsonb('availability').default([]),
  stripeExpressStatus: text('stripe_express_status').default('unlinked'),
  joinedCommunities: jsonb('joined_communities').$type<string[]>().default([]),
  savedTeachers: jsonb('saved_teachers').$type<string[]>().default([]),
  languages: jsonb('languages').$type<string[]>().default([]),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow()
});

export const lessons = pgTable('lessons', {
  id: text('id').primaryKey(),
  teacherId: text('teacher_id').notNull(),
  studentId: text('student_id').notNull(),
  teacherName: text('teacher_name').notNull(),
  studentName: text('student_name').notNull(),
  subject: text('subject').notNull(),
  date: text('date').notNull(),
  timeSlot: text('time_slot').notNull(),
  hourlyRate: real('hourly_rate').notNull(),
  price: real('price').notNull(),
  platformFee: real('platform_fee').notNull(),
  teacherEarnings: real('teacher_earnings').notNull(),
  status: text('status').notNull(), // 'pending' | 'confirmed' | 'completed' | 'cancelled'
  teacherTimezone: text('teacher_timezone').notNull(),
  studentTimezone: text('student_timezone').notNull(),
  studentLocalTime: text('student_local_time').notNull(),
  teacherLocalTime: text('teacher_local_time').notNull(),
  paymentCaptured: boolean('payment_captured').default(false),
  createdAt: timestamp('created_at').defaultNow()
});

export const communities = pgTable('communities', {
  slug: text('slug').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  iconName: text('icon_name').notNull(),
  memberCount: integer('member_count').notNull().default(0),
  pinnedTeacherIds: jsonb('pinned_teacher_ids').$type<string[]>().default([]),
  discussionFeed: jsonb('discussion_feed').default([]),
  qaList: jsonb('qa_list').default([]),
  createdAt: timestamp('created_at').defaultNow()
});
