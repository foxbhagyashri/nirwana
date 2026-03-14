import React from "react";
import { Home, Building, Tent, TreePine, Castle } from "lucide-react";
import { accommodationTypes } from "../data";

const iconMap = {
  Home,
  Building,
  Tent,
  TreePine,
  Castle,
};

interface AccommodationTypesProps {
  selectedType: string;
  onTypeSelect: (typeId: string) => void;
}

export function AccommodationTypes({
  selectedType,
  onTypeSelect,
}: AccommodationTypesProps) {
  return (
    <section className="py-0 bg-white overflow-x-hidden pt-5 mt-5" id="accommodations">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-6 sm:mb-10 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">
            Accommodation Types
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Choose your perfect stay experience
          </p>
        </div>

        {/* Horizontal scroll container */}
        <div className="overflow-x-auto -mx-4 px-4">
          <div
            className="
              flex gap-4 sm:gap-6
              pb-4
              snap-x snap-mandatory
              justify-center
              min-w-max
            "
          >
            {accommodationTypes.map((type, index) => {
              const IconComponent = iconMap[type.icon as keyof typeof iconMap];
              const isSelected = selectedType === type.id;

              return (
                <div
                  key={type.id}
                  onClick={() => onTypeSelect(type.id)}
                  className={`
                  flex-shrink-0 flex flex-col items-center
                  cursor-pointer
                  min-w-[70px] sm:min-w-[90px]
                  snap-start
                  transition-transform duration-300
                  hover:scale-105 active:scale-95
                  animate-slide-up
                  pt-2
                `}
                  style={{ animationDelay: `${index * 100}ms`, willChange: "transform" }}
                >
                  <div
                    className={`
                    w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-2 
                    transition-all duration-300
                    ${isSelected
                        ? "bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-lg scale-105"
                        : "bg-gradient-to-br from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 shadow-md"
                      }
                  `}
                  >
                    <IconComponent
                      className={`
                      w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-300
                      ${isSelected ? "text-white" : "text-emerald-700"}
                    `}
                    />
                  </div>
                  <span
                    className={`
                    text-xs sm:text-sm font-medium text-center
                    ${isSelected ? "text-emerald-600" : "text-gray-700"}
                  `}
                  >
                    {type.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
