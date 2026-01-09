"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Facebook, Twitter, Instagram, Linkedin, ThumbsUp, ThumbsDown } from "lucide-react";
import { useEffect, useState } from "react";
import { FaFacebook, FaLinkedin, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { BsInstagram, BsTwitter } from "react-icons/bs";

interface Blog {
  _id: string;
  title: string;
  category: string;
  author: string;
  createdAt: string;
  image: string;
  content: string;
  likes?: string[];
  dislikes?: string[];
  comments?: Comment[];
}

interface Comment {
  _id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const BlogPost = () => {
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const params = useParams();
  const blogId = params.id as string | string[] | undefined;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
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
    if (!blogId) return;

    const fetchBlogDetails = async () => {
      try {
        const response = await fetch(`/api/blog/${blogId}`);
        const data = await response.json();
        if (response.ok) {
          console.log("Blog data received:", data.detailsBlog);
          setBlog(data.detailsBlog);
          setLikes(data.detailsBlog.likeCount || 0);
          setDislikes(data.detailsBlog.dislikeCount || 0);
          
          // Properly set comments from database
          const blogComments = data.detailsBlog.comments || [];
          setComments(blogComments);
          console.log("Comments loaded:", blogComments);
          
          // Check if current user has liked or disliked
          if (userId) {
            setUserLiked(data.detailsBlog.likedBy?.includes(userId) || false);
            setUserDisliked(data.detailsBlog.dislikedBy?.includes(userId) || false);
          }
          
          // --- Related blogs fetch karein (Category ke base par) ---
          if (data.detailsBlog.category && blogId) {
            fetchRelated(data.detailsBlog.category, blogId);
          }
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    };

    const fetchRelated = async (category: string, currentId: string | string[]) => {
        try {
            const res = await fetch(`/api/blog`); 
            const data = await res.json();
            if (res.ok) {
                const filtered = data.blogs.filter((b: Blog) => b._id !== currentId && b.category === category);
                setRelatedBlogs(filtered.slice(0, 3));
            }
        } catch (err) {
            console.log("Related fetch error", err);
        }
    }

    fetchBlogDetails();
  }, [blogId]);

  const handleLikeDislike = async (action: "like" | "dislike") => {
    if (!userId || !blogId) return;

    try {
      const response = await fetch(`/api/blog/${blogId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, action }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update state with counts from API (using $inc, so these are always accurate)
        setLikes(data.likeCount);
        setDislikes(data.dislikeCount);
        setUserLiked(data.userLiked);
        setUserDisliked(data.userDisliked);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !commentAuthor.trim() || !blogId) return;

    setIsLoadingComment(true);
    try {
      const response = await fetch(`/api/blog/${blogId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ author: commentAuthor, text: commentText }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Comment posted successfully:", data.comments);
        setComments(data.comments || []);
        setCommentText("");
        setCommentAuthor("");
      } else {
        console.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsLoadingComment(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">Blog Not Found</h1>
          <button
            onClick={() => router.back()}
            className="text-green-600 font-bold flex items-center gap-2 hover:text-green-700"
          >
            <ArrowLeft size={20} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      <style>{`
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
        .animate-slideInLeft { animation: slideInLeft 0.6s ease-out; }
      `}</style>
      
      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-8 md:px-16 py-4 max-w-7xl mx-auto animate-slideInLeft border-b border-zinc-200">
        <div className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-linear-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-bold italic group-hover:scale-110 transition-transform duration-300">G</div>
          <span className="text-xl font-bold bg-linear-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Agrob</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-600">
          <a href="/" className="hover:text-green-600 transition duration-300 relative group">
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="/blogs" className="hover:text-green-600 transition duration-300 relative group">
            Blogs
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#" className="hover:text-green-600 transition duration-300 relative group">
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#" className="hover:text-green-600 transition duration-300 relative group">
            Service
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#" className="hover:text-green-500 transition duration-300 relative group">
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
          </a>
          {user?.role === 'admin' && (
            <a href="/Admin" className="hover:text-green-500 transition duration-300 relative group">
              Admin
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </a>
          )}
        </div>
        <button 
          onClick={handleLogout}
          className="bg-linear-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-full text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
        >
          Log out
        </button>
      </nav>

     

      {/* Blog Header */}
      <header className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
            {blog?.category}
          </span>
          <h1 className="text-5xl font-bold leading-tight mb-4">
            {blog?.title}
          </h1>
          <div className="flex items-center gap-4 text-zinc-600 text-sm">
            <span>By {blog?.author}</span>
            <span>•</span>
            <span>{blog?.createdAt && new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}</span>
          </div>
        </div>
        <img
          src={blog?.image}
          alt={blog?.title}
          className="w-full h-125 object-cover rounded-2xl shadow-lg"
        />
      </header>

      {/* Blog Content */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        <div
          className="prose prose-lg max-w-none text-zinc-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog?.content || '' }}
        />
      </article>

      {/* Like/Dislike Section */}
      <section className="max-w-4xl mx-auto px-6 py-8 border-b border-zinc-200">
        <div className="flex items-center justify-between">
          <p className="text-zinc-600 text-sm font-semibold">Was this article helpful?</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleLikeDislike("like")}
              className={`flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all transform hover:scale-110 ${
                userLiked
                  ? "bg-green-100 text-green-700 shadow-md"
                  : "bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              {userLiked ? (
                <FaThumbsUp size={16} />
              ) : (
                <ThumbsUp size={16} />
              )}
              <span>{likes}</span>
            </button>
            <button
              onClick={() => handleLikeDislike("dislike")}
              className={`flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all transform hover:scale-110 ${
                userDisliked
                  ? "bg-red-100 text-red-700 shadow-md"
                  : "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              {userDisliked ? (
                <FaThumbsDown size={16} />
              ) : (
                <ThumbsDown size={16} />
              )}
              <span>{dislikes}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="max-w-4xl mx-auto px-6 py-12 border-b border-zinc-200">
        <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>
        
        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mb-8 p-4 bg-zinc-50 rounded-lg">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              required
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
            <textarea
              placeholder="Share your thoughts..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              maxLength={500}
              rows={3}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">{commentText.length}/500</span>
              <button
                type="submit"
                disabled={isLoadingComment || !commentText.trim() || !commentAuthor.trim()}
                className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:bg-gray-400 cursor-pointer"
              >
                {isLoadingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="p-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-zinc-900">{comment.author}</h4>
                  <span className="text-xs text-zinc-500">
                    {comment.createdAt && new Date(comment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-sm text-zinc-700 leading-relaxed">{comment.text}</p>
              </div>
            ))
          ) : (
            <p className="text-zinc-500 text-sm text-center py-8">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </section>

      {/* Share Section */}
      <section className="max-w-4xl mx-auto px-6 py-12 border-b border-zinc-200 mt-0">
        <h3 className="text-xl font-bold mb-6">Share This Article</h3>
        <div className="flex gap-4">
          <button className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition">
            <FaFacebook size={20} />
          </button>
          <button className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition">
            <BsTwitter size={20} />
          </button>
          <button className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition">
            <BsInstagram size={20} />
          </button>
          <button className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition">
            <FaLinkedin size={20} />
          </button>
        </div>
      </section>

      {/* Related Articles Section */}
     {/* Related Articles Section - Updated Logic */}
      <section className="max-w-4xl mx-auto px-6 py-12 border-t border-zinc-200">
        <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {relatedBlogs.length > 0 ? (
            relatedBlogs.map((related, index) => (
              <div
                key={index}
                className="group cursor-pointer border border-zinc-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                onClick={() => router.push(`/blogs/${related?._id}`)} // Check karein path blogs hai ya blog
              >
                <img
                  src={related?.image}
                  alt={related?.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2 group-hover:text-green-600 transition">
                    {related?.title}
                  </h4>
                  <p className="text-zinc-600 text-sm">
                    {related?.createdAt && new Date(related.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-zinc-500">No related articles found.</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1f24] text-white pt-16 pb-8 px-6 mt-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-zinc-800 pb-12">
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="text-zinc-400 text-sm space-y-3">
              <li>About Company</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="text-zinc-400 text-sm space-y-3">
              <li>Pricing</li>
              <li>Help Center</li>
              <li>What's New</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Resources</h4>
            <ul className="text-zinc-400 text-sm space-y-3">
              <li>Community</li>
              <li>Documentation</li>
              <li>API Status</li>
              <li>Partners</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Newsletter</h4>
            <p className="text-zinc-400 text-sm mb-4">Subscribe to get updates</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-zinc-700 text-white text-sm rounded-l"
              />
              <button className="bg-green-600 px-4 py-2 text-white text-sm rounded-r hover:bg-green-700 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-zinc-600 text-xs mt-8">© 2026 Agriculture Blogs. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default BlogPost;
