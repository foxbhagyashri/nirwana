"use client";

import React, { useState, useEffect, useMemo, memo, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useAutoRetry } from "../hooks/useAutoRetry";

// --- TYPE DEFINITIONS ---
export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  avatar: string;
  date?: string;
}

interface ApiTestimonial {
  id: number;
  guestName: string;
  propertyName: string;
  image: string;
  rating: number;
  review: string;
  date: string;
}

// --- OPTIMIZED & REUSABLE SUB-COMPONENTS ---

const ImageLoader = memo(function ImageLoader({ src, alt }: { src: string; alt: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className="relative w-full h-full overflow-hidden rounded-full">
      <img
        src={src}
        alt={`${alt} placeholder`}
        className={`w-full h-full object-cover scale-110 filter blur-md transition-opacity duration-300 ${isLoaded ? "opacity-0" : "opacity-100"}`}
        aria-hidden="true"
      />
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
        onError={(e) => {
          // Fallback in case of an error
          (e.target as HTMLImageElement).src = 'https://i.pravatar.cc/150';
        }}
      />
    </div>
  );
});

const Preloader = memo(function Preloader({ testimonials, currentIndex }: { testimonials: Testimonial[]; currentIndex: number }) {
  if (testimonials.length <= 1) return null;
  const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
  const nextIndex = (currentIndex + 1) % testimonials.length;

  return (
    <div style={{ display: "none" }}>
      <img src={testimonials[nextIndex]?.avatar} alt="Preload next" />
      <img src={testimonials[prevIndex]?.avatar} alt="Preload previous" />
    </div>
  );
});

const TestimonialCard = memo(function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 relative overflow-hidden">
      <div className="absolute top-6 left-6 w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
        <Quote className="w-8 h-8 text-emerald-600" />
      </div>
      <div className="text-center pt-8">
        <div className="flex justify-center mb-6">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
          ))}
        </div>
        <blockquote className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-8 font-light italic">
          "{testimonial.review}"
        </blockquote>
        <div className="flex items-center justify-center space-x-4">
          <div className="w-16 h-16 border-4 border-emerald-100 rounded-full">
            <ImageLoader src={testimonial.avatar} alt={testimonial.name} />
          </div>
          <div className="text-left">
            <p className="font-bold text-lg text-gray-800">{testimonial.name}</p>
            <p className="text-gray-600">{testimonial.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

const SkeletonLoader = () => (
  <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
    <div className="animate-pulse flex flex-col items-center">
      <div className="w-24 h-6 bg-gray-200 rounded-md mb-6"></div>
      <div className="w-full h-8 bg-gray-200 rounded-md mb-4"></div>
      <div className="w-3/4 h-8 bg-gray-200 rounded-md mb-8"></div>
      <div className="flex items-center justify-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        <div className="space-y-2">
          <div className="w-32 h-6 bg-gray-200 rounded-md"></div>
          <div className="w-24 h-5 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  </div>
);

// --- MAIN TESTIMONIALS COMPONENT ---
export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ▼▼▼ FIX: The complete API call logic is restored here ▼▼▼
  const fetchTestimonials = useCallback(async (isRetry: boolean = false) => {
    if (!isRetry) {
      setLoading(true);
      setError(null);
    }
    try {
      const { retryWithBackoff } = await import('../utils/apiRetry');
      
      const response = await retryWithBackoff(
        () => fetch("https://api.nirwanastays.com/admin/ratings"),
        {
          maxRetries: 3,
          initialDelay: 1000,
          onRetry: (attempt) => {
            if (isRetry) {
              console.log(`Auto-retrying testimonials fetch (attempt ${attempt}/3)...`);
            }
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      const data: ApiTestimonial[] = await response.json();
      const transformedData: Testimonial[] = data.map((item) => ({
        id: item.id.toString(),
        name: item.guestName,
        location: item.propertyName,
        avatar: item.image, // The 'image' field from API is mapped to 'avatar'
        rating: item.rating,
        review: item.review,
        date: item.date,
      }));
      setTestimonials(transformedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      if (!isRetry) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      }
    } finally {
      if (!isRetry) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);
  
  // Auto-retry if testimonials are empty
  useAutoRetry(
    async () => {
      await fetchTestimonials(true);
    },
    () => testimonials.length > 0,
    {
      maxRetries: 5,
      initialDelay: 3000,
      retryInterval: 3000,
      enabled: testimonials.length === 0 && !loading,
    }
  );
  
  const currentTestimonial = useMemo(() => testimonials[currentIndex], [testimonials, currentIndex]);

  const nextTestimonial = useCallback(() => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(nextTestimonial, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length, nextTestimonial]);

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-b from-emerald-50 to-emerald-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800">What Our Guests Say</h2>
          </div>
          <SkeletonLoader />
        </div>
      </section>
    );
  }

  if (error) {
    return (
        <section className="py-16 lg:py-24 bg-gradient-to-b from-emerald-50 to-emerald-100">
            <div className="text-center max-w-2xl mx-auto">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Could not load testimonials</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button onClick={() => fetchTestimonials(false)} className="flex items-center mx-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                </button>
            </div>
        </section>
    );
  }

  if (testimonials.length === 0) {
    return (
        <section className="py-16 lg:py-24 bg-gradient-to-b from-emerald-50 to-emerald-100">
            <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-2xl font-semibold text-gray-800">No testimonials yet.</h3>
                <p className="text-gray-600">Check back soon to see what our guests have to say!</p>
            </div>
        </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-emerald-50 to-emerald-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800">
            What Our Guests Say
          </h2>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <TestimonialCard testimonial={currentTestimonial} />
          <Preloader testimonials={testimonials} currentIndex={currentIndex} />
          <div className="flex justify-between items-center mt-8 max-w-lg mx-auto">
            <button onClick={prevTestimonial} aria-label="Previous testimonial" className="p-2 rounded-full hover:bg-emerald-100 transition-colors">
              <ChevronLeft className="text-emerald-600" />
            </button>
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${index === currentIndex ? 'w-6 bg-emerald-500' : 'w-2 bg-emerald-200'}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button onClick={nextTestimonial} aria-label="Next testimonial" className="p-2 rounded-full hover:bg-emerald-100 transition-colors">
              <ChevronRight className="text-emerald-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}