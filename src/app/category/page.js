"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "../context/page";

export default function AddCategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { storeId, setStoreId, setCategoryId } = useStore(); // ✅ include setStoreId
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");
  const [message, setMessage] = useState("");

  // ✅ If storeId not set in context, get it from URL
  useEffect(() => {
    const idFromUrl = searchParams.get("storeId");
    if (!storeId && idFromUrl) {
      setStoreId(idFromUrl);
    }
  }, [storeId, setStoreId, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!storeId) {
      setMessage("❌ Error: No store selected. Please create a store first.");
      return;
    }

    const categoryData = {
      name,
      description,
      storeId: parseInt(storeId, 10), // ✅ Convert to number
      parentId: parentId ? parseInt(parentId, 10) : null,
    };

    try {
      const response = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) throw new Error("Failed to create category");
      const data = await response.json();

      setCategoryId(data.id); // ✅ Save created category ID in context
      setMessage(`✅ Category created: ${data.name}`);

      // Redirect to product creation page after success
      setTimeout(() => router.push("/products/create"), 1000);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Add a Category</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Category Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Store ID</label>
          <input
            type="text"
            value={storeId || ""}
            readOnly
            style={{ ...styles.input, backgroundColor: "#eee" }}
          />
        </div>

        <button type="submit" style={styles.button}>
          Create Category
        </button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

// ✅ Styles
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
  formGroup: { marginBottom: "15px" },
  label: { fontWeight: "bold" },
  input: { padding: "10px", borderRadius: "5px", border: "1px solid #ccc" },
  textarea: { padding: "10px", borderRadius: "5px", border: "1px solid #ccc" },
  button: {
    padding: "10px 20px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
  message: { marginTop: "20px", fontWeight: "bold" },
};
