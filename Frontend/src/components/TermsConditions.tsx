"use client";
import React, { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { useRouter } from "next/navigation";

export function TermsConditions() {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          src="https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Terms & Conditions"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent"></div>
        <div className="relative z-10 text-center w-full animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Terms & Conditions
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 font-light animate-slide-up">
            Please read our terms before booking your stay
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
                Booking and Payment
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>All bookings require a 30% advance payment.</li>
                <li>Full payment must be made before check-in.</li>
                <li>GST and other applicable taxes will be charged extra.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-4 font-serif">
                Check-in and Check-out
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Check-in time: 3:00 PM</li>
                <li>Check-out time: 11:00 AM</li>
                <li>
                  Early check-in and late check-out subject to availability.
                </li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-4 font-serif">
                Property Rules
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Guests must present valid ID proof at check-in.</li>
                <li>Outside food and beverages not allowed.</li>
                <li>Smoking allowed only in designated areas.</li>
                <li>Pets not allowed unless specifically permitted.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-4 font-serif">
                Liability
              </h2>
              <p className="mb-2">Nirwana Stays is not liable for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Loss or damage to personal belongings.</li>
                <li>Accidents or injuries on property.</li>
                <li>Service interruptions due to natural causes.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-4 font-serif">
                Modifications
              </h2>
              <p>
                We reserve the right to modify these terms at any time.
                Continued use of our services constitutes acceptance of updated
                terms.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
