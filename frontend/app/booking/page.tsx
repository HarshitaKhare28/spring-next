'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { bookingsAPI } from '../lib/api';
import toast from 'react-hot-toast';

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const hotelId = searchParams.get('hotelId');
  const hotelName = searchParams.get('hotelName') || '';
  const pricePerNight = parseFloat(searchParams.get('price') || '0');
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '2';

  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    adults: '2',
    children: '0',
    rooms: '1',
    mealPreference: 'none',
    specialRequests: '',
  });
  const [nights, setNights] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      toast.error('Please login to book a hotel');
      router.push('/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    
    // Pre-fill email from user data
    setFormData(prev => ({
      ...prev,
      email: userData.email || '',
      fullName: userData.name || ''
    }));

    // Calculate nights
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays);
    }
  }, [checkIn, checkOut, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const bookingData = {
        userId: user.id || '',
        userEmail: user.email,
        hotelId: hotelId || '',
        hotelName,
        checkIn,
        checkOut,
        nights,
        pricePerNight,
        totalPrice: calculateTotal(),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        rooms: parseInt(formData.rooms),
        adults: parseInt(formData.adults),
        children: parseInt(formData.children),
        mealPreference: formData.mealPreference,
        specialRequests: formData.specialRequests,
      };

      toast.loading('Creating booking...', { id: 'booking-submit' });
      const response = await bookingsAPI.create(bookingData);
      
      if (response.success) {
        // Also save to localStorage for backward compatibility
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        bookings.push(response.booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        toast.success('Booking confirmed! Redirecting...', { id: 'booking-submit' });
        setTimeout(() => router.push('/bookings'), 1000);
      } else {
        toast.error('Failed to create booking: ' + response.message, { id: 'booking-submit' });
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking. Please try again.', { id: 'booking-submit' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    const roomCost = pricePerNight * nights * parseInt(formData.rooms);
    const mealCost = formData.mealPreference === 'veg' ? 1500 * nights : 
                     formData.mealPreference === 'nonveg' ? 2500 * nights : 0;
    return roomCost + mealCost;
  };

  if (!hotelName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Guest Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-bold mb-4 text-gray-900">Room & Guest Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Number of Rooms *
                      </label>
                      <select
                        value={formData.rooms}
                        onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                      >
                        <option value="1">1 Room</option>
                        <option value="2">2 Rooms</option>
                        <option value="3">3 Rooms</option>
                        <option value="4">4 Rooms</option>
                        <option value="5">5+ Rooms</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Adults *
                      </label>
                      <select
                        value={formData.adults}
                        onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                      >
                        <option value="1">1 Adult</option>
                        <option value="2">2 Adults</option>
                        <option value="3">3 Adults</option>
                        <option value="4">4 Adults</option>
                        <option value="5">5+ Adults</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Children
                      </label>
                      <select
                        value={formData.children}
                        onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                      >
                        <option value="0">No Children</option>
                        <option value="1">1 Child</option>
                        <option value="2">2 Children</option>
                        <option value="3">3 Children</option>
                        <option value="4">4+ Children</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-bold mb-4 text-gray-900">Meal Preference</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="relative flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      <input
                        type="radio"
                        name="mealPreference"
                        value="none"
                        checked={formData.mealPreference === 'none'}
                        onChange={(e) => setFormData({ ...formData, mealPreference: e.target.value })}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">No Meals</div>
                        <div className="text-sm text-gray-600">Room only</div>
                      </div>
                    </label>

                    <label className="relative flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      <input
                        type="radio"
                        name="mealPreference"
                        value="veg"
                        checked={formData.mealPreference === 'veg'}
                        onChange={(e) => setFormData({ ...formData, mealPreference: e.target.value })}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">🥗 Vegetarian</div>
                        <div className="text-sm text-gray-600">+₹1500/night</div>
                      </div>
                    </label>

                    <label className="relative flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      <input
                        type="radio"
                        name="mealPreference"
                        value="nonveg"
                        checked={formData.mealPreference === 'nonveg'}
                        onChange={(e) => setFormData({ ...formData, mealPreference: e.target.value })}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">🍗 Non-Vegetarian</div>
                        <div className="text-sm text-gray-600">+₹2500/night</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Any special requirements or requests..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </button>
              </form>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Booking Summary</h3>

              <div className="mb-6">
                <h4 className="font-bold text-lg text-gray-900">{hotelName}</h4>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Check-in:</span>
                  <span className="font-semibold">{checkIn}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Check-out:</span>
                  <span className="font-semibold">{checkOut}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Nights:</span>
                  <span className="font-semibold">{nights}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Rooms:</span>
                  <span className="font-semibold">{formData.rooms}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Guests:</span>
                  <span className="font-semibold">
                    {formData.adults} Adult{parseInt(formData.adults) > 1 ? 's' : ''}
                    {parseInt(formData.children) > 0 && `, ${formData.children} Child${parseInt(formData.children) > 1 ? 'ren' : ''}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Price per night:</span>
                  <span className="font-semibold">₹{pricePerNight}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Room cost ({nights} nights × {formData.rooms} room{parseInt(formData.rooms) > 1 ? 's' : ''}):</span>
                  <span className="font-semibold">₹{pricePerNight * nights * parseInt(formData.rooms)}</span>
                </div>
                {formData.mealPreference !== 'none' && (
                  <div className="flex justify-between text-gray-700">
                    <span>
                      Meals ({formData.mealPreference === 'veg' ? 'Vegetarian' : 'Non-Veg'}):
                    </span>
                    <span className="font-semibold">
                      ₹{formData.mealPreference === 'veg' ? 1500 * nights : 2500 * nights}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{calculateTotal()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Includes all taxes and fees</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}
