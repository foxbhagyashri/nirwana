"use client";
import React, { useState, useMemo } from "react";
import { Calendar, Clock, User, ArrowRight, Tag } from "lucide-react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { useRouter } from "next/navigation";
import Image from "next/image";
import blogsData from "@/data/blogs.json";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
  tags: string[];
}

export function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const router = useRouter();

  // Sort blogs by date (newest first)
  const blogs = useMemo(() => {
    return [...blogsData].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }) as BlogPost[];
  }, []);

  const categories = ["all", ...new Set(blogs.map(blog => blog.category).filter(Boolean))];
  const filteredBlogs = selectedCategory === "all"
    ? blogs
    : blogs.filter(blog => blog.category === selectedCategory);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  const handleNavigate = (section: string) => {
    if (section === "home") router.push("/");
    else if (section === "accommodations") router.push("/#accommodations");
    else if (section === "gallery") router.push("/gallery");
    else if (section === "about") router.push("/about");
    else if (section === "blogs") router.push("/blogs");
    else router.push(`/${section}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation onNavigate={handleNavigate} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 to-emerald-800 text-white py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Our Blogs
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto">
            Discover travel tips, stories, and insights about Pawna Lake camping and nature stays
          </p>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="mb-8 flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          )}

          {/* Blog Grid */}
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No blog posts found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                  onClick={() => router.push(`/blogs/${blog.slug}`)}
                >
                  {/* Blog Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    {blog.image ? (
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                        <Tag className="w-16 h-16 text-white opacity-50" />
                      </div>
                    )}
                  </div>

                  {/* Blog Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    {blog.category && (
                      <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full mb-3">
                        {blog.category}
                      </span>
                    )}

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {blog.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        {blog.author && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{blog.author}</span>
                          </div>
                        )}
                        {blog.date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(blog.date)}</span>
                          </div>
                        )}
                        {blog.readTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{blog.readTime}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Read More */}
                    <button className="flex items-center gap-2 text-emerald-600 font-semibold text-sm hover:gap-3 transition-all group-hover:text-emerald-700">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

