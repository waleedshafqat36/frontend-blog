"use client";

import { Globe } from "lucide-react";
import { useState } from "react";
import React from "react";
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

export default function BlogLanguageToggle({ blog, relatedBlogs = [], trendingBlogs = [], children }: { blog: BlogContent; relatedBlogs?: BlogContent[]; trendingBlogs?: BlogContent[]; children: React.ReactNode }) {
  const [isUrdu, setIsUrdu] = useState(false);

  const handleToggleLanguage = () => {
    setIsUrdu(!isUrdu);
    if (!isUrdu) {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  };

  // Clone children with isUrdu prop
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { isUrdu } as any);
    }
    return child;
  });

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
        {/* Blog Header */}
        <header className="max-w-4xl mx-auto px-6 py-8 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
          <div className="mb-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold hover-lift">
                {blog?.category}
              </span>
              <button
                onClick={handleToggleLanguage}
                className={`flex items-center gap-2 px-4 py-2 border-none cursor-pointer rounded-full hover:shadow-md text-sm font-bold transition-all ${
                  isUrdu ? 'bg-green-100 text-green-700' : 'bg-green-100 text-green-700'
                }`}
              >
                <Globe size={16} />
                {isUrdu ? "English" : "اردو"}
              </button>
            </div>
            <h1 dir="auto" className="text-5xl font-bold leading-tight mb-4 text-zinc-900 hover-lift transition-transform duration-300">
              {isUrdu ? blog?.titleUrdu || blog?.title : blog?.title}
            </h1>
            <div className="flex items-center gap-4 text-zinc-600 text-sm animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
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
          <img
            src={blog?.image}
            alt={blog?.title}
            className="w-full h-125 object-cover rounded-2xl shadow-lg animate-fadeInUp hover-lift"
            style={{ animationDelay: "0.3s" }}
          />
        </header>

        {/* Blog Content with Sidebar */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content - Left Side (3 columns) */}
            <article className={`lg:col-span-3 pl-15 ${isUrdu ? 'urdu-mode' : 'english-mode'}`}>
              <div
                dir={isUrdu ? "rtl" : "ltr"}
                className={`blog-content text-gray-700 leading-relaxed ${isUrdu ? 'urdu-text-style' : 'english-text-style'}`}
                dangerouslySetInnerHTML={{
                  __html: isUrdu ? blog?.contentUrdu || blog?.content || "" : blog?.content || "",
                }}
              />
            </article>

            {/* Related Articles Sidebar - Right Side (1 column) */}
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
                                {relatedBlog.createdAt && new Date(relatedBlog.createdAt).toLocaleDateString()}
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
          </div>
        </div>

        {/* Render the rest of the blog content */}
        {childrenWithProps}

        {/* Trending Articles Section */}
        <TrendingArticles trendingBlogs={trendingBlogs} isUrdu={isUrdu} />
      </div>
    </>
  );
}
