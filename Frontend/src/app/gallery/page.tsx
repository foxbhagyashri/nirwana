import { GalleryPage } from "@/components/GalleryPage";
import { SEOConfigs } from "@/utils/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: SEOConfigs.gallery.title,
    description: SEOConfigs.gallery.description,
    openGraph: {
        title: SEOConfigs.gallery.title,
        description: SEOConfigs.gallery.description,
        url: SEOConfigs.gallery.canonical,
    },
    alternates: {
        canonical: SEOConfigs.gallery.canonical,
    }
};

export default function Page() {
  return <GalleryPage />;
}

