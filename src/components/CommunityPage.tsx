import React, { useState } from 'react';
import { User, Community, Post, QAItem } from '../types';
import { COUNTRIES } from '../data';
import { 
  Users, MessageCircle, Heart, Share2, Award, 
  HelpCircle, ChevronRight, Sparkles, Send, BookOpen 
} from 'lucide-react';

interface CommunityPageProps {
  slug: string;
  mockCommunities: Community[];
  mockTeachers: User[];
  currentUser: User | null;
  onAddPost: (communitySlug: string, post: Post) => void;
  onAddReply: (communitySlug: string, postId: string, reply: { authorName: string; authorRole: 'student' | 'teacher'; content: string }) => void;
  onAddQuestion: (communitySlug: string, questionText: string) => void;
  onAddAnswer: (communitySlug: string, questionId: string, answerText: string) => void;
  onNavigate: (page: string, params?: any) => void;
}

export default function CommunityPage({
  slug,
  mockCommunities,
  mockTeachers,
  currentUser,
  onAddPost,
  onAddReply,
  onAddQuestion,
  onAddAnswer,
  onNavigate,
}: CommunityPageProps) {
  
  const community = mockCommunities.find(c => c.slug === slug);

  // States for creating posts/Q&As
  const [newPostContent, setNewPostContent] = useState("");
  const [newQuestionText, setNewQuestionText] = useState("");
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [answerInputs, setAnswerInputs] = useState<Record<string, string>>({});

  // Tab State
  const [activeTab, setActiveTab] = useState<'discussion' | 'qa'>('discussion');

  if (!community) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <p className="text-gray-500 font-semibold">Community not found.</p>
        <button onClick={() => onNavigate('communities')} className="text-primary font-bold">Back to Study Clubs</button>
      </div>
    );
  }

  // Find pinned teachers for this subject
  const pinnedTeachers = mockTeachers.filter(t => community.pinnedTeacherIds.includes(t.id));

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const authorName = currentUser?.name || "Guest Student";
    const authorRole = currentUser?.role || "student";

    const newPost: Post = {
      id: `p_${Date.now()}`,
      authorName,
      authorRole,
      content: newPostContent.trim(),
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      replies: []
    };

    onAddPost(community.slug, newPost);
    setNewPostContent("");
  };

  const handlePostReply = (postId: string) => {
    const replyText = replyInputs[postId];
    if (!replyText || !replyText.trim()) return;

    const authorName = currentUser?.name || "Guest Student";
    const authorRole = currentUser?.role || "student";

    onAddReply(community.slug, postId, {
      authorName,
      authorRole,
      content: replyText.trim()
    });

    setReplyInputs({ ...replyInputs, [postId]: "" });
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    onAddQuestion(community.slug, newQuestionText.trim());
    setNewQuestionText("");
  };

  const handlePostAnswer = (questionId: string) => {
    const answerText = answerInputs[questionId];
    if (!answerText || !answerText.trim()) return;

    onAddAnswer(community.slug, questionId, answerText.trim());
    setAnswerInputs({ ...answerInputs, [questionId]: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8" id="community-page-root">
      
      {/* Back to communities index link */}
      <button 
        onClick={() => onNavigate('communities')}
        className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#0c0c10] flex items-center gap-1"
      >
        ← Back to all Study Clubs
      </button>

      {/* Community Jumbotron Header */}
      <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-syne text-[#0c0c10]">{community.name}</h2>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{community.memberCount} active learners online</div>
            </div>
          </div>
          <p className="text-sm text-gray-500 max-w-2xl font-medium leading-relaxed">{community.description}</p>
        </div>

        {/* Join button simulation */}
        <button className="bg-primary hover:bg-primary/95 text-white font-bold text-xs px-5 py-3 border border-transparent rounded-[8px] shadow-sm transition-colors">
          ✓ Joined Study Club
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* Left Column Sidebar: Pinned Top Teachers (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-5 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-2.5 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-primary" />
              <h3 className="font-syne text-xs uppercase tracking-wider text-[#0c0c10]">Pinned Elite Tutors</h3>
            </div>

            {pinnedTeachers.length > 0 ? (
              <div className="space-y-4">
                {pinnedTeachers.map(teacher => {
                  const countryObj = COUNTRIES.find(c => c.name === teacher.country) || COUNTRIES[0];
                  return (
                    <div 
                      key={teacher.id}
                      onClick={() => onNavigate('teacher-profile', { teacherId: teacher.id })}
                      className="border border-[#e5e5e1] p-3 rounded-[8px] hover:border-primary hover:shadow-sm cursor-pointer transition-all space-y-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <img src={teacher.avatar} alt={teacher.name} className="w-8 h-8 rounded-full border border-gray-300 object-cover" />
                        <div>
                          <div className="font-bold text-[#0c0c10] leading-tight flex items-center gap-1">
                            {teacher.name}
                            <span>{countryObj?.flag}</span>
                          </div>
                          <div className="text-[10px] text-gray-400 font-medium">${teacher.hourlyRate}/hr</div>
                        </div>
                      </div>
                      
                      <div className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed font-medium">
                        "{teacher.bio}"
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic font-medium">No specialized tutors assigned to this subject club currently.</p>
            )}
          </div>
        </div>

        {/* Right Columns: Discussion Threads or Q&A Panels (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Tab toggles */}
          <div className="flex border-b border-gray-200 gap-4">
            <button 
              onClick={() => setActiveTab('discussion')}
              className={`pb-2.5 font-syne text-base tracking-tight border-b-2 transition-colors ${activeTab === 'discussion' ? 'border-primary text-primary font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              General Discussion Feed
            </button>
            <button 
              onClick={() => setActiveTab('qa')}
              className={`pb-2.5 font-syne text-base tracking-tight border-b-2 transition-colors ${activeTab === 'qa' ? 'border-secondary text-secondary font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Homework Q&A Forum
            </button>
          </div>

          {activeTab === 'discussion' ? (
            <div className="space-y-6">
              
              {/* Write new post */}
              <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-4 shadow-sm">
                <form onSubmit={handleCreatePost} className="space-y-3">
                  <div className="text-xs font-bold text-gray-500 uppercase">Start a new peer discussion thread</div>
                  <textarea 
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Ask a general studying question or share an interesting resource..."
                    rows={3}
                    className="w-full bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-2.5 text-xs font-semibold leading-relaxed shadow-sm focus:border-primary focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      className="bg-primary hover:bg-primary/95 text-white font-bold text-xs px-4 py-2 rounded-[8px] flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Post Thread
                    </button>
                  </div>
                </form>
              </div>

              {/* Thread list */}
              <div className="space-y-4">
                {community.discussionFeed && community.discussionFeed.length > 0 ? (
                  community.discussionFeed.map(post => (
                    <div key={post.id} className="bg-white border border-[#e5e5e1] rounded-[14px] p-5 shadow-sm space-y-4">
                      
                      {/* Thread Author info */}
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#0c0c10]">{post.authorName}</span>
                          <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${post.authorRole === 'teacher' ? 'bg-[#01c9a8] text-[#0c0c10]' : 'bg-gray-100 text-gray-500'}`}>
                            {post.authorRole}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">{post.date}</span>
                      </div>

                      {/* Content */}
                      <p className="text-xs font-medium text-gray-700 leading-relaxed">
                        {post.content}
                      </p>

                      {/* Likes and stats */}
                      <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 border-t border-gray-100 pt-3">
                        <button className="flex items-center gap-1 hover:text-alert text-gray-400">
                          <Heart className="w-3.5 h-3.5" />
                          <span>{post.likes} Likes</span>
                        </button>
                        <span className="text-gray-200">•</span>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{post.replies?.length || 0} Comments</span>
                        </div>
                      </div>

                      {/* Replies List */}
                      {post.replies && post.replies.length > 0 && (
                        <div className="bg-[#f7f6f2] rounded-[8px] p-3.5 space-y-3.5 border border-[#e5e5e1]">
                          {post.replies.map(reply => (
                            <div key={reply.id} className="space-y-1 text-xs">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[#0c0c10]">{reply.authorName}</span>
                                <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${reply.authorRole === 'teacher' ? 'bg-[#01c9a8] text-[#0c0c10]' : 'bg-gray-100 text-gray-500'}`}>
                                  {reply.authorRole}
                                </span>
                                <span className="text-[9px] text-gray-400 font-medium ml-auto">{reply.date}</span>
                              </div>
                              <p className="text-gray-600 leading-relaxed font-medium pl-1">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add comment reply */}
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={replyInputs[post.id] || ""}
                          onChange={(e) => setReplyInputs({ ...replyInputs, [post.id]: e.target.value })}
                          placeholder="Write a quick comment reply..."
                          className="flex-1 bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] px-3 py-1.5 text-xs font-semibold focus:border-primary focus:outline-none shadow-sm"
                        />
                        <button 
                          onClick={() => handlePostReply(post.id)}
                          className="bg-[#0c0c10] hover:bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-[8px] shrink-0 transition-colors"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic font-medium text-center py-6">No discussion threads currently open.</p>
                )}
              </div>
            </div>
          ) : (
            // Q&A section
            <div className="space-y-6">
              
              {/* Write new Homework question */}
              <div className="bg-white border border-[#e5e5e1] rounded-[14px] p-4 shadow-sm">
                <form onSubmit={handleCreateQuestion} className="space-y-3">
                  <div className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                    <HelpCircle className="w-4 h-4 text-secondary" />
                    Ask a conceptual or homework question
                  </div>
                  <textarea 
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="e.g. Can someone explain the physical difference between constant velocity and constant acceleration with gravity?..."
                    rows={3}
                    className="w-full bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] p-2.5 text-xs font-semibold leading-relaxed shadow-sm focus:border-primary focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      className="bg-secondary text-[#0c0c10] font-bold text-xs px-4 py-2 border border-[#e5e5e1] rounded-[8px] flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Publish Question
                    </button>
                  </div>
                </form>
              </div>

              {/* Q&A list */}
              <div className="space-y-4">
                {community.qaList && community.qaList.length > 0 ? (
                  community.qaList.map(qa => (
                    <div key={qa.id} className="bg-white border border-[#e5e5e1] rounded-[14px] p-5 shadow-sm space-y-4">
                      
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                        <div className="text-xs font-bold text-primary flex items-center gap-1">
                          <HelpCircle className="w-4 h-4 text-secondary" />
                          <span>Question from {qa.askerName}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">{qa.date}</span>
                      </div>

                      <h4 className="font-syne text-sm text-[#0c0c10] leading-relaxed">
                        {qa.question}
                      </h4>

                      {/* Answers block */}
                      {qa.answers && qa.answers.length > 0 && (
                        <div className="space-y-3 pt-2">
                          {qa.answers.map(ans => (
                            <div key={ans.id} className="bg-green-50 border border-green-200 rounded-[8px] p-4 space-y-2">
                              <div className="flex items-center gap-2 text-xs">
                                <span className="font-bold text-green-900 flex items-center gap-1">
                                  ✓ {ans.answererName}
                                </span>
                                <span className="text-[8px] bg-[#01c9a8] text-[#0c0c10] font-extrabold uppercase px-1.5 py-0.5 rounded">
                                  {ans.answererRole} (Verified Tutor)
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium ml-auto">{ans.date}</span>
                              </div>
                              <p className="text-xs text-gray-700 leading-relaxed font-semibold pl-1">
                                {ans.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add answers */}
                      <div className="flex gap-2 border-t border-gray-100 pt-3">
                        <input 
                          type="text" 
                          value={answerInputs[qa.id] || ""}
                          onChange={(e) => setAnswerInputs({ ...answerInputs, [qa.id]: e.target.value })}
                          placeholder="Submit a professional tutor verified answer..."
                          className="flex-1 bg-[#f7f6f2] border border-[#e5e5e1] rounded-[8px] px-3 py-1.5 text-xs font-semibold focus:border-primary focus:outline-none shadow-sm"
                        />
                        <button 
                          onClick={() => handlePostAnswer(qa.id)}
                          className="bg-secondary text-[#0c0c10] text-[10px] font-bold px-3 py-1.5 rounded-[8px] shrink-0 transition-colors"
                        >
                          Submit Answer
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic font-medium text-center py-6">No homework or conceptual questions posted currently.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
