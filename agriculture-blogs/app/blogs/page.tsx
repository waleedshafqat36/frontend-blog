"use client";

import React, { useEffect, useState } from 'react';
import { Search, Send, ArrowRight, Facebook, Twitter, Instagram, Linkedin, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AgricultureBlog = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const router = useRouter();
  useEffect(() => {
    // Fetch articles from API if needed
      const fetchArticles = async () => {
        // Example fetch call
        const response = await fetch('/api/blog');
        const data = await response.json();
        setArticles(data.blogs);
      };
      fetchArticles();
  }, []);


  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      {/* --- NAVBAR --- */} 
     {/* <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold italic">G</div>
          <span className="text-xl font-bold text-green-700">Agrob</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-600">
        
          <a href="/" className="hover:text-green-600">Home</a>
          <a href="#" className="hover:text-green-600">About</a>
          <a href="#" className="hover:text-green-600">Blogs</a>
          <a href="#" className="hover:text-green-600">Service</a>
           <a href="#" className="hover:text-green-500">Contact</a>
       
        </div>
        <a className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-red-700 duration-500 cursor-pointer transition-all">
        Log out
        </a>
      </nav> */}

      {/* --- HERO SECTION --- */}
      <header className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Sustainable Future <br /> Insights
          </h1>
          <p className="text-zinc-500 text-sm max-w-sm mb-4">
            We share common trends and strategies for improving your understanding and in high demand of science unique trends sources from around the world.
          </p>
          <a href="#" className="text-green-600 text-sm font-bold flex items-center gap-2">
            Learn More <ArrowRight size={16} />
          </a>
        </div>
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1000" 
            alt="Farming rows" 
            className="rounded-3xl shadow-xl w-full h-[400px] object-cover"
          />
        </div>
      </header>

      {/* --- TRENDING ARTICLES --- */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-2">Our Trending Article</h2>
        <p className="text-zinc-400 text-sm mb-12 max-w-2xl">
          
        </p>

        <div className="grid md:grid-cols-4 gap-8">
          {articles.map((article, index) => (
            <div key={index} className="group cursor-pointer"  onClick={() => router.push(`/blogs/${article._id}`)}>
              <div className="overflow-hidden rounded-2xl mb-4 ">
                <img 
                  src={article.image} 
                  alt="Agriculture" 
                  className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-lg mb-2 leading-tight">
                {article.title}
              </h3>
              <p className="text-zinc-500 text-xs mb-4">
                {article.content}
              </p>
              <div className="flex items-center justify-between gap-4">
                <button
                 
                  className="text-xs font-bold text-green-600 flex items-center gap-1 hover:text-green-700 transition"
                >
                   Learn More <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center text-[10px]">✓</div>
                </button>
                <button
               
                  className="text-xs font-bold  hover:text-white transition px-3 py-2 cursor-pointer bg-green-500 rounded-lg"
                >
                  Blog
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#1a1f24] text-white pt-16 pb-8 px-6">
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
          <div className="md:col-span-2">
            <h4 className="font-bold mb-6">Newsletter</h4>
            <div className="relative max-w-md">
              <input 
                type="text" 
                placeholder="email@example.com" 
                className="w-full bg-zinc-800 border-none rounded-full py-4 px-6 text-sm outline-none"
              />
              <button className="absolute right-2 top-2 bg-green-600 p-2 rounded-full hover:bg-green-700 transition-all">
                <Send size={18} />
              </button>
            </div>
            <div className="flex gap-4 mt-8">
              <Facebook size={20} className="text-zinc-400 hover:text-white cursor-pointer" />
              <Twitter size={20} className="text-zinc-400 hover:text-white cursor-pointer" />
              <Instagram size={20} className="text-zinc-400 hover:text-white cursor-pointer" />
              <Linkedin size={20} className="text-zinc-400 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
        <p className="text-center text-zinc-600 text-xs mt-8">© 2026 Agrob. All Rights Reserved.</p>
      </footer>

      {/* --- MODAL --- */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-zinc-900">Article Details</h2>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-zinc-500 hover:text-zinc-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <img 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800" 
                alt={selectedArticle.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              
              <h3 className="text-2xl font-bold mb-4 text-zinc-900">
                {selectedArticle.title}
              </h3>
              
              <div className="space-y-4 text-zinc-700 leading-relaxed">
                <p>{selectedArticle.description}</p>
                <p>{selectedArticle.fullContent}</p>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => {
                    setSelectedArticle(null);
                    router.push(`/blogs/${selectedArticle.id}`);
                  }}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  Read Full Article
                </button>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="flex-1 bg-zinc-200 text-zinc-900 py-3 rounded-lg font-bold hover:bg-zinc-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgricultureBlog;