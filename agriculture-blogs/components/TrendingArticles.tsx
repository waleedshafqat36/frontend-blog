"use client";

import { ArrowRight } from "lucide-react";

interface Blog {
  _id: string;
  slug: string;
  title: string;
  titleUrdu?: string;
  createdAt: string;
  image: string;
  content: string;
  likeCount?: number;
}

interface TrendingArticlesProps {
  trendingBlogs: Blog[];
  isUrdu?: boolean;
}

export default function TrendingArticles({ trendingBlogs, isUrdu = false }: TrendingArticlesProps) {
  if (!trendingBlogs || trendingBlogs.length === 0) {
    return null;
  }

  return (
    <section className="max-w-4xl mx-auto px-6 py-12 border-b border-zinc-200 animate-fadeInUp" style={{animationDelay: "0.7s"}}>
      <h3 className="text-xl font-bold mb-6">{isUrdu ? "ٹریندنگ آرٹیکلز" : "Trending Articles"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trendingBlogs.map((t: Blog, idx: number) => (
          <a
            key={idx}
            href={`/blogs/${t.slug}`}
            className="group cursor-pointer"
          >
            <div className="overflow-hidden rounded-lg mb-4">
              <img 
                src={t.image} 
                alt={t.title} 
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <h4 className="font-bold text-sm mb-2 line-clamp-2 leading-tight group-hover:text-green-600 transition">
              {isUrdu ? t.titleUrdu || t.title : t.title}
            </h4>
            <p className="text-zinc-500 text-xs mb-4 line-clamp-2">
              {t.content ? t.content.replace(/<[^>]*>/g, '').substring(0, 80) + '...' : isUrdu ? 'اس مضمون کے بارے میں مزید پڑھیں' : 'Read more about this article'}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600">
                {t.createdAt && new Date(t.createdAt).toLocaleDateString()}
              </span>
              <span className="text-xs font-bold text-green-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                {isUrdu ? "مزید پڑھیں" : "Learn More"} <ArrowRight size={14} />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
