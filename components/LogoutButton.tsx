"use client";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

const handleLogout = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    if (token) {
      await axios.delete("/logout", {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    // Clear localStorage regardless
    localStorage.removeItem("token");

    // Redirect to login page
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
