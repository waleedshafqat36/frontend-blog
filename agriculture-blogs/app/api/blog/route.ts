import cloudinary from "@/lib/cloudinary";
import ConnectDB from "@/lib/db";
import { genSlug, genUrduSlug } from "@/lib/slugGen";
import Blog from "@/models/blog";
import { log } from "console";
import { NextResponse } from "next/server";

//  FETCH ALL BLOGS
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




//  BLOG CREATION WITH IMAGE UPLOAD TO CLOUDINARY
 export async function POST(req: Request) {  
  try {
    const formData = await req.formData();
    const toStr = (key: string) => {
      const v = formData.get(key);
      if (v === null) return '';
      if (typeof v === 'string') return v;
      if (v instanceof File) return '';
      return String(v);
    }

    let title = toStr('title')
    let titleUrdu = toStr('titleUrdu')
    let contentUrdu = toStr('contentUrdu')
    let author = toStr('author')
    let content = toStr('content')
    const file = formData.get("image") as File | null;

    // console.log("Received data:", { title, titleUrdu, author, category, content: content?.slice?.(0,120), contentUrdu: contentUrdu?.slice?.(0,120), fileName: file?.name });

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

    // Normalize inputs
    title = title.trim()
    titleUrdu = titleUrdu.trim()
    author = author.trim()
    content = content || ''
    contentUrdu = contentUrdu || ''

    // Detect Arabic/Urdu characters (covers common Arabic, Urdu ranges)
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/
    // If titleUrdu empty but title contains Arabic script, use it
    if (!titleUrdu && arabicRegex.test(title)) {
      titleUrdu = title
      title = ''
    }
    // If contentUrdu empty but content contains Arabic script, move it
    if (!contentUrdu && content && arabicRegex.test(content)) {
      contentUrdu = content
      content = ''
    }

    // console.log('Storing to DB:', { title: title.slice(0,60), titleUrdu: titleUrdu.slice(0,60), content: content.slice(0,60), contentUrdu: contentUrdu.slice(0,60) });
  // Slug implementation
  const slugSource = title ;
  const slugSourceUrdu = titleUrdu ;

  const newSlug = genSlug(slugSource)
  const urduSlug = genUrduSlug(slugSourceUrdu)
    // 3. Database Entry
    const blog = await Blog.create({
      title,
      slug:newSlug,
      titleUrdu,
      slugUrdu:urduSlug,
      author,
      SubCategory: [],
      content,
      contentUrdu,
      image: uploadResponse.secure_url // Cloudinary link
    });
  console.log("Blog created successfully:", blog);
    return NextResponse.json({ success: true, blog }, { status: 201 }); 

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}