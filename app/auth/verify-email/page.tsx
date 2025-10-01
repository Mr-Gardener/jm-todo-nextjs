"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Verifying your account...");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("No token provided.");
        return;
      }

      try {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}verify-email?token=${token}`);
        setStatus("Email verified! Redirecting to login...");
        setTimeout(() => router.push("/auth/login"), 3000);
      } catch (err) {
        setStatus("Verification failed. The link may be invalid or expired.");
      }
    };

    verify();
  }, [token, router]);

const handleResend = async () => {
  setError("");
  setMessage("");

  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}resend-verification`, {
      email,
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
        <p>{status}</p>
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
