'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';

interface Hotel {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  amenities: string[];
  description: string;
  // optional detailed reviews list (frontend only)
  reviewsList?: { user: string; rating: number; text: string; date?: string }[];
}

function HotelsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const location = searchParams.get('location') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '2';

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [minRating, setMinRating] = useState(0);
  const [reviewsMap, setReviewsMap] = useState<Record<number, { count: number; avg: number; list: { user: string; rating: number; text: string; date?: string }[] }>>({});
  const [showReviewForm, setShowReviewForm] = useState<Record<number, boolean>>({});
  const [reviewForm, setReviewForm] = useState<Record<number, { rating: number; text: string }>>({});

  useEffect(() => {
    // Mock hotel data filtered by location search
    const mockHotels: Hotel[] = [
      {
        id: 1,
        name: 'Grand Plaza Hotel',
        location: location || 'Mumbai',
        price: 20000,
        rating: 4.8,
        reviews: 342,
        image: '/images/rooms/indoor-design-luxury-resort.jpg',
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'],
        description: 'Luxury hotel in the heart of the city with stunning views',
      },
      {
        id: 2,
        name: 'Sunset Beach Resort',
        location: location || 'Goa',
        price: 15000,
        rating: 4.6,
        reviews: 256,
        image: '/images/rooms/modern-studio-apartment-design-with-bedroom-living-space.jpg',
        amenities: ['WiFi', 'Beach Access', 'Pool', 'Restaurant'],
        description: 'Beachfront resort perfect for a relaxing getaway',
      },
      {
        id: 3,
        name: 'City Center Inn',
        location: location || 'Delhi',
        price: 10000,
        rating: 4.3,
        reviews: 189,
        image: '/images/rooms/vojtech-bruzek-Yrxr3bsPdS0-unsplash.jpg',
        amenities: ['WiFi', 'Parking', 'Breakfast'],
        description: 'Comfortable accommodation in downtown area',
      },
      {
        id: 4,
        name: 'Mountain View Lodge',
        location: location || 'Shimla',
        price: 16000,
        rating: 4.7,
        reviews: 298,
        image: '/images/rooms/markus-spiske-g5ZIXjzRGds-unsplash.jpg',
        amenities: ['WiFi', 'Mountain View', 'Restaurant', 'Fireplace'],
        description: 'Cozy lodge with breathtaking mountain scenery',
      },
      {
        id: 5,
        name: 'Royal Palace Hotel',
        location: location || 'Jaipur',
        price: 29000,
        rating: 4.9,
        reviews: 428,
        image: '/images/rooms/indoor-design-luxury-resort.jpg',
        amenities: ['WiFi', 'Spa', 'Pool', 'Fine Dining', 'Concierge'],
        description: 'Five-star luxury with world-class amenities',
      },
      {
        id: 6,
        name: 'Budget Comfort Suites',
        location: location || 'Bangalore',
        price: 6500,
        rating: 4.1,
        reviews: 156,
        image: '/images/rooms/vojtech-bruzek-Yrxr3bsPdS0-unsplash.jpg',
        amenities: ['WiFi', 'Parking', 'Breakfast'],
        description: 'Affordable and comfortable rooms for budget travelers',
      },
    ];

    setHotels(mockHotels);
    setFilteredHotels(mockHotels);
    // fetch persisted reviews from backend for each mock hotel (if backend available)
    (async () => {
      const map: Record<number, any> = {};
      for (const h of mockHotels) {
        try {
          const res = await fetch(`http://localhost:8080/api/hotels/${h.id}/reviews`);
          if (res.ok) {
            const list = await res.json();
            const count = list.length;
            const avg = count ? list.reduce((s: number, r: any) => s + r.rating, 0) / count : h.rating;
            map[h.id] = { count, avg, list };
          } else {
            map[h.id] = { count: h.reviews || 0, avg: h.rating || 0, list: h.reviewsList || [] };
          }
        } catch (e) {
          map[h.id] = { count: h.reviews || 0, avg: h.rating || 0, list: h.reviewsList || [] };
        }
      }
      setReviewsMap(map);
    })();
  }, [location]);

  useEffect(() => {
    const filtered = hotels.filter(
      (hotel) =>
        hotel.price >= priceRange[0] &&
        hotel.price <= priceRange[1] &&
        hotel.rating >= minRating
    );
    setFilteredHotels(filtered);
  }, [priceRange, minRating, hotels]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">
            Hotels in {location || 'All Locations'}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm">
            {checkIn && <span>Check-in: {checkIn}</span>}
            {checkOut && <span>Check-out: {checkOut}</span>}
            <span>Guests: {guests}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Filters</h3>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Price Range
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">
                    ₹0 - ₹{priceRange[1].toLocaleString('en-IN')} per night
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option value="0">Any</option>
                  <option value="4.0">4.0+</option>
                  <option value="4.5">4.5+</option>
                  <option value="4.8">4.8+</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setPriceRange([0, 50000]);
                  setMinRating(0);
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Hotel Listings */}
          <div className="flex-1">
            <div className="mb-4 text-gray-600">
              {filteredHotels.length} hotels found
            </div>

            <div className="space-y-6">
              {filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Hotel Image */}
                    <div className="md:w-64 h-48 md:h-auto bg-cover bg-center" style={{backgroundImage: `url(${hotel.image})`}}>
                    </div>

                    {/* Hotel Details */}
                    <div className="flex-1 p-6">
                      <div className="mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {hotel.name}
                        </h3>
                        <p className="text-gray-600">📍 {hotel.location}</p>
                      </div>

                      <p className="text-gray-700 mb-4">{hotel.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>

                      {/* Reviews summary and write review option */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-yellow-500 font-semibold">⭐ {reviewsMap[hotel.id]?.avg?.toFixed(1) || hotel.rating}</div>
                            <Link href={`/hotels/${hotel.id}/reviews`} className="text-sm text-gray-600 underline">({reviewsMap[hotel.id]?.count ?? hotel.reviews} reviews)</Link>
                          </div>
                          {/* write review button moved next to Book Now for a cleaner layout */}
                        </div>

                        {showReviewForm[hotel.id] && (
                          <div className="mt-3 bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your rating</label>
                            <div className="flex items-center gap-1 mb-3">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setReviewForm((r) => ({ ...r, [hotel.id]: { ...(r[hotel.id] || { rating: 5, text: '' }), rating: s } }))}
                                  className={`px-2 py-1 rounded ${((reviewForm[hotel.id]?.rating) ?? 0) >= s ? 'bg-yellow-400 text-white' : 'bg-white text-gray-500 border'}`}
                                >
                                  ⭐
                                </button>
                              ))}
                            </div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">Your review</label>
                            <textarea
                              value={reviewForm[hotel.id]?.text ?? ''}
                              onChange={(e) => setReviewForm((r) => ({ ...r, [hotel.id]: { ...(r[hotel.id] || { rating: 5, text: '' }), text: e.target.value } }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
                              rows={3}
                              placeholder="Share your experience"
                            />

                            <div className="flex items-center gap-3">
                              <button
                                onClick={async () => {
                                  const form = reviewForm[hotel.id] || { rating: 5, text: '' };
                                  const userName = (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user') || '{}')?.name) || 'Anonymous';
                                  // POST to backend
                                  try {
                                    const res = await fetch(`http://localhost:8080/api/hotels/${hotel.id}/reviews`, {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ userName, rating: form.rating || 5, text: form.text || '' }),
                                    });
                                    if (res.ok) {
                                      const saved = await res.json();
                                      setReviewsMap((m) => {
                                        const prev = m[hotel.id] || { count: hotel.reviews || 0, avg: hotel.rating || 0, list: [] };
                                        const newCount = prev.count + 1;
                                        const newAvg = ((prev.avg * prev.count) + saved.rating) / newCount;
                                        return { ...m, [hotel.id]: { count: newCount, avg: newAvg, list: [saved, ...(prev.list || [])] } };
                                      });
                                    } else {
                                      // fallback: update locally if backend unavailable
                                      const newReview = { user: userName, rating: form.rating || 5, text: form.text || '', date: new Date().toISOString() };
                                      setReviewsMap((m) => {
                                        const prev = m[hotel.id] || { count: hotel.reviews || 0, avg: hotel.rating || 0, list: [] };
                                        const newCount = prev.count + 1;
                                        const newAvg = ((prev.avg * prev.count) + newReview.rating) / newCount;
                                        return { ...m, [hotel.id]: { count: newCount, avg: newAvg, list: [newReview, ...(prev.list || [])] } };
                                      });
                                    }
                                  } catch (err) {
                                    const newReview = { user: userName, rating: form.rating || 5, text: form.text || '', date: new Date().toISOString() };
                                    setReviewsMap((m) => {
                                      const prev = m[hotel.id] || { count: hotel.reviews || 0, avg: hotel.rating || 0, list: [] };
                                      const newCount = prev.count + 1;
                                      const newAvg = ((prev.avg * prev.count) + newReview.rating) / newCount;
                                      return { ...m, [hotel.id]: { count: newCount, avg: newAvg, list: [newReview, ...(prev.list || [])] } };
                                    });
                                  }

                                  // clear form & hide
                                  setReviewForm((r) => ({ ...r, [hotel.id]: { rating: 5, text: '' } }));
                                  setShowReviewForm((s) => ({ ...s, [hotel.id]: false }));
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                              >
                                Submit Review
                              </button>
                              <button
                                onClick={() => setShowReviewForm((s) => ({ ...s, [hotel.id]: false }))}
                                className="text-sm text-gray-600"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {/* show a couple of latest reviews */}
                        {/* Reviews are summarized on the card; click the reviews count to see all reviews on a separate page. */}
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-3xl font-bold text-blue-600">
                            ₹{hotel.price.toLocaleString('en-IN')}
                          </p>
                          <p className="text-sm text-gray-600">per night</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setShowReviewForm((s) => ({ ...s, [hotel.id]: !s[hotel.id] }))}
                            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition-colors"
                            aria-label={`Write a review for ${hotel.name}`}
                          >
                            {showReviewForm[hotel.id] ? 'Close review' : 'Write a review'}
                          </button>

                          <Link
                            href={`/booking?hotelId=${hotel.id}&hotelName=${encodeURIComponent(hotel.name)}&price=${hotel.price}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                          >
                            Book Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HotelsContent />
    </Suspense>
  );
}
