import React from 'react';
import { Search, Send, ArrowRight, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const AgricultureBlog = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold italic">G</div>
          <span className="text-xl font-bold text-green-700">Agrob</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-600">
          <a href="#" className="hover:text-green-600">Home</a>
          <a href="#" className="hover:text-green-600">About</a>
          <a href="#" className="hover:text-green-600">Service</a>
          <a href="#" className="hover:text-green-600">Blog</a>
        </div>
        <button className="bg-green-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-green-700 transition-all">
          Contact
        </button>
      </nav>


      {/* --- TRENDING ARTICLES --- */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-2">Our Trending Article</h2>
        <p className="text-zinc-400 text-sm mb-12 max-w-2xl">
          Contrary to popular belief, Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="group cursor-pointer">
              <div className="overflow-hidden rounded-2xl mb-4">
                <img 
                  src={`https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600`} 
                  alt="Agriculture" 
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-lg mb-2 leading-tight">
                Delivery is reschedule for the next available time slot.
              </h3>
              <p className="text-zinc-500 text-xs mb-4">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                   Learn More <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center text-[10px]">✓</div>
                </span>
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
    </div>
  );
};

export default AgricultureBlog;