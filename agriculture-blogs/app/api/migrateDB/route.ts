import ConnectDB from "@/lib/db";
import { genSlug } from "@/lib/slugGen";
import Blog from "@/models/blog";



export async function GET(){
    await ConnectDB();
    const blogs = await Blog.find({$or:[{slug: { $exists: false }  },{ slug : " " }]})
    const updateAllBlogs = blogs.map(async (blog)=>{
        // Har purana data jis ma slug ni h 
        blog.slug = genSlug(blog.title)
        console.log(`Updating ${blog.slug}`)
        return await blog.save()
    })
    await Promise.all(updateAllBlogs)

    return Response.json({ message: `${blogs.length} blogs updated with slugs!` });

}

export async function POST(){
    await ConnectDB();
    
    // Sync commentCount with actual comments array
    const blogs = await Blog.find({});
    
    const syncPromises = blogs.map(async (blog) => {
        const actualCommentCount = blog.comments ? blog.comments.length : 0;
        if (blog.commentCount !== actualCommentCount) {
            blog.commentCount = actualCommentCount;
            console.log(`Synced ${blog.slug}: commentCount updated to ${actualCommentCount}`);
            return await blog.save();
        }
        return blog;
    });
    
    await Promise.all(syncPromises);
    
    return Response.json({ 
        message: `${blogs.length} blogs synced with correct comment counts!`,
        blogs: blogs.length 
    });
}