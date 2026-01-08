import cloudinary from "@/lib/cloudinary";
import ConnectDB from "@/lib/db";
import Blog from "@/models/blog";
import { NextResponse } from "next/server";


// export async function POST(req: Request) {  
// try {
//     const formData = await req.formData();
//     const title = formData.get("title") as string;
//     const author = formData.get("author") as string;
//     const category = formData.get("category") as string;
//     const content = formData.get("content") as string;
//     const file = formData.get("image") as File;
//     console.log("Received file:", file); 
//     if (!file) {
//         return NextResponse.json({ message: "Image file is required" }, { status: 400 });
        
//     }
//     await ConnectDB();
   
// const UploadResources = await cloudinary.uploader.upload(file , {
//   resource_type: "auto",
//   folder: "blogs",
// });
//     const blog = await Blog.create({
//         title,
//         author, 
//         category,
//         content,
//         image: UploadResources.secure_url
//     });
//     return NextResponse.json({ success: true, blog }, { status: 201 }); 
// } catch (error) {
//     console.error("Error creating blog:", error);
// }
// } 
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
 export async function POST(req: Request) {  
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const category = formData.get("category") as string;
    const content = formData.get("content") as string;
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ message: "Image is missing" }, { status: 400 });
    }

    await ConnectDB();

    // 1. File ko Buffer mein badlein (Next.js server-side requirement)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Cloudinary Upload Stream (Chunki hamare paas file ka temporary path nahi hai)
    const uploadResponse: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "blogs", resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    // 3. Database Entry
    const blog = await Blog.create({
      title,
      author, 
      category,
      content,
      image: uploadResponse.secure_url // Cloudinary link
    });

    return NextResponse.json({ success: true, blog }, { status: 201 }); 

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}