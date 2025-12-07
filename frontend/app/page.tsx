'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    alert('Logged out successfully!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="bg-white p-12 rounded-2xl shadow-xl w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Welcome to Spring Boot + Next.js App
        </h1>

        {user ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-green-800 mb-2">
                Hello, {user.name}! 👋
              </h2>
              <p className="text-green-700">Email: {user.email}</p>
              <p className="text-green-700">User ID: {user.userId}</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-gray-600 mb-6 text-lg">
              Please login or signup to continue
            </p>
            
            <Link
              href="/login"
              className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium text-lg"
            >
              Login
            </Link>
            
            <Link
              href="/signup"
              className="block w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors text-center font-medium text-lg"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
