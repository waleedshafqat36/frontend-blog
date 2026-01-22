import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/blog";
import connectDB from "@/lib/db";

interface BlogDocument {
  _id: string;
  slug: string;
  title: string;
  titleUrdu?: string;
  createdAt: string;
  image: string;
  content: string;
  contentUrdu?: string;
  likeCount?: number;
  dislikeCount?: number;
  commentCount?: number;
  shareCount?: number;
  viewCount?: number;
  likedBy?: string[];
  dislikedBy?: string[];
  comments?: any[];
  updatedAt?: string;
}

// Calculate engagement score based on likes and comments only
function calculateEngagementScore(blog: any): number {
  // Simple ranking: Likes + Comments (no other factors)
  const likes = blog.likeCount || 0;
  const comments = blog.commentCount || 0;

  // Weighted score: Likes (2x weight) + Comments (3x weight)
  return likes * 2 + comments * 3;
}

// Calculate growth rate based on recent activity
function calculateGrowthRate(blog: any): number {
  const lastUpdated = blog.updatedAt ? new Date(blog.updatedAt).getTime() : new Date(blog.createdAt).getTime();
  const now = new Date().getTime();
  const hoursAgo = (now - lastUpdated) / (1000 * 60 * 60);

  // Prioritize likes and comments for growth calculation
  // Likes: 5x, Comments: 6x, Shares: 2x
  const engagementGrowth = (blog.likeCount || 0) * 5 + (blog.commentCount || 0) * 6 + (blog.shareCount || 0) * 2;
  
  if (hoursAgo < 1) return engagementGrowth * 2;
  if (hoursAgo < 24) return engagementGrowth * 1.5;
  
  return engagementGrowth * 0.8;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Fetch all blogs with engagement data - explicitly include comments
    const blogs = await Blog.find({}).select('+comments').lean();

    if (!blogs || blogs.length === 0) {
      return NextResponse.json(
        { blogs: [], message: "No blogs found" },
        { status: 200 }
      );
    }

    // Enhance blogs with engagement metrics
    const enrichedBlogs = blogs.map((blog: any) => {
      // Ensure commentCount matches actual comments array
      const actualCommentCount = blog.comments ? blog.comments.length : 0;
      const commentCount = Math.max(blog.commentCount || 0, actualCommentCount);
      
      return {
        ...blog,
        commentCount, // Use the accurate count
        _id: blog._id.toString(),
        engagement: {
          trendScore: calculateEngagementScore({...blog, commentCount}),
          growthRate: calculateGrowthRate({...blog, commentCount}),
          recentViews: blog.viewCount || 0,
          recentLikes: blog.likeCount || 0,
          recentComments: commentCount,
          freshness: Math.max(0, 10 - ((new Date().getTime() - new Date(blog.createdAt).getTime()) / (1000 * 60 * 60 * 24)) * 0.3),
        },
      };
    });

    // Sort by engagement score (highest first)
    const trendingBlogs = enrichedBlogs
      .sort((a: any, b: any) => b.engagement.trendScore - a.engagement.trendScore)
      .slice(0, 12); // Return top 12 trending blogs

    // Cache for 5 minutes (client-side) but allow frequent requests for real-time updates
    const headers = new Headers();
    headers.set("Cache-Control", "public, max-age=300, s-maxage=300");
    headers.set("Content-Type", "application/json");

    return NextResponse.json(
      {
        blogs: trendingBlogs,
        totalBlogs: blogs.length,
        timestamp: new Date().toISOString(),
        message: "Trending blogs fetched successfully",
      },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error fetching trending blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending blogs", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Optional: POST endpoint to update blog metrics (for manual updates)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { blogId, action, value } = await req.json();

    if (!blogId || !action) {
      return NextResponse.json(
        { error: "Missing required fields: blogId, action" },
        { status: 400 }
      );
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    // Update engagement metrics based on action
    switch (action) {
      case "incrementViews":
        blog.viewCount = (blog.viewCount || 0) + 1;
        break;
      case "incrementShares":
        blog.shareCount = (blog.shareCount || 0) + 1;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    blog.updatedAt = new Date();
    await blog.save();

    return NextResponse.json(
      { message: "Blog metrics updated successfully", blog },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating blog metrics:", error);
    return NextResponse.json(
      { error: "Failed to update blog metrics", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
