"use client";

import { useState } from "react";
import axios from "axios";
import { AxiosError } from "axios";
import { useAuth } from "@/app/context/AuthContext";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login: setAuthUser } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
      try {
    const res = await axios.post("http://localhost:3333/api/register", {
      full_name: fullName,
      email,
      password,
    });

    // Save token and user in context
    setAuthUser(res.data.user, res.data.access_token);

    console.log("Registration successful:", res.data);
  } catch (err: unknown) {
  const error = err as AxiosError<{ message?: string }>;
    console.error("Registration failed:", error.response?.data || error.message);
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
      </form>
    </main>
  );
}
