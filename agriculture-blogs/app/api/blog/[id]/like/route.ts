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

    let updateQuery: any = {};
    let userAlreadyLiked = false;
    let userAlreadyDisliked = false;

    if (action === "like") {
      blog.likedBy = blog.likedBy || [];
      blog.dislikedBy = blog.dislikedBy || [];

      userAlreadyLiked = blog.likedBy.includes(userId);
      userAlreadyDisliked = blog.dislikedBy.includes(userId);

      if (!userAlreadyLiked) {
        // User hasn't liked yet, so add the like
        updateQuery.$inc = { likeCount: 1 };
        updateQuery.$push = { likedBy: userId };

        // If user had disliked before, remove dislike
        if (userAlreadyDisliked) {
          updateQuery.$inc.dislikeCount = -1;
          updateQuery.$pull = { dislikedBy: userId };
        }
      } else {
        // User already liked, so remove the like (toggle)
        updateQuery.$inc = { likeCount: -1 };
        updateQuery.$pull = { likedBy: userId };
      }
    } else if (action === "dislike") {
      blog.likedBy = blog.likedBy || [];
      blog.dislikedBy = blog.dislikedBy || [];

      userAlreadyLiked = blog.likedBy.includes(userId);
      userAlreadyDisliked = blog.dislikedBy.includes(userId);

      if (!userAlreadyDisliked) {
        // User hasn't disliked yet, so add the dislike
        updateQuery.$inc = { dislikeCount: 1 };
        updateQuery.$push = { dislikedBy: userId };

        // If user had liked before, remove like
        if (userAlreadyLiked) {
          updateQuery.$inc.likeCount = -1;
          updateQuery.$pull = { likedBy: userId };
        }
      } else {
        // User already disliked, so remove the dislike (toggle)
        updateQuery.$inc = { dislikeCount: -1 };
        updateQuery.$pull = { dislikedBy: userId };
      }
    }

    // Execute the update with $inc operator
    let updatedBlog = await Blog.findByIdAndUpdate(id, updateQuery, { new: true });

    // Ensure counts never go below 0
    if (updatedBlog) {
      if (!updatedBlog.likeCount || updatedBlog.likeCount < 0) {
        updatedBlog.likeCount = 0;
      }
      if (!updatedBlog.dislikeCount || updatedBlog.dislikeCount < 0) {
        updatedBlog.dislikeCount = 0;
      }
      await updatedBlog.save();
    }

    return NextResponse.json(
      {
        success: true,
        likeCount: updatedBlog?.likeCount || 0,
        dislikeCount: updatedBlog?.dislikeCount || 0,
        userLiked: updatedBlog?.likedBy?.includes(userId) || false,
        userDisliked: updatedBlog?.dislikedBy?.includes(userId) || false,
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
