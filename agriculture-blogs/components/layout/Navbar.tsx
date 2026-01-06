"use client";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold">Agriculture Blogs</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <a href="/" className="hover:text-blue-500">Home</a>
          <a href="/blog" className="hover:text-blue-500">Blog</a>
          <a href="/auth/login" className="hover:text-blue-500">Login</a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)}>
            {open ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white px-6 pb-4 flex flex-col space-y-3">
          <a href="/" className="hover:text-blue-500">Home</a>
          <a href="/blog" className="hover:text-blue-500">Blog</a>
          <a href="/auth/login" className="hover:text-blue-500">Login</a>
        </div>
      )}
    </nav>
  );
}
