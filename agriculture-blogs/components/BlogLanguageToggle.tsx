"use client";

import { Globe } from "lucide-react";
import { useState, useMemo, useCallback, ReactNode } from "react";
import React from "react";
import BlogImage from "./BlogImage";
import TrendingArticles from "./TrendingArticles";

interface BlogContent {
  _id: string;
  slug: string;
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
}

// Memoized header component to prevent re-renders
const BlogHeader = React.memo(function BlogHeader({ 
  blog, 
  isUrdu, 
  onToggleLanguage 
}: { 
  blog: BlogContent; 
  isUrdu: boolean; 
  onToggleLanguage: () => void;
}) {
  return (
    <header className="max-w-4xl mx-auto px-6 py-8" style={{}}>
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold hover-lift">
            {blog?.category}
          </span>
          <button
            onClick={onToggleLanguage}
            className={`flex items-center gap-2 px-4 py-2 border-none cursor-pointer rounded-full hover:shadow-md text-sm font-bold transition-all ${
              isUrdu ? 'bg-green-100 text-green-700' : 'bg-green-100 text-green-700'
            }`}
          >
            <Globe size={16} />
            {isUrdu ? "English" : "اردو"}
          </button>
        </div>
        <h1 dir="auto" className="text-3xl font-bold leading-tight mb-4 text-zinc-900 hover-lift transition-transform duration-300">
          {isUrdu ? blog?.titleUrdu || blog?.title : blog?.title}
        </h1>
        <div className="flex items-center gap-4 text-zinc-600 text-sm" style={{}}>
          <span>By {blog?.author}</span>
          <span>•</span>
          <span>
            {blog?.createdAt &&
              new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
          </span>
        </div>
      </div>
      <BlogImage src={blog?.image} alt={blog?.title} title={blog?.title} />
    </header>
  );
}, (prevProps, nextProps) => {
  // Memoization: re-render only if blog data or isUrdu actually changes
  return (
    prevProps.blog?._id === nextProps.blog?._id &&
    prevProps.blog?.image === nextProps.blog?.image &&
    prevProps.blog?.title === nextProps.blog?.title &&
    prevProps.isUrdu === nextProps.isUrdu
  );
});

BlogHeader.displayName = "BlogHeader";

BlogHeader.displayName = "BlogHeader";

// Memoized sidebar component
const RelatedArticlesSidebar = React.memo(function RelatedArticlesSidebar({ 
  relatedBlogs, 
  isUrdu 
}: { 
  relatedBlogs: BlogContent[]; 
  isUrdu: boolean;
}) {
  return (
    <aside className="lg:col-span-1 pl-4">
      <div className="sticky top-8">
        <div className="border border-zinc-200 rounded-xl p-4 bg-zinc-50">
          <h3 className="text-base font-bold mb-4 text-zinc-900">
            {isUrdu ? "متعلقہ مضامین" : "Related Articles"}
          </h3>
          {relatedBlogs && relatedBlogs.length > 0 ? (
            <div className="space-y-3">
              {relatedBlogs.map((relatedBlog, idx) => (
                <a
                  key={idx}
                  href={`/blogs/${relatedBlog.slug}`}
                  className="block p-3 bg-white rounded-lg border border-zinc-200 hover:border-green-500 hover:shadow-md transition group"
                >
                  <div className="flex gap-2">
                    {relatedBlog.image && (
                      <img
                        src={relatedBlog.image}
                        alt={relatedBlog.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-zinc-900 line-clamp-2 group-hover:text-green-600 transition">
                        {isUrdu ? relatedBlog.titleUrdu || relatedBlog.title : relatedBlog.title}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1">{relatedBlog.category}</p>
                      <p className="text-xs text-zinc-400 mt-1">
                        {relatedBlog.createdAt && new Date(relatedBlog.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-xs text-center py-3">
              {isUrdu ? "کوئی متعلقہ مضامین نہیں ملے" : "Related articles will be loaded here"}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
});

RelatedArticlesSidebar.displayName = "RelatedArticlesSidebar";

interface BlogLanguageToggleProps {
  blog: BlogContent;
  relatedBlogs?: BlogContent[];
  trendingBlogs?: BlogContent[];
  children: ReactNode;
}

export default function BlogLanguageToggle({ 
  blog, 
  relatedBlogs = [], 
  trendingBlogs = [], 
  children 
}: BlogLanguageToggleProps) {
  // Read language preference from localStorage, default to Urdu
  const [isUrdu, setIsUrdu] = useState(() => {
    if (typeof window !== 'undefined') {
      const preference = localStorage.getItem('blogLanguagePreference');
      return preference === 'english' ? false : true;
    }
    return true;
  });

  const handleToggleLanguage = useCallback(() => {
    setIsUrdu(prev => {
      const newValue = !prev;
      if (newValue) {
        document.documentElement.dir = "rtl";
      } else {
        document.documentElement.dir = "ltr";
      }
      return newValue;
    });
  }, []);

  // Memoize children with isUrdu prop to prevent unnecessary re-renders
  const childrenWithProps = useMemo(() => {
    if (React.isValidElement(children)) {
      return React.cloneElement(children, { isUrdu } as any);
    }
    return children;
  }, [children, isUrdu]);

  return (
    <>
      <style>{`
        .urdu-mode {
          direction: rtl;
          text-align: right;
        }
        .english-mode {
          direction: ltr;
          text-align: left;
        }
      `}</style>

      {/* Blog Content - Dynamic based on language */}
      <div className={isUrdu ? "urdu-mode" : "english-mode"}>
        <BlogHeader blog={blog} isUrdu={isUrdu} onToggleLanguage={handleToggleLanguage} />

        {/* Blog Content with Sidebar */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content - Left Side (3 columns) */}
            <article className={`lg:col-span-3 ${isUrdu ? 'pr-[60px]' : 'pl-[60px]'}`}>
              <div
                dir={isUrdu ? "rtl" : "ltr"}
                className={`blog-content text-gray-700 leading-relaxed ${isUrdu ? 'urdu-text-style' : 'english-text-style'}`}
                dangerouslySetInnerHTML={{
                  __html: isUrdu ? blog?.contentUrdu || blog?.content || "" : blog?.content || "",
                }}
              />
            </article>

            {/* Related Articles Sidebar */}
            <RelatedArticlesSidebar relatedBlogs={relatedBlogs} isUrdu={isUrdu} />
          </div>
        </div>

        {/* Render the rest of the blog content with isUrdu prop */}
        {childrenWithProps}

        {/* Trending Articles Section */}
        <TrendingArticles trendingBlogs={trendingBlogs} isUrdu={isUrdu} limit={3} />
      </div>
    </>
  );
}
