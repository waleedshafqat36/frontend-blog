// app/blog/[id]/page.tsx
import { Metadata } from 'next';
//  Aapka wo "use client" wala component
import BlogPost from '@/components/Blogdetails';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  // API se data fetch karein. 
  // Yaad rahe: Server-side par fetch ke liye poora URL dena parta hai (http://localhost:3000 ya domain)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${siteUrl}/api/blog/${slug}`);
  const data = await res.json();
  const blog = data.detailsBlog;

  

  if (!blog) return { title: "Blog Not Found" };

  // HTML content se plain text nikalne ke liye regex (agar content HTML mein hai)
  const plainDescription = blog.content.replace(/<[^>]*>/g, '').substring(0, 160);

  return {
    title: blog.title,
    description: plainDescription,
    openGraph: {
      title: blog.title,
      description: plainDescription,
      url: `${siteUrl}/blog/${slug}`,
      siteName: 'Agrob',
      images: [
        {
          url: blog.image, 
          width: 1200,
          height: 630,
        },
      ],
      type: 'article',
    },
  };
}

export default async function Page({params}: Props) {
  const {slug} = await params
  return <BlogPost slug={slug} />;
}