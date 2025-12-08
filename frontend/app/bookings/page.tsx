'use client';

import { useEffect, useState } from 'react';
import { bookingsAPI } from '../lib/api';
import toast from 'react-hot-toast';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      window.location.href = '/login';
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    
    loadBookings(userData.email);
  }, []);

  const loadBookings = async (email: string) => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getUserBookings(email);
      setBookings(response);
      
      // Also save to localStorage for backward compatibility
      localStorage.setItem('bookings', JSON.stringify(response));
    } catch (error) {
      console.error('Failed to load bookings:', error);
      toast.error('Failed to load bookings from server. Showing cached data.');
      // Fallback to localStorage if backend fails
      const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      setBookings(storedBookings);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string, hotelName: string) => {
    // Create a custom toast for confirmation
    const confirmToast = toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Cancel Booking?
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {hotelName}
              </p>
              <div className="mt-3">
                <input
                  id="cancel-reason"
                  type="text"
                  placeholder="Reason (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              const reasonInput = document.getElementById('cancel-reason') as HTMLInputElement;
              const reason = reasonInput?.value || 'No reason provided';
              processCancellation(bookingId, reason);
            }}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none"
          >
            Confirm
          </button>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const processCancellation = async (bookingId: string, reason: string) => {
    try {
      setCancellingId(bookingId);
      toast.loading('Cancelling booking...', { id: 'cancel-booking' });
      
      const response = await bookingsAPI.cancelBooking(bookingId, reason);
      
      if (response.success) {
        toast.success('Booking cancelled successfully!', { id: 'cancel-booking' });
        // Reload bookings
        if (user) {
          loadBookings(user.email);
        }
      } else {
        toast.error('Failed to cancel: ' + response.message, { id: 'cancel-booking' });
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      toast.error('Failed to cancel booking. Please try again.', { id: 'cancel-booking' });
    } finally {
      setCancellingId(null);
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't made any bookings yet. Start exploring our hotels!
            </p>
            <a
              href="/hotels"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              Browse Hotels
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {booking.hotelName}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
                      <p>👤 Guest: {booking.fullName}</p>
                      <p>📧 Email: {booking.email}</p>
                      <p>📅 Check-in: {booking.checkIn}</p>
                      <p>📅 Check-out: {booking.checkOut}</p>
                      <p>🌙 Nights: {booking.nights}</p>
                      <p>🏠 Rooms: {booking.rooms}</p>
                      <p>👥 Adults: {booking.adults}</p>
                      <p>👶 Children: {booking.children}</p>
                      {booking.mealPreference && booking.mealPreference !== 'none' && (
                        <p>🍽️ Meals: {booking.mealPreference === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}</p>
                      )}
                    </div>
                    {booking.specialRequests && (
                      <p className="mt-2 text-gray-600">
                        💬 Special Requests: {booking.specialRequests}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">
                      ₹{booking.totalPrice.toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-gray-600">Total Price</p>
                    
                    {booking.status === 'CANCELLED' ? (
                      <div className="mt-2">
                        <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                          Cancelled
                        </span>
                        {booking.cancellationReason && (
                          <p className="text-xs text-gray-500 mt-1">
                            Reason: {booking.cancellationReason}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="mt-2 space-y-2">
                        <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                          Confirmed
                        </span>
                        <button
                          onClick={() => handleCancelBooking(booking.id, booking.hotelName)}
                          disabled={cancellingId === booking.id}
                          className="block w-full mt-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                        >
                          {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
