"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server error: Expected JSON but received ${contentType || "unknown"}. (Status: ${res.status})`);
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      localStorage.setItem("adminToken", data.token);
      router.push("/admin");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface-container rounded-3xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <Icon icon="material-symbols:admin-panel-settings" className="text-5xl text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-black">EmirAir Admin</h1>
          <p className="text-on-surface-variant">Log in to manage flights</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-surface-container-highest border-none rounded-xl p-4 focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-highest border-none rounded-xl p-4 focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold uppercase tracking-wide hover:bg-primary/90 transition shadow-md mt-6"
          >
            Login
          </button>
        </form>
        
        <div className="mt-6 text-center">
           <Link href="/" className="text-primary hover:underline text-sm font-semibold">
            Return to Home
           </Link>
        </div>
      </div>
    </div>
  );
}
