"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useEffect, useState } from "react";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { BsInstagram, BsTwitter } from "react-icons/bs";

const BlogPost = () => {
  const router = useRouter();
  const [blog, setBlog] = useState(null); // Initial state null rakhein
  const [relatedBlogs, setRelatedBlogs] = useState([]); // Related blogs ke liye alag state
  const params = useParams();
  const blogId = params.id;

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await fetch(`/api/blog/${blogId}`);
        const data = await response.json();
        if (response.ok) {
          setBlog(data.detailsBlog);
          
          // --- Related blogs fetch karein (Category ke base par) ---
          fetchRelated(data.detailsBlog.category, blogId);
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    };

    const fetchRelated = async (category, currentId) => {
        try {
            // Aapka existing GET /api/blog use kar sakte hain ya naya filter wala endpoint
            const res = await fetch(`/api/blog`); 
            const data = await res.json();
            if (res.ok) {
                // Current blog ko hata kar baki filter karein
                const filtered = data.blogs.filter(b => b._id !== currentId && b.category === category);
                setRelatedBlogs(filtered.slice(0, 3));
            }
        } catch (err) {
            console.log("Related fetch error", err);
        }
    }

    if (blogId) fetchBlogDetails();
  }, [blogId]);

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
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition mb-6"
        >
          <ArrowLeft size={20} /> Back to Blogs
        </button>
      </div>

      {/* Blog Header */}
      <header className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
            {blog.category}
          </span>
          <h1 className="text-5xl font-bold leading-tight mb-4">
            {blog.title}
          </h1>
          <div className="flex items-center gap-4 text-zinc-600 text-sm">
            <span>By {blog.author}</span>
            <span>•</span>
            <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}</span>
          </div>
        </div>
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-[500px] object-cover rounded-2xl shadow-lg"
        />
      </header>

      {/* Blog Content */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        <div
          className="prose prose-lg max-w-none text-zinc-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>

      {/* Share Section */}
      <section className="max-w-4xl mx-auto px-6 py-12 border-t border-zinc-200">
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
                onClick={() => router.push(`/blogs/${related._id}`)} // Check karein path blogs hai ya blog
              >
                <img
                  src={related.image}
                  alt={related.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2 group-hover:text-green-600 transition">
                    {related.title}
                  </h4>
                  <p className="text-zinc-600 text-sm">
                    {new Date(related.createdAt).toLocaleDateString()}
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
