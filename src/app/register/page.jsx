"use client"
import React, { useState } from "react";
import Link from "next/link";
import api from "@/lib/axios"
import { useRouter } from "next/navigation";


const register = () => {
  const [name , setName] = useState("")
  const [email , setEmail]= useState("")
  const [password , setPassword] = useState("") 
  const router = useRouter()

  const handleRegister = async ()=>{
   try {
       await api.post("auth/register" ,{
       name,
       email,
       password,
     } )
     router.push("/login")
   } catch (error) {
    console.log(error);
    
   } 
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md ">
        <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center mb-6 mx-auto">
          <span className="text-white font-bold text-2xl">in</span>
        </div>
        <h2 className="text-2xl font-semibold mb-1 flex justify-center">
          Register here
        </h2>
        <input
        value={name}
        onChange={(e)=> setName(e.target.value)}
          type="text"
          placeholder="Name"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-blue-500"
        />
        <input
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
          type="text"
          placeholder="Email"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-blue-500"
        />
        <input
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-blue-500"
        />
        <button onClick={handleRegister} className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700">
          Register
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
          If you have an account? Login
          <Link href="/login" className="text-blue-600 font-semibold">
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default register;
