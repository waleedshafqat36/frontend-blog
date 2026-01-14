"use client";

import { usePathname } from "next/navigation";
import Navbar from "../components/layout/Navbar";
import Script from "next/script"; // 1. Script component import karein

import "./globals.css"; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/Admin" || pathname === "/auth/login" || pathname === "/auth/register" || pathname.startsWith("/blogs");

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {!hideNavbar && <Navbar />} 
        <main className="flex-grow">{children}</main>

        {/* 2. Google Translate Library Load karein */}
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />

        {/* 3. Translate function ko initialize karein */}
       {/* RootLayout.tsx mein is script ko update karein */}
<Script id="google-translate-init" strategy="afterInteractive">
  {`
    function googleTranslateElementInit() {
      new google.translate.TranslateElement({
        pageLanguage: 'en', // Database language English hai to 'en' rakhein
        includedLanguages: 'en,ur',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    }
  `}
</Script>
      </body>
    </html>
  );
}     
 
