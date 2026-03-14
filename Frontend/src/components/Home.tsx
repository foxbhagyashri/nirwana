"use client";

import React, { useState, useEffect, startTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Navigation } from './Navigation';
import { Hero } from './Hero';
import { LocationCards } from './LocationCards';
import { AccommodationTypes } from './AccommodationTypes';
import { Accommodations } from './Accommodations';
// import { LocationAccommodation } from './LocationAccommodation';
import { Accommodation } from '../types';
import { usePageTracking } from '@/hooks/usePageTracking';
import { trackButtonClick, trackPhoneClick, trackWhatsAppClick, trackAccommodationView } from '@/utils/analytics';

// Dynamically import below-the-fold components to reduce initial bundle size
const Activities = dynamic(() => import('./Activities').then(mod => ({ default: mod.Activities })), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center"><div className="animate-pulse text-gray-400">Loading activities...</div></div>,
  ssr: true,
});

const AccommodationOptions = dynamic(() => import('./AccommodationOptions').then(mod => ({ default: mod.AccommodationOptions })), {
  loading: () => null,
  ssr: true,
});

const Testimonials = dynamic(() => import('./Testimonials').then(mod => ({ default: mod.Testimonials })), {
  loading: () => null,
  ssr: true,
});

const InstagramShowcase = dynamic(() => import('./InstagramShowcase').then(mod => ({ default: mod.InstagramShowcase })), {
  loading: () => null,
  ssr: true,
});

const Footer = dynamic(() => import('./Footer').then(mod => ({ default: mod.Footer })), {
  loading: () => null,
  ssr: true,
});

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedType, setSelectedType] = useState('all');

  // Track page views
  usePageTracking();

  // Handle scroll on mount if hash is present or search param? 
  // The original code relied on setTimeout after navigation.
  // We can implement a simple useEffect to handle scrolling if needed, but let's stick to the callback logic for now.

const handleNavigate = (section: string) => {

  const staticPages = ['booking', 'gallery', 'about', 'blogs', 'home'];

  // Static pages
  if (staticPages.includes(section)) {
    router.push(section === 'home' ? '/' : `/${section}`);
    return;
  }

  // If it's a city (dynamic route)
  if (!staticPages.includes(section)) {
    router.push(`/${section}`);
    return;
  }

  // Scroll logic
  if (pathname !== '/') {
    router.push('/');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

  } else {
    requestAnimationFrame(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
};

  const [locationFilter, setLocationFilter] = useState("all");

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(locationId);

    // Scroll to Perfect Stays Await section
    setTimeout(() => {
      const section = document.getElementById("accommodations");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };



  const handleTypeSelect = (typeId: string) => {
    setSelectedType(selectedType === typeId ? 'all' : typeId);
    // Use requestAnimationFrame to avoid forced reflow
    requestAnimationFrame(() => {
      const element = document.getElementById('accommodations');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  const handleBookNow = () => {
    trackButtonClick('book_your_stay', pathname);
    if (pathname !== '/') {
      router.push('/');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const element = document.getElementById('locations');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    } else {
      requestAnimationFrame(() => {
        const element = document.getElementById('locations');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  };

  const handleBookAccommodation = (accommodation: any) => {
    trackAccommodationView(accommodation.id.toString(), accommodation.name);
    trackButtonClick('book_accommodation', pathname, { accommodation_id: accommodation.id, accommodation_name: accommodation.name });

    // Prefetch the page for instant navigation
    router.prefetch(`/accommodation/${accommodation.id}`);

    // Use startTransition for smoother navigation
    startTransition(() => {
      router.push(`/accommodation/${accommodation.id}`);
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navigation onNavigate={handleNavigate} />
      <Hero onBookNow={handleBookNow} />

      <div id="locations">
        {/* <LocationCards
          selectedLocation={selectedLocation}
          onLocationSelect={(locationId) => setSelectedLocation(locationId)}
        /> */}
        <LocationCards
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
        />
      </div>

      {/* <LocationAccommodation
        selectedLocation={selectedLocation}
        selectedType="all"
        onBookAccommodation={(acc) => console.log(acc)}
      /> */}

      <div id="accommodation-types">
        <AccommodationTypes
          selectedType={selectedType}
          onTypeSelect={handleTypeSelect}
        />
      </div>


      <div id="accommodations">
        {(!selectedLocation || selectedLocation === 'all') && (!selectedType || selectedType === 'all') ? (
          <section className="relative z-10 py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-3">
                Select a location or accommodation type
              </h3>
              <p className="text-gray-600">
                Please choose a location or type to see available properties.
              </p>
            </div>
          </section>
        ) : (
          <Accommodations
            selectedLocation={selectedLocation}
            selectedType={selectedType}
            onBookAccommodation={handleBookAccommodation}
          />
        )}
      </div>


      <AccommodationOptions />

      <div id="activities">
        <Activities />
      </div>

      <Testimonials />
      <InstagramShowcase />
      <Footer />

      {/* Floating Call Button */}
      <a
        href="tel:9021408308"
        onClick={trackPhoneClick}
        className="fixed bottom-24 right-6 z-50 w-12 h-12 md:w-16 md:h-16 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 animate-pulse"
        style={{ animationDuration: '2s', animationIterationCount: 'infinite' }}
        aria-label="Call Nirwana Stays"
      >
        <svg className="w-6 h-6 md:w-9 md:h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1v3.5a1 1 0 01-1 1C10.07 22 2 13.93 2 4.5A1 1 0 013 3.5h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
        </svg>
      </a>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/9021408308?text=Hi! I'm interested in booking a stay at Nirwana Stays."
        onClick={trackWhatsAppClick}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 md:w-16 md:h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 animate-pulse"
        style={{ animationDuration: '2s', animationIterationCount: 'infinite' }}
      >
        <svg className="w-6 h-6 md:w-9 md:h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
        </svg>
      </a>
    </div>
  );
}

