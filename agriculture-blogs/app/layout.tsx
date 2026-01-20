"use client";

import { usePathname } from "next/navigation";
import Navbar from "../components/layout/Navbar";
import Script from "next/script"; // 1. Script component import karein

import "./globals.css"; 
import { Send } from "lucide-react";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import Footer from "@/components/layout/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar =  pathname === "/auth/login" || pathname === "/auth/register";
  const hideFooter = pathname === "/Admin" || pathname.startsWith("/blogs");

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {!hideNavbar && <Navbar />} 
        <main className="flex-grow">{children}</main>
        {!hideFooter && <Footer/>   }
      </body>
    </html>
  );
}     

