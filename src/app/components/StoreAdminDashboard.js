"use client";

import { useEffect, useState } from "react";
import FormComponent from "./FormComponent";

export default function AdminDashboard({ storeId }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formType, setFormType] = useState("");

  const fetchData = async () => {
    if (!storeId) {
      setError("No store selected");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch categories (with products)
      const categoriesRes = await fetch(`/api/category/${storeId}`);
      if (!categoriesRes.ok) throw new Error("Failed to fetch categories");
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData);

      // Flatten products from categories
      const allProducts = categoriesData.flatMap((category) =>
        category.products.map((product) => ({
          ...product,
          categoryName: category.name,
        }))
      );
      setProducts(allProducts);

      // Fetch orders
      const ordersRes = await fetch(`/api/orders/${storeId}`);
      if (!ordersRes.ok) throw new Error("Failed to fetch orders");
      const ordersData = await ordersRes.json();
      setOrders(ordersData);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [storeId]);

  const handleAdd = async (data) => {
    try {
      let url = "";
      switch (formType) {
        case "category":
          url = `/api/category/${storeId}`;
          break;
        case "product":
          url = `/api/products/${storeId}`;
          break;
        case "order":
          url = `/api/orders/${storeId}`;
          break;
        default:
          return;
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add");
      }

      setFormType(""); // Close form
      fetchData(); // Refresh dashboard data
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <p className="p-6 text-gray-700">Loading dashboard...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      {/* Add Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFormType("category")}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Add Category
        </button>
        <button
          onClick={() => setFormType("product")}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Add Product
        </button>
        <button
          onClick={() => setFormType("order")}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Add Order
        </button>
      </div>

      {/* Dynamic Form Modal */}
      {formType && (
        <FormComponent
          type={formType}
          categories={categories}
          onSubmit={handleAdd}
          onCancel={() => setFormType("")}
        />
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="font-semibold text-gray-600">Total Products</h2>
          <p className="text-3xl font-bold mt-2">{products.length}</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="font-semibold text-gray-600">Total Categories</h2>
          <p className="text-3xl font-bold mt-2">{categories.length}</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="font-semibold text-gray-600">Total Orders</h2>
          <p className="text-3xl font-bold mt-2">{orders.length}</p>
        </div>
      </div>

      {/* Products Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.categoryName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Categories List */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <ul className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {categories.map((category) => (
            <li key={category.id} className="px-6 py-4 flex justify-between items-center">
              <span>{category.name}</span>
              <span className="text-gray-500 text-sm">{category.products.length || 0} Products</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Orders Table */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Orders</h2>
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{order.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${order.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
