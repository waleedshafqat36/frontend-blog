import ConnectDB from "@/lib/db";
import Blog from "@/models/blog";
import { findRelatedBlogs } from "@/lib/relevanceMatch";
import { NextResponse } from "next/server";

interface Blog {
  _id: string;
  title: string;
  titleUrdu?: string;
  content: string;
  contentUrdu?: string;
  author?: string;
  [key: string]: any;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const currentBlogId = url.searchParams.get("id");
    const limit = parseInt(url.searchParams.get("limit") || "3");

    if (!currentBlogId) {
      return NextResponse.json(
        { message: "Blog ID is required" },
        { status: 400 }
      );
    }

    await ConnectDB();

    // Fetch current blog
    const currentBlog = await Blog.findById(currentBlogId);
    if (!currentBlog) {
      return NextResponse.json(
        { message: "Blog not found" },
        { status: 404 }
      );
    }

    // Fetch all other blogs
    const allBlogs = await Blog.find({ _id: { $ne: currentBlogId } }).sort({
      createdAt: -1,
    });

    // Find related blogs based on content similarity
    const relatedBlogs = findRelatedBlogs(currentBlog, allBlogs, limit);

    return NextResponse.json(
      {
        success: true,
        blogs: relatedBlogs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
