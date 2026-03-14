"use client";

import React, { useState, useEffect, useRef } from "react";
import { fetchLocations, getLocations } from "../data";
import { Location } from "../types";
import { useAutoRetry } from "../hooks/useAutoRetry";

interface LocationCardsProps {
  selectedLocation: string;
  onLocationSelect: (locationId: string) => void;
}

export function LocationCards({
  selectedLocation,
  onLocationSelect,
}: LocationCardsProps) {
  const [current, setCurrent] = useState(0);
  const [fetchedLocations, setFetchedLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        await fetchLocations();
        const allLocations = getLocations();

        // --- Start of new sorting logic ---

        // Find the specific locations
        let pawna: Location | undefined;
        let lonavala: Location | undefined;
        let karjat: Location | undefined;
        const otherLocations: Location[] = [];

        allLocations.forEach((location) => {
          const name = location.name.toLowerCase();
          if (name.includes("pawna")) {
            pawna = location;
          } else if (name.includes("lonavala")) {
            lonavala = location;
          } else if (name.includes("karjat")) {
            karjat = location;
          } else {
            otherLocations.push(location);
          }
        });

        const sortedLocations: Location[] = [];

        // 1. Add Pawna first. This makes it index 0, the default card.
        if (pawna) sortedLocations.push(pawna);

        // 2. Add Karjat second. This makes it index 1, to the "right" of Pawna.
        if (karjat) sortedLocations.push(karjat);

        // 3. Add all other locations.
        sortedLocations.push(...otherLocations);

        // 4. Add Lonavala last. This makes it wrap around to the "left" of Pawna.
        if (lonavala) sortedLocations.push(lonavala);

        // Fallback in case one of the key locations wasn't found
        if (!pawna || !lonavala || !karjat) {
          console.warn(
            "One of Pawna, Lonavala, or Karjat was not found. Using default Pawna-first sort."
          );
          // Use the original sort logic as a fallback
          setFetchedLocations(
            allLocations.sort((a, b) => {
              if (a.name.toLowerCase().includes("pawna")) return -1;
              if (b.name.toLowerCase().includes("pawna")) return 1;
              return 0;
            })
          );
        } else {
          setFetchedLocations(sortedLocations);
        }
        // --- End of new sorting logic ---
      } catch (error) {
        console.error("Error loading locations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, []);

  // Auto-retry if locations are empty
  useAutoRetry(
    async () => {
      await fetchLocations(true);
      const retriedLocations = getLocations();
      if (retriedLocations.length > 0 && fetchedLocations.length === 0) {
        // Re-run the sorting logic
        let pawna: Location | undefined;
        let lonavala: Location | undefined;
        let karjat: Location | undefined;
        const otherLocations: Location[] = [];

        retriedLocations.forEach((location) => {
          const name = location.name.toLowerCase();
          if (name.includes("pawna")) {
            pawna = location;
          } else if (name.includes("lonavala")) {
            lonavala = location;
          } else if (name.includes("karjat")) {
            karjat = location;
          } else {
            otherLocations.push(location);
          }
        });

        const newSorted: Location[] = [];
        if (pawna) newSorted.push(pawna);
        if (karjat) newSorted.push(karjat);
        newSorted.push(...otherLocations);
        if (lonavala) newSorted.push(lonavala);

        if (newSorted.length > 0) {
          setFetchedLocations(newSorted);
        }
      }
    },
    () => fetchedLocations.length > 0,
    {
      maxRetries: 5,
      initialDelay: 3000,
      retryInterval: 3000,
      enabled: fetchedLocations.length === 0 && !loading,
    }
  );

  const next = () => setCurrent((prev) => (prev + 1) % fetchedLocations.length);
  const prev = () =>
    setCurrent(
      (prev) => (prev - 1 + fetchedLocations.length) % fetchedLocations.length
    );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else prev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const getCarouselItems = () => {
    if (!fetchedLocations.length) return [];
    const items = [];
    for (let i = -2; i <= 2; i++) {
      let idx =
        (current + i + fetchedLocations.length) % fetchedLocations.length;
      items.push({ ...fetchedLocations[idx], level: i });
    }
    return items;
  };

  // Update the getLevelStyle function for smoother mobile animations:
  const getLevelStyle = (level: number): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      left: "50%",
      top: "50%",
      transition: "all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)", // Smoother easing
      cursor: "pointer",
      zIndex: 10 - Math.abs(level),
      opacity: Math.abs(level) > 2 ? 0 : 1,
      boxShadow: "0 10px 24px 0 rgba(0,0,0,0.15)",
      borderRadius: "12px",
      overflow: "hidden",
      willChange: "transform, opacity",
      transform: "translate3d(-50%, -50%, 0)", // Base transform for hardware acceleration
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      perspective: "1000px",
      WebkitPerspective: "1000px",
    };

    // Adjusted sizes and transforms for mobile
    switch (level) {
      case 0:
        return {
          ...base,
          width: "140px", // Slightly larger center card
          height: "200px",
          zIndex: 20,
          opacity: 1,
          transform: "translate3d(-50%, -50%, 0) scale(1)",
        };
      case -1:
        return {
          ...base,
          width: "120px",
          height: "180px",
          opacity: 0.8,
          zIndex: 15,
          transform:
            "translate3d(-50%, -50%, 0) scale(0.9) translateX(-110%) rotateY(15deg)",
        };
      case 1:
        return {
          ...base,
          width: "120px",
          height: "180px",
          opacity: 0.8,
          zIndex: 15,
          transform:
            "translate3d(-50%, -50%, 0) scale(0.9) translateX(110%) rotateY(-15deg)",
        };
      case -2:
        return {
          ...base,
          width: "100px",
          height: "160px",
          opacity: 0.6,
          zIndex: 12,
          transform:
            "translate3d(-50%, -50%, 0) scale(0.8) translateX(-220%) rotateY(25deg)",
        };
      case 2:
        return {
          ...base,
          width: "100px",
          height: "160px",
          opacity: 0.6,
          zIndex: 12,
          transform:
            "translate3d(-50%, -50%, 0) scale(0.8) translateX(220%) rotateY(-25deg)",
        };
      default:
        return { ...base, opacity: 0 };
    }
  };

  if (loading) {
    return (
      <section className="relative will-change-transform backface-visibility-hidden py-16 lg:py-24 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Explore Locations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our beautiful resorts across stunning destinations
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading locations...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative will-change-transform backface-visibility-hidden py-16 lg:py-24 bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Popular Destinations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover luxury accommodations across India's most beautiful destinations
          </p>
        </div>

        {/* Desktop view - horizontal scroll without scrollbar */}
        <div className="hidden lg:block relative overflow-x-hidden">
          <div className="overflow-x-auto -mx-4 px-4">
            <div
              className="flex gap-6 pb-6 snap-x snap-mandatory scroll-smooth min-w-max"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
                transform: "translate3d(0,0,0)",
              }}
            >
              {fetchedLocations.map((location, index) => (
                <div key={location.id} className="snap-center">
                  <LocationCard
                    location={location}
                    isSelected={selectedLocation === location.id}
                    onClick={() => onLocationSelect(location.id)}
                    animationDelay={index * 100}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile view - 3D stacked with 5 cards and gaps */}
        <div
          className="lg:hidden relative mx-auto hardware-accelerated"
          style={{
            height: "260px", // Increased height for better visibility
            maxWidth: "100%",
            perspective: "1200px",
            overflow: "visible",
            transform: "translate3d(0,0,0)",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="relative w-full h-full transform-gpu"
            style={{
              minHeight: 220,
              transform: "translate3d(0,0,0)",
            }}
          >
            {getCarouselItems().map((location) => (
              <div
                key={location.id}
                style={getLevelStyle(location.level)}
                onClick={() => {
                  if (Math.abs(location.level) <= 1) {
                    onLocationSelect(location.id);
                  } else if (location.level === -2) {
                    prev();
                  } else if (location.level === 2) {
                    next();
                  }
                }}
                className={`
          group transition-all duration-500 hardware-accelerated
          ${selectedLocation === location.id && location.level === 0
                    ? "ring-2 ring-emerald-400"
                    : ""}
        `}
              >
                <img
                  src={location.image}
                  alt={`${location.name} luxury accommodations and resorts`}
                  className="w-full h-full object-cover"
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  style={{
                    transform: "translate3d(0,0,0)",
                    backfaceVisibility: "hidden",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col justify-end items-center gap-2">
                  <h3
                    className={`
              font-bold text-white text-center transform-gpu
              ${location.level === 0 ? "text-base" : "text-sm"}
            `}
                    style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
                  >
                    {location.name}
                  </h3>
                  {/* Mobile Button - only show for center card (level 0) */}
                  {location.level === 0 && (
                    <button
  onClick={(e) => {
    e.stopPropagation();
    onLocationSelect(location.id);

    const section = document.getElementById("accommodations-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }}
  className={`
    inline-block px-4 py-2 rounded-full font-medium transition-all duration-300
    ${selectedLocation === location.id
      ? "bg-emerald-400 text-emerald-900 shadow-lg"
      : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"}
  `}
>
  {selectedLocation === location.id ? "Selected" : "Explore"}
</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Desktop helper component
function LocationCard({
  location,
  isSelected,
  onClick,
  animationDelay,
}: {
  location: Location;
  isSelected: boolean;
  onClick: () => void;
  animationDelay: number;
}) {
  return (
    <div
      onClick={onClick}
      className={`
        flex-shrink-0 w-80 cursor-pointer transform transition-transform duration-300
        will-change-transform hardware-accelerated
        ${isSelected ? "scale-[1.02]" : ""}
      `}
      style={{
        animationDelay: `${animationDelay}ms`,
        transform: "translate3d(0,0,0)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      <div
        className={`
        relative rounded-3xl overflow-hidden shadow-lg transition-shadow duration-300
        ${isSelected ? "shadow-2xl ring-2 ring-emerald-400" : "hover:shadow-xl"}
      `}
      >
        <img
          src={location.image}
          alt={`${location.name} luxury accommodations and resorts`}
          className="w-full h-56 object-cover"
          loading="lazy"
          decoding="async"
          style={{
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-bold text-white mb-3 transform-gpu">
            {location.name}
          </h3>
          <div
            className={`
            inline-block px-6 py-3 rounded-full font-medium transition-colors duration-300
            ${isSelected
                ? "bg-emerald-400 text-emerald-900"
                : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              }
          `}
          >
            {isSelected ? "Selected" : "Explore"}
          </div>
        </div>
      </div>
    </div>
  );
}