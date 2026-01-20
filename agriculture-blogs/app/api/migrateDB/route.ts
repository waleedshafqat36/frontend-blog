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