"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Heart,
  Star,
  TrendingUp,
} from "lucide-react";
// import Router  from "next/router";
// import { useRouter } from 'next/router';
import Link from "next/link";

// Replace button with a Link component for a smoother transition

function HomePage() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    // Get existing cart from memory or initialize empty array
    const existingCart = cartItems;

    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex(
      (item) => item.id === product.id
    );

    let updatedCart;
    if (existingItemIndex > -1) {
      // Update quantity if exists
      updatedCart = existingCart.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // Add new item with quantity 1
      updatedCart = [...existingCart, { ...product, quantity: 1 }];
    }

    // Update cart state
    setCartItems(updatedCart);
    setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0));

    // Add subtle animation feedback
    const button = document.querySelector(`[data-product="${product.id}"]`);
    if (button) {
      button.classList.add("scale-95");
      setTimeout(() => button.classList.remove("scale-95"), 150);
    }

    // Show success message (optional toast notification effect)
    showAddToCartNotification(product.name);
  };

  const showAddToCartNotification = (productName) => {
    // Create temporary notification element
    const notification = document.createElement("div");
    notification.className =
      "fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in";
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>Added to cart!</span>
      </div>
    `;
    document.body.appendChild(notification);

    // Remove after 2 seconds
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateX(100%)";
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  };

  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sellHandle = () => {
    // alert('sell')
    router.push("/sellers");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                ShopHub
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className="text-gray-700 hover:text-yellow-500 font-medium transition"
              >
                Home
              </a>
              <a
                href="/shop"
                className="text-gray-700 hover:text-yellow-500 font-medium transition"
              >
                Shop
              </a>
              <a
                href="/deals"
                className="text-gray-700 hover:text-yellow-500 font-medium transition"
              >
                Deals
              </a>
              <a
                href="/contact"
                className="text-gray-700 hover:text-yellow-500 font-medium transition"
              >
                Contact
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Link href="/sellers">
                <button className="hidden md:block p-2 bg-red-500 px-5 rounded-lg transition">
                  Sell
                </button>
              </Link>

              <button className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              <a
                href="/cart"
                className="relative p-2 hover:bg-gray-100 rounded-full transition"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce">
                    {cartCount}
                  </span>
                )}
              </a>
              <button
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 border-t">
              <a
                href="/"
                className="block py-2 text-gray-700 hover:text-yellow-500 font-medium"
              >
                Home
              </a>
              <a
                href="/shop"
                className="block py-2 text-gray-700 hover:text-yellow-500 font-medium"
              >
                Shop
              </a>
              <a
                href="/deals"
                className="block py-2 text-gray-700 hover:text-yellow-500 font-medium"
              >
                Deals
              </a>
              <a
                href="/contact"
                className="block py-2 text-gray-700 hover:text-yellow-500 font-medium"
              >
                Contact
              </a>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 text-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-24 md:py-40 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <span className="text-sm font-semibold">
                  ✨ New Arrivals Every Week
                </span>
              </div>

              <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                Discover Amazing Products
              </h2>

              <p className="text-xl md:text-2xl mb-8 text-white/95 leading-relaxed">
                Shop the latest trends with unbeatable prices and fast shipping.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="group bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-all shadow-2xl hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2">
                  Shop Now
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
                <button className="border-2 border-white px-8 py-4 rounded-full font-bold hover:bg-white/20 backdrop-blur-sm transition-all">
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl md:text-4xl font-bold mb-1">
                    50K+
                  </div>
                  <div className="text-sm text-white/80">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold mb-1">
                    1000+
                  </div>
                  <div className="text-sm text-white/80">Products</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold mb-1">
                    4.9★
                  </div>
                  <div className="text-sm text-white/80">Rating</div>
                </div>
              </div>
            </div>

            {/* Right Content - Feature Cards */}
            <div className="hidden md:block relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform hover:-translate-y-2">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">🚚</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Free Shipping</h3>
                  <p className="text-sm text-white/80">On orders over $50</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform hover:-translate-y-2 mt-8">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">💳</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Secure Payment</h3>
                  <p className="text-sm text-white/80">100% protected</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform hover:-translate-y-2">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">↩️</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Easy Returns</h3>
                  <p className="text-sm text-white/80">30-day guarantee</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform hover:-translate-y-2 mt-8">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
                  <p className="text-sm text-white/80">Always here to help</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#F9FAFB"
            />
          </svg>
        </div>
      </section>

      {/* Search Bar */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-3 flex items-center border-2 border-gray-100 hover:border-yellow-400 transition-all">
            <Search className="w-6 h-6 text-gray-400 ml-4" />
            <input
              type="text"
              placeholder="Search for products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 outline-none text-lg"
            />
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all mr-1">
              Search
            </button>
          </div>

          {/* Quick Links */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="text-gray-600 text-sm">Trending:</span>
            {["Electronics", "Fashion", "Home Decor", "Sports", "Books"].map(
              (tag) => (
                <button
                  key={tag}
                  className="px-4 py-1.5 bg-white rounded-full text-sm text-gray-700 hover:bg-yellow-100 hover:text-yellow-700 transition-all shadow-sm border border-gray-200"
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Featured Products
          </h3>
          <p className="text-gray-600">Handpicked items just for you</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-4 animate-pulse"
              >
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition shadow-lg"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.has(product.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      } transition`}
                    />
                  </button>
                  <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                    NEW
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">(4.8)</span>
                  </div>

                  <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h4>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      {product.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      $99.99
                    </span>
                  </div>

                  <button
                    data-product={product.id}
                    onClick={() => addToCart(product)}
                    className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No products found matching your search.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="font-bold text-lg mb-4">About ShopHub</h5>
              <p className="text-gray-400 text-sm">
                Your one-stop destination for quality products at amazing
                prices.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/shop"
                    className="text-gray-400 hover:text-yellow-400 transition"
                  >
                    Shop
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-gray-400 hover:text-yellow-400 transition"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-400 hover:text-yellow-400 transition"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-4">Customer Service</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/faq"
                    className="text-gray-400 hover:text-yellow-400 transition"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="/shipping"
                    className="text-gray-400 hover:text-yellow-400 transition"
                  >
                    Shipping
                  </a>
                </li>
                <li>
                  <a
                    href="/returns"
                    className="text-gray-400 hover:text-yellow-400 transition"
                  >
                    Returns
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-4">Newsletter</h5>
              <p className="text-gray-400 text-sm mb-3">
                Subscribe for exclusive deals
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-l-lg text-gray-900 outline-none"
                />
                <button className="bg-yellow-500 px-4 py-2 rounded-r-lg hover:bg-yellow-400 transition">
                  Join
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
