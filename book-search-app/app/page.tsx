"use client";

import { useEffect, useState } from "react";

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
}

export default function BookExplorer() {
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch books
  const fetchBooks = async (searchText: string) => {
    if (!searchText.trim()) {
      setBooks([]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchText)}`
      );
      const data = await res.json();
      setBooks(data.docs || []);
    } catch (err) {
      console.error("Error fetching books:", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center pt-10">Book Explorer</h1>
      <p className="text-gray-600 text-center mt-2">Search books instantly</p>

      {/* Search Bar Container */}
      <div className="flex justify-center mt-12 px-4">
        <div className="relative w-full max-w-2xl">
          <input
            type="text"
            placeholder="Search books..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              fetchBooks(e.target.value);
            }}
            className="w-full px-5 py-3 pl-11 text-base rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
          />
          <span className="absolute left-4 top-3 text-gray-400 text-lg">🔍</span>
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setBooks([]);
              }}
              className="absolute right-4 top-3 text-gray-400 hover:text-black text-lg"
            >
              ✖
            </button>
          )}
        </div>
      </div>

      {/* Result Count */}
      {query && (
        <p className="text-center mt-4 text-gray-500">
          Showing {books.length} results for "{query}"
        </p>
      )}

      {/* Books Grid Container - Centered with equal spacing */}
      <div className="flex justify-center px-4 mt-12">
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {books.map((book) => (
              <div
                key={book.key}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:scale-105 hover:border-gray-300 transition-all duration-300 p-4 cursor-pointer"
              >
                <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                  {book.title}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400 text-sm">👤</span>
                  <p className="text-xs text-gray-700 line-clamp-2">
                    {book.author_name?.join(", ") || "Unknown Author"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">📅</span>
                  <p className="text-xs text-gray-600">
                    {book.first_publish_year || "Not available"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
