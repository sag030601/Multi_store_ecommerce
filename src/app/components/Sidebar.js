"use client";
import { Store, Package, PlusCircle } from "lucide-react";

export default function Sidebar({ active, onChange }) {
  const links = [
    { key: "dashboard", label: "Dashboard", icon: <Store size={20} /> },
    { key: "products", label: "Products", icon: <Package size={20} /> },
    { key: "addProduct", label: "Add Product", icon: <PlusCircle size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-gray-100 flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        🛍️ Store Admin
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <button
            key={link.key}
            onClick={() => onChange(link.key)}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition 
              ${
                active === link.key
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
          >
            {link.icon}
            {link.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
