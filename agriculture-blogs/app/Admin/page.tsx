"use client"
import React, { useState } from 'react';
import { UploadCloud, Send, PencilLine } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AddBlogForm = () => {
  // 1. State for form fields
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Agriculture',
    content: '',
  });
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 2. Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('author', formData.author);
    data.append('category', formData.category);
    data.append('content', formData.content);
    if (image) data.append('image', image);
  
    

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        // Note: Content-Type header yahan nahi likhna hai!
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
       router.push('/blogs');
        // Form reset logic yahan daal sakte hain
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F1F5F9] p-6 md:p-12">
      <div className="w-full max-w-6xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden border border-slate-100 flex flex-col">
        
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
              <PencilLine className="text-green-400" /> New Publication
            </h2>
            <p className="text-slate-400 text-xs mt-1">Fill the details and upload a cover image.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Blog Title</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter blog title..."
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-green-500 focus:bg-white outline-none transition-all font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Author</label>
                  <input 
                    type="text" 
                    name="author"
                    required
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Enter your name" 
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-green-500 outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-green-500 outline-none appearance-none"
                  >
                    <option value="Agriculture">Agriculture</option>
                    <option value="Agri-Tech">Agri-Tech</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Article Body</label>
                <textarea 
                  name="content"
                  required
                  value={formData.content}
                  onChange={handleChange}
                  rows={5} 
                  placeholder="Start typing..." 
                  className="w-full px-6 py-5 rounded-[2rem] bg-slate-50 border border-slate-200 focus:border-green-500 outline-none transition-all resize-none"
                ></textarea>
              </div>
            </div>

            {/* RIGHT COLUMN: File Upload */}
            <div className="flex flex-col">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2">Cover Image</label>
              <div className="flex-1 relative group">
                <input 
                  type="file" 
                  id="cover-image" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  accept="image/*"
                 onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                       setImage(e.target.files[0]); 
                           }}}   />
                <div className={`w-full h-full min-h-[300px] border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center p-10 transition-all ${image ? 'border-green-500 bg-green-50' : 'border-slate-100 bg-slate-50/50 group-hover:bg-green-50 group-hover:border-green-200'}`}>
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6 text-green-500">
                    <UploadCloud size={40} />
                  </div>
                  <h3 className="text-slate-800 font-bold text-lg mb-1">
                    {image ? image.name : "Drag & Drop Image"}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 text-center">PNG, JPG, or GIF (Max 5MB)</p>
                  <span className="px-6 py-2 bg-green-600 text-white rounded-full text-xs font-bold">
                    {image ? "Change File" : "Choose File"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-end gap-4 border-t border-slate-100 pt-8">
            <a href="/blogs" className="text-slate-400 font-bold px-8 py-4 hover:text-slate-600">Cancel</a>
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full md:w-auto flex items-center justify-center gap-3 text-white font-black px-12 py-4 rounded-2xl shadow-xl transition-all active:scale-95 ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-green-200'}`}
            >
              {loading ? "Publishing..." : "Publish Post"} <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogForm;