import ConnectDB from "@/lib/db";
import Blog from "@/models/blog";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { author, text } = await req.json();

    if (!author || !text) {
      return NextResponse.json(
        { message: "Author and text are required" },
        { status: 400 }
      );
    }

    await ConnectDB();

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    const newComment = {
      _id: new mongoose.Types.ObjectId(),
      author,
      text,
      createdAt: new Date()
    };

    blog.comments = blog.comments || [];
    blog.comments.push(newComment);
    await blog.save();

    return NextResponse.json(
      {
        success: true,
        comment: newComment,
        comments: blog.comments
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

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await ConnectDB();

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        comments: blog.comments || []
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
