import ConnectDB from "@/lib/db";
import Blog from "@/models/blog";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Latest Next.js mein params ko await karna zaroori hai
    const { id } = await params; 
    
    await ConnectDB();
    
    const detailsBlog = await Blog.findById(id).lean();

    if (!detailsBlog) {
      console.log("Blog not found for ID:", id); // Server console mein check karein
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, detailsBlog }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 500 });
  }
}

  
