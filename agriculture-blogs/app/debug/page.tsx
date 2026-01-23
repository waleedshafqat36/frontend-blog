'use client'

import React, { useEffect, useState } from 'react';

interface Blog {
  _id: string;
  title: string;
  author: string;
  slug: string;
}

export default function DebugPage() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blog');
        const data = await response.json();
        
        if (data.blogs) {
          setBlogs(data.blogs);
        } else {
          setError('No blogs returned from API');
        }
      } catch (err) {
        setError('Error fetching blogs: ' + String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-zinc-900 mb-8">
          Debug Dashboard
        </h1>
        
        {/* Environment Check */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6 border-l-4 border-purple-600">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">
            Environment Configuration
          </h2>
          <div className="bg-slate-100 p-4 rounded font-mono text-sm space-y-2">
            <p>Cloudinary Cloud: <span className={cloudName ? 'text-green-600 font-bold' : 'text-red-600'}>{cloudName || 'NOT SET'}</span></p>
          </div>
        </div>

        {/* Blogs Data Check */}
        <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-green-600">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">
            Blogs Data Status
          </h2>

          {loading && (
            <div className="p-4 bg-blue-50 border border-blue-300 rounded">
              <p className="text-blue-800 font-semibold">⏳ Loading blogs data...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-300 rounded">
              <p className="text-red-800 font-bold">❌ Error: {error}</p>
            </div>
          )}

          {!loading && !error && blogs.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-300 rounded mb-6">
              <p className="text-green-800 font-bold">
                ✓ Successfully fetched {blogs.length} blogs from database
              </p>
            </div>
          )}

          {!loading && !error && blogs.length === 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-300 rounded mb-6">
              <p className="text-yellow-800 font-bold">⚠ No blogs in database yet</p>
              <p className="text-yellow-700 text-sm mt-2">
                Create dummy blogs to test: Visit <a href="/debug/test-dummy-blogs" className="underline text-blue-600 hover:text-blue-800">/debug/test-dummy-blogs</a>
              </p>
            </div>
          )}

          {blogs.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-zinc-900 mb-4">Blogs List ({blogs.length} total)</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {blogs.slice(0, 10).map((blog, idx) => (
                  <div
                    key={blog._id}
                    className="p-4 bg-linear-to-r from-blue-50 to-green-50 rounded border-l-4 border-green-600 hover:shadow-md transition"
                  >
                    <p className="font-bold text-lg text-zinc-900">
                      {idx + 1}. {blog.title}
                    </p>
                    <p className="text-sm text-zinc-600">
                      Author: <span className="font-semibold">{blog.author}</span>
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Slug: <span className="font-mono bg-white px-2 py-1 rounded">{blog.slug}</span>
                    </p>
                  </div>
                ))}
                {blogs.length > 10 && (
                  <p className="text-center text-zinc-600 pt-4">
                    ...and {blogs.length - 10} more blogs
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex gap-4 flex-wrap">
          <a href="/blogs" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
            View Blogs Page
          </a>
          <a href="/debug/test-dummy-blogs" className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition">
            Create Test Blogs
          </a>
          <a href="/Admin" className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition">
            Go to Admin
          </a>
        </div>
      </div>
    </div>
  )

}
