"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Facebook, Twitter, Instagram, Linkedin, ThumbsUp, ThumbsDown, MessageCircle, Edit2, Trash2, Globe } from "lucide-react";
import { useEffect, useState } from "react";

// Add animations to globals
const animationStyles = `
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
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
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
  
  .animate-fadeInUp {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .animate-slideInLeft {
    animation: slideInLeft 0.5s ease-out forwards;
  }
  
  .animate-scaleIn {
    animation: scaleIn 0.4s ease-out forwards;
  }
  
  .hover-lift {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .hover-lift:hover {
    transform: translateY(-4px);
  }
`;
import { FaFacebook, FaLinkedin, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { BsInstagram, BsTwitter, BsWhatsapp } from "react-icons/bs";

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
  authorId?: string;
  text: string;
  createdAt: string;
  likes?: number;
  dislikes?: number;
  likedBy?: string[];
  dislikedBy?: string[];
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
  // const [commentAuthor, setCommentAuthor] = useState("");
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editAuthor, setEditAuthor] = useState("");
  const [editText, setEditText] = useState("");
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [commentLikes, setCommentLikes] = useState<{[key: string]: boolean}>({});
  const [commentDislikes, setCommentDislikes] = useState<{[key: string]: boolean}>({});
  const params = useParams();
  const blogId = params.id as string | string[] | undefined;
  const [isUrdu, setIsUrdu] = useState(false)

const toggleLanguage = async (langCode: 'en' | 'ur') => {
  // Pehle direction aur UI switch kar dein taake user ko foran response mile
  setIsUrdu(langCode === 'ur');

  const triggerGoogleTranslate = () => {
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    
    if (selectElement) {
      if (langCode === 'en') {
        selectElement.value = ''; // Original English ke liye khali chordein
      } else {
        selectElement.value = 'ur';
      }
      selectElement.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      // Agar abhi tak load nahi hua, to 500ms baad phir try karein (sirf 3 baar)
      console.log("Waiting for Google Translate to initialize...");
    }
  };

  // 1 second ka gap dein taake script init ho jaye agar pehle nahi hui
  setTimeout(triggerGoogleTranslate, 500);
};
  useEffect(() => {
    if (isUrdu) {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [isUrdu]);
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
// fetch blog details from API
    const fetchBlogDetails = async () => {
      try {
        const response = await fetch(`/api/blog/${blogId}`);
        const data = await response.json();
        console.log(data);
        
        if (response.ok) {
          // console.log("Blog data received:", data.detailsBlog);
          setBlog(data.detailsBlog);
          setLikes(data.detailsBlog.likeCount || 0);
          setDislikes(data.detailsBlog.dislikeCount || 0);
          
          // Properly set comments from database
          const blogComments = data.detailsBlog.comments || [];
          setComments(blogComments);
          // console.log("Comments loaded:", blogComments);
          
          // Initialize comment likes/dislikes based on current user
          if (userId && blogComments.length > 0) {
            const likedCommentsMap: {[key: string]: boolean} = {};
            const dislikedCommentsMap: {[key: string]: boolean} = {};
            
            blogComments.forEach((comment: Comment) => {
              likedCommentsMap[comment._id] = comment.likedBy?.includes(userId) || false;
              dislikedCommentsMap[comment._id] = comment.dislikedBy?.includes(userId) || false;
            });
            
            setCommentLikes(likedCommentsMap);
            setCommentDislikes(dislikedCommentsMap);
          }
          
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
// Related blogs fetch karne ka function
    const fetchRelated = async (category: string, currentId: string | string[]) => {
        try {
            const res = await fetch(`/api/blog`); 
            const data = await res.json();
          console.log("data", data);
          
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
// Like/Dislike handlers
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
// Add Comment handler
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const authorName = user?.name || "Anonymous";
    if (!commentText.trim() || !authorName.trim() || !blogId) return;

    setIsLoadingComment(true);
    try {
      // post comment to API endpoint
      const response = await fetch(`/api/blog/${blogId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ author: authorName, text: commentText, authorId: user?._id }),
      });

      if (response.ok) {
        const data = await response.json();
        // console.log("Comment posted successfully:", data.comments);
        setComments(data.comments || []);
        setCommentText("");
      } else {
        console.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsLoadingComment(false);
    }
  };
  // Edit Comment handlers
  const handleEditComment = (id: string, author: string, text: string) => {
  setEditingCommentId(id);
  setEditAuthor(author);
  setEditText(text);
};
// Cancel Edit handler
const handleCancelEdit = () => {
  setEditingCommentId(null);
  setEditAuthor("");
  setEditText("");
};
// Edit Comment handler for submission
  const handleEditComments = async () => {
     if (!editAuthor.trim() || !editText.trim()) return;
    try {
      // Update comment to API endpoint
      const response = await fetch(`/api/blog/${blogId}/comment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
           commentId: editingCommentId,
        author: editAuthor,
        text: editText
       }),
      }); 
      
      
      if (response.ok) {
        const data = await response.json();
        setComments(prev =>
        prev.map(c =>
          c._id === editingCommentId
            ? { ...c, author: editAuthor, text: editText }
            : c
        ));
        handleCancelEdit();
      } else {
        console.error("Failed to update comment");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  }; 
// Delete Comment handler
  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/blog/${blogId}/comment`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId }),
      });
      
      if (response.ok) {
        setComments(prev => prev.filter(c => c._id !== commentId));
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
// Comment Like/Dislike handler
  const handleCommentLikeDislike = async (commentId: string, action: "like" | "dislike") => {
    if (!userId || !blogId) return;

    try {
      const response = await fetch(`/api/blog/${blogId}/comment/${commentId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, action }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev =>
          prev.map(c =>
            c._id === commentId
              ? {
                  ...c,
                  likes: data.likes,
                  dislikes: data.dislikes,
                  likedBy: data.likedBy,
                  dislikedBy: data.dislikedBy,
                }
              : c
          )
        );
        if (action === "like") {
          setCommentLikes(prev => ({ ...prev, [commentId]: data.userLiked }));
        } else {
          setCommentDislikes(prev => ({ ...prev, [commentId]: data.userDisliked }));
        }
      }
    } catch (error) {
      console.error("Error:", error);
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
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slideInLeft { animation: slideInLeft 0.6s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.5s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .hover-lift { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .hover-lift:hover { transform: translateY(-4px); }
      `}</style>
      

     

      {/* Blog Header */}
      <header className="max-w-4xl mx-auto px-6 py-8 animate-fadeInUp" style={{animationDelay: "0.1s"}}>
        <div className="mb-6">
           <div className="flex items-center gap-2">
          <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-4 hover-lift">
            {blog?.category}
          </span>
           <button
          onClick={() => toggleLanguage(isUrdu ? 'en' : 'ur')}
       className={`flex items-center gap-2 px-4 py-2 mb-4 border-none cursor-pointer rounded-full hover-lift text-sm font-bold transition-all border ${
    isUrdu ? 'bg-green-100 text-green-700 border-none ' : ' bg-green-100 text-green-700'
  }`}
>
   <Globe size={16} className={isUrdu ? "animate-spin" : ""} />
  {isUrdu ? "English" : "اردو"} 
</button>
           </div>
          <h1 dir="auto" className="text-5xl font-bold leading-tight mb-4 text-zinc-900 hover-lift transition-transform duration-300">
            {isUrdu? blog?.titleUrdu : blog?.title}
          </h1>
          <div className="flex items-center gap-4 text-zinc-600 text-sm animate-fadeInUp" style={{animationDelay: "0.2s"}}>
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
          className="w-full h-125 object-cover rounded-2xl shadow-lg animate-fadeInUp hover-lift" 
          style={{animationDelay: "0.3s"}}
        />
      </header>

      {/* Blog Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Left Side (3 columns) */}
          <article className={`lg:col-span-3 pl-15 ${isUrdu ? 'urdu-mode' : 'english-mode'}`}>
            {/* 1. Google Translate Container (Isay hidden mat karein, bas small kar dein) */}
            {/* <div id="google_translate_element" style={{ opacity: 0, height: '1px', position: 'absolute' }}></div> */}
            
            {/* 2. Content Div */}
            <div
              // 'dir' state ke mutabiq switch hoga taake alignment foran badal jaye
              dir={isUrdu ? "rtl" : "ltr"}
              // Class name bhi dynamic honi chahiye
              className={`blog-content text-gray-700 leading-relaxed ${isUrdu ? 'urdu-text-style' : 'english-text-style'}`}
              dangerouslySetInnerHTML={{ __html: isUrdu ? blog?.contentUrdu : blog?.content }}
            />
          </article>

          {/* Related Articles Sidebar - Right Side (1 column) */}
          <aside className="lg:col-span-1 pl-4">
            <div className="sticky top-8">
              <div className="border border-zinc-200 rounded-xl p-4 bg-zinc-50">
                <h3 className="text-base font-bold mb-4 text-zinc-900">Related Articles</h3>
                <div className="space-y-3">
                  {relatedBlogs.length > 0 ? (
                    relatedBlogs.slice(0, 3).map((related, index) => (
                      <div
                        key={index}
                        className="group cursor-pointer border border-zinc-200 rounded-lg overflow-hidden hover:shadow-md transition-all hover-lift bg-white animate-scaleIn"
                        style={{animationDelay: `${0.7 + index * 0.1}s`}}
                        onClick={() => router.push(`/blogs/${related?._id}`)}
                      >
                        <img
                          src={related?.image}
                          alt={related?.title}
                          className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="p-2.5">
                          <h4 className="font-semibold text-xs mb-1.5 group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
                            {related?.title}
                          </h4>
                          <p className="text-zinc-500 text-[11px]">
                            {related?.createdAt && new Date(related.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-500 text-xs text-center py-3">No related articles found.</p>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Like/Dislike Section */}
      <section className="max-w-4xl ml-22 px-6 py-8 border-b border-zinc-200 animate-fadeInUp" style={{animationDelay: "0.4s"}}>
        <div className="flex items-start justify-between gap-6">
          <p className="text-zinc-600 text-sm font-semibold">Was this article helpful?</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleLikeDislike("like")}
              className={`flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all transform hover:scale-110 hover-lift ${
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
              className={`flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all transform hover:scale-110 hover-lift ${
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
            <button
              onClick={() => setShowCommentSection(!showCommentSection)}
              className={`flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all transform hover:scale-110 ${
                showCommentSection
                  ? "bg-blue-100 text-blue-700 shadow-md"
                  : "bg-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
              }`}
              title="Toggle comments section"
            >
              <MessageCircle size={16} />
              <span>{comments.length}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Comments Section helo */}
      {showCommentSection && (
      <section className="max-w-4xl mx-auto px-6 py-12 border-b border-zinc-200">
        <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>
        
        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mb-8 p-4 bg-zinc-50 rounded-lg animate-fadeInUp hover-lift" style={{animationDelay: "0.5s"}}>
          <div className="space-y-3">
            <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg hover-lift transition-all">
              <p className="text-sm text-zinc-700">
                <span className="text-zinc-600 font-medium">Commenting as: </span>
                <span className="font-bold text-green-700">{user?.name || "Anonymous"}</span>
              </p>
            </div>
            <textarea
              placeholder="Share your thoughts..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              maxLength={500}
              rows={3}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 resize-none transition-all"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">{commentText.length}/500</span>
              <button
                type="submit"
                disabled={isLoadingComment || !commentText.trim()}
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
    comments.map((comment) => (
      <div key={comment._id} className="p-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition">
        {editingCommentId === comment._id ? (
          // ✨ Editable form
          <div className="space-y-2">
            <input
              type="text"
              value={editAuthor}
              onChange={(e) => setEditAuthor(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md"
            />
            <textarea
              rows={3}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleEditComments}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-200 text-gray-700 px-4 py-1 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // ✨ Normal display
          <>
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-zinc-900">{comment.author}</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">
                  {comment.createdAt && new Date(comment.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {user && (comment.authorId === user._id || comment.author === user.name) && (
                  <>
                    <button
                      onClick={() => handleEditComment(comment._id, comment.author, comment.text)}
                      className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                      title="Edit comment"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-600 hover:text-red-800 transition cursor-pointer"
                      title="Delete comment"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
            <p className="text-sm text-zinc-700 leading-relaxed">{comment.text}</p>
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => handleCommentLikeDislike(comment._id, "like")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  commentLikes[comment._id]
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-600"
                }`}
              >
                {commentLikes[comment._id] ? (
                  <FaThumbsUp size={14} />
                ) : (
                  <ThumbsUp size={14} />
                )}
                <span>{comment.likes || 0}</span>
              </button>
              <button
                onClick={() => handleCommentLikeDislike(comment._id, "dislike")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  commentDislikes[comment._id]
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                {commentDislikes[comment._id] ? (
                  <FaThumbsDown size={14} />
                ) : (
                  <ThumbsDown size={14} />
                )}
                <span>{comment.dislikes || 0}</span>
              </button>
            </div>
          </>
        )}
      </div>
    ))
  ) : (
    <p className="text-zinc-500 text-sm text-center py-8">
      No comments yet. Be the first to comment!
    </p>
  )}
</div>

      </section>
      )}

      {/* Share Section */}
      <section className="max-w-4xl mx-auto px-6 py-12 border-b border-zinc-200 mt-0 animate-fadeInUp" style={{animationDelay: "0.6s"}}>
  <h3 className="text-xl font-bold mb-6">Share This Article</h3>
  <div className="flex gap-4">
    {/* Facebook */}
    <a 
      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition hover-lift shadow-md hover:shadow-lg"
    >
      <FaFacebook size={20} />
    </a>

    {/* Twitter (X) */}
    <a 
      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition hover-lift shadow-md hover:shadow-lg"
    >
      <BsTwitter size={20} />
    </a>

    {/* LinkedIn */}
    <a 
      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition hover-lift shadow-md hover:shadow-lg"
    >
      <FaLinkedin size={20} />
    </a>

    {/* WhatsApp */}
    <a 
      href={`https://wa.me/?text=${encodeURIComponent(blog.title + " " + window.location.href)}`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition hover-lift shadow-md hover:shadow-lg"
    >
      <BsWhatsapp size={20} />
    </a>
  </div>
</section>

      {/* Related Articles Section - REMOVED (now in sidebar on right) */}

      {/* Footer */}
      <footer className="bg-[#1a1f24] text-white pt-16 pb-8 px-6 mt-16 animate-fadeInUp" style={{animationDelay: "0.8s"}}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-zinc-800 pb-12">
          <div className="hover-lift">
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="text-zinc-400 text-sm space-y-3">
              <li className="hover:text-green-500 transition-colors duration-300 cursor-pointer">About Company</li>
              <li className="hover:text-green-500 transition-colors duration-300 cursor-pointer">Terms of Service</li>
              <li className="hover:text-green-500 transition-colors duration-300 cursor-pointer">Privacy Policy</li>
              <li className="hover:text-green-500 transition-colors duration-300 cursor-pointer">Contact Us</li>
            </ul>
          </div>
          <div className="hover-lift">
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="text-zinc-400 text-sm space-y-3">
              <li className="hover:text-green-500 transition-colors duration-300 cursor-pointer">Pricing</li>
              <li className="hover:text-green-500 transition-colors duration-300 cursor-pointer">Help Center</li>
              <li className="hover:text-green-500 transition-colors duration-300 cursor-pointer">What's New</li>
              <li className="hover:text-green-500 transition-colors duration-300 cursor-pointer">Blog</li>
            </ul>
          </div>
          <div className="hover-lift">
            <h4 className="font-bold mb-6">Resources</h4>
            <ul className="text-zinc-400 text-sm space-y-3">
              <li className="hover:text-green-500 transition-colors duration-300 cursor-pointer">Community</li>
              <li className="hover:text-green-500 transition-colors duration-300 cursor-pointer">Documentation</li>
              <li className="hover:text-green-500 transition-colors duration-300 cursor-pointer">API Status</li>
              <li className="hover:text-green-500 transition-colors duration-300 cursor-pointer">Partners</li>
            </ul>
          </div>
          <div className="hover-lift">
            <h4 className="font-bold mb-6">Newsletter</h4>
            <p className="text-zinc-400 text-sm mb-4">Subscribe to get updates</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-zinc-700 text-white text-sm rounded-l focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
              />
              <button className="bg-green-600 px-4 py-2 text-white text-sm rounded-r hover:bg-green-700 transition-all hover-lift">
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
