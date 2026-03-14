"use client";
import React, { useLayoutEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { useRouter } from "next/navigation";

export function PrivacyPolicy() {
  const router = useRouter();

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }
  }, []);

  const handleNavigate = (section: string) => {
      if (section === "home") {
          router.push("/");
      } else if (section === "accommodations") {
          router.push("/#accommodations");
      } else if (section === "about") {
          router.push("/about");
      } else if (section === "gallery") {
        router.push("/gallery");
      }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
      <Navigation
        onNavigate={handleNavigate}
      />

      {/* Hero Header */}
      <section className="relative h-[320px] sm:h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Privacy Policy"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent"></div>
        <div className="relative z-10 text-center w-full animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Privacy Policy
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 font-light animate-slide-up">
            Your privacy matters at Nirwana Stays
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-3xl mx-auto bg-white/90 rounded-3xl shadow-2xl border border-emerald-100 p-6 sm:p-10 animate-slide-up">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="space-y-8 text-gray-700 text-base sm:text-lg leading-relaxed">
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-4 font-serif">
                Introduction
              </h2>
              <p>
                Nirwana Stays is committed to protecting your privacy. This
                Privacy Policy explains how we collect, use, and safeguard your
                personal information when you use our website and services.
              </p>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-4 font-serif">
                Information We Collect
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal details (name, email, phone, address)</li>
                <li>Booking information and preferences</li>
                <li>Payment details</li>
                <li>Communications and feedback</li>
                <li>Website usage data (cookies, analytics)</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-4 font-serif">
                How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To process bookings and payments</li>
                <li>To communicate with you regarding your stay</li>
                <li>To improve our services and website</li>
                <li>To send promotional offers (with your consent)</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-4 font-serif">
                Data Security
              </h2>
              <p>
                We implement industry-standard security measures to protect your
                personal information from unauthorized access, disclosure,
                alteration, or destruction.
              </p>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-4 font-serif">
                Your Rights
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and update your personal information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Contact us for privacy-related concerns</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-4 font-serif">
                Contact Us
              </h2>
              <p>
                For any questions or requests regarding your privacy, please
                contact us at:
                <br />
                <span className="font-semibold">
                  privacy@nirwanastays.com
                </span>{" "}
                or <span className="font-semibold">+91 98765 43210</span>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
