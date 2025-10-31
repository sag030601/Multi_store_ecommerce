export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="font-semibold text-gray-600">Total Products</h2>
          <p className="text-3xl font-bold mt-2">120</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="font-semibold text-gray-600">Total Orders</h2>
          <p className="text-3xl font-bold mt-2">58</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="font-semibold text-gray-600">Revenue</h2>
          <p className="text-3xl font-bold mt-2">$12,340</p>
        </div>
      </div>
    </div>
  );
}
