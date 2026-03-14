import { AccommodationBookingWrapper } from "@/components/AccommodationBookingPage";
import { fetchAccommodations } from "@/data";
import { SEOConfigs } from "@/utils/seo";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }> | { id: string };
};

// Generate static params for all accommodations at build time
export async function generateStaticParams() {
  const accommodations = await fetchAccommodations();
  return accommodations.map((acc) => ({
    id: acc.id.toString(),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Handle both Promise and direct params (Next.js 15+ compatibility)
  const resolvedParams = params instanceof Promise ? await params : params;
  const accommodations = await fetchAccommodations();
  // Normalize ID comparison (handle both string and number IDs)
  const normalizedId = String(resolvedParams.id).trim();
  const accommodation = accommodations.find((acc) => String(acc.id).trim() === normalizedId);

  if (!accommodation) {
    return {
      title: "Accommodation Not Found - Nirwana Stays",
      description: "The requested accommodation could not be found.",
    };
  }

  const seo = SEOConfigs.accommodation(accommodation);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [accommodation.image],
    },
  };
}

export default async function Page({ params }: Props) {
  // Handle both Promise and direct params (Next.js 15+ compatibility)
  const resolvedParams = params instanceof Promise ? await params : params;
  return <AccommodationBookingWrapper id={resolvedParams.id} />;
}
