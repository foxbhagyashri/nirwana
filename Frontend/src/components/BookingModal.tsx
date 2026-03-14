// import React, { useState } from 'react';
// import { X, Calendar, Users, Phone, Mail, User, MapPin, Star, Wifi, Car, Coffee } from 'lucide-react';
// import { Accommodation, BookingData } from '../types';

// interface BookingModalProps {
//   accommodation: Accommodation | null;
//   isOpen: boolean;
//   onClose: () => void;
// }

// export function BookingModal({ accommodation, isOpen, onClose }: BookingModalProps) {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [formData, setFormData] = useState<BookingData>({
//     checkIn: null,
//     checkOut: null,
//     adults: 2,
//     children: 0,
//     name: '',
//     email: '',
//     phone: ''
//   });

//   if (!isOpen || !accommodation) return null;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Booking submitted:', formData);
//     alert('Booking request submitted! We will contact you shortly.');
//     onClose();
//   };

//   const handleInputChange = (field: keyof BookingData, value: string | number) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const calculateNights = () => {
//     if (formData.checkIn && formData.checkOut) {
//       const checkIn = new Date(formData.checkIn);
//       const checkOut = new Date(formData.checkOut);
//       const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//       return diffDays;
//     }
//     return 1;
//   };

//   const totalAmount = accommodation.price * calculateNights();

//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
//       <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden relative">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
//         >
//           <X className="w-6 h-6 text-gray-600" />
//         </button>

//         <div className="grid lg:grid-cols-2 h-full overflow-y-auto">
//           {/* Left Side - Image Gallery and Details */}
//           <div className="bg-gray-50">
//             {/* Image Gallery */}
//             <div className="relative h-64 lg:h-80">
//               <img
//                 src={accommodation.gallery[currentImageIndex] || accommodation.image}
//                 alt={accommodation.name}
//                 className="w-full h-full object-cover"
//               />

//               {/* Image Navigation */}
//               {accommodation.gallery.length > 1 && (
//                 <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
//                   {accommodation.gallery.map((_, index) => (
//                     <button
//                       key={index}
//                       onClick={() => setCurrentImageIndex(index)}
//                       className={`w-3 h-3 rounded-full transition-all ${
//                         index === currentImageIndex ? 'bg-white' : 'bg-white/50'
//                       }`}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Accommodation Details */}
//             <div className="p-8">
//               <div className="mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-3">{accommodation.name}</h2>
//                 <div className="flex items-center space-x-2 text-gray-600">
//                   <MapPin className="w-4 h-4" />
//                   <span className="capitalize">{accommodation.location}</span>
//                   <span className="mx-2">•</span>
//                   <span className="capitalize">{accommodation.type}</span>
//                 </div>
//               </div>

//               <p className="text-gray-600 mb-8 leading-relaxed">{accommodation.fullDescription}</p>

//               {/* Price */}
//               <div className="bg-emerald-50 rounded-2xl p-6 mb-8">
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">Price per night</span>
//                   <span className="text-2xl font-bold text-emerald-600">₹{accommodation.price.toLocaleString()}</span>
//                 </div>
//               </div>

//               {/* Inclusions */}
//               <div className="mb-8">
//                 <h4 className="font-semibold text-gray-800 mb-4">Included</h4>
//                 <ul className="space-y-3">
//                   {accommodation.inclusions.map((item, index) => (
//                     <li key={index} className="flex items-center space-x-3 text-gray-600">
//                       <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
//                       <span>{item}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {/* Exclusions */}
//               <div>
//                 <h4 className="font-semibold text-gray-800 mb-4">Not Included</h4>
//                 <ul className="space-y-3">
//                   {accommodation.exclusions.map((item, index) => (
//                     <li key={index} className="flex items-center space-x-3 text-gray-500">
//                       <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
//                       <span>{item}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Booking Form */}
//           <div className="p-8 overflow-y-auto">
//             <h3 className="text-2xl font-bold text-gray-800 mb-8">Complete Your Booking</h3>

//             <form onSubmit={handleSubmit} className="space-y-8">
//               {/* Dates */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-3">
//                     <Calendar className="w-4 h-4 inline mr-2" />
//                     Check-in Date
//                   </label>
//                   <input
//                     type="date"
//                     required
//                     className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                     value={formData.checkIn}
//                     onChange={(e) => handleInputChange('checkIn', e.target.value)}
//                     min={new Date().toISOString().split('T')[0]}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-3">
//                     <Calendar className="w-4 h-4 inline mr-2" />
//                     Check-out Date
//                   </label>
//                   <input
//                     type="date"
//                     required
//                     className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                     value={formData.checkOut}
//                     onChange={(e) => handleInputChange('checkOut', e.target.value)}
//                     min={formData.checkIn || new Date().toISOString().split('T')[0]}
//                   />
//                 </div>
//               </div>

//               {/* Guests */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-3">
//                     <Users className="w-4 h-4 inline mr-2" />
//                     Adults
//                   </label>
//                   <select
//                     className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                     value={formData.adults}
//                     onChange={(e) => handleInputChange('adults', parseInt(e.target.value))}
//                   >
//                     {[1, 2, 3, 4, 5, 6].map(num => (
//                       <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-3">
//                     <Users className="w-4 h-4 inline mr-2" />
//                     Children
//                   </label>
//                   <select
//                     className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                     value={formData.children}
//                     onChange={(e) => handleInputChange('children', parseInt(e.target.value))}
//                   >
//                     {[0, 1, 2, 3, 4].map(num => (
//                       <option key={num} value={num}>{num} Child{num !== 1 ? 'ren' : ''}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Contact Information */}
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-3">
//                     <User className="w-4 h-4 inline mr-2" />
//                     Full Name
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                     value={formData.name}
//                     onChange={(e) => handleInputChange('name', e.target.value)}
//                     placeholder="Enter your full name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-3">
//                     <Mail className="w-4 h-4 inline mr-2" />
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     required
//                     className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                     value={formData.email}
//                     onChange={(e) => handleInputChange('email', e.target.value)}
//                     placeholder="Enter your email"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-3">
//                     <Phone className="w-4 h-4 inline mr-2" />
//                     Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     required
//                     className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                     value={formData.phone}
//                     onChange={(e) => handleInputChange('phone', e.target.value)}
//                     placeholder="Enter your phone number"
//                   />
//                 </div>
//               </div>

//               {/* Booking Summary */}
//               <div className="bg-gray-50 rounded-xl p-6">
//                 <h4 className="font-semibold text-gray-800 mb-4">Booking Summary</h4>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span>Nights:</span>
//                     <span>{calculateNights()}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Rate per night:</span>
//                     <span>₹{accommodation.price.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Guests:</span>
//                     <span>{formData.adults + formData.children}</span>
//                   </div>
//                   <div className="border-t pt-3 flex justify-between font-semibold text-lg">
//                     <span>Total Amount:</span>
//                     <span className="text-emerald-600">₹{totalAmount.toLocaleString()}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-4 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
//               >
//                 Confirm Booking
//               </button>
//             </form>

//             <p className="text-xs text-gray-500 mt-6 text-center">
//               By booking, you agree to our terms and conditions. You will receive a confirmation email shortly.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
