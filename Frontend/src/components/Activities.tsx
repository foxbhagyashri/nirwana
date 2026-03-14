"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { activities } from "../data";

export function Activities() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activities.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + activities.length) % activities.length
    );
  };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="py-16 lg:py-24 relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `
          linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.7)),
          url('https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')
        `,
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Unforgettable Experiences
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Immerse yourself in a world of adventure and relaxation
          </p>
        </div>

        {/* Unique Slider */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/20"
          >
            <ChevronLeft className="w-7 h-7 text-white" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/20"
          >
            <ChevronRight className="w-7 h-7 text-white" />
          </button>

          {/* Slider Container */}
          <div className="relative overflow-hidden rounded-3xl">
            {/* Mobile: Single card view */}
            <div className="lg:hidden h-96">
              <div
                className="flex transition-transform duration-700 ease-in-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="w-full flex-shrink-0 relative"
                  >
                    <div className="relative h-full rounded-3xl overflow-hidden group">
                      <img
                        src={activity.image}
                        alt={activity.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                      {/* Activity Name */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                        <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 transform transition-all duration-500 group-hover:scale-105">
                          {activity.name}
                        </h3>
                        <div className="w-24 h-1 bg-emerald-400 mx-auto rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Two cards view */}
            <div className="hidden lg:block h-96">
              <div
                className="flex transition-transform duration-700 ease-in-out h-full"
                style={{ transform: `translateX(-${currentSlide * 50}%)` }}
              >
                {activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="w-1/2 flex-shrink-0 relative px-3"
                  >
                    <div className="relative h-full rounded-3xl overflow-hidden group">
                      <img
                        src={activity.image}
                        alt={activity.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                      {/* Activity Name */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                        <h3 className="text-2xl font-bold text-white mb-4 transform transition-all duration-500 group-hover:scale-105">
                          {activity.name}
                        </h3>
                        <div className="w-24 h-1 bg-emerald-400 mx-auto rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-3 mt-8">
            {activities.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? "bg-emerald-400 w-12 h-3"
                    : "bg-white/30 w-3 h-3 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}