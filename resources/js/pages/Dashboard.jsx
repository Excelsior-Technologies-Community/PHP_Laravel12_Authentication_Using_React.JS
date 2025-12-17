import React from "react"; // 👈 MUST

export default function Dashboard() {
  const csrfToken =
    document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p className="mb-6">Welcome to your dashboard!</p>
        <form method="POST" action="/logout">
          <input type="hidden" name="_token" value={csrfToken} />
          <button className="bg-red-500 text-white px-6 py-2 rounded-lg">
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}

