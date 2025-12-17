import React from "react"; 

export default function Registration() {
  const csrfToken =
    document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Register
        </h2>

        <form method="POST" action="/register" className="space-y-4">
          <input type="hidden" name="_token" value={csrfToken} />

          <input className="w-full px-4 py-2 border rounded-lg" name="name" placeholder="Name" required />
          <input className="w-full px-4 py-2 border rounded-lg" name="email" placeholder="Email" required />
          <input className="w-full px-4 py-2 border rounded-lg" type="password" name="password" placeholder="Password" required />
          <input className="w-full px-4 py-2 border rounded-lg" type="password" name="password_confirmation" placeholder="Confirm Password" required />

          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

