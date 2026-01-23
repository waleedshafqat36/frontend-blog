"use client";

import React, { useEffect, useState } from 'react';
import {  X, ThumbsUp, ArrowUpRight, Clock, Sparkles, Flame, ArrowRight, FlameIcon, ChevronRight } from 'lucide-react';
import { FaThumbsUp } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
// import { BsInstagram, BsTwitter } from 'react-icons/bs';

interface Article {
  _id: string;
  image: string;
  title: string;
  titleUrdu?: string;
  content: string;
  contentUrdu?: string;
  fullContent: string;
  likeCount?: number;
  likedBy?: string[];
  createdAt?: string;
  slug?: string;
  author:string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const AgricultureBlog = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [articleLikes, setArticleLikes] = useState<{ [key: string]: number }>({});
  const [userLikedArticles, setUserLikedArticles] = useState<Set<string>>(new Set());
  const [loadedCards, setLoadedCards] = useState<Set<string>>(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isUrdu, setIsUrdu] = useState(true);
  const router = useRouter();

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (!content) return '';
    // Remove HTML tags
    const plainText = content.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  const handleLike = async (articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) return;

    try {
      const response = await fetch(`/api/blog/${articleId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, action: "like" }),
      });

      if (response.ok) {
        const data = await response.json();
        setArticleLikes(prev => ({
          ...prev,
          [articleId]: data.likeCount
        }));
        
        if (data.userLiked) {
          setUserLikedArticles(prev => new Set([...prev, articleId]));
        } else {
          setUserLikedArticles(prev => {
            const newSet = new Set(prev);
            newSet.delete(articleId);
            return newSet;
          });
        }
      }
    } catch (error) {
      console.error("Error liking article:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }

    // Generate unique userId for this session
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userId', newUserId);
      setUserId(newUserId);
    }
  }, []);

  useEffect(() => {
    // Fetch articles from API
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/blog');
        const data = await response.json();
        setArticles(data.blogs);
        
        // Initialize like counts
        const likes: { [key: string]: number } = {};
        const likedSet = new Set<string>();
        
        // Get current userId from localStorage to ensure we have the most recent value
        const currentUserId = localStorage.getItem('userId');
        
        data.blogs.forEach((article: Article) => {
          likes[article._id] = article.likeCount || 0;
          // Check if current user has liked this article
          if (currentUserId && article.likedBy?.includes(currentUserId)) {
            likedSet.add(article._id);
          }
        });
        
        setArticleLikes(likes);
        setUserLikedArticles(likedSet);

        // Stagger card animations
        data.blogs.forEach((article: Article, index: number) => {
          setTimeout(() => {
            setLoadedCards(prev => new Set([...prev, article._id]));
          }, index * 100);
        });
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    
    fetchArticles();
  }, []);

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('blogLanguagePreference', isUrdu ? 'urdu' : 'english');
  }, [isUrdu]);



  return (
    <div className="min-h-screen bg-linear-to-b from-white via-green-50 to-white font-sans text-zinc-900">
      {/* Animated background gradient */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        /* Agriculture-themed animations */
        @keyframes leafSway {
          0%, 100% { transform: rotate(-2deg) translateY(0px); }
          25% { transform: rotate(2deg) translateY(-3px); }
          50% { transform: rotate(0deg) translateY(0px); }
          75% { transform: rotate(-2deg) translateY(-2px); }
        }
        @keyframes sprout {
          0% {
            opacity: 0;
            transform: scaleY(0) translateY(20px);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: scaleY(1) translateY(0);
          }
        }
        @keyframes grow {
          0% {
            transform: scaleY(0.3);
            opacity: 0;
          }
          100% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes leafFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 5px rgba(34, 197, 94, 0.3);
          }
          50% { 
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.6);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes cardHover {
          0% {
            transform: translateY(0);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
          50% {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(34, 197, 94, 0.2);
          }
          100% {
            transform: translateY(0);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
        }
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        @keyframes fieldWave {
          0%, 100% { transform: translateX(0) skewY(0deg); }
          25% { transform: translateX(5px) skewY(1deg); }
          50% { transform: translateX(10px) skewY(0deg); }
          75% { transform: translateX(5px) skewY(-1deg); }
        }
        
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-slideInLeft { animation: slideInLeft 0.6s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.6s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.5s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
        .animate-leafFloat { animation: leafFloat 4s ease-in-out infinite; }
        .animate-leafSway { animation: leafSway 3s ease-in-out infinite; }
        .animate-sprout { animation: sprout 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-grow { animation: grow 0.8s ease-out; }
        .animate-bounce-subtle { animation: bounce 2s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse 2s ease-in-out infinite; }
        .animate-glow { animation: glow 3s ease-in-out infinite; }
        .animate-slideUp { animation: slideUp 0.7s ease-out; }
        .animate-fieldWave { animation: fieldWave 4s ease-in-out infinite; }
        .card-loader { animation: slideUp 0.6s ease-out forwards; opacity: 0; }
        
        /* Hover effects */
        .card-hover:hover {
          animation: none;
        }
      `}</style>

<div className="max-w-7xl mx-auto px-6 py-12 font-sans selection:bg-green-100">
    
    <div className="max-w-7xl mx-auto px-6  font-sans selection:bg-green-100 selection:text-green-900">
      <style>{`
        @keyframes subtle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-subtle-bounce { animation: subtle-bounce 3s ease-in-out infinite; }
        
        .glass-tag {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .bento-card-hover {
          transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .bento-card-hover:hover {
          box-shadow: 0 30px 60px -12px rgba(22, 101, 52, 0.15);
        }
      `}</style>

      {/* --- REFINED HEADER --- */}
      {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8"> */}
        
      {/* --- TRENDING ARTICLES --- */}
<section className="max-w-7xl mx-auto px-6 py-2">
  {/* Centered Header Section */}
  <div className="mb-8 flex flex-col animate-fadeInUp">
    
    <h2 className="text-4xl md:text-4xl font-black mb-6 tracking-tighter text-zinc-900 leading-none">
      BLOGS <span className="text-green-600 ">MARKET</span>
    </h2>
    
    {/* Search and Language Toggle Buttons */}
    <div className="flex items-center gap-4 mb-8 flex-wrap">
      {/* Search Input */}
      <div className="relative flex-1 min-w-xs">
        <input 
          type="text"
          placeholder={isUrdu ? "بلاگز تلاش کریں..." : "Search blogs..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full px-4 py-2.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all ${isUrdu ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'}`}
          dir={isUrdu ? "rtl" : "ltr"}
        />
        <svg 
          className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400 ${isUrdu ? 'left-3' : 'right-3'}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Language Toggle Buttons */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsUrdu(false)}
          className={`px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
            !isUrdu 
              ? 'bg-green-600 text-white shadow-lg' 
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          English
        </button>
        <button 
          onClick={() => setIsUrdu(true)}
          className={`px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
            isUrdu 
              ? 'bg-green-600 text-white shadow-lg' 
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          اردو
        </button>
      </div>
    </div>
  </div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch" dir={isUrdu ? "rtl" : "ltr"}>
  {articles
    .filter((article) => {
      const searchLower = searchQuery.toLowerCase();
      const titleMatch = article.title?.toLowerCase().includes(searchLower);
      const titleUrduMatch = article.titleUrdu?.toLowerCase().includes(searchLower);
      const contentMatch = article.content?.toLowerCase().includes(searchLower);
      const authorMatch = article.author?.toLowerCase().includes(searchLower);
      return titleMatch || titleUrduMatch || contentMatch || authorMatch;
    })
    .map((article, index) => (
    <div 
       onClick={()=>router.push(`/blogs/${article?.slug}`)}
      key={index} 
      className="group cursor-pointer flex flex-col bg-white rounded-xl overflow-hidden border border-zinc-100 hover:shadow-lg transition-all duration-500 h-full"
    >
      {/* 1. Controlled Image Height */}
      <div className="relative h-32 overflow-hidden shrink-0">
        <img 
     
          src={article?.image || ''} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt={article?.title}
        />
      </div>

      {/* 2. Content with flex-grow to fill remaining space */}
      <div className="p-3 flex flex-col flex-grow" dir={isUrdu ? "rtl" : "ltr"}>
        <div className="flex items-center gap-2 mb-1.5 text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
          <span>{article.author || 'Bilal'}</span>
          <span className="w-0.5 h-0.5 bg-zinc-200 rounded-full"></span>
          <span>
            {article.createdAt 
              ? new Date(article.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })
              : 'Jan 22'}
          </span>
        </div>

        <h3 className={`text-sm font-bold mb-1.5 leading-tight text-zinc-900 group-hover:text-green-600 transition-colors line-clamp-2 ${isUrdu ? 'text-base' : ''}`} style={isUrdu ? {   fontFamily: "'Jameel Noori Nastaleeq', serif", } : {}}>
          {isUrdu ? (article?.titleUrdu || article?.title) : article?.title}
        </h3>

        <p className={`text-zinc-500 text-[10px] mb-3 leading-relaxed line-clamp-2 ${isUrdu ? 'text-sm' : ''}`} style={isUrdu ? {   fontFamily: "'Jameel Noori Nastaleeq', serif", } : {}}>
          {isUrdu 
            ? (article?.contentUrdu?.replace(/<[^>]*>/g, '').slice(0, 80) || article?.content?.replace(/<[^>]*>/g, '').slice(0, 80))
            : article?.content?.replace(/<[^>]*>/g, '').slice(0, 80)}...
        </p>

        {/* 3. Action Button at the bottom */}
        <div className="pt-2 border-t border-zinc-50 flex items-center justify-between mt-auto">
         <button
  className="
    group/btn
    inline-flex items-center gap-1.5
    text-xs font-medium
    text-zinc-700
    px-2.5 py-1.5
    rounded-full
    border border-zinc-300
    bg-white
    hover:bg-zinc-900 hover:text-white
    transition-all duration-300
  "
>
  Read more
  <span
    className="
      w-4 h-4
      rounded-full
      border border-zinc-300
      flex items-center justify-center
      group-hover/btn:border-white
      group-hover/btn:bg-white
      group-hover/btn:text-zinc-900
      transition-all duration-300
    "
  >
    <ChevronRight size={10} />
  </span>
</button>

        </div>
      </div>
    </div>
  ))}
</div>
</section>

    

 
    </div>
    </div>
    </div>
  );
};

export default AgricultureBlog;