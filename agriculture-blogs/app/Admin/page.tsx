"use client"

import React, { useState, useEffect } from "react"
import { UploadCloud, Send, PencilLine } from "lucide-react"
import { useRouter } from "next/navigation"
import BlogEditor from "@/components/BlogEditor"

const AddBlogForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "Agriculture",
    content: "", // HTML from TipTap
  })
  const [userName, setUserName] = useState<string>("")
const [isUrdu, setIsUrdu] = useState(false);
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Get logged-in user from localStorage or cookies
  useEffect(() => {
    // First try to get from localStorage
    const storedUser = localStorage.getItem('user')
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
    data.append("author", userName) // Author from logged-in user
    data.append("category", formData.category)
    data.append("content", formData.content)
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
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
              <PencilLine className="text-green-400" />
              New Publication
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Fill the details and upload a cover image.
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* LEFT COLUMN */}
            <div className="space-y-6">

              {/* BLOG CONTENT (TipTap) - AT TOP */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Article Body
                </label>

                <BlogEditor
                  value={formData.content}
                  onChange={(html) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: html,
                    }))
                  }
                />
              </div>

              {/* TITLE */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Blog Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-green-500 outline-none font-semibold"
                />
              </div>

              {/* CATEGORY + AUTHOR (ONE LINE) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-green-500 outline-none"
                  >
                    <option value="Agriculture">Agriculture</option>
                    <option value="Agri-Tech">Agri-Tech</option>
                    <option value="Sustainability">Sustainability</option>
                    <option value="Organic Farming">Organic Farming</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Author
                  </label>
                  <div className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center text-slate-700 font-semibold">
                    {userName || "Loading..."}
                  </div>
                </div>
              </div>

            {/* RIGHT COLUMN: IMAGE */}
             <div className="flex flex-col">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2">
                Cover Image
              </label>

              <div className="flex-1 relative group">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setImage(e.target.files[0])
                    }
                  }}
                />

                <div
                  className={`w-full h-full min-h-72 border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center p-10 transition-all ${
                    image
                      ? "border-green-500 bg-green-50"
                      : "border-slate-100 bg-slate-50/50"
                  }`}
                >
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6 text-green-500">
                    <UploadCloud size={40} />
                  </div>

                    <h3 className="text-slate-800 font-bold text-base mb-1">
                      {image ? image.name : "Drag & Drop Image"}
                    </h3>

                    <p className="text-slate-400 text-sm mb-3">
                      PNG, JPG, or GIF (Max 5MB)
                    </p>

                    <span className="px-4 py-1 bg-green-600 text-white rounded-full text-xs font-bold">
                      {image ? "Change File" : "Choose File"}
                    </span>
                  </div>
                </div>
              </div>
            </div> 
             <div className="p-6 border border-green-200 rounded-2xl bg-gradient-to-b from-green-50 to-white shadow-md min-h-[400px] overflow-auto transition-all hover:shadow-xl">
  <h2 className="text-2xl font-bold mb-6 text-green-600 tracking-wide border-b pb-2 border-green-200">
    Live Preview
  </h2>

              <style>{`
                .live-preview h1 {
                  font-size: 2rem;
                  font-weight: bold;
                  margin: 1.5rem 0 1rem 0;
                  color: #1f2937;
                }
                .live-preview h2 {
                  font-size: 1.875rem;
                  font-weight: bold;
                  margin: 1.5rem 0 0.875rem 0;
                  color: #1f2937;
                }
                .live-preview h3 {
                  font-size: 1.5rem;
                  font-weight: bold;
                  margin: 1.25rem 0 0.75rem 0;
                  color: #374151;
                }
                .live-preview h4 {
                  font-size: 1.25rem;
                  font-weight: bold;
                  margin: 1rem 0 0.625rem 0;
                  color: #374151;
                }
                .live-preview h5 {
                  font-size: 1.125rem;
                  font-weight: bold;
                  margin: 0.875rem 0 0.5rem 0;
                  color: #4b5563;
                }
                .live-preview h6 {
                  font-size: 1rem;
                  font-weight: bold;
                  margin: 0.75rem 0 0.5rem 0;
                  color: #4b5563;
                }
                .live-preview p {
                  margin: 0.875rem 0;
                  line-height: 1.6;
                }
                .live-preview ul, .live-preview ol {
                  margin: 1rem 0;
                  padding-left: 2rem;
                }
                .live-preview li {
                  margin: 0.5rem 0;
                  line-height: 1.6;
                }
                .live-preview blockquote {
                  border-left: 4px solid #16a34a;
                  padding-left: 1rem;
                  margin: 1rem 0;
                  color: #4b5563;
                  font-style: italic;
                }
                .live-preview code {
                  background-color: #f3f4f6;
                  padding: 0.2rem 0.4rem;
                  border-radius: 0.25rem;
                  font-family: 'Courier New', monospace;
                  color: #dc2626;
                }
                .live-preview pre {
                  background-color: #1f2937;
                  color: #e5e7eb;
                  padding: 1rem;
                  border-radius: 0.5rem;
                  overflow-x: auto;
                  margin: 1rem 0;
                }
                .live-preview a {
                  color: #16a34a;
                  text-decoration: underline;
                }
                .live-preview a:hover {
                  color: #15803d;
                }
              `}</style>

              <div className={`live-preview prose prose-sm max-w-full transition-all duration-300 ${isUrdu  ? 'urdu-font !text-right'  : '!text-left'
  }`}
  dir={isUrdu ? 'rtl' : 'ltr'}
  style={{
    // Inline style taake koi aur CSS isay rok na sakay
    textAlign: isUrdu ? 'right' : 'left',
    fontFamily: isUrdu ? "'Noto Nastaliq Urdu', serif" : 'inherit',
    lineHeight: isUrdu ? '2.2' : 'normal'
  }}
  dangerouslySetInnerHTML={{ __html: formData.content }}
/>
            </div>
            </div>

          {/* ACTIONS */}
          <div className="mt-12 flex justify-end gap-4 border-t border-slate-100 pt-8">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-3 text-white font-black px-12 py-4 rounded-2xl transition-all ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Publishing..." : "Publish Post"}
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBlogForm
