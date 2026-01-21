import ConnectDB from "@/lib/db";
import Blog from "@/models/blog";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    // Latest Next.js mein params ko await karna zaroori hai
    const { slug } = await params; 
    
    await ConnectDB();
    
    const detailsBlog = await Blog.findOne({$or: [{ slug: slug }, { slugUrdu: slug }]}).lean();
   
    if (!detailsBlog) {
      console.log("❌ DB mein ye slug nahi mila:", slug);
      console.log("Blog not found for ID:", slug); // Server console mein check karein
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    // Ensure commentCount matches actual comments array
    const actualCommentCount = detailsBlog.comments ? detailsBlog.comments.length : 0;
    if (detailsBlog.commentCount !== actualCommentCount) {
      detailsBlog.commentCount = actualCommentCount;
    }

    // Increment viewCount
    try {
      await Blog.updateOne(
        { _id: detailsBlog._id },
        { $inc: { viewCount: 1 } }
      );
    } catch (error) {
      console.error("Error updating viewCount:", error);
      // Continue anyway, don't fail the request
    }

    return NextResponse.json({ success: true, detailsBlog }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 500 });
  }
}
