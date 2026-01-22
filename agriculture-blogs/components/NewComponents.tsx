import React from 'react';
import { ArrowUpRight, Calendar, User, Clock, ChevronRight, Share2, Bookmark, ArrowRight } from 'lucide-react';

const PremiumAgriBlog = ({ articles = [], otherPosts = [], router }) => {
  return (
    <div className="min-h-screen bg-[#F8F9F5] font-sans text-zinc-900 selection:bg-green-200">
      <style>{`
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .premium-card {
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .premium-card:hover {
          transform: translateY(-8px);
        }
        .glass-badge {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>

      {/* --- HERO: EDITORIAL MAGAZINE LAYOUT --- */}
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-12 gap-8 lg:gap-12">
          
          {/* Main Editorial: Left 7 Columns */}
          <div className="col-span-12 lg:col-span-7 group cursor-pointer" onClick={() => router.push(`/blog/${articles[0]?.slug}`)}>
            <div className="relative overflow-hidden rounded-[3.5rem] bg-zinc-200 aspect-[4/5] lg:aspect-auto lg:h-[750px] shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1200" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                alt="Main Feature"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-8 lg:p-20 w-full">
                <div className="flex items-center gap-4 mb-8">
                  <span className="bg-green-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                    Feature Story
                  </span>
                  <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Jan 2026 • 8 Min Read</span>
                </div>
                <h2 className="text-white text-4xl lg:text-7xl font-extrabold leading-[1.05] mb-10 tracking-tighter">
                  Gandum ki Bumper Paidawar: Jadeed Zarai Tareeqay
                </h2>
                <div className="flex items-center gap-6">
                  <button className="bg-white text-black px-10 py-5 rounded-[2rem] font-black flex items-center gap-3 hover:bg-green-600 hover:text-white transition-all duration-500 transform group-hover:translate-x-2 shadow-xl">
                    Explore Details <ArrowRight size={22} />
                  </button>
                  <div className="flex gap-4">
                    <button className="p-5 rounded-[1.5rem] border border-white/20 text-white hover:bg-white/10 backdrop-blur-md transition-all"><Share2 size={22}/></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Bento: Right 5 Columns */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-10">
            <div className="flex items-center justify-between border-b-2 border-zinc-100 pb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Essential Reads</h3>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-green-200"></div>
              </div>
            </div>

            {otherPosts.slice(0, 3).map((post, idx) => (
              <div key={post._id || idx} className="group flex gap-8 items-center premium-card cursor-pointer" onClick={() => router.push(`/blog/${post.slug}`)}>
                <div className="relative shrink-0 w-36 h-36 rounded-[2.5rem] overflow-hidden shadow-xl ring-1 ring-black/5">
                  <img src={post.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef'} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" alt={post.title} />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-green-600 text-[9px] font-black uppercase mb-3 tracking-[0.2em]">{post.category || 'Agronomy'}</span>
                  <h4 className="text-2xl font-extrabold leading-tight text-zinc-800 group-hover:text-green-600 transition-colors line-clamp-2 tracking-tight">
                    {post.title}
                  </h4>
                  <div className="mt-4 flex items-center gap-4 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                    <span className="flex items-center gap-1"><User size={12}/> {post.author}</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> 5m</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Premium Subscription Bento */}
            <div className="mt-auto p-12 rounded-[3.5rem] bg-zinc-900 text-white relative overflow-hidden group/cta cursor-pointer">
               <div className="relative z-10">
                 <h4 className="text-3xl font-extrabold mb-3 tracking-tight">Kissan Insights</h4>
                 <p className="text-zinc-400 text-sm mb-8 font-medium leading-relaxed">Join 10k+ farmers receiving jadeed zarai maharat weekly.</p>
                 <div className="flex gap-3 bg-white/5 p-2 rounded-[2rem] border border-white/10 focus-within:border-green-500 transition-all">
                    <input className="bg-transparent px-6 py-3 text-sm w-full focus:outline-none placeholder:text-zinc-600 font-bold" placeholder="Your farm email" />
                    <button className="bg-green-600 p-4 rounded-full group-hover/cta:rotate-45 transition-transform duration-500"><ArrowUpRight/></button>
                 </div>
               </div>
               {/* Abstract shapes for background */}
               <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-green-600/30 blur-[100px] rounded-full" />
               <div className="absolute -left-10 -top-10 w-32 h-32 bg-green-400/10 blur-[60px] rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* --- LATEST FEED SECTION --- */}
      <section className="bg-white py-32 rounded-t-[6rem] shadow-[0_-50px_100px_-20px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-6">
          <header className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <div className="max-w-2xl">
              <h2 className="text-6xl font-black tracking-tighter mb-6 italic leading-none">Field Intelligence</h2>
              <div className="flex flex-wrap gap-3">
                {['All Reports', 'Livestock', 'Crop Science', 'Agri-Tech', 'Market Rates'].map(cat => (
                  <button key={cat} className="px-8 py-3 rounded-full border border-zinc-100 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-500">{cat}</button>
                ))}
              </div>
            </div>
            <p className="text-zinc-400 max-w-xs text-sm font-medium leading-relaxed border-l-2 border-green-600 pl-6">
              A curated collection of documentation focusing on agricultural breakthroughs and Punjab market trends.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32">
            {articles.map((article, index) => (
              <div key={article._id || index} className="group flex flex-col premium-card cursor-pointer" onClick={() => router.push(`/blog/${article?.slug}`)}>
                <div className="relative aspect-[3/4] rounded-[4rem] overflow-hidden mb-10 shadow-2xl ring-1 ring-black/5">
                  <img src={article?.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[1.5s] ease-out" alt={article.title} />
                  <div className="absolute top-10 left-10">
                     <div className="glass-badge px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white">
                       {article.category || 'Article'}
                     </div>
                  </div>
                </div>
                <div className="flex items-center gap-5 mb-6">
                  <div className="h-[2px] w-12 bg-green-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Winter Edition 2026</span>
                </div>
                <h3 className="text-4xl font-extrabold leading-[1.1] mb-6 group-hover:text-green-600 transition-colors tracking-tighter">
                  {article?.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 mb-10 font-medium italic">
                  "{article.content?.replace(/<[^>]*>/g, '').slice(0, 160)}..."
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-zinc-50 border border-zinc-100 flex items-center justify-center font-black text-zinc-400 text-xs tracking-tighter">
                      {article.author?.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-widest">{article.author}</span>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase">Lead Researcher</span>
                    </div>
                  </div>
                  <button className="w-14 h-14 rounded-full border-2 border-zinc-100 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-all duration-500">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PremiumAgriBlog;