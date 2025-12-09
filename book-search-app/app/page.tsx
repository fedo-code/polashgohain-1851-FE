"use client";

import { useEffect, useState } from "react";

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
}

export default function BookExplorer() {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch books from API
  const fetchBooks = async (searchText: string) => {
    if (!searchText.trim()) {
      setAllBooks([]);
      setFilteredBooks([]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchText)}`
      );
      const data = await res.json();
      const results = data.docs || [];
      setAllBooks(results);
      setFilteredBooks(results);
    } catch (err) {
      console.error("Error fetching books:", err);
      setAllBooks([]);
      setFilteredBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search and filter
  const handleSearch = (value: string) => {
    setQuery(value);
    
    if (!value.trim()) {
      setAllBooks([]);
      setFilteredBooks([]);
      return;
    }

    // First search - fetch from API
    if (allBooks.length === 0) {
      fetchBooks(value);
    } else {
      // Subsequent typing - filter existing results
      const filtered = allBooks.filter((book: Book) =>
        book.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredBooks(filtered);
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
              handleSearch(e.target.value);
            }}
            className="w-full px-5 py-3 pl-11 text-base rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
          />
          <span className="absolute left-4 top-3 text-gray-400 text-lg">🔍</span>
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setAllBooks([]);
                setFilteredBooks([]);
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
          Showing {filteredBooks.length} results for "{query}"
        </p>
      )}

      {/* Empty State */}
      {query && filteredBooks.length === 0 && !loading && (
        <p className="text-center mt-8 text-gray-500">
          No books found. Try another title.
        </p>
      )}

      {/* Loading State */}
      {loading && (
        <p className="text-center mt-8 text-gray-500">
          Loading...
        </p>
      )}

      {/* Books Grid Container - Centered with equal spacing */}
      <div className="flex justify-center px-4 mt-24">
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
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
                    {book.first_publish_year || "Year not available"}
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
