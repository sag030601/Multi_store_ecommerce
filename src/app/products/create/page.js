"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useStore } from "@/app/context/page";

export default function CreateProductForm() {
  const { storeId, categoryId } = useStore(); // ✅ get both
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: null,
    stock: "",
    imageUrl: "",
  });

  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!storeId || !categoryId) {
      setMessage(
        "❌ Missing store or category. Please go back and create them first."
      );
      return;
    }

    try {
      await axios.post("/api/products", {
        ...product,
        storeId: parseInt(storeId, 10), // ✅ Convert to number

        categoryId,
        price: parseFloat(product.price), // ✅ Convert to number
        stock: parseInt(product.stock) || 0,
      });
      setMessage("✅ Product created successfully!");
      // setTimeout(() => router.push("/"), 1000);
      setTimeout(() => router.push(`/?storeId=${storeId}`), 1000);
    } catch (err) {
      setMessage("❌ Failed to create product: " + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Add a Product</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
          style={styles.input}
          required
        />
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
          style={styles.textarea}
        />
        <input
          name="price"
          type="number"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
          style={styles.input}
          required
        />
        <input
          name="stock"
          type="number"
          value={product.stock}
          onChange={handleChange}
          placeholder="Stock"
          style={styles.input}
        />
        <input
          name="imageUrl"
          value={product.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
          style={styles.input}
        />

        {/* auto-filled IDs */}
        <input
          value={storeId || ""}
          readOnly
          placeholder="Store ID"
          style={{ ...styles.input, backgroundColor: "#eee" }}
        />
        <input
          value={categoryId || ""}
          readOnly
          placeholder="Category ID"
          style={{ ...styles.input, backgroundColor: "#eee" }}
        />

        <button type="submit" style={styles.button}>
          Create Product
        </button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  },
  header: { fontSize: "2rem", marginBottom: "20px" },
  form: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "500px",
    width: "100%",
  },
  input: {
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  textarea: {
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
  message: { marginTop: "20px", fontWeight: "bold" },
};
