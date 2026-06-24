"use client"
import { useEffect } from "react"
import api from "@/lib/axios"
import useAuthStore from "@/store/authStore"

export default function AuthProvider({ children }) {
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me")
        setUser(res.data.data.user)
      } catch {
        // not logged in — that's fine
      }
    }
    checkAuth()
  }, [])

  return children
}
