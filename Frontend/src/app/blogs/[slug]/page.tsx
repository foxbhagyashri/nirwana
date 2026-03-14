import { BlogDetailPage } from "@/components/BlogDetailPage";
import { Metadata } from "next";
import blogsDataRaw from "@/data/blogs.json";

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
  content: string; // HTML content as string
  propertyIds?: number[];
  isEmbeddProperties?: boolean;
}

// Type the imported JSON data
const blogsData = blogsDataRaw as unknown as BlogPost[];

function getBlog(slug: string): BlogPost | null {
  return blogsData.find((blog) => blog.slug === slug) || null;
}

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
  return blogsData.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> | { slug: string } 
}): Promise<Metadata> {
  // Handle both Promise and direct params (Next.js 15+ compatibility)
  const resolvedParams = params instanceof Promise ? await params : params;
  const blog = getBlog(resolvedParams.slug);
  
  if (!blog) {
    return {
      title: "Blog Post Not Found | Nirwana Stays",
    };
  }

  return {
    title: `${blog.title} | Nirwana Stays Blog`,
    description: blog.excerpt || "Read our latest blog post about Pawna Lake camping and nature stays.",
    keywords: blog.tags?.join(", ") || "travel blog, Pawna Lake, camping",
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      images: blog.image ? [blog.image] : [],
      publishedTime: blog.date,
      authors: blog.author ? [blog.author] : [],
    },
  };
}

export default async function Page({ 
  params 
}: { 
  params: Promise<{ slug: string }> | { slug: string } 
}) {
  // Handle both Promise and direct params (Next.js 15+ compatibility)
  const resolvedParams = params instanceof Promise ? await params : params;
  return <BlogDetailPage slug={resolvedParams.slug} />;
}

