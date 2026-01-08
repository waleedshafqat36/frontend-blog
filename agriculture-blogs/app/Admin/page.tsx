import React from 'react';
import { UploadCloud, User, Calendar, Tag, FileText, Send, PencilLine, X } from 'lucide-react';

const AddBlogForm = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F1F5F9] p-6 md:p-12">
      
      {/* Main Card */}
      <div className="w-full max-w-6xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden border border-slate-100 flex flex-col">
        
        {/* Header Banner */}
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
              <PencilLine className="text-green-400" /> New Publication
            </h2>
            <p className="text-slate-400 text-xs mt-1">Fill the details and upload a cover image.</p>
          </div>
          <div className="hidden md:block px-4 py-2 bg-white/10 rounded-full border border-white/10 text-xs font-medium">
            Draft Mode Active
          </div>
        </div>

        <form className="p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* LEFT COLUMN: Text Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Blog Title</label>
                <input 
                  type="text" 
                  placeholder="Enter blog title..."
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-green-500 focus:bg-white outline-none transition-all font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Author</label>
                  <input type="text" placeholder="Enter your name" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-green-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                  <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-green-500 outline-none appearance-none">
                    <option>Agriculture</option>
                    <option>Agri-Tech</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Article Body</label>
                <textarea rows={5} placeholder="Start typing..." className="w-full px-6 py-5 rounded-[2rem] bg-slate-50 border border-slate-200 focus:border-green-500 outline-none transition-all resize-none"></textarea>
              </div>
            </div>

            {/* RIGHT COLUMN: File Upload Area */}
            <div className="flex flex-col">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2">Cover Image</label>
              
              <div className="flex-1 relative group">
                <input 
                  type="file" 
                  id="cover-image" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  accept="image/*"
                />
                <div className="w-full h-full min-h-[300px] border-4 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50 flex flex-col items-center justify-center p-10 group-hover:bg-green-50 group-hover:border-green-200 transition-all">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6 text-green-500 group-hover:scale-110 transition-transform duration-500">
                    <UploadCloud size={40} />
                  </div>
                  <h3 className="text-slate-800 font-bold text-lg mb-1">Drag & Drop Image</h3>
                  <p className="text-slate-400 text-sm mb-4 text-center">PNG, JPG, or GIF (Max 5MB)</p>
                  <span className="px-6 py-2 bg-green-600 text-white rounded-full text-xs font-bold shadow-lg shadow-green-200">
                    Choose File
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                <div className="w-2 h-2 mt-1.5 bg-blue-400 rounded-full"></div>
                <p className="text-[11px] text-blue-600 leading-relaxed font-medium">
                  Recommendation: Use a high-quality landscape image (1200x600px) for better display on the blog home page.
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Action Bar */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-end gap-4 border-t border-slate-100 pt-8">
            <button type="button" className="text-slate-400 font-bold px-8 py-4 hover:text-slate-600 transition-all">Cancel</button>
            <button 
              type="submit" 
              className="w-full md:w-auto flex items-center justify-center gap-3 bg-green-600 text-white font-black px-12 py-4 rounded-2xl hover:bg-green-700 shadow-xl shadow-green-200 transition-all active:scale-95"
            >
              Publish Post <Send size={18} />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddBlogForm;