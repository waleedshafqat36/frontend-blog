"use client";

import { usePathname } from "next/navigation";
import Navbar from "../components/layout/Navbar";

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/Admin" || pathname === "/auth/login" || pathname === "/auth/register" || pathname.startsWith("/blogs");

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {!hideNavbar && <Navbar />}
        <main className="flex-grow">{children}</main>
        
      </body>
    </html>
  );
}
