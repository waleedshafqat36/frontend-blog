"use client";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center py-4">
         <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold italic">G</div>
          <span className="text-xl font-bold text-green-700">Agrob</span>
        </div>
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-600">
          <a href="/" className="hover:text-green-600">Home</a>
          <a href="#" className="hover:text-green-600">About</a>
          <a href="/blogs" className="hover:text-green-600">Blogs</a>
          <a href="#" className="hover:text-green-600">Service</a>
           <a href="#" className="hover:text-green-500">Contact</a>
        </div>
           <a href="/auth/login" className="hover:text-white rounded-xl px-3 py-2 bg-red-500">Log out</a>

        {/* Mobile Menu Buttongreen */}
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
          <a href="/blogs" className="hover:text-blue-500">Blog</a>
          <a href="/auth/login" className="hover:text-blue-500">Logout</a>
        </div>
      )}
    </nav>
  );
}
