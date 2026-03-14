import { BlogPage } from "@/components/BlogPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs | Nirwana Stays - Travel Tips & Stories",
  description: "Read our latest blog posts about Pawna Lake camping, travel tips, nature stays, and adventure experiences at Nirwana Stays.",
  keywords: "travel blog, Pawna Lake blog, camping tips, nature stays, travel stories, Maharashtra travel",
  openGraph: {
    title: "Blogs | Nirwana Stays",
    description: "Read our latest blog posts about Pawna Lake camping, travel tips, and nature stays.",
    type: "website",
  },
};

export default function Page() {
  return <BlogPage />;
}

