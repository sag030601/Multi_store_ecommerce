"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useStore } from "../context/page";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const { storeId } = useStore();
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("/api/cartItems/1"); // API route for user's cart
        setCartItems(response.data);
        calculateTotal(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const calculateTotal = (cartItems) => {
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    setTotal(totalAmount);
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`/api/cartItems/${itemId}`);
      const updated = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updated);
      calculateTotal(updated);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // ✅ Razorpay Checkout Integration
  const handleCheckout = async () => {
    try {
      // 1️⃣ Razorpay payment options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: (total + 50) * 100, // amount in paise
        currency: "INR",
        name: "My E-Commerce Store",
        description: "Purchase from My Store",
        handler: async function (response) {
          try {
            // 2️⃣ Verify payment & create order in backend
            const verifyRes = await axios.post("/api/verify-payment", {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              userId: 1, // replace with logged-in user ID
              cartItems,
              total: total + 50,
              shippingAddress: {
                addressLine1: "123 Street",
                city: "City",
                state: "State",
                zip: "123456",
              },
              billingAddress: {
                addressLine1: "123 Street",
                city: "City",
                state: "State",
                zip: "123456",
              },
            });

            if (verifyRes.data.success) {
              alert("✅ Payment successful! Order placed.");
              setCartItems([]);
              setTotal(0);
              window.location.href = "/thank-you";
            } else {
              alert("❌ Payment verification failed!");
            }
          } catch (err) {
            console.error("Error verifying payment:", err);
            alert("❌ Payment verification failed!");
          }
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Customer Address",
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to initialize payment.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <motion.div
          className="text-xl text-gray-700"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading your cart...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-indigo-600" size={28} />
            <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>
          </div>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
            onClick={() => (window.location.href = "/")}
          >
            Continue Shopping
          </button>
        </div>
      </header>

      {/* Main Section */}
      <main className="container mx-auto px-4 py-10">
        {cartItems.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center text-gray-600 mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ShoppingCart size={60} className="text-gray-400 mb-4" />
            <p className="text-lg mb-2">Your cart is empty!</p>
            <button
              onClick={() => (window.location.href = "/home")}
              className="mt-3 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
            >
              Browse Products
            </button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          item.productImage || "/images/product-placeholder.jpg"
                        }
                        alt={item.productName}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Price: ₹{item.product.price}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <button
                      className="text-red-500 hover:text-red-700 transition"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cart Summary */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg h-fit sticky top-24"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Order Summary
              </h3>
              <div className="flex justify-between text-gray-600 mb-2">
                <p>Subtotal</p>
                <p>₹{total.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-gray-600 mb-2">
                <p>Shipping</p>
                <p>₹50</p>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-semibold text-gray-800">
                <p>Total</p>
                <p>₹{(total + 50).toFixed(2)}</p>
              </div>
              <button
                onClick={handleCheckout}
                className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-500 transition"
              >
                Proceed to Checkout
              </button>
            </motion.div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-20">
        <div className="container mx-auto text-center text-sm">
          &copy; {new Date().getFullYear()} My E-Commerce Store. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
