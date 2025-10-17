"use client";
import { useState } from "react";
import axios from "axios";

export default function CreateProductForm() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    storeId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/products", product);
    alert("Product created successfully!");
  };

  return (
    <div>
      <h1>Create Product</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
        />
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
        />
        <input
          type="number"
          name="stock"
          value={product.stock}
          onChange={handleChange}
          placeholder="Stock"
        />
        <input
          type="number"
          name="categoryId"
          value={product.categoryId}
          onChange={handleChange}
          placeholder="Category ID"
        />
        <input
          type="number"
          name="storeId"
          value={product.storeId}
          onChange={handleChange}
          placeholder="Store ID"
        />
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
}
