"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ThumbsUp, ThumbsDown, MessageCircle, Edit2, Trash2, Share2 } from "lucide-react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

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

export default function BlogInteractive({ blogId, slugUrdu, initialLikes = 0, initialDislikes = 0, initialLikedBy = [], initialDislikedBy = [], initialComments = [], isUrdu = false }: { 
  blogId: string; 
  slugUrdu:string
  initialLikes?: number;
  initialDislikes?: number;
  initialLikedBy?: string[];
  initialDislikedBy?: string[];
  initialComments?: Comment[];
  isUrdu?: boolean;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState("");
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editAuthor, setEditAuthor] = useState("");
  const [editText, setEditText] = useState("");
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [commentLikes, setCommentLikes] = useState<{[key: string]: boolean}>({});
  const [commentDislikes, setCommentDislikes] = useState<{[key: string]: boolean}>({});
  
  // Use ref to track if initialization is done
  const initializedRef = useRef(false);

  // Single consolidated initialization effect
  useEffect(() => {
    if (initializedRef.current) return;
    
    // Initialize user and userId
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }

    let storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userId', storedUserId);
    }
    setUserId(storedUserId);
    
    initializedRef.current = true;
  }, []);

  // Update like/dislike state when userId changes
  useEffect(() => {
    if (!userId) return;
    
    setUserLiked(initialLikedBy.includes(userId));
    setUserDisliked(initialDislikedBy.includes(userId));

    // Initialize comment like/dislike maps
    if (initialComments.length > 0) {
      const likedCommentsMap: {[key: string]: boolean} = {};
      const dislikedCommentsMap: {[key: string]: boolean} = {};
      
      initialComments.forEach((comment: Comment) => {
        likedCommentsMap[comment._id] = comment.likedBy?.includes(userId) || false;
        dislikedCommentsMap[comment._id] = comment.dislikedBy?.includes(userId) || false;
      });
      
      setCommentLikes(likedCommentsMap);
      setCommentDislikes(dislikedCommentsMap);
    }
  }, [userId, initialLikedBy, initialDislikedBy, initialComments]);

  const handleLikeDislike = useCallback(async (action: "like" | "dislike") => {
    if (!userId) return;

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
        setLikes(data.likeCount);
        setDislikes(data.dislikeCount);
        setUserLiked(data.userLiked);
        setUserDisliked(data.userDisliked);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [userId, blogId]);

  const handleAddComment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const authorName = user?.name || "Anonymous";
    if (!commentText.trim() || !authorName.trim()) return;

    setIsLoadingComment(true);
    try {
      const response = await fetch(`/api/blog/${blogId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ author: authorName, text: commentText, authorId: user?._id }),
      });

      if (response.ok) {
        const data = await response.json();
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
  }, [commentText, blogId, user]);

  const handleEditComment = (id: string, author: string, text: string) => {
    setEditingCommentId(id);
    setEditAuthor(author);
    setEditText(text);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditAuthor("");
    setEditText("");
  };

  const handleEditComments = async () => {
    if (!editAuthor.trim() || !editText.trim()) return;
    try {
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
// 
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

  const handleCommentLikeDislike = async (commentId: string, action: "like" | "dislike") => {
    if (!userId) return;

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

  return (
    <>
      {/* Like/Dislike Section */}
      <section className="max-w-4xl ml-22 px-6 py-8 border-b border-zinc-200 animate-fadeInUp" style={{animationDelay: "0.4s"}}>
        <div className="flex items-start justify-between gap-6">
          <p className="text-zinc-600 text-sm font-semibold">{isUrdu ? "کیا یہ مضمون مددگار تھا؟" : "Was this article helpful?"}</p>
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
            <button
              onClick={async () => {
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: document.title,
                      url: typeof window !== 'undefined' ? window.location.href : '',
                    });
                  } catch (error) {
                    console.log('Share cancelled or failed:', error);
                  }
                } else {
                  // Fallback: copy URL to clipboard
                  const url = typeof window !== 'undefined' ? window.location.href : '';
                  navigator.clipboard.writeText(url).then(() => {
                    alert('Link copied to clipboard!');
                  });
                }
              }}
              className="flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all transform hover:scale-110 bg-gray-100 text-gray-400 hover:bg-purple-50 hover:text-purple-600"
              title={isUrdu ? "اس مضمون کو شیئر کریں" : "Share this article"}
            >
              <Share2 size={16} />
              <span>{isUrdu ? "شیئر" : "Share"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      {showCommentSection && (
        <section className="max-w-4xl mx-auto px-6 py-12 border-b border-zinc-200">
          <h3 className="text-2xl font-bold mb-6">{isUrdu ? `تبصرے (${comments.length})` : `Comments (${comments.length})`}</h3>
          
          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mb-8 p-4 bg-zinc-50 rounded-lg animate-fadeInUp" style={{animationDelay: "0.5s"}}>
            <div className="space-y-3">
              <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-zinc-700">
                  <span className="text-zinc-600 font-medium">{isUrdu ? "تبصرہ کر رہے ہیں:" : "Commenting as: "}</span>
                  <span className="font-bold text-green-700">{user?.name || "Anonymous"}</span>
                </p>
              </div>
              <textarea
                placeholder={isUrdu ? "اپنے خیالات شیئر کریں..." : "Share your thoughts..."}
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
    </>
  );
}
