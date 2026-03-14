"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { MapPin, Move, Filter, Search, X } from "lucide-react";
import { Accommodation, Location } from "../types";
import { fetchAccommodations, fetchLocations, getAccommodations, getLocations } from "../data";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { useAutoRetry } from "../hooks/useAutoRetry";



// Helper function to truncate text
const truncateText = (text: string, maxLength: number, isMobile: boolean) => {
  if (!text) return "";
  if (!isMobile || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};


interface AccommodationsProps {
  selectedLocation: string;
  selectedType: string;
  onBookAccommodation: (accommodation: Accommodation) => void;
}

// Image Slider Component - OPTIMIZED
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
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(
    () => [true, ...Array(images.length - 1).fill(false)]
  );

  useEffect(() => {
    setCurrentIndex(0);
    setImagesLoaded([true, ...Array(images.length - 1).fill(false)]);
  }, [images]);

  // Preload images
  useEffect(() => {
    images.forEach((imageUrl, index) => {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => handleImageLoad(index);
    });
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

  const handleImageLoad = useCallback((index: number) => {
    setImagesLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  }, []);

  if (images.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-64 sm:h-48 md:h-56 lg:h-64 overflow-hidden select-none group bg-gray-200 force-gpu scroll-optimize"
      style={{
        touchAction: "pan-y",
        transform: "translate3d(0,0,0)",
        backfaceVisibility: "hidden"
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
          transition: isTransitioning ? 'transform 0.3s ease-out' : 'none'
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="w-full h-full flex-shrink-0 bg-gray-200"
            style={{
              transform: 'translate3d(0,0,0)',
              willChange: 'transform'
            }}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className={`w-full h-full object-cover pointer-events-none select-none transition-opacity duration-300 ${imagesLoaded[index] ? 'opacity-100' : 'opacity-0'
                }`}
              draggable={false}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              onLoad={() => handleImageLoad(index)}
              style={{
                transform: 'translate3d(0,0,0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
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
            onClick={() => changeSlide(currentIndex > 0 ? currentIndex - 1 : images.length - 1)}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
            disabled={isTransitioning}
          >
            ←
          </button>
          <button
            onClick={() => changeSlide(currentIndex < images.length - 1 ? currentIndex + 1 : 0)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
            disabled={isTransitioning}
          >
            →
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
              className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex
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

const useAccommodationsFilter = (
  accommodations: Accommodation[],
  filters: {
    searchTerm: string;
    priceRange: { min: number; max: number };
    typeFilter: string[];
    locationFilter: string;
    sortBy: string;
  },
  locations: Location[] // <<< MODIFIED
) => {
  return useMemo(() => {
    let filtered = accommodations.filter(acc => acc.available);

    // Search term filter
    if (filters.searchTerm) {
      filtered = filtered.filter(acc =>
        acc.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(
      acc => acc.price >= filters.priceRange.min && acc.price <= filters.priceRange.max
    );

    // Type filter
    if (filters.typeFilter.length > 0) {
      filtered = filtered.filter(acc => filters.typeFilter.includes(acc.type));
    }

    // Location filter
    if (filters.locationFilter && filters.locationFilter !== "all") {
      console.log('Filtering by location:', filters.locationFilter);
      console.log('Available locations:', locations);

      // <<< MODIFIED: Use the 'locations' parameter
      const selectedLocationName =
        filters.locationFilter === "all"
          ? ""
          : (locations.find((l) => l.id === filters.locationFilter)?.name || "").toLowerCase();

      console.log('Selected location name:', selectedLocationName);

      filtered = filtered.filter((acc) => {
        const cityIdMatch = acc.cityId ? acc.cityId === filters.locationFilter : false;
        const locationNameMatch = selectedLocationName ? acc.location.toLowerCase().includes(selectedLocationName) : false;
        const matches = cityIdMatch || locationNameMatch;

        if (matches) {
          console.log('Accommodation matches:', acc.name, 'cityId:', acc.cityId, 'location:', acc.location);
        }

        return matches;
      });

      console.log('Filtered accommodations count:', filtered.length);
    }

    // Sorting
    const sorted = [...filtered];
    switch (filters.sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
    }

    return sorted;
  }, [accommodations, filters, locations]); // <<< MODIFIED: Added dependency
};


// Update the main component with optimized state management
export function Accommodations({
  selectedLocation,
  selectedType,
  onBookAccommodation,
}: AccommodationsProps) {
  const ITEMS_PER_PAGE = 15;

  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const isMobile = useMediaQuery('(max-width: 1024px)');

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState(selectedLocation || "all");
  const [sortBy, setSortBy] = useState("default");

  // UI states
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Update locationFilter when selectedLocation prop changes
  useEffect(() => {
    setLocationFilter(selectedLocation || "all");
  }, [selectedLocation]);

  // Update typeFilter when selectedType prop changes
  useEffect(() => {
    if (selectedType && selectedType !== "all") {
      setTypeFilter([selectedType]);
    } else {
      setTypeFilter([]);
    }
  }, [selectedType]);

  const handleLoadMore = useCallback(() => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  }, []);

  const filters = useMemo(() => ({
    searchTerm,
    priceRange,
    typeFilter,
    locationFilter,
    sortBy
  }), [searchTerm, priceRange, typeFilter, locationFilter, sortBy]);

  const accommodationTypes = useMemo(() => [...new Set(accommodations.map(a => a.type))], [accommodations]);
  // Use the locations state directly

  const filteredAccommodations = useAccommodationsFilter(
    accommodations,
    filters,
    locations // <<< MODIFIED: Pass locations to the hook
  );

  const maxPriceInitial = useMemo(() => Math.max(...accommodations.map(d => d.price), 5000), [accommodations]);

  const resetFilters = () => {
    setSearchTerm("");
    if (selectedType && selectedType !== "all") {
      setTypeFilter([selectedType]);
    } else {
      setTypeFilter([]);
    }
    setLocationFilter(selectedLocation || "all");
    setSortBy("default");
    setPriceRange({ min: 0, max: maxPriceInitial });
  };

  const debouncedLoadMore = useCallback(
    debounce(() => {
      setVisibleCount(prev => prev + ITEMS_PER_PAGE);
    }, 150),
    []
  );

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          debouncedLoadMore();
        }
      },
      { rootMargin: '100px' }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [debouncedLoadMore, filteredAccommodations.length]);

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      try {
        // Fetch both accommodations and locations
        const [accommodationsData, locationsData] = await Promise.all([
          fetchAccommodations(),
          fetchLocations()
        ]);

        setLocations(locationsData);

        // Shuffle accommodations for variety
        const shuffledData = [...accommodationsData];
        for (let i = shuffledData.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
        }

        setAccommodations(shuffledData);
        const maxPrice = Math.max(...accommodationsData.map(d => d.price), 5000);
        setPriceRange({ min: 0, max: maxPrice });
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-retry for accommodations
  useAutoRetry(
    async () => {
      const retried = await fetchAccommodations(true);
      if (retried.length > 0) {
        setAccommodations((prev) => {
          // Only update if current state is empty
          if (prev.length === 0) {
            const shuffled = [...retried];
            for (let i = shuffled.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
          }
          return prev;
        });
        setPriceRange((prev) => {
          const maxPrice = Math.max(...retried.map(d => d.price), 5000);
          return prev.max === 0 ? { min: 0, max: maxPrice } : prev;
        });
      }
    },
    () => accommodations.length > 0,
    {
      maxRetries: 5,
      initialDelay: 3000,
      retryInterval: 3000,
      enabled: accommodations.length === 0 && !loading,
    }
  );

  // Auto-retry for locations
  useAutoRetry(
    async () => {
      const retried = await fetchLocations(true);
      if (retried.length > 0) {
        setLocations((prev) => prev.length === 0 ? retried : prev);
      }
    },
    () => locations.length > 0,
    {
      maxRetries: 5,
      initialDelay: 3000,
      retryInterval: 3000,
      enabled: locations.length === 0 && !loading,
    }
  );

  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMobileFilterOpen]);

  const paginatedAccommodations = useMemo(() => {
    return filteredAccommodations.slice(0, visibleCount);
  }, [filteredAccommodations, visibleCount]);

  const handleBookAccommodation = useCallback(
    (accommodation: Accommodation) => {
      onBookAccommodation(accommodation);
    },
    [onBookAccommodation]
  );

  useScrollOptimization();

  return (
    <section className="py-16 lg:py-24 bg-gray-50 relative scroll-optimize force-gpu" id="accommodations-section">
      <div className="max-w-7xl mx-auto px-4 force-gpu">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Perfect Stays Await
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Choose from our carefully curated accommodations.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 mb-8 relative z-20">
          {/* START: Mobile Filter Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="w-full flex items-center justify-between text-left p-2 border rounded-full shadow"
            >
              <div className="flex items-center gap-3">
                <Search size={20} className="ml-2 text-gray-700" />
                <div>
                  <p className="font-bold">Filters</p>
                  <p className="text-xs text-gray-500">Location, type, price...</p>
                </div>
              </div>
              <div className="p-2 border rounded-full mr-1">
                <Filter size={20} className="text-emerald-600" />
              </div>
            </button>
          </div>
          {/* END: Mobile Filter Button */}

          {/* START: Desktop Filter Bar */}
          <div className="hidden md:flex flex-col md:flex-row items-center border border-gray-200 rounded-full divide-y md:divide-y-0 md:divide-x">
            <div className="relative w-full md:w-1/3 p-2">
              <label htmlFor="search-desktop" className="absolute top-0 left-6 text-xs font-bold text-gray-700">Name</label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="search-desktop"
                  type="text"
                  placeholder="e.g. 'Beachside Villa'"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-none rounded-full focus:ring-0 text-sm"
                />
              </div>
            </div>
            <div className="w-full md:w-auto p-2">
              <label htmlFor="location-desktop" className="block text-center text-xs font-bold text-gray-700 mb-1">Location</label>
              <select
                id="location-desktop"
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                className="w-full py-2 px-3 border-none rounded-full focus:ring-0 text-sm appearance-none text-center"
              >
                <option value="all">All Locations</option>
                {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
              </select>
            </div>
            <div className="flex-grow flex items-center justify-between p-2 w-full md:w-auto">
              <div className="relative w-full text-center">
                <button
                  onClick={() => setActiveFilter(activeFilter === 'details' ? null : 'details')}
                  className="w-full py-2 rounded-full hover:bg-gray-100 text-sm"
                >
                  <span className="font-bold text-gray-700">More Filters</span>
                  <span className="text-gray-500 ml-2">Type & Price</span>
                </button>
                {activeFilter === 'details' && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white border rounded-xl shadow-2xl p-4 z-30 text-left">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-lg">Filters</h4>
                      <button onClick={() => setActiveFilter(null)} className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Accommodation Type</label>
                      <div className="space-y-2">
                        {accommodationTypes.map(type => (
                          <label key={type} className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded cursor-pointer">
                            <input type="checkbox" checked={typeFilter.includes(type)} onChange={() => setTypeFilter(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                            <span className="capitalize text-sm">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <hr className="my-4" />
                    <div>
                      <label htmlFor="price" className="block text-sm font-semibold text-gray-800 mb-2">Price Range</label>
                      <p className="text-sm text-gray-600 mb-4">Up to ₹{priceRange.max.toLocaleString()}</p>
                      <input id="price" type="range" min="0" max={maxPriceInitial} value={priceRange.max} onChange={e => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                    </div>
                  </div>
                )}
              </div>
              <button className="bg-emerald-600 text-white rounded-full p-3 ml-2 hover:bg-emerald-700 transition-colors">
                <Search size={20} />
              </button>
            </div>
          </div>
          {typeFilter.length > 0 && (
            <div className="hidden md:flex pt-3 items-center flex-wrap gap-2">
              <span className="text-sm font-semibold text-gray-600">Active Filters:</span>
              {typeFilter.map(type => (
                <div key={type} className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-1 rounded-full">
                  <span className="capitalize">{type}</span>
                  <button onClick={() => setTypeFilter(prev => prev.filter(t => t !== type))} className="ml-1"><X size={12} /></button>
                </div>
              ))}
              <button onClick={() => setTypeFilter([])} className="text-xs text-gray-500 hover:text-red-600 hover:underline">Clear All</button>
            </div>
          )}
        </div>
        {/* END: Desktop Filter Bar */}

        <div className="text-emerald-600 font-semibold mb-6 text-center lg:text-left">
          {loading
            ? "Loading…"
            : `${filteredAccommodations.length} ${filteredAccommodations.length === 1 ? "property" : "properties"
            } found`}
        </div>

        {loading ? (
          <div className="text-center py-24">Loading accommodations…</div>
        ) : filteredAccommodations.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Properties Found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more options.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedAccommodations.map((accommodation) => (
                <AccommodationCard
                  key={accommodation.id}
                  accommodation={accommodation}
                  onBook={handleBookAccommodation}
                  isMobile={isMobile}
                />
              ))}
            </div>
            {visibleCount < filteredAccommodations.length && (
              <div ref={loadMoreRef} className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  className="bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* START: Mobile Filter Modal */}
      {isMobileFilterOpen && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{
              padding: '20px 20px 16px 20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                Filters
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  fontSize: '16px'
                }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div style={{
              padding: '20px',
              overflowY: 'auto',
              flex: 1
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Search */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Search by name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 'Beachside Villa'"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Location */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Location
                  </label>
                  <select
                    value={locationFilter}
                    onChange={e => setLocationFilter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="all">All Locations</option>
                    {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="default">Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Price Range
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '12px',
                    margin: '0 0 12px 0'
                  }}>
                    Up to ₹{priceRange.max.toLocaleString()}
                  </p>
                  <input
                    type="range"
                    min="0"
                    max={maxPriceInitial}
                    value={priceRange.max}
                    onChange={e => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: '#e5e7eb',
                      outline: 'none',
                      appearance: 'none'
                    }}
                  />
                </div>

                {/* Accommodation Types */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '12px'
                  }}>
                    Accommodation Type
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {accommodationTypes.map(type => (
                      <label key={type} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}>
                        <input
                          type="checkbox"
                          checked={typeFilter.includes(type)}
                          onChange={() => setTypeFilter(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])}
                          style={{
                            width: '16px',
                            height: '16px',
                            accentColor: '#10b981'
                          }}
                        />
                        <span style={{ textTransform: 'capitalize' }}>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 20px 20px 20px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '12px',
              flexShrink: 0
            }}>
              <button
                onClick={resetFilters}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Show {filteredAccommodations.length} properties
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      {/* END: Mobile Filter Modal */}
    </section>
  );
}

interface AccommodationCardProps {
  accommodation: Accommodation;
  onBook: (accommodation: Accommodation) => void;
  isMobile: boolean;
}

const AccommodationCard = React.memo(function AccommodationCard({
  accommodation,
  onBook,
  isMobile,
}: AccommodationCardProps) {
  const router = useRouter();

  // Prefetch the accommodation page on hover for faster navigation
  const handleMouseEnter = useCallback(() => {
    router.prefetch(`/accommodation/${accommodation.id}`);
  }, [router, accommodation.id]);

  const handleAccommodationClick = () => {
    router.push(`/accommodation/${accommodation.id}`);
  };

  const handleBookClick = useCallback(() => {
    // Prefetch before navigation for instant loading
    router.prefetch(`/accommodation/${accommodation.id}`);
    // Track is handled in parent component (Home.tsx)
    onBook(accommodation);
  }, [accommodation, onBook, router]);

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-xl h-full flex flex-col w-[94%] mx-auto sm:w-full transform transition-transform duration-200 hover:scale-[1.02]"
      onMouseEnter={handleMouseEnter}
    >
      <div className="relative overflow-hidden h-64 sm:h-48 md:h-56 lg:h-64">
        <ImageSlider
          images={
            accommodation.gallery && accommodation.gallery.length > 0
              ? accommodation.gallery
              : [accommodation.image]
          }
          isMobile={isMobile}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-sm rounded-lg px-1.5 py-0.5 sm:px-3 sm:py-1 shadow-lg flex items-center max-w-[70%] pointer-events-none">
          <span className="text-xs sm:text-base font-bold text-gray-800 truncate">
            ₹{accommodation.price.toLocaleString()}
          </span>

          <span className="text-[10px] sm:text-xs text-gray-600 ml-1"> {accommodation.type.toLowerCase() === 'villa' ? '/Day' : '/Person'}</span>
        </div>
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-emerald-500/90 text-white px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-lg font-medium capitalize backdrop-blur-sm text-xs sm:text-base max-w-[70%] truncate pointer-events-none">
          {accommodation.type}
        </div>
      </div>
      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
          <button
            onClick={handleAccommodationClick}
            className="hover:text-emerald-600 transition-colors underline-offset-2 hover:underline text-left"
          >
            {accommodation.name}
          </button>
        </h3>
        <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base line-clamp-4 sm:line-clamp-3">
          {truncateText(accommodation.description, 120, isMobile)}
        </p>
        <div className="flex items-center gap-x-4 gap-y-2 mb-4 sm:mb-6 text-rose-taupe flex-wrap text-xs rounded-full">
          {accommodation.inclusions &&
            accommodation.inclusions.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <span className="bg-blue-100 text-green-500 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200 cursor-pointer">
                  {item}
                </span>
              </div>
            ))
          }
          {accommodation.inclusions && accommodation.inclusions.length > 5 && (
            <div className="flex items-center gap-1.5">
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium cursor-default">
                5+
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <button
            onClick={handleBookClick}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-3 rounded-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
});

const useScrollOptimization = () => {
  useEffect(() => {
    const handler = () => {
      if (!document.body.classList.contains('is-scrolling')) {
        document.body.classList.add('is-scrolling');
        window.requestAnimationFrame(() => {
          document.body.classList.remove('is-scrolling');
        });
      }
    };

    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
};

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    // Set initial value
    setMatches(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
};

// Add these keyframes to your global CSS file (e.g., index.css) for the animations
/*
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
*/
