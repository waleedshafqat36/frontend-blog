import { Send } from 'lucide-react'
import React from 'react'
import { BsInstagram, BsTwitter } from 'react-icons/bs'
import { FaFacebook, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#1a1f24] to-[#0d0f12] text-white pt-16 pb-8 px-8 md:px-16 mt-20">
                 <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16 border-b border-zinc-800/50 pb-12">
                   <div className="animate-fadeInUp" style={{ animationDelay: '0s' }}>
                     <h4 className="font-bold mb-6 text-green-400">Company</h4>
                     <ul className="text-zinc-400 text-sm space-y-3">
                       <li className="hover:text-green-400 transition-colors duration-300 cursor-pointer">About Company</li>
                       <li className="hover:text-green-400 transition-colors duration-300 cursor-pointer">Terms of Service</li>
                       <li className="hover:text-green-400 transition-colors duration-300 cursor-pointer">Privacy Policy</li>
                       <li className="hover:text-green-400 transition-colors duration-300 cursor-pointer">Contact Us</li>
                     </ul>
                   </div>
                   <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                     <h4 className="font-bold mb-6 text-green-400">Support</h4>
                     <ul className="text-zinc-400 text-sm space-y-3">
                       <li className="hover:text-green-400 transition-colors duration-300 cursor-pointer">Pricing</li>
                       <li className="hover:text-green-400 transition-colors duration-300 cursor-pointer">Help Center</li>
                       <li className="hover:text-green-400 transition-colors duration-300 cursor-pointer">What's New</li>
                       <li className="hover:text-green-400 transition-colors duration-300 cursor-pointer">Blog</li>
                     </ul>
                   </div>
                   <div className="md:col-span-2 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                     <h4 className="font-bold mb-6 text-green-400">Newsletter</h4>
                     <div className="relative max-w-md group">
                       <input 
                         type="text" 
                         placeholder="email@example.com" 
                         className="w-full bg-zinc-800/50 border border-zinc-700 group-hover:border-green-500 rounded-full py-4 px-6 text-sm outline-none transition-all duration-300 focus:border-green-500 focus:bg-zinc-800"
                       />
                       <button className="absolute right-2 top-2 bg-gradient-to-r from-green-600 to-green-700 p-2 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                         <Send size={18} />
                       </button>
                     </div>
                     <div className="flex gap-4 mt-8">
                       <FaFacebook size={20} className="text-zinc-400 hover:text-green-400 hover:scale-110 cursor-pointer transition-all duration-300" />
                       <BsTwitter size={20} className="text-zinc-400 hover:text-green-400 hover:scale-110 cursor-pointer transition-all duration-300" />
                       <BsInstagram size={20} className="text-zinc-400 hover:text-green-400 hover:scale-110 cursor-pointer transition-all duration-300" />
                       <FaLinkedin size={20} className="text-zinc-400 hover:text-green-400 hover:scale-110 cursor-pointer transition-all duration-300" />
                     </div>
                   </div>
                 </div>
                 <p className="text-center text-zinc-600 text-xs mt-8 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>© 2026 Agrob. All Rights Reserved.</p>
               </footer>
  )
}

export default Footer