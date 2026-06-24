"use client";
import Link from "next/link";
import React, { useState} from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";  
import useAuthStore from "@/store/authStore";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
   const setUser = useAuthStore((state) => state.setUser)

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
       setUser(response.data.data.user)
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md ">
        <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center mb-6 mx-auto">
          <span className="text-white font-bold text-2xl">in</span>
        </div>
        <h2 className="text-2xl font-semibold mb-1 flex justify-center">
          Sign in
        </h2>
        <p className="text-gray-500 text-sm mb-6 flex justify-center">
          Stay updated on your professional world
        </p>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Email"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-blue-500"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700"
        >
          Sign in
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account? Register
          <Link href="/register" className="text-blue-600 font-semibold">
            Join now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default login;
