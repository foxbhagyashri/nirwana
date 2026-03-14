"use client";
import React from "react";
import { Home, Building, Tent, TreePine } from "lucide-react";

const options = [
  {
    id: "cottage",
    name: "Cottages",
    icon: Home,
    description: "Perfect for couples and families, our cottages offer cozy interiors with stunning lake or garden views."
  },
  {
    id: "villa",
    name: "Villas",
    icon: Building,
    description: "Experience ultimate comfort and privacy in our luxurious villas — a blend of modern design and natural surroundings."
  },
  {
    id: "camping",
    name: "Camping",
    icon: Tent,
    description: "Enjoy Pawana Lake camping with bonfires, music, and starlit skies. Perfect for adventure lovers who want to feel close to nature."
  },
  {
    id: "glamping",
    name: "Glamping",
    icon: TreePine,
    description: "For those seeking a mix of comfort and wilderness, our lakeside glamping experience in Lonavala combines luxury tents, scenic views, and unforgettable memories."
  }
];

export function AccommodationOptions() {
  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-x-1/2 -translate-y-1/2 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-x-1/2 translate-y-1/2 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Accommodation Options at <span className="text-emerald-600">Nirwana Stays</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your ideal way to stay, relax, and reconnect with nature
          </p>
          <div className="w-24 h-1 bg-emerald-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {options.map((option, index) => {
            const Icon = option.icon;
            return (
              <div 
                key={option.id}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors duration-300">
                  <Icon className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors">
                  {option.name}
                </h3>
                
                <p className="text-gray-600 leading-relaxed text-sm">
                  {option.description}
                </p>

                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

