'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center group">
            <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-105 transition-transform">
              <path d="M10 32H34V12H30V8H14V12H10V32ZM14 16H18V20H14V16ZM26 16H30V20H26V16ZM14 24H18V28H14V24ZM26 24H30V28H26V24ZM20 16H24V20H20V16ZM20 24H24V28H20V24Z" fill="#F28C59"/>
              <path d="M12 8L22 2L32 8" stroke="#F28C59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <text x="42" y="26" fill="#FFFFFF" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="22">StayHub</text>
            </svg>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link 
              href="/" 
              className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all font-medium"
            >
              Home
            </Link>
            <Link 
              href="/hotels" 
              className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all font-medium"
            >
              Hotels
            </Link>
            {user && (
              <Link 
                href="/bookings" 
                className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all font-medium"
              >
                My Bookings
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white font-medium">Hello, {user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-lg transition-all font-semibold shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white hover:bg-white/20 px-5 py-2.5 rounded-lg transition-all font-semibold"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-lg transition-all font-semibold shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
