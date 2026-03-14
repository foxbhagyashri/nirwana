import { AboutPage } from "@/components/AboutPage";
import { SEOConfigs } from "@/utils/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: SEOConfigs.about.title,
    description: SEOConfigs.about.description,
    openGraph: {
        title: SEOConfigs.about.title,
        description: SEOConfigs.about.description,
        url: SEOConfigs.about.canonical,
    },
    alternates: {
        canonical: SEOConfigs.about.canonical,
    }
};

export default function Page() {
  return <AboutPage />;
}

