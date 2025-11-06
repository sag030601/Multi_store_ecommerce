"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
// import { useStore } from "@/app/context/StoreContext";
import { useStore } from "../context/page";


export default function StoreForm({ initialStoreId }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { storeId, setStoreId } = useStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Set storeId from server if provided
  useEffect(() => {
    if (initialStoreId && !storeId) {
      setStoreId(initialStoreId);
    }
  }, [initialStoreId, storeId, setStoreId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user?.email) {
      setMessage("You must be logged in to create a store");
      return;
    }

    const storeData = { name, description, logoUrl };

    try {
      const response = await fetch("/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeData),
      });

      if (!response.ok) throw new Error("Failed to create store");

      const store = await response.json();

      // ✅ Save storeId in context
      setStoreId(store.id);

      setMessage(`Store created successfully: ${store.name}`);

      // ✅ Redirect to category with storeId
      router.push(`/category?storeId=${store.id}`);
    } catch (err) {
      console.error(err);
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Add a Store</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="name" style={styles.label}>Store Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.label}>Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="logoUrl" style={styles.label}>Logo URL</label>
          <input
            id="logoUrl"
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>Create Store</button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

// Styles
const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "20px", backgroundColor: "#f4f7fc" },
  header: { fontSize: "2rem", marginBottom: "20px", color: "#333" },
  form: { display: "flex", flexDirection: "column", width: "100%", maxWidth: "500px", backgroundColor: "#fff", padding: "30px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" },
  formGroup: { marginBottom: "20px" },
  label: { fontSize: "1rem", fontWeight: "600", marginBottom: "8px", color: "#555" },
  input: { padding: "10px", fontSize: "1rem", border: "1px solid #ccc", borderRadius: "4px" },
  textarea: { padding: "10px", fontSize: "1rem", border: "1px solid #ccc", borderRadius: "4px", minHeight: "100px" },
  button: { padding: "12px 20px", fontSize: "1rem", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  message: { marginTop: "20px", fontSize: "1rem", color: "#333", fontWeight: "600" },
};
