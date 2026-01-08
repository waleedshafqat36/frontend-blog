import cloudinary from "@/lib/cloudinary";
import ConnectDB from "@/lib/db";
import Blog from "@/models/blog";
import { NextResponse } from "next/server";


export async function POST(req: Request) {  
try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const category = formData.get("category") as string;
    const content = formData.get("content") as string;
    const file = formData.get("image") as File;
    console.log("Received file:", file);
    if (!file) {
        return NextResponse.json({ message: "Image file is required" }, { status: 400 });
        
    }
    await ConnectDB();
   
const UploadResources = await cloudinary.uploader.upload(file as any, {
  resource_type: "auto",
  folder: "blogs",
});
    const blog = await Blog.create({
        title,
        author, 
        category,
        content,
        image: UploadResources.secure_url
    });
    return NextResponse.json({ success: true, blog }, { status: 201 }); 
} catch (error) {
    console.error("Error creating blog:", error);
}
}
export async function GET() {
    try {
        await ConnectDB();
        const blogs = await Blog.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, blogs }, { status: 200 });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }  
 }