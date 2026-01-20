"use client";

import React, { useEffect, useState } from 'react';
import {  X, ThumbsUp } from 'lucide-react';
import { FaThumbsUp } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
// import { BsInstagram, BsTwitter } from 'react-icons/bs';

interface Article {
  _id: string;
  image: string;
  title: string;
  content: string;
  fullContent: string;
  likeCount?: number;
  likedBy?: string[];
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
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [articleLikes, setArticleLikes] = useState<{ [key: string]: number }>({});
  const [userLikedArticles, setUserLikedArticles] = useState<Set<string>>(new Set());
  const [loadedCards, setLoadedCards] = useState<Set<string>>(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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

const otherPosts = [
  { 
    id: 1, 
    title: "Kapas ki munasib kash aur beej ka intekhab", 
    img: "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?q=80&w=200" 
  },
  { 
    id: 2, 
    title: "Jadeed kisaan: Tunnel farming se munafa kaise kamayein?", 
    img: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=200" 
  },
  { 
    id: 3, 
    title: "Sardiyon mein sabziyon ki dekh bhaal ke aham mashwaray", 
    img: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=200" 
  },
  { 
    id: 4, 
    title: "Khadon ka mutawazin istemal aur zameen ki zarkhezi", 
    img: "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=200" 
  },
  { 
    id: 5, 
    title: "Dhaan ki fasal ko bimariyon se bachane ka tariqa", 
    img: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?q=80&w=400" 
  },

];;


  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50 to-white font-sans text-zinc-900">
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

      {/* --- NAVBAR --- */}
     

      {/* --- HERO SECTION --- */}
    
    <div className="max-w-7xl mx-auto px-4 py-10 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        
        {/* Left Side: Main Featured Post */}
    <div className="lg:col-span-2 relative group cursor-pointer overflow-hidden rounded-2xl h-[450px]">
  {/* Agriculture Image */}
  <img 
    src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1200" 
    alt="Gandum ki Kasht" 
    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
  />
  
  {/* Dark Overlay with Gradient */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8">
    
    {/* Category Tag */}
    <span className="bg-green-600/40 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full w-fit mb-4 border border-green-400/30">
      Agriculture
    </span>
    
    {/* Title */}
    <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight max-w-lg">
      Gandum ki Bumper Paidawar: Jadeed Zarai Tareeqay aur Dekh Bhaal
    </h1>
    
    {/* Optional: Chota sa description ya date */}
    <p className="text-gray-300 text-sm mt-3">
      Dr. Zahid • January 9, 2026
    </p>
  </div>
</div>

        {/* Right Side: Other Featured Posts */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Other featured posts</h2>
          <div className="flex flex-col gap-5">
            {otherPosts.map((post) => (
              <div key={post.id} className="flex gap-4 items-center group cursor-pointer">
                <div className="flex-shrink-0 w-24 h-16 overflow-hidden rounded-xl">
                  <img 
                    src={post.img} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>

      {/* --- TRENDING ARTICLES --- */}
      <section className="max-w-7xl mx-auto px-8 md:px-16 py-16">
        <div className="mb-12 animate-fadeInUp">
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent animate-slideUp hover:scale-105 transition-transform duration-300 inline-block">
            Our Trending Articles
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-green-600 to-green-400 rounded-full animate-grow"></div>
          <p className="text-zinc-500 text-sm mt-4 max-w-2xl animate-slideUp" style={{animationDelay: '0.2s'}}>
            Discover the latest insights and trends in sustainable agriculture. Explore expert articles on farming, agri-tech, and organic solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 px-2 md:px-0">
          {articles.map((article, index) => (
            
            <div 
              key={index} 
              className="group cursor-pointer card-loader px-3 py-2 rounded-2xl hover:bg-green-50/50 transition-all duration-300 relative"
              style={{
                animation: loadedCards.has(article._id) ? 'slideUp 0.6s ease-out forwards' : 'none',
                animationDelay: loadedCards.has(article._id) ? `${index * 0.1}s` : '0s'
              }}
            >
              {/* Glow background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-200/0 to-green-100/0 group-hover:from-green-200/20 group-hover:to-green-100/20 rounded-2xl transition-all duration-500"></div>
              
              <div className="relative z-10">
                <div className="overflow-hidden rounded-2xl mb-4 relative cursor-pointer group/image" onClick={() => router.push(`/blogs/${article?.slug}`)}>
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  
                  <img 
                    src={article?.image || ''} 
                    alt="Agriculture" 
                    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-700 ease-out cursor-pointer"
                  />
                  
                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 rounded-2xl"></div>
                  
                  {/* Featured badge with animation */}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105 shadow-lg">
                    Featured
                  </div>
                </div>
                
                <h3 className="font-bold text-lg mb-2 leading-tight text-zinc-900 group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
                  {article?.title}
                </h3>
                
                <p className="text-zinc-500 text-xs mb-4 leading-relaxed line-clamp-2">
                  {truncateContent(article?.content || '', 100)}
                </p>
                
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() => router.push(`/blogs/${article?.slug}`)}
                    className="text-xs font-bold text-green-600 flex items-center gap-1 hover:text-green-700 hover:gap-2 transition-all duration-300 group/btn"
                  >
                    Learn More 
                    <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center text-[10px] group-hover/btn:bg-green-600 group-hover/btn:text-white transition-all duration-300 transform group-hover/btn:scale-110">✓</div>
                  </button>
                  
                  <button
                    onClick={(e) => handleLike(article._id, e)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 transform hover:scale-110 ${
                      userLikedArticles.has(article._id)
                        ? "bg-green-100 text-green-700 shadow-md animate-bounce-subtle"
                        : "bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-600"
                    }`}
                  >
                    {userLikedArticles.has(article._id) ? (
                      <FaThumbsUp size={14} />
                    ) : (
                      <ThumbsUp size={14} />
                    )}
                    <span>{articleLikes[article._id] || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
    

      {/* --- MODAL --- */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-zinc-900">Article Details</h2>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-zinc-500 hover:text-zinc-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <img 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800" 
                alt={selectedArticle?.title || 'Article'}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              
              <h3 className="text-2xl font-bold mb-4 text-zinc-900">
                {selectedArticle?.title}
              </h3>
              
              <div className="space-y-4 text-zinc-700 leading-relaxed prose prose-sm max-w-full">
                <div dangerouslySetInnerHTML={{ __html: selectedArticle?.fullContent || '' }} />
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => {
                    if (selectedArticle?._id) {
                      setSelectedArticle(null);
                      router.push(`/blogs/${selectedArticle._id}`);
                    }
                  }}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  Read Full Article
                </button>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="flex-1 bg-zinc-200 text-zinc-900 py-3 rounded-lg font-bold hover:bg-zinc-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgricultureBlog;