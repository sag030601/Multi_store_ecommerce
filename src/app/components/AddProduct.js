"use client";
import { useState } from "react";

export default function AddProductPage() {
  const [form, setForm] = useState({ name: "", price: "", stock: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product added:", form);
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-4"
      >
        <div>
          <label className="block font-medium">Product Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block font-medium">Price</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>
        <div>
          <label className="block font-medium">Stock</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
