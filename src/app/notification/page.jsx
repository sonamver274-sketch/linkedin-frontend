"use client"
import { useEffect, useState } from "react"
import api from "@/lib/axios"

const typeText = {
  connection_request: "ne tumhe connection request bheji",
  like: "ne tumhari post like ki",
  comment: "ne tumhari post pe comment kiya"
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notification")
        setNotifications(res.data.data.notifications)
        await api.put("/notification/read")
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-16 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Notifications</h1>

        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400">
            Koi notification nahi hai abhi
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`flex items-center gap-3 bg-white rounded-xl shadow px-4 py-3 ${!n.read ? "border-l-4 border-blue-500" : ""}`}
              >
                <img
                  src={n.sender?.profilePicture || "/avatar.svg"}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">{n.sender?.name}</span>{" "}
                    {typeText[n.type]}
                  </p>
                  {n.post?.content && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                      "{n.post.content}"
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {new Date(n.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short"
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
