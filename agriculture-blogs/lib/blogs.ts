import ConnectDB from './db';
import Blog from '@/models/blog';

export async function fetchBlogBySlug(slug: string) {
  try {
    await ConnectDB();
    const blog = await Blog.findOne({ slug });
    return blog ? JSON.parse(JSON.stringify(blog)) : null;
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return null;
  }
}

export async function fetchRelatedBlogs(category: string, blogId: string, limit: number = 5) {
  try {
    await ConnectDB();
    const relatedBlogs = await Blog.find({
      category,
      _id: { $ne: blogId }
    })
      .limit(limit)
      .sort({ createdAt: -1 });
    return relatedBlogs.map(blog => JSON.parse(JSON.stringify(blog)));
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    return [];
  }
}

export async function fetchTrendingBlogs(limit: number = 5) {
  try {
    await ConnectDB();
    const trendingBlogs = await Blog.find()
      .limit(limit)
      .sort({ createdAt: -1 });
    return trendingBlogs.map(blog => JSON.parse(JSON.stringify(blog)));
  } catch (error) {
    console.error('Error fetching trending blogs:', error);
    return [];
  }
}
