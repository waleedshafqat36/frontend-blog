"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Filter, SortAsc } from "lucide-react";
import TrendingArticles from "@/components/TrendingArticles";

interface Blog {
  _id: string;
  slug: string;
  title: string;
  titleUrdu?: string;
  createdAt: string;
  image: string;
  content: string;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  viewCount?: number;
  category?: string;
}

export default function TrendingPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"trend" | "recent" | "views">("trend");
  const [categories, setCategories] = useState<string[]>([]);
  const [isUrdu, setIsUrdu] = useState(false);

  useEffect(() => {
    const fetchTrendingBlogs = async () => {
      try {
        const response = await fetch("/api/blog/trending");
        const data = await response.json();

        if (data.blogs) {
          setBlogs(data.blogs);

          // Extract unique categories
        const uniqueCategories = ["All", ...new Set(data.blogs.map((b: Blog) => b.category || ""))] as string[];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching trending blogs:", error);
      }
    };

    fetchTrendingBlogs();
  }, []);

  useEffect(() => {
    // Filter by category
    let filtered = blogs.filter((blog) =>
      selectedCategory === "All" ? true : blog.category === selectedCategory
    );

    // Sort based on selected option
    if (sortBy === "recent") {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === "views") {
      filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    } else {
      // Default: sort by engagement (trend)
      filtered.sort(
        (a, b) =>
          ((b.likeCount || 0) * 2 + (b.commentCount || 0) * 3) -
          ((a.likeCount || 0) * 2 + (a.commentCount || 0) * 3)
      );
    }

    setFilteredBlogs(filtered);
  }, [blogs, selectedCategory, sortBy]);

  const handleLanguageToggle = () => {
    setIsUrdu(!isUrdu);
    document.documentElement.dir = !isUrdu ? "rtl" : "ltr";
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-white to-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-zinc-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-green-600 animate-bounce" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-zinc-900">
                {isUrdu ? "ٹریندنگ آرٹیکلز" : "Trending Articles"}
              </h1>
              <p className="text-sm text-zinc-600">
                {isUrdu
                  ? "بہترین انگیجمنٹ کے ساتھ"
                  : "Discover articles with fast-growing engagement"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLanguageToggle}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold hover:bg-green-200 transition"
          >
            {isUrdu ? "English" : "اردو"}
          </button>
        </div>
      </header>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          {/* Category Filter */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
              <Filter size={18} />
              {isUrdu ? "زمرہ" : "Category"}:
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full transition font-medium text-sm ${
                    selectedCategory === cat
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
              <SortAsc size={18} />
              {isUrdu ? "ترتیب" : "Sort"}:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "trend" | "recent" | "views")}
              className="px-4 py-2 border border-zinc-300 rounded-lg bg-white hover:border-green-600 focus:border-green-600 focus:outline-none transition font-medium text-sm"
            >
              <option value="trend">{isUrdu ? "ٹریندنگ" : "Trending"}</option>
              <option value="recent">{isUrdu ? "حالیہ" : "Recent"}</option>
              <option value="views">{isUrdu ? "نظریے" : "Most Viewed"}</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-zinc-600 mt-4">
          {isUrdu
            ? `${filteredBlogs.length} مضامین دکھا رہے ہیں`
            : `Showing ${filteredBlogs.length} articles`}
        </p>
      </section>

      {/* Trending Articles Grid */}
      <TrendingArticles
        trendingBlogs={filteredBlogs}
        isUrdu={isUrdu}
        limit={20}
      />

      {/* Footer Message */}
      {filteredBlogs.length === 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="rounded-lg border-2 border-dashed border-zinc-300 p-12">
            <TrendingUp size={48} className="text-zinc-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-900 mb-2">
              {isUrdu ? "کوئی مضامین نہیں ملے" : "No Articles Found"}
            </h3>
            <p className="text-zinc-600">
              {isUrdu
                ? "اس زمرے میں کوئی ٹریندنگ مضامین دستیاب نہیں ہیں"
                : "No trending articles found in this category"}
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
