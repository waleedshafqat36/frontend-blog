import { ThumbsUp, ArrowRight } from "lucide-react";
import BlogInteractiveWrapper from "./BlogInteractiveWrapper";
import BlogLanguageToggle from "./BlogLanguageToggle";
import { ReactNode } from "react";

interface Blog {
  _id: string;
  slug: string;
  slugUrdu?: string;
  title: string;
  titleUrdu?: string;
  category: string;
  author: string;
  createdAt: string;
  image: string;
  content: string;
  contentUrdu?: string;
  likeCount?: number;
  dislikeCount?: number;
  likedBy?: string[];
  dislikedBy?: string[];
  comments?: any[];
  SubCategory?: string[];
}

async function getRelatedBlogs(category: string, currentId: string) {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${siteUrl}/api/blog`);
    const data = await res.json();
    const filtered = data.blogs.filter((b: Blog) => 
      b._id !== currentId && 
      b.category === category
    );
    return filtered.slice(0, 3);
  } catch (err) {
    console.log("Related fetch error", err);
    return [];
  }
}

async function getTrendingBlogs() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${siteUrl}/api/blog/trending`);
    const data = await res.json();
    return data.blogs ? data.blogs.slice(0, 6) : [];
  } catch (err) {
    console.error("Trending fetch error", err);
    return [];
  }
}

export default async function BlogPost({ blog: initialBlog }: { blog: Blog }): Promise<ReactNode> {
  if (!initialBlog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">Blog Not Found</h1>
        </div>
      </div>
    );
  }

  const trendingBlogs = await getTrendingBlogs();
  const relatedBlogs = await getRelatedBlogs(initialBlog.category, initialBlog._id);

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
        .urdu-mode {
          direction: rtl;
          text-align: right;
        }
        .english-mode {
          direction: ltr;
          text-align: left;
        }
      `}</style>

      <BlogLanguageToggle blog={initialBlog} relatedBlogs={relatedBlogs} trendingBlogs={trendingBlogs}>
        {/* Interactive Section (Client Component) */}
        <BlogInteractiveWrapper
          blogId={initialBlog.slug}
          title={initialBlog.title}
          initialLikes={initialBlog.likeCount || 0}
          initialDislikes={initialBlog.dislikeCount || 0}
          initialLikedBy={initialBlog.likedBy || []}
          initialDislikedBy={initialBlog.dislikedBy || []}
          initialComments={initialBlog.comments || []}
        />
      </BlogLanguageToggle>

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
}
