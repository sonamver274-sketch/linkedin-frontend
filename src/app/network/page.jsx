"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import api from "@/lib/axios"

export default function NetworkPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/user/all")
        setUsers(res.data.data.users)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleConnect = async (targetId) => {
    try {
      await api.put(`/connection/send/${targetId}`)
      setUsers((prev) =>
        prev.map((u) =>
          u._id === targetId ? { ...u, connectionStatus: "sent" } : u
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleWithdraw = async (targetId) => {
    try {
      await api.put(`/connection/remove/${targetId}`)
      setUsers((prev) =>
        prev.map((u) =>
          u._id === targetId ? { ...u, connectionStatus: "none" } : u
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleAccept = async (targetId) => {
    try {
      await api.put(`/connection/accept/${targetId}`)
      setUsers((prev) =>
        prev.map((u) =>
          u._id === targetId ? { ...u, connectionStatus: "connected" } : u
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-16 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">People you may know</h1>

        {users.length === 0 ? (
          <p className="text-gray-500">No other users found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {users.map((u) => (
              <div
                key={u._id}
                className="bg-white rounded-xl shadow overflow-hidden flex flex-col items-center pb-4"
              >
                <div className="w-full h-14 bg-blue-500" />
                <Link href={`/profile/${u._id}`}>
                  <img
                    src={u.profilePicture || "/avatar.svg"}
                    alt={u.name}
                    className="w-16 h-16 rounded-full border-2 border-white object-cover -mt-8 hover:opacity-90 transition"
                  />
                </Link>
                <Link href={`/profile/${u._id}`} className="hover:underline">
                  <p className="font-semibold text-gray-900 mt-2 text-center px-2">
                    {u.name}
                  </p>
                </Link>
                <p className="text-gray-400 text-xs text-center px-2 mt-1">
                  {u.headline || "No headline"}
                </p>

                <div className="mt-3">
                  {u.connectionStatus === "none" && (
                    <button
                      onClick={() => handleConnect(u._id)}
                      className="px-5 py-1.5 text-sm border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 font-medium"
                    >
                      Connect
                    </button>
                  )}
                  {u.connectionStatus === "sent" && (
                    <button
                      onClick={() => handleWithdraw(u._id)}
                      className="px-5 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 font-medium"
                    >
                      Withdraw
                    </button>
                  )}
                  {u.connectionStatus === "received" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(u._id)}
                        className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 font-medium"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleWithdraw(u._id)}
                        className="px-4 py-1.5 text-sm border border-gray-400 text-gray-500 rounded-full hover:bg-gray-100 font-medium"
                      >
                        Ignore
                      </button>
                    </div>
                  )}
                  {u.connectionStatus === "connected" && (
                    <span className="px-5 py-1.5 text-sm text-green-600 font-medium">
                      ✓ Connected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
