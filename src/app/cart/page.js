"use client"; // Make this a Client Component

import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for making requests

function CartPage() {
  const [cartItems, setCartItems] = useState([]); // State to store cart items
  const [loading, setLoading] = useState(true); // State to track loading state
  const [total, setTotal] = useState(0); // State to store the total cart price

  // Fetch the cart data when the component mounts
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/cartItems/1"); // Replace '1' with dynamic cart ID as needed
        setCartItems(response.data); // Set the cart items from API response
        calculateTotal(response.data); // Calculate the total based on the cart items
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // Function to calculate the total cart value
  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    setTotal(total);
  };

  // Loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl">Loading...</span>
      </div>
    );
  }

  // Remove item from cart
  const handleRemoveItem = async (itemId) => {
    try {
      // Send a request to your API to remove the item from the cart
      await axios.delete(`http://localhost:3000/api/cartItems/${itemId}`);
      // Update the state to remove the item locally
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      calculateTotal(cartItems); // Recalculate total after removal
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    // Redirect to checkout page or handle checkout logic
    console.log("Proceeding to checkout...");
  };

  return (
    <div className="bg-gray-100 py-12">
      {/* Header */}
      <header className="bg-gray-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Your Cart</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        {/* If there are no cart items */}
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Display actual product details */}
                    <img
                      src={item.productImage || "/images/product-placeholder.jpg"}
                      alt="Product"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{item.productName}</h3>
                      <p className="text-sm text-gray-500">Store ID: {item.storeId}</p>
                      <p className="text-sm text-gray-500">Price: ${item.product.price}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                      onClick={() => handleRemoveItem(item.id)} // Remove item from cart
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cart Summary */}
        <div className="mt-12 flex justify-between items-center bg-gray-900 text-white p-6 rounded-lg shadow-md">
          <div>
            <h3 className="text-xl font-semibold">Total</h3>
            <p className="text-lg">Total: ${total.toFixed(2)}</p>
          </div>
          <button
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 transition duration-300"
            onClick={handleCheckout} // Define this function for checkout logic
          >
            Proceed to Checkout
          </button>
        </div>
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

export default CartPage;
