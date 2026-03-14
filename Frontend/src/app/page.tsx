import Home from "@/components/Home";
import { SEOConfigs } from "@/utils/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: SEOConfigs.home.title,
    description: SEOConfigs.home.description,
    keywords: SEOConfigs.home.keywords,
    openGraph: {
        title: SEOConfigs.home.title,
        description: SEOConfigs.home.description,
        // images: [SEOConfigs.home.structuredData.image] // Assuming structure
    }
};

export default function Page() {
  return <Home />;
}
