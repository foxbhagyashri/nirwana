import { KamshetPage } from "@/components/KamshetPage";
import { SEOConfigs } from "@/utils/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
    // title: SEOConfigs.pawana.title,
    // description: SEOConfigs.pawana.description,
    // openGraph: {
    //   title: SEOConfigs.pawana.title,
    //   description: SEOConfigs.pawana.description,
    //   url: SEOConfigs.pawana.canonical,
    // },
    // alternates: {
    //   canonical: SEOConfigs.pawana.canonical,
    // },
};

export default function Page() {
    return <KamshetPage />;
}