"use client";
import { useQuery } from "react-query";
import axios from "axios";

async function fetchProducts() {
  const response = await axios.get("/api/products");
  return response.data;
}

export default function ProductList() {
  const { data, error, isLoading } = useQuery("products", fetchProducts);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching products</div>;

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {data.map((product) => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
