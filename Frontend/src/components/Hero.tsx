"use client";
import React from "react";
import { Waves, Mountain, Sun, TreePine, ArrowDown } from "lucide-react";
import { trackButtonClick } from "@/utils/analytics";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import Link from "next/link";

// --- PROPS ---
interface HeroProps {
  onBookNow: () => void;
}

interface HighlightCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

// --- HIGHLIGHTS ---
const highlights: HighlightCardProps[] = [
  { icon: Waves, title: "Lakeside Location", description: "Direct access to pristine Pawna Lake" },
  { icon: Mountain, title: "Scenic Views", description: "Breathtaking sunrise and sunset vistas" },
  { icon: Sun, title: "Year Round", description: "Perfect weather throughout the year" },
  { icon: TreePine, title: "Nature Immersion", description: "Surrounded by lush greenery" },
];

// --- HERO IMAGES ---
const heroImages = [
  "/nirwana_her-min.jpeg",
  "/IMG_4417.jpg",
  "/IMG-20230308-WA0067.jpg",
  "/IMG_4523.jpg"
];

// --- CARD COMPONENT ---
function HighlightCard({ icon: IconComponent, title, description }: HighlightCardProps) {
  return (
    <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white/70 backdrop-blur-sm shadow-lg">
      <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
        <IconComponent className="w-6 h-6 text-emerald-600" />
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}

// --- MAIN HERO ---
export function Hero({ onBookNow }: HeroProps) {

  const handleScrollToAbout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackButtonClick("scroll_to_about", window.location.pathname);
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBookNowClick = () => {
    trackButtonClick("hero_book_your_stay", window.location.pathname);

    document
      .getElementById("accommodations")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* HERO SECTION */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* BACKGROUND SLIDER */}
        <div className="absolute inset-0">

          <Swiper
            modules={[Autoplay, Navigation, EffectFade]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            navigation={true}
            effect="fade"
            loop={true}
            className="h-full"
          >

            {heroImages.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt="Nirwana Stays Resort"
                  className="w-full h-screen object-cover "
                />
              </SwiperSlide>
            ))}

          </Swiper>

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 z-10 pointer-events-none"></div>
        </div>



        {/* HERO TEXT */}
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
            Nirwana Stays

            <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-emerald-300 mt-2">
              Lake Camping Resort
            </span>

          </h1>

          <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-200 font-light">
            Luxury Lakeside Accommodations • Adventure Activities • Nature Retreat
          </p>

          <button
            onClick={handleBookNowClick}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Book Your Stay
          </button>

        </div>

        {/* SCROLL ICON */}
        <a
          href="#about"
          onClick={handleScrollToAbout}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce z-20"
          aria-label="Scroll to about section"
        >
          <ArrowDown className="w-6 h-6" />
        </a>

      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="py-16 lg:py-24 bg-gradient-to-b from-white to-emerald-50"
      >

        <div className="max-w-7xl mx-auto px-4">

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* LEFT */}
            <div className="space-y-8 text-center lg:text-left">

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                Experience Nature's
                <span className="block text-emerald-600">Paradise</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {highlights.map((highlight) => (
                  <Link key={highlight.title} href="/gallery">
                    <div className="cursor-pointer hover:scale-105 transition-transform duration-300">
                      <HighlightCard {...highlight} />
                    </div>
                  </Link>
                ))}

              </div>

            </div>

            {/* RIGHT */}
            <div className="text-center lg:text-left">

              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Welcome to Nirwana Stays, the best lake view resort and hotel in
                Lonavala, Maharashtra, where nature, comfort, and adventure come
                together. Nestled on the tranquil shores of Pawna Lake, our resort
                offers the perfect escape for travellers seeking peace, scenic
                beauty, and unforgettable outdoor experiences.
              </p>

              <p className="text-lg text-gray-600 leading-relaxed">
                Whether you’re looking for a lakeside glamping experience in
                Lonavala, cozy cottages, or luxurious villas, Nirwana Stays is
                your ideal resort near Pawna Lake — where every sunrise feels like
                a new beginning.
              </p>

            </div>

          </div>

        </div>

      </section>
    </>
  );
}