// app/page.js
"use client"; // This makes the component a Client Component

import React, { useState,useEffect } from "react";
import axios from "axios";

function HomePage() {
  const [products, setProducts] = useState([]); // State for storing products

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products"); // Use Axios to fetch data
        setProducts(response.data); // Set the response data to state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs only once when the component mounts

  return (
    <div className="bg-gray-100">
      {/* Header with Navigation */}
      <header className="bg-gray-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">My E-Commerce</h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a href="/" className="hover:text-yellow-400">
                  Home
                </a>
              </li>
              <li>
                <a href="/shop" className="hover:text-yellow-400">
                  Shop
                </a>
              </li>
              <li>
                <a href="/cart" className="hover:text-yellow-400">
                  Cart
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-yellow-400">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Section */}
      <main className="py-12">
        <section className="text-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-20">
          <h2 className="text-4xl font-extrabold">
            Welcome to the Best E-Commerce Store!
          </h2>
          <p className="mt-4 text-xl">
            Shop the latest products at unbeatable prices.
          </p>
        </section>

        {/* Featured Products */}
        <section className="container mx-auto px-4 py-10">
          <h3 className="text-3xl font-semibold text-center text-gray-900 mb-8">
            Featured Products
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-6 rounded-lg shadow-lg transition transform hover:scale-105"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-56 object-cover rounded-md mb-4"
                />
                <h4 className="text-xl font-semibold text-gray-900">
                  {product.name}
                </h4>
                <p className="text-lg text-gray-600 mt-2">{product.price}</p>
                <button className="mt-4 w-full py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 transition duration-300">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 My E-Commerce Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
