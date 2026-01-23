"use client"

import React, { useState, useEffect } from "react"
import { UploadCloud, Send, PencilLine, User, ChevronDown, ChevronDownCircle, Check, Layout } from "lucide-react"
import { useRouter } from "next/navigation"
import BlogEditor from "@/components/BlogEditor"

const AddBlogForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    author:"  ",
    titleUrdu: "",
    contentUrdu: "", 
    content: "", // HTML from TipTap
  })
  const [user, setUserName] = useState<string>("")
const [isUrdu, setIsUrdu] = useState(false);
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Get logged-in user from localStorage or cookies
  useEffect(() => {
    // First try to get from localStorage
    const storedUser = localStorage.getItem('user')
    // console.log(storedUser);
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUserName(userData.name)
        return
      } catch (error) {
        console.error("Failed to parse user from localStorage", error)
      }
    }

    // Fallback to cookies
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [key, value] = cookie.split("=")
      acc[key] = decodeURIComponent(value)
      return acc
    }, {} as Record<string, string>)

    if (cookies.user) {
      try {
        const userData = JSON.parse(cookies.user)
        setUserName(userData.name)
      } catch (error) {
        console.error("Failed to parse user cookie", error)
      }
    }
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const data = new FormData()
    data.append("title", formData.title)
    data.append("titleUrdu", formData.titleUrdu) // Urdu title same as title for now
    // Ensure Urdu content is sent to `contentUrdu` and English to `content`.
    let englishContent = formData.content || ''
    let urduContent = formData.contentUrdu || ''

    // If editor was left in Urdu mode and englishContent contains the latest text,
    // move it to `contentUrdu` to avoid losing the Urdu content.
    if (isUrdu) {
      if (!urduContent && englishContent) {
        urduContent = englishContent
        englishContent = ''
      }
    } else {
      if (!englishContent && urduContent) {
        englishContent = urduContent
        urduContent = ''
      }
    }

    // Fallback: detect Arabic/Urdu script in the submitted HTML and store accordingly.
    try {
      const arabicScript = /\p{Script=Arabic}/u
      if (englishContent && arabicScript.test(englishContent)) {
        urduContent = englishContent
        englishContent = ''
      }
    } catch (e) {
      // If the environment doesn't support Unicode property escapes, skip detection
    }

    data.append("contentUrdu", urduContent)
    data.append("isUrdu", String(isUrdu))
    data.append("author", formData.author) // Author from logged-in user
    data.append("content", englishContent)
    if (image) data.append("image", image)

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        body: data,
      })

      const result = await response.json()

      if (response.ok) {
        router.push("/blogs")
      } else {
        alert(result.message || "Failed to publish blog")
      }
    } catch (error) {
      console.error("Submit error:", error)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F1F5F9] p-6 md:p-12">
    
      <div className="w-full max-w-6xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden border border-slate-100 flex flex-col">

        {/* HEADER */}
    {/* NEXT-GEN MODERN AGRICULTURE HEADER */}
<div className="relative overflow-hidden bg-gradient-to-br from-[#22c55e] via-[#16a34a] to-[#15803d] p-8 md:p-12 text-white border-b border-white/10 shadow-2xl">
  
  {/* Modern UI Decorations - Animated Blur Circles */}
  <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-yellow-300/20 blur-[100px] animate-pulse"></div>
  <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-900/30 blur-[80px]"></div>

  {/* Thin Decorative Line */}
  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

  <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
    
    {/* Left Side: Brand & Text */}
    <div className="max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
        {/* Logo with Dynamic Ring */}
        <div className="relative group w-fit">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-yellow-400 to-white rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000"></div>
          <div className="relative p-1.5 bg-[#064e3b] rounded-full backdrop-blur-xl shadow-2xl border border-white/20">
            <img 
              src="/images/KissanMarket.jpg" 
              alt="Kissan Market Logo" 
              className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover shadow-lg"
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-sm">
              Kissan <span className="text-yellow-300">Market</span>
            </h2>
            <div className="hidden sm:block h-8 w-[1px] bg-white/20 mx-2"></div>
            <span className="text-xl md:text-2xl font-light text-green-50 tracking-[0.4em] uppercase">Blog</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-yellow-400 animate-ping"></span>
            <span className="text-[10px] md:text-xs font-bold tracking-[2px] uppercase text-green-100/80">
              Community Creator Portal 2.0
            </span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -left-4 top-0 h-full w-1 bg-yellow-400 rounded-full hover:animate-spin"></div>
        <p className="pl-4 text-green-50 text-base md:text-lg leading-relaxed max-w-2xl font-medium">
          "Turn your agricultural wisdom into <span className="text-white border-b-2 border-yellow-400/50">digital harvests</span>. 
          Fill the details and showcase your crops through high-quality visuals."
        </p>
      </div>
    </div>

    {/* Right Side: Modern Floating Card */}
    <div className="w-full lg:w-auto">
      <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center gap-6">
        <div className="flex flex-col items-center border-r border-white/10 pr-6">
          <span className="text-yellow-300 text-2xl font-black">24/7</span>
          <span className="text-[10px] uppercase font-bold tracking-tighter text-green-100">Support</span>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-white italic">"Growing Together"</p>
          <button className="text-[10px] bg-white text-green-700 px-3 py-1 rounded-full font-bold hover:bg-yellow-400 hover:text-green-900 transition-all duration-300 shadow-lg">
             PUBLISH TIPS
          </button>
        </div>
      </div>
    </div>

  </div>
</div>

        {/* FORM */}
      <form onSubmit={handleSubmit} className="p-8 md:p-14 bg-white">
  {/* TOP SECTION: TITLE & LANGUAGE SWITCH */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-slate-100 pb-8">
    <div className="space-y-1">
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">Compose <span className="text-green-600">Article</span></h3>
      <p className="text-slate-400 font-medium">Draft your agricultural insights for the Kissan Market community.</p>
    </div>
    
    {/* Language Indicator Badge */}
    <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
      <button 
        type="button"
        onClick={() => setIsUrdu(false)}
        className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${!isUrdu ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400'}`}
      >ENGLISH</button>
      <button 
        type="button"
        onClick={() => setIsUrdu(true)}
        className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${isUrdu ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400'}`}
      >اردو</button>
    </div>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
    
    {/* LEFT COLUMN: EDITING AREA (Span 8) */}
    <div className="lg:col-span-8 space-y-10">
      
      {/* RICH TEXT EDITOR */}
      <div className="relative group">
        <div className="absolute -top-3 left-6 px-3 bg-white text-[10px] font-black tracking-widest text-green-600 uppercase z-10">
          Main Content Area
        </div>
        <div className="rounded-[2rem] border-2 border-slate-100 focus-within:border-green-500/30 focus-within:ring-[10px] focus-within:ring-green-50 transition-all duration-500 bg-white">
          <BlogEditor
            valueEn={formData.content}
            valueUr={formData.contentUrdu}
            onChangeEn={(html) => setFormData((prev) => ({ ...prev, content: html }))}
            onChangeUr={(html) => setFormData((prev) => ({ ...prev, contentUrdu: html }))}
            isUrdu={isUrdu}
            onIsUrduChange={(next) => setIsUrdu(next)}
          />
        </div>
      </div>

      {/* TITLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="group space-y-3">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-green-600">English Headline</label>
          <input
            type="text"
            name="title"
            placeholder="Focus on a catchy headline..."
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-7 py-5 rounded-[1.5rem] bg-slate-50 border-none focus:bg-white focus:ring-4 focus:ring-green-50 outline-none transition-all font-bold text-slate-800 shadow-inner"
          />
        </div>
        <div className="group space-y-3">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mr-1 text-right block transition-colors group-focus-within:text-green-600">مضمون کا عنوان</label>
          <input
            dir="rtl"
            type="text"
            name="titleUrdu"
            placeholder="اردو میں عنوان لکھیں..."
            required
            value={formData.titleUrdu}
            onChange={handleChange}
            className="w-full px-7 py-5 rounded-[1.5rem] bg-slate-50 border-none focus:bg-white focus:ring-4 focus:ring-green-50 outline-none transition-all font-bold text-slate-800 text-xl shadow-inner"
          />
        </div>
      </div>

      {/* LIVE PREVIEW (Integrated Below Editor) */}
      {/* MODERN LIVE PREVIEW - NEW DESIGN */}
<div className="mt-8 relative group">
  {/* Soft Background Glow */}
  <div className="absolute -inset-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-700"></div>

  <div className="relative bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] overflow-hidden">
    
    {/* PREVIEW BAR */}
    <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
        </div>
        <span className="text-[10px] font-black text-green-400 hover:text-green-600 uppercase tracking-[0.2em]">Device Preview</span>
      </div>
      
      <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-[9px] font-bold text-green-600 uppercase tracking-tighter">Live Sync</span>
      </div>
    </div>

    {/* CONTENT AREA */}
    <div className="p-8 md:p-12 max-h-[500px] overflow-y-auto custom-scrollbar bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:24px_24px]">
      
      {/* Blog Branding In Preview */}
      <div className="mb-8 flex justify-between items-start">
        <div className="space-y-1">
          <h4 className="text-slate-900 italic font-bold text-xl md:text-2xl  leading-tight">
            {formData.title || (isUrdu ? "آپ کا عنوان یہاں نظر آئے گا" : "Your Title Here")}
          </h4>
          <div className="flex items-center italic pl-3 gap-2 text-green-400 text-[11px] font-medium uppercase tracking-widest">
            <span>{formData.author || "Author"}</span>
          </div>
        </div>
        <img src="/images/KissanMarket.jpg" alt="" className="w-10 h-10 rounded-full  greenscale" />
      </div>

      {/* The Actual Content Rendering */}
      <div
        dir={isUrdu ? "rtl" : "ltr"}
        className={`blog-content transition-all duration-500
          ${isUrdu 
            ? 'urdu-text-style text-2xl leading-[2] text-slate-700' 
            : 'english-text-style text-base leading-relaxed text-slate-600'}`}
        dangerouslySetInnerHTML={{ 
          __html: (isUrdu ? formData?.contentUrdu : formData?.content) || 
          `<p class="text-slate-300 italic">${isUrdu ? "مضمون لکھنا شروع کریں..." : "Start writing your article to see the preview..."}</p>` 
        }}
      />

      {/* Bottom Decoration */}
      <div className="mt-12 pt-6 border-t border-slate-50 flex justify-center">
        <span className="text-[10px] font-black text-slate-200 uppercase tracking-[0.4em]">End of Preview</span>
      </div>
    </div>
  </div>
</div>
    </div>

    {/* RIGHT COLUMN: SIDEBAR (Span 4) */}
    <div className="lg:col-span-4 space-y-8">
      
      {/* IMAGE UPLOAD - Ultra Modern */}
      <div className="relative group">
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          onChange={(e) => { if (e.target.files?.[0]) setImage(e.target.files[0]) }}
        />
        <div className={`aspect-square rounded-[3rem] border-4 border-dashed transition-all duration-700 flex flex-col items-center justify-center p-8 text-center
          ${image ? "border-green-500 bg-green-50 shadow-2xl shadow-green-100 scale-[1.02]" : "border-slate-100 bg-slate-50/50 group-hover:bg-slate-50 group-hover:border-green-200"}`}>
          
          <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-6 transition-all duration-500 
            ${image ? "bg-green-600 text-white rotate-12 shadow-xl" : "bg-white text-slate-300 shadow-md group-hover:rotate-6"}`}>
            {image ? <Check size={40} strokeWidth={3} /> : <UploadCloud size={40} />}
          </div>

          <p className="text-slate-800 font-black text-sm uppercase tracking-widest">
            {image ? "Image Selected" : "Cover Media"}
          </p>
          <p className="text-slate-400 text-xs mt-2 font-medium">
            {image ? image.name : "Drag & drop your field photos here"}
          </p>
        </div>
      </div>

      {/* METADATA CARD */}
     <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] space-y-8 relative overflow-hidden group">
  
  {/* Modern Decorative Accent */}
  <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 rounded-full blur-[60px] -mr-10 -mt-10 group-hover:bg-green-100/50 transition-colors duration-700"></div>

  {/* AUTHOR INPUT */}
  <div className="relative z-10 space-y-3">
    <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
      <User size={14} className="text-green-500" /> Author Name
    </label>
    <div className="relative group/input">
      <input
        type="text"
        name="author"
        placeholder="Enter your name"
        required
        value={formData.author}
        onChange={handleChange}
        className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4.5 focus:bg-white focus:ring-4 focus:ring-green-50 focus:border-green-500 outline-none font-bold text-sm text-slate-700 placeholder:text-slate-300 transition-all"
      />
    </div>
  </div>



  {/* PUBLISH BUTTON */}
  <div className="relative z-10 pt-2">
    <button
      type="submit"
      disabled={loading}
      className={`w-full flex items-center justify-center gap-4 text-white font-black py-5 rounded-2xl transition-all duration-300
        ${loading 
          ? "bg-slate-200 cursor-not-allowed text-slate-400" 
          : "bg-green-600 hover:bg-green-700 shadow-xl shadow-green-100 hover:shadow-green-200 hover:-translate-y-1 active:scale-[0.98]"}`}
    >
      <span className="uppercase tracking-widest text-xs">
        {loading ? "Publishing..." : "Finish & Publish"}
      </span>
      {!loading && <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
    </button>
    
    <p className="text-[10px] text-center text-slate-400 font-bold mt-4 uppercase tracking-tighter italic">
      Ready to grow with Kissan Market?
    </p>
  </div>
</div>
    </div>
  </div>
</form>
      </div>
    </div>
  )
}

export default AddBlogForm
