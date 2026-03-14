// Predefined SEO configurations for different pages
export const SEOConfigs = {
  home: {
    title: "Best Lake View Resort in Lonavala | Pawna Lake Camping Nirwana Stays",
    description: "Stay at Nirwana Stays – the best lake view resort and hotel in Lonavala, Maharashtra. Enjoy Pawna Lake camping, glamping, and nature stays all year round.",
    keywords: "Pawna Lake camping, luxury camping resort, glamping Maharashtra, cottage booking, villa rental, adventure activities, lakeside accommodation, nature retreat",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "name": "Nirwana Stays",
      "description": "Premier Pawna Lake camping resort offering luxury accommodations and adventure activities",
      "url": "https://nirwanastays.com",
      "telephone": "+91-9021408308",
      "email": "info@nirwanastays.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Pawna Lake",
        "addressLocality": "Lonavala",
        "addressRegion": "Maharashtra",
        "postalCode": "410401",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "18.7604",
        "longitude": "73.4070"
      },
      "image": "https://nirwanastays.com/og-image.jpg",
      "priceRange": "₹₹₹",
      "amenityFeature": [
        "Lakeside Location",
        "Adventure Activities",
        "Bonfire Nights",
        "Water Sports",
        "BBQ & Dining",
        "Music Nights",
        "Stargazing"
      ],
      "starRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      }
    }
  },
  
  about: {
    title: "Pawna Lake Camping & Lake View Resort near Lonavala | Nirwana Stays",
    description: "Nirwana Stays — the best lake view resort and hotel in Lonavala, Maharashtra. Enjoy lakeside glamping, Pawna Lake camping and luxury stays near Pawna Lake",
    keywords: "about Nirwana Stays, Pawna Lake resort story, luxury camping mission, nature retreat history",
    canonical: "https://nirwanastays.com/about",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Nirwana Stays",
      "description": "Learn about Nirwana Stays, the premier Pawna Lake camping resort",
      "url": "https://nirwanastays.com/about"
    }
  },
  
  gallery: {
    title: "Photo Gallery - Nirwana Stays Pawna Lake | Resort Images & Activities",
    description: "Explore our photo gallery showcasing the beauty of Nirwana Stays at Pawna Lake. See our accommodations, activities, and scenic views.",
    keywords: "Nirwana Stays gallery, Pawna Lake photos, resort images, camping photos, accommodation pictures",
    canonical: "https://nirwanastays.com/gallery",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      "name": "Nirwana Stays Gallery",
      "description": "Photo gallery of Nirwana Stays Pawna Lake resort",
      "url": "https://nirwanastays.com/gallery"
    }
  },
  
  accommodation: (accommodation: any) => ({
    title: `${accommodation.name} - ${accommodation.type} at Nirwana Stays Pawna Lake`,
    description: `Book ${accommodation.name} ${accommodation.type} at Nirwana Stays. ${accommodation.description || 'Luxury accommodation with stunning lake views.'}`,
    keywords: `${accommodation.name}, ${accommodation.type} booking, Pawna Lake accommodation, Nirwana Stays ${accommodation.type}`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Accommodation",
      "name": accommodation.name,
      "description": accommodation.description || `Luxury ${accommodation.type} at Nirwana Stays`,
      "url": `https://nirwanastays.com/accommodation/${accommodation.id}`,
      "image": accommodation.image,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Pawna Lake",
        "addressLocality": "Lonavala",
        "addressRegion": "Maharashtra",
        "postalCode": "410401",
        "addressCountry": "IN"
      },
      "priceRange": `₹${accommodation.price}`,
      "amenityFeature": accommodation.inclusions || [],
      "occupancy": {
        "@type": "QuantitativeValue",
        "maxValue": accommodation.max_guest || 4
      }
    }
  })
};
