import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../index.css";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Best Lake View Resort in Lonavala | Pawna Lake Camping Nirwana Stays",
  description: "Stay at Nirwana Stays – the best lake view resort and hotel in Lonavala, Maharashtra. Enjoy Pawna Lake camping, glamping, and nature stays all year round.",
  keywords: "Pawna Lake camping, luxury camping resort, glamping Maharashtra, cottage booking, villa rental, adventure activities, lakeside accommodation, nature retreat",
  authors: [{ name: "Nirwana Stays" }],
  icons: {
    icon: [
      { url: "/logo-light.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-light.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/logo-light.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/logo-light.png",
  },
  openGraph: {
    type: "website",
    url: "https://nirwanastays.com/",
    title: "Best Lake View Resort in Lonavala | Pawna Lake Camping Nirwana Stays",
    description: "Stay at Nirwana Stays – the best lake view resort and hotel in Lonavala, Maharashtra. Enjoy Pawna Lake camping, glamping, and nature stays all year round.",
    siteName: "Nirwana Stays",
    locale: "en_IN",
    images: [
      {
        url: "https://nirwanastays.com/og-image.jpg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@nirwanastays", // Assuming this handle or just keeping structure
    title: "Best Lake View Resort in Lonavala | Pawna Lake Camping Nirwana Stays",
    description: "Stay at Nirwana Stays – the best lake view resort and hotel in Lonavala, Maharashtra. Enjoy Pawna Lake camping, glamping, and nature stays all year round.",
    images: ["https://nirwanastays.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://nirwanastays.com/",
  },
  other: {
    "geo.region": "IN-MH",
    "geo.placename": "Lonavala",
    "geo.position": "18.7604;73.4070",
    "ICBM": "18.7604, 73.4070",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Fonts for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <meta name="theme-color" content="#10b981" />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}

