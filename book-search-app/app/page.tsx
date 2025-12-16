"use client";

import { useState } from "react";

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

  // Fetch books
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

  // Handle Search
  const handleSearch = (value: string) => {
    setQuery(value);

    if (!value.trim()) {
      setAllBooks([]);
      setFilteredBooks([]);
      return;
    }

    if (allBooks.length === 0) {
      fetchBooks(value);
      return;
    }

    const filtered = allBooks.filter((book: Book) =>
      book.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl pb-20">

        {/* Title */}
        <h1 className="text-4xl font-bold text-center pt-10">Book Explorer</h1>
        <p className="text-gray-600 text-center mt-2">Search books instantly</p>

        {/* SEARCH BAR WITH BIGGER GAP */}
        <div className="flex justify-center mt-14 px-4">
          <div className="w-full max-w-2xl bg-white rounded-full shadow-md border border-gray-300 flex items-center focus-within:ring-2 focus-within:ring-blue-500 transition">

            {/* Search Icon */}
            <span className="pl-5 text-gray-500 text-lg">🔍</span>

            {/* Input */}
            <input
              type="text"
              placeholder="Search books..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="
                flex-1 py-3 px-4 text-base
                rounded-full 
                outline-none 
                border-none
                bg-transparent
                text-gray-900
              "
            />

            {/* Clear Button */}
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setAllBooks([]);
                  setFilteredBooks([]);
                }}
                className="pr-5 text-gray-400 hover:text-red-500 text-xl"
              >
                ✖
              </button>
            )}
          </div>
        </div>

        {/* Result Count */}
        {query && (
          <p className="text-center mt-4 text-gray-500 mb-8">
            Showing {filteredBooks.length} results for "{query}"
          </p>
        )}

        {/* Empty State */}
        {query && filteredBooks.length === 0 && !loading && (
          <p className="text-center mt-8 text-gray-500">
            No books found. Try another title.
          </p>
        )}

        {/* Loading */}
        {loading && (
          <p className="text-center mt-8 text-gray-500">Loading...</p>
        )}

        {/* Books Grid (moved higher with mt-8) */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {filteredBooks.map((book) => (
              <div
                key={book.key}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 
                hover:shadow-lg hover:scale-105 hover:border-gray-300 transition-all 
                duration-300 p-6 cursor-pointer min-h-[180px] flex items-center justify-center w-full max-w-[260px]"
              >
                <div className="w-full max-w-[220px] mx-auto">

                  {/* Title */}
                  <h3 className="text-base font-semibold text-gray-900 mb-6 line-clamp-2">
                    {book.title}
                  </h3>

                  {/* Authors */}
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-gray-400 text-sm">👤</span>
                    <p className="text-xs text-gray-700 line-clamp-2">
                      {book.author_name?.join(", ") || "Unknown Author"}
                    </p>
                  </div>

                  {/* Year */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">📅</span>
                    <p className="text-xs text-gray-600">
                      {book.first_publish_year || "Year not available"}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
