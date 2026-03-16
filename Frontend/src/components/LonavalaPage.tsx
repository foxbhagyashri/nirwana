"use client";

import React, { useLayoutEffect, useState } from "react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { useRouter, useParams } from "next/navigation";
import { usePageTracking } from "@/hooks/usePageTracking";
import { AccommodationTypes } from "./AccommodationTypes";
import { LocationAccommodation } from "./LocationAccommodation";

export function LonavalaPage() {
    const params = useParams();
    const location = Array.isArray(params.location)
        ? params.location[0]
        : params.location || "lonavala";

    const router = useRouter();
    usePageTracking();

    const [selectedLocation, setSelectedLocation] = useState("all");
    const [selectedType, setSelectedType] = useState("all");

    const handleLocationSelect = (locationId: string) => {
        setSelectedLocation(locationId);

        setTimeout(() => {
            const section = document.getElementById("accommodations");
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);
    };

    const handleTypeSelect = (typeId: string) => {
        setSelectedType(selectedType === typeId ? "all" : typeId);

        requestAnimationFrame(() => {
            const element = document.getElementById("accommodations");
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        });
    };

    const handleBookAccommodation = (accommodationId: string) => {
        router.push(`/accommodation/${accommodationId}`);
    };

    useLayoutEffect(() => {
        if (typeof window !== "undefined") {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }
    }, []);

    const handleNavigate = (section: string) => {
        if (section === "home") router.push("/");
        else if (section === "accommodations") router.push("/#accommodations");
        else if (section === "gallery") router.push("/gallery");
        else if (section === "about") router.push("/about");

        else router.push(`/${section}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            <Navigation onNavigate={handleNavigate} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
                        alt="About Nirwana Stays"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-emerald-700/60"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        Lonavala
                        Resorts
                    </h1>
                    <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto">
                        Lonavala
                        Resorts
                    </p>
                </div>
            </section>

            {/* Accommodation Section */}
            <section className="py-20 bg-white">
                <div id="accommodation-types">
                    <AccommodationTypes
                        selectedType={selectedType}
                        onTypeSelect={handleTypeSelect}
                    />
                </div>

                <div id="accommodations">
                    <LocationAccommodation
                       selectedLocation={location}
                        selectedType={selectedType}
                        onBookAccommodation={handleBookAccommodation}
                    />
                </div>
            </section>

            <Footer />
        </div>
    );
}