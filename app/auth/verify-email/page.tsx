"use client";

import { useState } from "react";
import axios from "axios";

export default function VerifyEmailPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

const handleResend = async () => {
  setError("");
  setMessage("");

  try {
    await axios.post("http://localhost:3333/api/resend-verification", {
      email, // must pass email here
    });
    setMessage("Verification email resent! Please check your inbox.");
  } catch (err) {
    setError("Failed to resend verification email.");
  }
};

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <p className="mb-4">
          We sent you a verification link. Please check your inbox before logging in.
        </p>
        <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={handleResend}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Resend Verification Email
        </button>

        {message && <p className="text-green-600 mt-4">{message}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </main>
  );
}
