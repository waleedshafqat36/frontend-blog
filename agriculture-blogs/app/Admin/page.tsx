"use client"

import React, { useState } from "react"
import { UploadCloud, Send, PencilLine } from "lucide-react"
import { useRouter } from "next/navigation"
import BlogEditor from "@/components/BlogEditor"

const AddBlogForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Agriculture",
    content: "", // HTML from TipTap
  })

  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
    data.append("author", formData.author)
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

              {/* AUTHOR + CATEGORY */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    required
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-green-500 outline-none"
                  />
                </div>

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
                  </select>
                </div>
              </div>

              {/* BLOG CONTENT (TipTap) */}
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

                  <h3 className="text-slate-800 font-bold text-lg mb-1">
                    {image ? image.name : "Drag & Drop Image"}
                  </h3>

                  <p className="text-slate-400 text-sm mb-4">
                    PNG, JPG, or GIF (Max 5MB)
                  </p>

                  <span className="px-6 py-2 bg-green-600 text-white rounded-full text-xs font-bold">
                    {image ? "Change File" : "Choose File"}
                  </span>
                </div>
              </div>
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
