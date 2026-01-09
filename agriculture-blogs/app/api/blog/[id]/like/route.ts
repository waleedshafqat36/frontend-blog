import ConnectDB from "@/lib/db";
import Blog from "@/models/blog";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId, action } = await req.json(); // action: "like" or "dislike"

    if (!userId || !action) {
      return NextResponse.json(
        { message: "userId and action are required" },
        { status: 400 }
      );
    }

    await ConnectDB();

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    // Remove user from opposite reaction
    if (action === "like") {
      blog.likes = blog.likes || [];
      blog.dislikes = blog.dislikes || [];

      // Remove from dislikes if exists
      blog.dislikes = blog.dislikes.filter((dislike: string) => dislike !== userId);

      // Add to likes if not already there
      if (!blog.likes.includes(userId)) {
        blog.likes.push(userId);
      } else {
        // Toggle: remove if already liked
        blog.likes = blog.likes.filter((like: string) => like !== userId);
      }
    } else if (action === "dislike") {
      blog.likes = blog.likes || [];
      blog.dislikes = blog.dislikes || [];

      // Remove from likes if exists
      blog.likes = blog.likes.filter((like: string) => like !== userId);

      // Add to dislikes if not already there
      if (!blog.dislikes.includes(userId)) {
        blog.dislikes.push(userId);
      } else {
        // Toggle: remove if already disliked
        blog.dislikes = blog.dislikes.filter((dislike: string) => dislike !== userId);
      }
    }

    await blog.save();

    return NextResponse.json(
      {
        success: true,
        likes: blog.likes.length,
        dislikes: blog.dislikes.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
