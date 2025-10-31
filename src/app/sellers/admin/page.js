"use client";
import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import AdminDashboard from "@/app/components/StoreAdminDashboard";
import ProductList from "@/app/products/page";
import ProductsPage from "@/app/components/ProductList";

// --- Admin Sections ---
function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
      <p className="text-gray-600">Welcome to your admin panel.</p>
    </div>
  );
}

function Products() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products List</h1>
      <p className="text-gray-600">Here’s where your products will appear.</p>
    </div>
  );
}

function AddProduct() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <p className="text-gray-600">Add a new product using this form.</p>
    </div>
  );
}

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState("dashboard"); // default = dashboard

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard />;
      case "products":
        return <ProductsPage />;
      case "addProduct":
        return <AddProduct />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar with click handler */}
      <Sidebar active={activeSection} onChange={setActiveSection} />

      {/* Main content */}
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}
