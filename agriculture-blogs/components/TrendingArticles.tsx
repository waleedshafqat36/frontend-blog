"use client";

import { ArrowRight, TrendingUp, ThumbsUp, MessageSquare, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Blog {
  _id: string;
  slug: string;
  title: string;
  titleUrdu?: string;
  createdAt: string;
  image: string;
  content: string;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  viewCount?: number;
  engagement?: {
    trendScore: number;
    growthRate: number;
    recentViews: number;
    recentLikes: number;
    recentComments: number;
    freshness: number;
  };
}

interface TrendingArticlesProps {
  trendingBlogs?: Blog[];
  isUrdu?: boolean;
  limit?: number;
}

// Calculate engagement score based on multiple factors
function calculateEngagementScore(blog: Blog): number {
  const now = new Date().getTime();
  const createdAt = new Date(blog.createdAt).getTime();
  const ageInDays = (now - createdAt) / (1000 * 60 * 60 * 24);
  
  // Freshness factor (newer is better, but not too penalizing for older posts)
  const freshnessScore = Math.max(0, 10 - ageInDays * 0.5);
  
  // Engagement metrics
  const likes = blog.likeCount || 0;
  const comments = blog.commentCount || 0;
  const shares = blog.shareCount || 0;
  const views = blog.viewCount || 1;
  
  // Engagement ratio calculation - Prioritize likes and comments
  // Likes: 5x weight, Comments: 6x weight, Shares: 2x weight
  const engagementRatio = (likes * 5 + comments * 6 + shares * 2) / Math.max(1, views);
  
  // Combined score: 30% freshness, 70% engagement (prioritize engagement more)
  return freshnessScore * 0.3 + (engagementRatio * 10) * 0.7;
}

// Format large numbers (e.g., 1.2K, 1.5M)
function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// Calculate days ago
function daysAgo(date: string): string {
  const now = new Date().getTime();
  const createdAt = new Date(date).getTime();
  const diffInDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays}d ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
  return `${Math.floor(diffInDays / 30)}m ago`;
}

export default function TrendingArticles({ 
  trendingBlogs = [], 
  isUrdu = false,
  limit = 3 
}: TrendingArticlesProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/blog/trending');
        
        if (!response.ok) {
          throw new Error('Failed to fetch trending blogs');
        }
        
        const data = await response.json();
        const sortedBlogs = (data.blogs || [])
          .sort((a: Blog, b: Blog) => calculateEngagementScore(b) - calculateEngagementScore(a))
          .slice(0, limit);
        
        setBlogs(sortedBlogs);
        setError(null);
      } catch (err) {
        console.error('Error fetching trending blogs:', err);
        // Fallback to provided blogs if API fails
        if (trendingBlogs && trendingBlogs.length > 0) {
          const sortedBlogs = [...trendingBlogs]
            .sort((a: Blog, b: Blog) => calculateEngagementScore(b) - calculateEngagementScore(a))
            .slice(0, limit);
          setBlogs(sortedBlogs);
        } else {
          setError(isUrdu ? 'ٹریندنگ آرٹیکلز لوڈ نہیں ہو سکے' : 'Unable to load trending articles');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingBlogs();

    // Refresh trending data every 2 minutes
    const interval = setInterval(fetchTrendingBlogs, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [trendingBlogs, limit, isUrdu]);

  if (loading && blogs.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-12 border-b border-zinc-200">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <TrendingUp className="text-green-600" size={32} />
          {isUrdu ? "ٹریندنگ آرٹیکلز" : "Trending Articles"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-zinc-200 h-40 rounded-lg mb-4"></div>
              <div className="bg-zinc-200 h-4 rounded mb-2 w-3/4"></div>
              <div className="bg-zinc-200 h-4 rounded mb-4 w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error && blogs.length === 0) {
    return null;
  }

  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 border-b border-zinc-200">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .trending-card {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .trending-badge {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        .engagement-bar {
          background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
        }
        .trending-card:hover {
          box-shadow: 0 20px 40px rgba(16, 185, 129, 0.15);
        }
      `}</style>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
            <TrendingUp className="text-green-600 animate-bounce" size={24} />
            {isUrdu ? "ٹریندنگ آرٹیکلز" : "Trending Articles"}
          </h2>
          <p className="text-zinc-600 text-xs">
            {isUrdu 
              ? "بہترین انگیجمنٹ" 
              : "Fast-growing engagement"}
          </p>
        </div>
      </div>

      {/* Trending Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.map((blog: Blog, idx: number) => {
          const engagement = blog.engagement || {
            trendScore: calculateEngagementScore(blog),
            growthRate: 0,
            recentViews: blog.viewCount || 0,
            recentLikes: blog.likeCount || 0,
            recentComments: blog.commentCount || 0,
            freshness: 0,
          };

          return (
            <a
              key={blog._id}
              href={`/blogs/${blog.slug}`}
              className="trending-card group h-full overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all duration-500 hover:border-green-500 hover:shadow-xl"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden bg-zinc-100 h-32">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Rank Badge */}
                <div className="absolute top-3 left-3 trending-badge text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg">
                  #{idx + 1}
                </div>

                {/* Freshness Badge */}
                <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                  {daysAgo(blog.createdAt)}
                </div>
              </div>

              {/* Content */}
              <div className="p-3 flex flex-col h-[calc(100%-8rem)]">
                {/* Title */}
                <h3 className="font-bold text-sm mb-1 line-clamp-2 group-hover:text-green-600 transition duration-300 grow">
                  {isUrdu ? blog.titleUrdu || blog.title : blog.title}
                </h3>

                {/* Preview */}
                <p className="text-zinc-600 text-xs mb-2 line-clamp-1">
                  {blog.content 
                    ? blog.content.replace(/<[^>]*>/g, '').substring(0, 50) + '...' 
                    : isUrdu ? 'مضمون' : 'Article'}
                </p>

                {/* Engagement Metrics */}
                <div className="space-y-1 mb-2 py-2 border-t border-b border-zinc-200">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-zinc-600">
                      <ThumbsUp size={12} />
                      <span>{formatNumber(blog.likeCount || 0)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-600">
                      <MessageSquare size={12} />
                      <span>{formatNumber(blog.commentCount || 0)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-600">
                      <Share2 size={12} />
                      <span>{formatNumber(blog.shareCount || 0)}</span>
                    </div>
                  </div>

                  {/* Engagement Score Bar */}
                  <div className="w-full bg-zinc-200 rounded-full h-1 overflow-hidden">
                    <div 
                      className="engagement-bar h-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (engagement.trendScore / 50) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-zinc-500">
                    {new Date(blog.createdAt).toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="text-green-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    {isUrdu ? "مزید" : "More"}
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>


    </section>
  );
}
