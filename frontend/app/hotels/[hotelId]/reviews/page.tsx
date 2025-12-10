'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Review {
  id?: string;
  userName?: string;
  rating: number;
  text?: string;
  createdAt?: string;
}

export default function ReviewsPage() {
  const params = useParams() as any;
  const hotelId = params?.hotelId;
  const search = useSearchParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (!hotelId) return;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/hotels/${hotelId}/reviews`);
        if (res.ok) {
          const list = await res.json();
          setReviews(list || []);
        } else {
          setReviews([]);
        }
      } catch (err) {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [hotelId]);

  const total = reviews.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const pageItems = reviews.slice(start, start + pageSize);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Reviews</h1>
            <Link href="/hotels" className="underline text-sm">Back to hotels</Link>
          </div>
          <p className="text-sm mt-2">Showing reviews for hotel ID: <strong>{hotelId}</strong></p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow">
          {loading ? (
            <div className="py-20 text-center">Loading reviews...</div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">{total} review{total !== 1 ? 's' : ''}</div>

              {pageItems.length === 0 ? (
                <div className="text-gray-700">No reviews yet. Be the first to leave a review!</div>
              ) : (
                <div className="space-y-4">
                  {pageItems.map((r: Review) => (
                    <div key={r.id || Math.random()} className="border p-4 rounded">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-gray-900">{r.userName || 'Anonymous'}</div>
                        <div className="text-yellow-500">{'⭐'.repeat(Math.max(0, Math.min(5, Math.round(r.rating || 0))))}</div>
                      </div>
                      <div className="text-sm text-gray-700 mt-2">{r.text}</div>
                      <div className="text-xs text-gray-500 mt-2">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">Page {page} of {pages}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    disabled={page >= pages}
                    className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
