"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/hotels?location=${location}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-blue-100">
        <div className="absolute inset-0 bg-slate-700 bg-opacity-80">
          <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: 'url(/images/bgplaceholder/full-shot-smiley-family-with-baggage.jpg)'}}></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl md:text-2xl text-white drop-shadow-lg">
              Discover amazing hotels, resorts, and accommodations worldwide
            </p>
            </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 -mt-24 relative z-10">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where are you going?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5+ Guests</option>
                </select>
              </div>

              <div className="md:col-span-5">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors text-lg shadow-lg"
                >
                  Search Hotels
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Popular Destinations (kept small for brevity) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Popular Destinations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: 'Mumbai', hotels: '250+ Hotels', image: '/images/hoteloutskirt/hotel-nevada-usa.jpg' },
              { name: 'Delhi', hotels: '180+ Hotels', image: '/images/hoteloutskirt/bilderboken-rlwE8f8anOc-unsplash.jpg' },
              { name: 'Bangalore', hotels: '320+ Hotels', image: '/images/hoteloutskirt/christian-lambert-vmIWr0NnpCQ-unsplash.jpg' },
              { name: 'Goa', hotels: '200+ Hotels', image: '/images/hoteloutskirt/sara-dubler-Koei_7yYtIo-unsplash.jpg' },
            ].map((dest) => (
              <div
                key={dest.name}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden group"
              >
                <div className="h-40 bg-cover bg-center group-hover:scale-110 transition-transform" style={{backgroundImage: `url(${dest.image})`}}>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900">{dest.name}</h3>
                  <p className="text-gray-600">{dest.hotels}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
