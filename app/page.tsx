"use client";

import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
      <h1 className="text-3xl font-bold">Welcome to JM Todo</h1>

      <div className="flex gap-4 mt-6">
        <Link href="/auth/login">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Login
          </button>
        </Link>

        <Link href="/auth/register">
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Register
          </button>
        </Link>
      </div>
    </main>
  );
  
}
