import React from "react"; // 👈 MUST

export default function Login() {
  const csrfToken =
    document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Customer Login
        </h2>

        <form method="POST" action="/login" className="space-y-4">
          <input type="hidden" name="_token" value={csrfToken} />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
