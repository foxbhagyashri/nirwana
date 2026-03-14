"use client";
import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Calendar, Clock, User, ArrowLeft, Tag, Share2, Move, ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { useRouter } from "next/navigation";
import Image from "next/image";
import blogsDataRaw from "@/data/blogs.json";
import { Accommodation } from "../types";
import axios from "axios";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
  tags: string[];
  content: string; // HTML content as string
  propertyIds?: number[];
  isEmbeddProperties?: boolean;
}

// Type the imported JSON data
const blogsData = blogsDataRaw as unknown as BlogPost[];

const API_BASE_URL = "https://api.nirwanastays.com";

// Image Slider Component for Property Cards
const ImageSlider = ({
  images,
  isMobile,
}: {
  images: string[];
  isMobile: boolean;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const dragOffset = useRef<number>(0);
  const dragType = useRef<"touch" | "mouse" | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  const changeSlide = useCallback(
    (newIndex: number) => {
      if (
        newIndex === currentIndex ||
        isTransitioning ||
        newIndex < 0 ||
        newIndex >= images.length
      )
        return;
      setIsTransitioning(true);
      setCurrentIndex(newIndex);
      if (sliderRef.current) {
        sliderRef.current.style.transition = "transform 0.3s ease-out";
        sliderRef.current.style.transform = `translateX(-${newIndex * 100}%)`;
      }
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    },
    [currentIndex, isTransitioning, images.length]
  );

  const handleDragStart = useCallback(
    (clientX: number, clientY: number, type: "touch" | "mouse") => {
      if (isTransitioning || images.length <= 1) return;
      startX.current = clientX;
      startY.current = clientY;
      isDragging.current = false;
      dragOffset.current = 0;
      dragType.current = type;
    },
    [isTransitioning, images.length]
  );

  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (isTransitioning || images.length <= 1 || !dragType.current) return;
      const deltaX = clientX - startX.current;
      const deltaY = clientY - startY.current;
      if (!isDragging.current) {
        const threshold = dragType.current === "touch" ? 15 : 10;
        if (
          Math.abs(deltaX) > threshold &&
          Math.abs(deltaX) > Math.abs(deltaY) * 1.2
        ) {
          isDragging.current = true;
        }
      }
      if (isDragging.current) {
        dragOffset.current = deltaX;
        const containerWidth = containerRef.current?.offsetWidth || 300;
        const percentage = (deltaX / containerWidth) * 100;
        let resistance = 1;
        if (
          (currentIndex === 0 && deltaX > 0) ||
          (currentIndex === images.length - 1 && deltaX < 0)
        ) {
          resistance = 0.3;
        }
        if (sliderRef.current) {
          const translateX = -(currentIndex * 100) + percentage * resistance;
          sliderRef.current.style.transition = "none";
          sliderRef.current.style.transform = `translateX(${translateX}%)`;
        }
      }
    },
    [currentIndex, isTransitioning, images.length]
  );

  const handleDragEnd = useCallback(() => {
    if (isTransitioning || images.length <= 1 || !isDragging.current) {
      isDragging.current = false;
      dragType.current = null;
      return;
    }
    const containerWidth = containerRef.current?.offsetWidth || 300;
    const threshold = containerWidth * 0.25;
    let newIndex = currentIndex;
    if (Math.abs(dragOffset.current) > threshold) {
      if (dragOffset.current > 0 && currentIndex > 0) {
        newIndex = currentIndex - 1;
      } else if (dragOffset.current < 0 && currentIndex < images.length - 1) {
        newIndex = currentIndex + 1;
      }
    }
    if (sliderRef.current) {
      sliderRef.current.style.transition = "transform 0.3s ease-out";
      sliderRef.current.style.transform = `translateX(-${newIndex * 100}%)`;
    }
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
    isDragging.current = false;
    dragOffset.current = 0;
    dragType.current = null;
  }, [currentIndex, isTransitioning, images.length]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!isActive) setIsActive(true);
      const touch = e.touches[0];
      handleDragStart(touch.clientX, touch.clientY, "touch");
    },
    [handleDragStart, isActive]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      handleDragMove(touch.clientX, touch.clientY);
    },
    [handleDragMove]
  );

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleDragStart(e.clientX, e.clientY, "mouse");
      const handleMouseMove = (e: MouseEvent) => {
        handleDragMove(e.clientX, e.clientY);
      };
      const handleMouseUp = () => {
        handleDragEnd();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [handleDragStart, handleDragMove, handleDragEnd]
  );

  if (images.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-64 sm:h-48 md:h-56 lg:h-64 overflow-hidden select-none group bg-gray-200"
      style={{
        touchAction: "pan-y",
        transform: "translate3d(0,0,0)",
        backfaceVisibility: "hidden",
      }}
      onMouseEnter={() => !isMobile && setIsActive(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      <div
        ref={sliderRef}
        className="flex h-full will-change-transform cursor-grab active:cursor-grabbing"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? "transform 0.3s ease-out" : "none",
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="w-full h-full flex-shrink-0 bg-gray-200"
            style={{
              transform: "translate3d(0,0,0)",
              willChange: "transform",
            }}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover pointer-events-none select-none"
              draggable={false}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              style={{
                transform: "translate3d(0,0,0)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            />
          </div>
        ))}
      </div>

      {!isActive && images.length > 1 && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 bg-black/50 text-white px-3 py-1.5 rounded-full text-xs backdrop-blur-sm">
            <Move size={14} />
            <span>{isMobile ? "Swipe" : "Hover"} to see more</span>
          </div>
        </div>
      )}

      {isActive && images.length > 1 && !isMobile && (
        <>
          <button
            onClick={() =>
              changeSlide(
                currentIndex > 0 ? currentIndex - 1 : images.length - 1
              )
            }
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
            disabled={isTransitioning}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() =>
              changeSlide(
                currentIndex < images.length - 1 ? currentIndex + 1 : 0
              )
            }
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
            disabled={isTransitioning}
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {isActive && images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => changeSlide(index)}
              disabled={isTransitioning}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Property Card Component
const PropertyCard = ({
  property,
  isMobile,
}: {
  property: Accommodation;
  isMobile: boolean;
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/accommodation/${property.id}`);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-xl h-full flex flex-col w-full transform transition-transform duration-200 hover:scale-[1.02]">
      <div className="relative overflow-hidden h-64 sm:h-48 md:h-56 lg:h-64">
        <ImageSlider
          images={
            property.gallery && property.gallery.length > 0
              ? property.gallery
              : [property.image]
          }
          isMobile={isMobile}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-sm rounded-lg px-1.5 py-0.5 sm:px-3 sm:py-1 shadow-lg flex items-center max-w-[70%] pointer-events-none">
          <span className="text-xs sm:text-base font-bold text-gray-800 truncate">
            ₹{property.price.toLocaleString()}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-600 ml-1">
            {" "}
            {property.type.toLowerCase() === "villa" ? "/Day" : "/Person"}
          </span>
        </div>
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-emerald-500/90 text-white px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-lg font-medium capitalize backdrop-blur-sm text-xs sm:text-base max-w-[70%] truncate pointer-events-none">
          {property.type}
        </div>
      </div>
      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
          <button
            onClick={handleClick}
            className="hover:text-emerald-600 transition-colors underline-offset-2 hover:underline text-left"
          >
            {property.name}
          </button>
        </h3>
        <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base line-clamp-4 sm:line-clamp-3">
          {property.description}
        </p>
        <div className="mt-auto">
          <button
            onClick={handleClick}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-3 rounded-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export function BlogDetailPage({ slug }: { slug: string }) {
  const router = useRouter();
  const [properties, setProperties] = useState<Accommodation[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const propertiesScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const blog = useMemo(() => {
    const found = blogsData.find((b) => b.slug === slug);
    
    // Debug logging (only in development)
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      console.log('Looking for slug:', slug);
      console.log('Available slugs:', blogsData.map(b => b.slug));
      if (!found) {
        console.warn('Blog not found for slug:', slug);
      }
    }
    
    return found;
  }, [slug]);

  // Fetch properties when blog has isEmbeddProperties = true
  useEffect(() => {
    let isMounted = true;

    const fetchProperties = async () => {
      if (!blog?.isEmbeddProperties || !blog?.propertyIds || blog.propertyIds.length === 0) {
        return;
      }

      setLoadingProperties(true);
      try {
        const propertyPromises = blog.propertyIds.map((id) =>
          axios.get(`${API_BASE_URL}/admin/properties/accommodations/${id}`)
        );

        const responses = await Promise.allSettled(propertyPromises);
        
        if (!isMounted) return;

        // Log any rejected promises
        responses.forEach((result, index) => {
          if (result.status === 'rejected') {
            const propertyId = blog.propertyIds?.[index] ?? 'unknown';
            console.warn(`Failed to fetch property with ID ${propertyId}:`, result.reason);
          }
        });

        // Filter fulfilled results and map to accommodations
        const fetchedProperties: Accommodation[] = responses
          .filter((result) => result.status === 'fulfilled')
          .map((result) => {
            const response = (result as PromiseFulfilledResult<Awaited<typeof propertyPromises[number]>>).value;
            const item = response.data;
          const rawType = item.basicInfo?.type || item.type || "";
          const normalizedType = rawType.toLowerCase();

          const loc = item.location;
          const locationString =
            typeof loc === "string"
              ? loc
              : [loc?.address, loc?.city?.name, loc?.name]
                  .filter(Boolean)
                  .join(" ");

          const rawCityId =
            item.location?.city?.id || item.city_id || item.cityId;
          const cityId =
            rawCityId !== undefined && rawCityId !== null && String(rawCityId).trim() !== ""
              ? String(rawCityId)
              : undefined;

          return {
            id: String(item.id),
            name: item.basicInfo?.name || item.name || "",
            type: normalizedType,
            location: locationString || "",
            cityId,
            price: parseFloat(item.basicInfo?.price || item.price || "0"),
            image: item.basicInfo?.images?.[0] || item.images?.[0] || "",
            description: item.basicInfo?.description || item.description || "",
            fullDescription:
              item.packages?.description ||
              item.basicInfo?.description ||
              item.description ||
              "",
            inclusions: item.basicInfo?.features || item.features || [],
            exclusions: [],
            gallery: item.basicInfo?.images || item.images || [],
            adult_price: item.packages?.pricing?.adult || 0,
            child_price: item.packages?.pricing?.child || 0,
            max_guest:
              item.packages?.pricing?.maxGuests || item.max_guests || 0,
            available: item.basicInfo?.available !== undefined ? item.basicInfo.available : true,
            MaxPersonVilla: item.MaxPersonVilla,
            ratePerPerson: item.ratePerPerson,
          };
        });

        if (isMounted) {
          setProperties(fetchedProperties);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching properties:", error);
          setProperties([]);
        }
      } finally {
        if (isMounted) {
          setLoadingProperties(false);
        }
      }
    };

    fetchProperties();

    return () => {
      isMounted = false;
    };
  }, [blog]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      });
    } catch {
      return dateString;
    }
  };

  const handleNavigate = (section: string) => {
    if (section === "home") {
      router.push("/");
    } else if (section === "accommodations") {
      router.push("/#accommodations");
    } else if (section === "about") {
      router.push("/about");
    } else if (section === "gallery") {
      router.push("/gallery");
    } else if (section === "blogs") {
      router.push("/blogs");
    }
     else if (section === "pawana") {
            router.push("/pawana");
        }
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && blog) {
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: url,
        });
      } else {
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      }
    }
  };

  if (!blog) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation onNavigate={handleNavigate} />
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h5.25m-1.5-18v18m0-18H6a2.25 2.25 0 00-2.25 2.25v11.25c0 .621.504 1.125 1.125 1.125H15.75a1.125 1.125 0 001.125-1.125V6.25a2.25 2.25 0 00-2.25-2.25h-1.5z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-6">
              The blog post you're looking for doesn't exist or may have been removed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/blogs")}
                className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Blogs
              </button>
              <button
                onClick={() => router.push("/")}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation onNavigate={handleNavigate} />
      
      {/* Hero Image */}
      {blog.image && (
        <div className="relative h-64 md:h-96 w-full overflow-hidden">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Blog Content */}
      <article className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => router.push("/blogs")}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Blogs</span>
        </button>

        {/* Category Badge */}
        {blog.category && (
          <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mb-4">
            {blog.category}
          </span>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          {blog.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
          {blog.author && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{blog.author}</span>
            </div>
          )}
          {blog.date && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(blog.date)}</span>
            </div>
          )}
          {blog.readTime && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{blog.readTime}</span>
            </div>
          )}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 ml-auto text-emerald-600 hover:text-emerald-700"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map((tag, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Embedded Properties Section - Full Width on Desktop */}
      {blog.isEmbeddProperties && blog.propertyIds && blog.propertyIds.length > 0 && (
        <div className="mb-12 w-full">
          {loadingProperties ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <p className="mt-4 text-gray-600">Loading properties...</p>
            </div>
          ) : properties.length > 0 ? (
            <div className="relative w-full">
              {/* Left Arrow */}
                <button
                  onClick={() => {
                    if (propertiesScrollRef.current) {
                      const container = propertiesScrollRef.current;
                      const cards = container.querySelectorAll('div > div');
                      if (cards.length > 0) {
                        if (isMobile) {
                          // For mobile: scroll to center the previous card
                          const cardWidth = (cards[0] as HTMLElement).offsetWidth;
                          const gap = 16;
                          const currentScroll = container.scrollLeft;
                          const scrollAmount = cardWidth + gap;
                          const targetScroll = currentScroll - scrollAmount;
                          
                          // Find the card that should be centered
                          let targetIndex = 0;
                          for (let i = 0; i < cards.length; i++) {
                            const card = cards[i] as HTMLElement;
                            const cardLeft = card.offsetLeft;
                            const cardCenter = cardLeft + cardWidth / 2;
                            const containerCenter = container.offsetWidth / 2;
                            
                            if (cardCenter < containerCenter + currentScroll) {
                              targetIndex = i;
                            } else {
                              break;
                            }
                          }
                          
                          if (targetIndex > 0) {
                            const targetCard = cards[targetIndex - 1] as HTMLElement;
                            const cardLeft = targetCard.offsetLeft;
                            const cardWidth = targetCard.offsetWidth;
                            const containerWidth = container.offsetWidth;
                            const scrollTo = cardLeft - (containerWidth / 2) + (cardWidth / 2);
                            
                            container.scrollTo({
                              left: scrollTo,
                              behavior: 'smooth'
                            });
                          }
                        } else {
                          // Desktop: scroll 3 cards
                          const cardWidth = (cards[0] as HTMLElement).offsetWidth;
                          const gap = 24;
                          const scrollAmount = (cardWidth + gap) * 3;
                          container.scrollBy({
                            left: -scrollAmount,
                            behavior: 'smooth'
                          });
                        }
                      }
                    }
                  }}
                  className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 md:p-3 transition-all hover:scale-110 border border-gray-200"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={() => {
                    if (propertiesScrollRef.current) {
                      const container = propertiesScrollRef.current;
                      const cards = container.querySelectorAll('div > div');
                      if (cards.length > 0) {
                        if (isMobile) {
                          // For mobile: scroll to center the next card
                          const currentScroll = container.scrollLeft;
                          const containerWidth = container.offsetWidth;
                          
                          // Find the card that should be centered next
                          let targetIndex = 0;
                          for (let i = 0; i < cards.length; i++) {
                            const card = cards[i] as HTMLElement;
                            const cardLeft = card.offsetLeft;
                            const cardWidth = card.offsetWidth;
                            const cardCenter = cardLeft + cardWidth / 2;
                            const containerCenter = containerWidth / 2 + currentScroll;
                            
                            if (cardCenter <= containerCenter) {
                              targetIndex = i;
                            } else {
                              break;
                            }
                          }
                          
                          if (targetIndex < cards.length - 1) {
                            const targetCard = cards[targetIndex + 1] as HTMLElement;
                            const cardLeft = targetCard.offsetLeft;
                            const cardWidth = targetCard.offsetWidth;
                            const scrollTo = cardLeft - (containerWidth / 2) + (cardWidth / 2);
                            
                            container.scrollTo({
                              left: scrollTo,
                              behavior: 'smooth'
                            });
                          }
                        } else {
                          // Desktop: scroll 3 cards
                          const cardWidth = (cards[0] as HTMLElement).offsetWidth;
                          const gap = 24;
                          const scrollAmount = (cardWidth + gap) * 3;
                          container.scrollBy({
                            left: scrollAmount,
                            behavior: 'smooth'
                          });
                        }
                      }
                    }
                  }}
                  className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 md:p-3 transition-all hover:scale-110 border border-gray-200"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                </button>

              {/* Properties Container - Full Width on Desktop */}
              <div 
                ref={propertiesScrollRef}
                className="overflow-x-auto pb-4 px-4 md:px-8 lg:px-16 scrollbar-hide"
                style={{
                  scrollSnapType: 'x mandatory',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <style jsx>{`
                  .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <div 
                  className="flex gap-4 md:gap-6"
                  style={{
                    paddingLeft: isMobile ? 'calc((100vw - 90vw) / 2)' : '0',
                    paddingRight: isMobile ? 'calc((100vw - 90vw) / 2)' : '0',
                  }}
                >
                  {properties.map((property, index) => (
                    <div
                      key={property.id}
                      className="flex-shrink-0"
                      style={{
                        width: isMobile 
                          ? '90vw' // One card on mobile
                          : 'calc((100vw - 192px) / 3)', // Full viewport width minus padding (96px each side: 64px + 32px gap) divided by 3 for desktop
                        scrollSnapAlign: isMobile ? 'center' : 'start',
                      }}
                    >
                      <PropertyCard property={property} isMobile={isMobile} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              Properties not available at the moment.
            </div>
          )}
        </div>
      )}

      {/* Blog Content Continued */}
      <article className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">

        {/* Blog Content */}
        <div 
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3 prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-li:mb-2 prose-strong:text-gray-900 prose-strong:font-semibold prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: blog.content || blog.excerpt }}
        />

        {/* Back to Blog Button */}
        <div className="mt-12 pt-8 border-t">
          <button
            onClick={() => router.push("/blogs")}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to All Posts</span>
          </button>
        </div>
      </article>

      <Footer />
    </div>
  );
}

