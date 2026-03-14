import { Location, AccommodationType, Activity, Accommodation, Testimonial } from '../types';
import axios from 'axios';
import { retryWithBackoff } from '../utils/apiRetry';


const BASE_URL = "https://api.nirwanastays.com";
console.log("API Base URL:", BASE_URL);

// Global variables to store the data
let locations: Location[] = [];
let accommodations: Accommodation[] = [];

// Fetch locations and cache them with retry logic
export const fetchLocations = async (forceRefresh: boolean = false): Promise<Location[]> => {
  console.log("Fetching locations from API...");
  if (locations.length && !forceRefresh) return locations;
  
  try {
    const response = await retryWithBackoff(
      () => axios.get(`${BASE_URL}/admin/cities`),
      {
        maxRetries: 3,
        initialDelay: 1000,
        onRetry: (attempt) => {
          console.log(`Retrying locations fetch (attempt ${attempt}/3)...`);
        },
      }
    );
    
    const data = response.data.data;
    console.log("Locations data:", data);
    
    locations = (data || []).map((item: any) => ({
      id: String(item.id),
      name: item.name,
      image: item.image || "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400",
    }));
    
    return locations;
  } catch (error) {
    console.error('Error fetching locations:', error);
    return locations; // Return cached data if available, otherwise empty array
  }
};

export const getLocations = (): Location[] => locations;

export const accommodationTypes: AccommodationType[] = [
  { id: 'cottage', name: 'Cottage', icon: 'Castle' },
  { id: 'villa', name: 'Villa', icon: 'Home' },
  { id: 'camping', name: 'Camping', icon: 'Tent' },
  { id: 'glamping', name: 'Glamping', icon: 'TreePine' }
];

export const activities: Activity[] = [
  {
    id: 'camping',
    name: 'Lakeside Camping',
    description: 'Experience nature under the stars by the beautiful Pawna Lake',
    image: '/lakesidecamping.jpg',
    icon: 'Tent'
  },
  {
    id: 'bonfire',
    name: 'Bonfire Nights',
    description: 'Gather around the fire with music, stories, and marshmallows',
    image: '/bonfirenights.jpg',
    icon: 'Flame'
  },
  {
    id: 'bbq',
    name: 'BBQ & Dining',
    description: 'Enjoy delicious grilled food with scenic lake views',
    image: '/BBQ.jpg',
    icon: 'ChefHat'
  },
  {
    id: 'kayaking',
    name: 'Water Sports',
    description: 'Kayaking, boating, and water activities on pristine waters',
    image: '/watersports.jpg',
    icon: 'Waves'
  },
  {
    id: 'music',
    name: 'Music Nights',
    description: 'Live music sessions and acoustic performances',
    image: '/musicnights.jpg',
    icon: 'Music'
  },
  {
    id: 'stargazing',
    name: 'Stargazing',
    description: 'Observe constellations in the clear night sky',
    image: '/startgazing.jpg',
    icon: 'Star'
  }
];

// Fetch accommodations and cache them with retry logic
export const fetchAccommodations = async (forceRefresh: boolean = false): Promise<Accommodation[]> => {
  console.log("Fetching accommodations from API...");
  if (accommodations.length && !forceRefresh) return accommodations;
  
  try {
    const response = await retryWithBackoff(
      () => axios.get(`${BASE_URL}/admin/properties/accommodations`),
      {
        maxRetries: 3,
        initialDelay: 1000,
        onRetry: (attempt) => {
          console.log(`Retrying accommodations fetch (attempt ${attempt}/3)...`);
        },
      }
    );
    
    const data = response.data.data;
    console.log("Accommodations data:", data);
    
    const normalizeType = (raw: any): string => {
      const t = String(raw || '').trim().toLowerCase();
      const map: Record<string, string> = {
        tent: 'camping',
        tents: 'camping',
        campsite: 'camping',
        camping: 'camping',
        glamp: 'glamping',
        glamping: 'glamping',
        cottage: 'cottage',
        cottages: 'cottage',
        bungalow: 'bungalow',
        bungalows: 'bungalow',
        villa: 'villa',
        villas: 'villa',
        resort: 'villa',
        resorts: 'villa'
      };
      return map[t] || t;
    };

    accommodations = (data || []).map((item: any) => {
      const rawType =
        item.type ||
        item.category ||
        item.category?.name ||
        item.package?.type ||
        item.property_type ||
        item.propertyType ||
        item.accommodationType ||
        '';

      let normalizedType = normalizeType(rawType);
      if (!normalizedType && typeof item.name === 'string') {
        const nameLc = item.name.toLowerCase();
        if (nameLc.includes('cottage')) normalizedType = 'cottage';
        else if (nameLc.includes('bungalow')) normalizedType = 'bungalow';
        else if (nameLc.includes('villa') || nameLc.includes('resort')) normalizedType = 'villa';
        else if (nameLc.includes('glamp')) normalizedType = 'glamping';
        else if (nameLc.includes('camp')) normalizedType = 'camping';
      }

      const loc = item.location;
      const locationString = typeof loc === 'string'
        ? loc
        : [loc?.address, loc?.city, loc?.name].filter(Boolean).join(' ');

      const rawCityId = item.city_id ?? item.cityId ?? item.location?.city_id ?? item.location?.cityId;
      const cityId = rawCityId !== undefined && rawCityId !== null && String(rawCityId).trim() !== ''
        ? String(rawCityId)
        : undefined;

      return ({
        id: String(item.id),
        name: item.name,
        type: normalizedType,
        location: locationString,
        cityId,
        price: parseFloat(item.price),
        image: item.images?.[0] || '',
        description: item.description,
        fullDescription: item.package?.description || item.description,
        inclusions: item.features || [],
        exclusions: [],
        gallery: item.images || [],
        adult_price: item.package?.pricing?.adult || 0,
        child_price: item.package?.pricing?.child || 0,
        // MODIFICATION: Also read max_guests from the root object as a fallback.
        max_guest: item.package?.pricing?.maxGuests || item.max_guests || 0,
        available: item.available,
        // MODIFICATION: Add the villa-specific fields from your SQL table.
        MaxPersonVilla: item.MaxPersonVilla ,
        RatePersonVilla: item.ratePerPerson
 ,
      });
    });
    console.log("Normalized Accommodations:", accommodations);
    return accommodations;
  } catch (error) {
    console.error('Error fetching accommodations:', error);
    return accommodations; // Return cached data if available, otherwise empty array
  }
};

export const getAccommodations = (): Accommodation[] => accommodations;

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    review: 'Amazing experience! The lakeside villa was perfect for our weekend getaway. The views were breathtaking and the staff was incredibly helpful.',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '2',
    name: 'Rahul Patel',
    location: 'Pune',
    rating: 5,
    review: 'The glamping experience was phenomenal! Perfect blend of adventure and comfort. The bonfire nights and activities made it unforgettable.',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '3',
    name: 'Anjali Singh',
    location: 'Delhi',
    rating: 5,
    review: 'Nirwana Stays exceeded all expectations! The location is pristine, activities are well-organized, and the food was delicious. Highly recommended!',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '4',
    name: 'Vikram Joshi',
    location: 'Bangalore',
    rating: 5,
    review: 'Perfect for a corporate retreat! The eco-bungalow was spacious, the team-building activities were engaging, and the natural setting was refreshing.',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];

// Export the arrays (note: these will be empty until fetch functions are called)
export { accommodations, locations };