"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false); // modal visibility
  const [adding, setAdding] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAdding(true);

    try {
      const response = await axios.post("/api/products", {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
      });

      setProducts((prev) => [...prev, response.data]);

      // reset form
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setShowModal(false);
    } catch (err) {
      alert("Error adding product");
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error fetching products</p>;

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product List</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          Add Product
        </button>
      </div>

      {/* Product Table */}
      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="px-6 py-3">{p.id}</td>
              <td className="px-6 py-3">{p.name}</td>
              <td className="px-6 py-3">{p.description}</td>
              <td className="px-6 py-3">${p.price}</td>
              <td className="px-6 py-3">{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg font-bold"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form className="space-y-3" onSubmit={handleAddProduct}>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                disabled={adding}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {adding ? "Adding..." : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
