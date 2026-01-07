"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const BlogPost = () => {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id;

  // Sample blog data
  const blogs = {
    1: {
      id: 1,
      title: "Delivery is reschedule for the next available time slot.",
      author: "John Farmer",
      date: "January 7, 2026",
      category: "Agriculture",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200",
      content: `
        <h2 class="text-2xl font-bold mt-6 mb-4">Understanding Modern Delivery Systems</h2>
        <p class="mb-4">In today's fast-paced agricultural industry, efficient delivery systems are crucial for success. When deliveries need to be rescheduled, it's important to have a clear understanding of the timeline and process involved.</p>
        
        <h3 class="text-xl font-bold mt-6 mb-3">Why Rescheduling Happens</h3>
        <p class="mb-4">Rescheduling deliveries is a common occurrence in agriculture. Weather conditions, equipment availability, and seasonal variations can all impact the timing of deliveries. Understanding these factors helps farmers and businesses plan better.</p>
        
        <h3 class="text-xl font-bold mt-6 mb-3">Best Practices for Managing Schedules</h3>
        <p class="mb-4">To ensure smooth operations, it's recommended to:</p>
        <ul class="list-disc list-inside mb-4 space-y-2">
          <li>Keep detailed records of all scheduled deliveries</li>
          <li>Communicate promptly with all stakeholders</li>
          <li>Have backup plans for critical deliveries</li>
          <li>Use technology to track and manage schedules</li>
          <li>Build flexibility into your planning</li>
        </ul>
        
        <h3 class="text-xl font-bold mt-6 mb-3">Conclusion</h3>
        <p class="mb-4">Effective delivery management is essential for agricultural success. By understanding scheduling challenges and implementing best practices, businesses can minimize disruptions and maintain customer satisfaction even when rescheduling becomes necessary.</p>
      `
    },
    2: {
      id: 2,
      title: "Sustainable farming practices for modern agriculture.",
      author: "Sarah Green",
      date: "January 6, 2026",
      category: "Sustainability",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad576?auto=format&fit=crop&q=80&w=1200",
      content: `
        <h2 class="text-2xl font-bold mt-6 mb-4">The Path to Sustainable Agriculture</h2>
        <p class="mb-4">Sustainable farming is no longer a luxury but a necessity in modern agriculture. As climate change and resource scarcity become more pressing, farmers worldwide are adopting practices that balance productivity with environmental stewardship.</p>
        
        <h3 class="text-xl font-bold mt-6 mb-3">Key Sustainable Practices</h3>
        <p class="mb-4">Several proven practices have emerged as leaders in sustainable farming:</p>
        <ul class="list-disc list-inside mb-4 space-y-2">
          <li>Crop rotation to maintain soil health</li>
          <li>Organic pest management methods</li>
          <li>Water conservation techniques</li>
          <li>Renewable energy integration</li>
          <li>Agroforestry systems</li>
        </ul>
        
        <h3 class="text-xl font-bold mt-6 mb-3">Benefits for Farmers</h3>
        <p class="mb-4">Beyond environmental benefits, sustainable practices offer economic advantages. Reduced chemical costs, improved soil fertility, and access to premium markets make these practices financially viable for farmers of all sizes.</p>
        
        <h3 class="text-xl font-bold mt-6 mb-3">The Future</h3>
        <p class="mb-4">As consumer demand for sustainable products grows and regulations tighten, adoption of these practices will only accelerate. Early adopters gain a competitive advantage in an increasingly conscious market.</p>
      `
    },
    3: {
      id: 3,
      title: "The future of organic farming in developing nations.",
      author: "Michael Kumar",
      date: "January 5, 2026",
      category: "Global Development",
      image: "https://images.unsplash.com/photo-1574943320219-553eb2f72db0?auto=format&fit=crop&q=80&w=1200",
      content: `
        <h2 class="text-2xl font-bold mt-6 mb-4">Organic Farming: A Growth Opportunity</h2>
        <p class="mb-4">Developing nations are experiencing a surge in organic farming adoption. With growing global demand for organic products and international support for sustainable practices, farmers in these regions have unprecedented opportunities to transform their livelihoods.</p>
        
        <h3 class="text-xl font-bold mt-6 mb-3">Current State of Organic Farming</h3>
        <p class="mb-4">Several developing nations have made significant strides in organic production, creating export opportunities that generate substantial income. Countries like India, Kenya, and Brazil have become major organic producers, benefiting both farmers and the environment.</p>
        
        <h3 class="text-xl font-bold mt-6 mb-3">Challenges and Solutions</h3>
        <p class="mb-4">While opportunities are abundant, challenges remain:</p>
        <ul class="list-disc list-inside mb-4 space-y-2">
          <li><strong>Certification Costs:</strong> International support programs are reducing barriers</li>
          <li><strong>Training:</strong> NGOs and governments provide education</li>
          <li><strong>Market Access:</strong> Digital platforms connect farmers to buyers</li>
          <li><strong>Capital:</strong> Microfinance initiatives support farmers</li>
        </ul>
        
        <h3 class="text-xl font-bold mt-6 mb-3">Vision for Tomorrow</h3>
        <p class="mb-4">With proper support and investment, organic farming can become the dominant agricultural model in developing nations, creating prosperous rural communities while preserving natural resources for future generations.</p>
      `
    }
  };

  const blog = blogs[blogId as keyof typeof blogs];

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
            <span>{blog.date}</span>
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
            <Facebook size={20} />
          </button>
          <button className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition">
            <Twitter size={20} />
          </button>
          <button className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition">
            <Instagram size={20} />
          </button>
          <button className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition">
            <Linkedin size={20} />
          </button>
        </div>
      </section>

      {/* Related Articles Section */}
      <section className="max-w-4xl mx-auto px-6 py-12 border-t border-zinc-200">
        <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.values(blogs).filter((b) => b.id !== blog.id).slice(0, 2).map((relatedBlog) => (
            <div
              key={relatedBlog.id}
              className="group cursor-pointer border border-zinc-200 rounded-lg overflow-hidden hover:shadow-lg transition"
              onClick={() => router.push(`/blogs/${relatedBlog.id}`)}
            >
              <img
                src={relatedBlog.image}
                alt={relatedBlog.title}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="p-4">
                <h4 className="font-bold text-lg mb-2 group-hover:text-green-600 transition">
                  {relatedBlog.title}
                </h4>
                <p className="text-zinc-600 text-sm">{relatedBlog.date}</p>
              </div>
            </div>
          ))}
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
