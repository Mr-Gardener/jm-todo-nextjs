"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login: setAuthUser } = useAuth();
   const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.post(`register`, {
        full_name: fullName,
        email,
        password,
      });

      setMessage(res.data.message || "Registration successful! Please check your email.");

      // ⬇️ Redirect user to verification page instead of auto-login
      setTimeout(() => router.push("/auth/verify-email"), 2000);
    } catch (err: unknown) {
      const errorMessage = isAxiosError(err)
        ? err.response?.data?.message || "Something went wrong."
        : "Something went wrong.";

      setError(errorMessage);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Register
        </button>

        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}

      </form>
    </main>
  );
}
