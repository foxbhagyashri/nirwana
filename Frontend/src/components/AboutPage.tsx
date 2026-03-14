"use client";

import React, { useLayoutEffect } from "react";
import {
  ArrowLeft,
  TreePine,
  Users,
  Award,
  Heart,
  MapPin,
  Phone,
  Mail,
  Star,
  Target,
  Eye,
} from "lucide-react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { useRouter } from "next/navigation";
import LazyImage from "./perf/LazyImage";
import { usePageTracking } from "@/hooks/usePageTracking";

export function AboutPage() {
  const router = useRouter();
  usePageTracking();

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, []);

  const stats = [
    { icon: Users, number: "2000+", label: "Happy Guests" },
    { icon: Award, number: "50+", label: "Awards Won" },
    { icon: Heart, number: "98%", label: "Satisfaction Rate" },
    { icon: Star, number: "4.9", label: "Average Rating" },
  ];

  const team = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      image:
        "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      description: "Visionary leader with 15+ years in hospitality",
    },
    {
      name: "Priya Sharma",
      role: "Operations Director",
      image:
        "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      description: "Expert in luxury resort management",
    },
    {
      name: "Amit Patel",
      role: "Experience Manager",
      image:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      description: "Specialist in adventure and outdoor activities",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Excellence",
      description:
        "We are committed to delivering exceptional experiences that exceed expectations.",
    },
    {
      icon: TreePine,
      title: "Environmental Responsibility",
      description:
        "Sustainable practices and eco-friendly operations are at the core of everything we do.",
    },
    {
      icon: Users,
      title: "Guest-Centric Approach",
      description:
        "Every decision we make is focused on creating memorable moments for our guests.",
    },
  ];

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
            src="https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
            alt="About Nirwana Stays"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-emerald-700/60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            About Nirwana Stays
          </h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up">
            Where Nature Meets Luxury, Creating Unforgettable Memories Since
            2015
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Born from a love for nature, comfort, and authentic hospitality, Nirwana Stays began as a dream to create a place where travellers could escape city life and reconnect with the peaceful charm of the outdoors. What started as a small Pawana Lake camping experience has evolved into the best lake view resort and hotel in Lonavala, Maharashtra — a perfect blend of adventure, relaxation, and scenic beauty.
                </p>
                <p>
                  Nestled on the tranquil shores of Pawna Lake, Nirwana Stays offers guests more than just accommodation — it’s an experience. From cozy lake-view rooms to our exclusive lakeside glamping experience in Lonavala, every stay is designed to bring you closer to nature without compromising on comfort or luxury.
                </p>
                <p>
                  Our journey began with a simple belief: true happiness lies in peaceful moments surrounded by nature. Over time, our small campsite grew into a full-fledged resort near Pawna Lake, offering a variety of stays — from luxury suites and cottages to adventure-filled camping under the stars.
                </p>
                <p>
                  At Nirwana Stays, sustainability and authenticity are at the heart of everything we do. We are committed to preserving the natural beauty of Pawna Lake while providing guests with unforgettable experiences — whether it’s a quiet sunrise by the water, a cozy bonfire night, or a rejuvenating morning in the hills of Lonavala.
                </p>
                <p>
                  Today, Nirwana Stays stands proudly as one of the best lake view resorts in Lonavala, Maharashtra, welcoming travellers from across the country to discover a place where luxury meets nature and every stay feels like a story waiting to be told.
                </p>
                <div className="pt-4 text-base border-t border-gray-200">
                  <p className="font-semibold text-gray-800 mb-2">Legal Information:</p>
                  <p className="text-sm">
                    Nirwana Stays is owned and operated by <span className="font-medium">TUSHAR RAJARAM THAKAR</span>
                  </p>
                  <div className="flex items-start mt-2">
                    <MapPin className="w-4 h-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
                    <p className="text-sm">
                      Registered Address: Pawananagar, At-Yelase, Post-Pawanagar, Yelase, Mawal, Pune, Maharashtra, India – 410406
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-up">
              <div className="grid grid-cols-2 gap-6">
                <LazyImage
                  src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                  alt="Resort view"
                  className="rounded-2xl shadow-lg"
                />
                <LazyImage
                  src="https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                  alt="Camping experience"
                  className="rounded-2xl shadow-lg mt-8"
                />
                <LazyImage
                  src="https://images.pexels.com/photos/2422588/pexels-photo-2422588.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                  alt="Water activities"
                  className="rounded-2xl shadow-lg -mt-8"
                />
                <LazyImage
                  src="https://images.pexels.com/photos/1749644/pexels-photo-1749644.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                  alt="Bonfire nights"
                  className="rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-3xl p-10 shadow-xl animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-8">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                At Nirwana Stays, our mission is to provide exceptional hospitality experiences that celebrate the natural beauty of Pawna Lake and Lonavala, Maharashtra. As the best lake view resort and hotel in Lonavala, we believe in creating a perfect balance between comfort, adventure, and sustainability.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg mt-4">
                Through our Pawna Lake camping and lakeside glamping experiences, we invite guests to reconnect with nature, unwind in serenity, and enjoy eco-friendly stays that support sustainable tourism. Our goal is to offer a peaceful haven where every traveller can rejuvenate their spirit, embrace the outdoors, and create memories that last a lifetime.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-xl animate-slide-up">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-8">
                <Eye className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                At Nirwana Stays, our vision is to become India’s leading eco-luxury lake view resort and hotel, renowned for redefining sustainable hospitality in Lonavala, Maharashtra. We aim to set new benchmarks for comfort and conservation, offering guests an unforgettable lakeside glamping and Pawna Lake camping experience that blends natural beauty with modern luxury.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg mt-4">
                By preserving the pristine surroundings of Pawna Lake and supporting eco-friendly tourism, we strive to create a destination that inspires future generations to travel responsibly and cherish the harmony between nature and hospitality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Our Achievements
            </h2>
            <p className="text-emerald-100 text-lg">
              Numbers that reflect our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-emerald-100">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className="text-center p-8 rounded-3xl bg-gradient-to-b from-emerald-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-emerald-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Experience Nirwana?
          </h2>
          <p className="text-xl text-gray-200 mb-10">
            Let us create an unforgettable experience tailored just for you
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => router.push("/")}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Book Your Stay
            </button>
            <a
              href="tel:+919175106307"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
