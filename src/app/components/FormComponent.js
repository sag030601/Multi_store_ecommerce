"use client";

import { useState } from "react";

export default function FormComponent({ type, onSubmit, onCancel, categories = [] }) {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const fields = {
    category: [
      { name: "name", label: "Category Name", type: "text", required: true },
      { name: "description", label: "Description", type: "text", required: false },
      { name: "parentId", label: "Parent Category", type: "select", required: false },
    ],
    product: [
      { name: "name", label: "Product Name", type: "text", required: true },
      { name: "price", label: "Price", type: "number", required: true },
      { name: "stock", label: "Stock", type: "number", required: true },
      { name: "categoryId", label: "Category", type: "select", required: true },
    ],
    order: [
      { name: "customerName", label: "Customer Name", type: "text", required: true },
      { name: "total", label: "Total Amount", type: "number", required: true },
      { name: "status", label: "Status", type: "text", required: true },
    ],
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Add {type}</h2>

        {fields[type].map((field) => (
          <div key={field.name} className="mb-4">
            <label className="block mb-1 font-medium">{field.label}</label>
            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">
                  {field.name === "parentId" ? "No Parent" : `Select ${field.label}`}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required={field.required}
              />
            )}
          </div>
        ))}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
