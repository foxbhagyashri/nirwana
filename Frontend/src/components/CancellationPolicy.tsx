"use client";
import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { useRouter } from 'next/navigation';

export function CancellationPolicy() {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <Navigation onNavigate={handleNavigate} />

      {/* Hero Header */}
      <section className="relative h-[320px] sm:h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Cancellation Policy"
          className="absolute inset-0 w-full h-full object-cover"
          loading='lazy'
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent"></div>
        <div className="relative z-10 text-center w-full animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Cancellation Policy
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 font-light animate-slide-up">
            Flexible cancellation for your peace of mind
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
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-4 font-serif">Standard Cancellation Policy</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>More than 7 days before check-in: Full refund minus processing fees</li>
                <li>4-7 days before check-in: 75% refund</li>
                <li>2-3 days before check-in: 50% refund</li>
                <li>Less than 48 hours: No refund</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-4 font-serif">Peak Season Policy</h2>
              <p>During peak seasons (Dec 20 - Jan 5, major holidays):</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>More than 15 days before check-in: 75% refund</li>
                <li>7-14 days before check-in: 50% refund</li>
                <li>Less than 7 days: No refund</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-4 font-serif">Group Bookings</h2>
              <p>For bookings of 3 or more rooms:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>More than 30 days before check-in: Full refund minus processing fees</li>
                <li>15-30 days before check-in: 75% refund</li>
                <li>7-14 days before check-in: 50% refund</li>
                <li>Less than 7 days: No refund</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-4 font-serif">Force Majeure</h2>
              <p>
                In case of cancellations due to natural disasters, government restrictions, or other unforeseen circumstances beyond our control, a full refund will be provided or booking can be rescheduled without additional charges.
              </p>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-4 font-serif">Refund Processing</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refunds will be processed within 7-10 working days</li>
                <li>Processing fees are non-refundable</li>
                <li>Refund will be made to the original payment method</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
