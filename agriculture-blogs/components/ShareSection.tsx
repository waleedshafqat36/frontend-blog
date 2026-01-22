"use client";

import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { BsTwitter, BsWhatsapp } from "react-icons/bs";
import { useEffect, useState } from "react";

interface ShareSectionProps {
  title: string;
  isUrdu?: boolean;
}

export default function ShareSection({ title, isUrdu = false }: ShareSectionProps) {
 const [mounted, setMounted] = useState(false);

  // Jab component mount ho jaye tab state true karein
  useEffect(() => {
    setMounted(true);
  }, []);

  // Agar component mount nahi hua, toh links ki bajaye loading ya khali div dikhayein
  if (!mounted) return <div className="h-12"></div>;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  return (
    <section className="max-w-4xl mx-auto px-6 py-12 border-b border-zinc-200 mt-0 animate-fadeInUp" style={{animationDelay: "0.6s"}}>
      <h3 className="text-xl font-bold mb-6">{isUrdu ? "اس مضمون کو شیئر کریں" : "Share This Article"}</h3>
      <div className="flex gap-4">
        {/* Facebook */}
        <a 
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition hover-lift shadow-md hover:shadow-lg"
          title={isUrdu ? "فیس بک پر شیئر کریں" : "Share on Facebook"}
        >
          <FaFacebook size={20} />
        </a>

        {/* Twitter (X) */}
        <a 
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition hover-lift shadow-md hover:shadow-lg"
          title={isUrdu ? "ٹوئٹر پر شیئر کریں" : "Share on Twitter"}
        >
          <BsTwitter size={20} />
        </a>

        {/* LinkedIn */}
        <a 
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition hover-lift shadow-md hover:shadow-lg"
          title={isUrdu ? "لنکڈ ان پر شیئر کریں" : "Share on LinkedIn"}
        >
          <FaLinkedin size={20} />
        </a>

        {/* WhatsApp */}
        <a 
          href={`https://wa.me/?text=${encodeURIComponent( currentUrl)}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition hover-lift shadow-md hover:shadow-lg"
          title={isUrdu ? "واٹس ایپ پر شیئر کریں" : "Share on WhatsApp"}
        >
          <BsWhatsapp size={20} />
        </a>
      </div>
    </section>
  );
}
