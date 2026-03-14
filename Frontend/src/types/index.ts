export interface Location {
  id: string;
  name: string;
  image: string;
}
export interface Amenities{
  id: string;
  name: string;
  icon: string;
}
export interface AccommodationType {
  id: string;
  name: string;
  icon: string;
}
export interface Coupon {
  id: number;
  code: string;
  discountType: 'fixed' | 'percentage';
  discount: string;
  minAmount: string;
  maxDiscount?: string | null;
  expiryDate: string;
  active: number;
  accommodationType: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
}

export interface Accommodation {
  id: string;
  name: string;
  type: string;
  location: string;
  cityId?: string;
  price: number;
  image: string;
  description: string;
  fullDescription: string;
  inclusions: string[];
  exclusions: string[];
  gallery: string[];
  adult_price:number;
  child_price:number;
  max_guest:number;
  available: boolean;
   MaxPersonVilla?: number; 
   ratePerPerson?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  avatar: string;
}

export interface BookingData {
  checkIn: Date | null;
  checkOut: Date | null;
  adults: number;
  children: number;
  name: string;
  email: string;
  phone: string;
}

export interface galleryImage{
  image_url:string;

}