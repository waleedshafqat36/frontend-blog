// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import BlogPost from '@/components/BlogdetailsServer';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${siteUrl}/api/blog/${slug}`);
  const data = await res.json();
  const blog = data.detailsBlog;

  if (!blog) return { title: "Blog Not Found" };

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
  const {slug} = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${siteUrl}/api/blog/${slug}`);
  const data = await res.json();
  const blog = data.detailsBlog;
  
  return await BlogPost({ blog });
}