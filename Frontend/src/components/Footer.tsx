"use client";
import React from "react";
import {
  TreePine,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import Link from "next/link";

export function Footer() {
   const quickLinks = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Gallery", path: "/gallery" },
    { label: "Blogs", path: "/blogs" },
  ];
  const services = [
    "Camping",
    "Villa Stays",
    "Corporate Events",
    "Wedding Venues",
    "Adventure Tours",
  ];

  const handlePolicyClick = (path: string) => {
    // First scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Then reload the page after scroll animation
    setTimeout(() => {
      window.location.href = path;
    }, 500);
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src="/logo-light.png"
                alt="Nirwana Stays Logo"
                className={"h-20 w-auto"}
                loading="lazy"
              />
            </div>
            <p className="text-gray-400 leading-relaxed mb-8">
              Experience nature's paradise at Pawna Lake with luxury
              accommodations, adventure activities, and unforgettable memories.
            </p>

            {/* Social Media */}
           

<div className="flex space-x-4">
  {[
    { Icon: Instagram, url: "https://www.instagram.com/nirwanastays/" },
    { Icon: Facebook, url: "https://www.facebook.com/profile.php?id=100081846432260" },
  ].map(({ Icon, url }, index) => (
    <a
      key={index}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 bg-gray-800 hover:bg-emerald-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
    >
      <Icon className="w-5 h-5" />
    </a>
  ))}
</div>

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4">
             {quickLinks.map((link) => (
              <li key={link.path} className="mb-2">
                <Link
                  href={link.path}
                            className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 hover:translate-x-1 inline-block"

                >
                  {link.label}
                </Link>
              </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          {/* <div>
            <h4 className="text-lg font-semibold mb-6">Our Services</h4>
            <ul className="space-y-4">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Get in Touch</h4>
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-emerald-400 mt-1" />
                <div>
                  <p className="text-gray-400">
                    Pawna Lake, Lonavala
                    <br />
                    Maharashtra, India
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-400" />
                <p className="text-gray-400">+91 9175106307</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-400" />
                <p className="text-gray-400">hello@nirwanastays.com</p>
              </div>
            </div>

            {/* Newsletter */}
            {/* <div className="mt-8">
              <h5 className="font-semibold mb-4">Stay Updated</h5>
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors"
                />
                <button className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors duration-200 font-semibold">
                  Subscribe
                </button>
              </div>
            </div> */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-center sm:text-left">
            © 2024 Nirwana Stays. All rights reserved.
          </p>
          {/* <p className="text-center sm:text-left">
            <span className="text-gray-400">Powered By</span>{" "}
            <span className="text-gray-400 font-bold">Tar</span>
            <span className="text-cyan-400 font-bold">Taria</span>{" "}
            <span className="text-gray-400 font-bold">Te</span>
            <span className="text-gray-400 font-bold">chno</span>
            <span className="text-cyan-400 font-bold">logies</span>
          </p> */}

          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => handlePolicyClick("/privacy-policy")}
              className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:scale-105"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handlePolicyClick("/terms-conditions")}
              className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:scale-105"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => handlePolicyClick("/cancellation-policy")}
              className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:scale-105"
            >
              Cancellation Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
