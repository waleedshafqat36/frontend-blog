import ConnectDB from "@/lib/db";
import Blog from "@/models/blog";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id, commentId } = await params;
    const { userId, action } = await req.json();

    if (!userId || !action) {
      return NextResponse.json(
        { message: "User ID and action are required" },
        { status: 400 }
      );
    }

    await ConnectDB();

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    const comment = blog.comments?.find((c: any) => c._id.toString() === commentId);
    if (!comment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }

    // Initialize likes and dislikes arrays if they don't exist
    if (!comment.likes) comment.likes = 0;
    if (!comment.dislikes) comment.dislikes = 0;
    if (!comment.likedBy) comment.likedBy = [];
    if (!comment.dislikedBy) comment.dislikedBy = [];

    if (action === "like") {
      const alreadyLiked = comment.likedBy.includes(userId);
      const alreadyDisliked = comment.dislikedBy.includes(userId);

      if (alreadyLiked) {
        // Remove like
        comment.likedBy = comment.likedBy.filter((id: string) => id !== userId);
        comment.likes = Math.max(0, comment.likes - 1);
      } else {
        // Add like
        comment.likedBy.push(userId);
        comment.likes += 1;

        // Remove dislike if exists
        if (alreadyDisliked) {
          comment.dislikedBy = comment.dislikedBy.filter((id: string) => id !== userId);
          comment.dislikes = Math.max(0, comment.dislikes - 1);
        }
      }
    } else if (action === "dislike") {
      const alreadyLiked = comment.likedBy.includes(userId);
      const alreadyDisliked = comment.dislikedBy.includes(userId);

      if (alreadyDisliked) {
        // Remove dislike
        comment.dislikedBy = comment.dislikedBy.filter((id: string) => id !== userId);
        comment.dislikes = Math.max(0, comment.dislikes - 1);
      } else {
        // Add dislike
        comment.dislikedBy.push(userId);
        comment.dislikes += 1;

        // Remove like if exists
        if (alreadyLiked) {
          comment.likedBy = comment.likedBy.filter((id: string) => id !== userId);
          comment.likes = Math.max(0, comment.likes - 1);
        }
      }
    }

    await blog.save();

    return NextResponse.json(
      {
        success: true,
        likes: comment.likes,
        dislikes: comment.dislikes,
        userLiked: comment.likedBy.includes(userId),
        userDisliked: comment.dislikedBy.includes(userId),
        likedBy: comment.likedBy,
        dislikedBy: comment.dislikedBy,
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
