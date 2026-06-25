"use client"
import { useEffect, useState } from "react"
import api from "@/lib/axios"

const typeText = {
  connection_request: "sent you a connection request",
  like: "liked your post",
  comment: "commented on your post"
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [accepted, setAccepted] = useState(new Set())
  const [ignored, setIgnored] = useState(new Set())

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

  const handleAccept = async (senderId, notifId) => {
    try {
      await api.put(`/connection/accept/${senderId}`)
      setAccepted((prev) => new Set([...prev, notifId]))
    } catch (err) {
      console.error(err)
    }
  }

  const handleIgnore = async (senderId, notifId) => {
    try {
      await api.put(`/connection/remove/${senderId}`)
      setIgnored((prev) => new Set([...prev, notifId]))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 md:pt-16 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 md:pt-16">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Notifications</h1>

        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400">
            No notifications yet
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`bg-white rounded-xl shadow px-4 py-3 ${!n.read ? "border-l-4 border-blue-500" : ""}`}
              >
                <div className="flex items-center gap-3">
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

                {n.type === "connection_request" && !accepted.has(n._id) && !ignored.has(n._id) && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleAccept(n.sender._id, n._id)}
                      className="px-5 py-1.5 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 font-medium"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleIgnore(n.sender._id, n._id)}
                      className="px-5 py-1.5 text-sm border border-gray-400 text-gray-500 rounded-full hover:bg-gray-100 font-medium"
                    >
                      Ignore
                    </button>
                  </div>
                )}

                {accepted.has(n._id) && (
                  <p className="text-xs text-green-600 font-medium mt-2">✓ Connected</p>
                )}
                {ignored.has(n._id) && (
                  <p className="text-xs text-gray-400 mt-2">Ignored</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
