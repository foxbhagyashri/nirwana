"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ImageData {
  id: number;
  image_url: string;
  alt_text: string;
  category: string;
  width: number;
  height: number;
  created_at: string;
}

export function GalleryPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: ImageData[] }>(
    {}
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const BASE_URL = "https://api.nirwanastays.com";
  // Fetch Images from API
  const router = useRouter();

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/gallery`);
        const fetchedImages: ImageData[] = response.data.images;

        setImages(fetchedImages);

        // Group by category
        const grouped: { [key: string]: ImageData[] } = fetchedImages.reduce(
          (acc, img) => {
            if (!acc[img.category]) acc[img.category] = [];
            acc[img.category].push(img);
            return acc;
          },
          {} as { [key: string]: ImageData[] }
        );

        // Add "all" category
        setCategories({ all: fetchedImages, ...grouped });
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const currentImages = categories[selectedCategory] || [];

  const openImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImage = () => {
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImageIndex === null) return;

    if (direction === "prev") {
      setSelectedImageIndex((prev) =>
        prev === 0 ? currentImages.length - 1 : (prev as number) - 1
      );
    } else {
      setSelectedImageIndex((prev) =>
        prev === currentImages.length - 1 ? 0 : (prev as number) + 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading Gallery...
      </div>
    );
  }

  const handleNavigate = (section: string) => {
    if (section === "home") router.push("/");
    else if (section === "accommodations") router.push("/#accommodations");
    else if (section === "gallery") router.push("/gallery");
    else if (section === "about") router.push("/about");
    else if (section === "blogs") router.push("/blogs");
    else router.push(`/${section}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Navigation onNavigate={handleNavigate} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={
              images[0]?.image_url || "https://via.placeholder.com/1920x1080"
            }
            alt="Gallery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-emerald-700/60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Our Gallery
          </h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up">
            Discover the Beauty and Experiences That Await You
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-white/80 backdrop-blur-sm sticky top-20 z-30 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto pb-4 justify-center">
            {Object.keys(categories).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex-shrink-0 px-8 py-4 rounded-full font-semibold transition-all duration-300 ${selectedCategory === key
                    ? "bg-emerald-500 text-white shadow-xl scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                  }`}
              >
                {key === "all"
                  ? "All Photos"
                  : key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {selectedCategory === "all"
                ? "All Photos"
                : selectedCategory.charAt(0).toUpperCase() +
                selectedCategory.slice(1)}
            </h2>
            <p className="text-gray-600">
              {currentImages.length} photos in this category
            </p>
          </div>

          {/* Masonry Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {currentImages.map((image, index) => (
              <div
                key={image.id}
                className="break-inside-avoid mb-6 group cursor-pointer relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 animate-slide-up"
                onClick={() => openImage(index)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <img
                  src={image.image_url}
                  alt={image.alt_text || `Gallery ${index + 1}`}
                  loading="lazy"
                  className="w-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100">
                    <ZoomIn className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Viewer Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          {/* Close Button */}
          <button
            onClick={closeImage}
            className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={() => navigateImage("prev")}
            className="absolute left-6 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={() => navigateImage("next")}
            className="absolute right-6 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Image */}
          <div className="relative max-w-6xl w-full max-h-[90vh] flex items-center justify-center">
            <img
              src={currentImages[selectedImageIndex].image_url}
              alt={
                currentImages[selectedImageIndex].alt_text ||
                `Gallery ${selectedImageIndex + 1}`
              }
              className="max-w-full max-h-full object-contain rounded-lg"
              loading="lazy"
            />

            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              {selectedImageIndex + 1} / {currentImages.length}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
