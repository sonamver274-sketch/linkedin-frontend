"use client"
import { useEffect, useState, useRef } from "react"
import api from "@/lib/axios"
import useAuthStore from "@/store/authStore"
import { ArrowLeft } from "lucide-react"

export default function MessagingPage() {
  const user = useAuthStore((state) => state.user)
  const [connectedUsers, setConnectedUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const bottomRef = useRef(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/message/connections")
        setConnectedUsers(res.data.data.users)
      } catch (err) {
        console.error(err)
      }
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    if (!selectedUser) return
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/message/${selectedUser._id}`)
        setMessages(res.data.data.messages)
      } catch (err) {
        console.error(err)
      }
    }
    fetchMessages()
  }, [selectedUser])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!text.trim() || !selectedUser) return
    try {
      const res = await api.post(`/message/send/${selectedUser._id}`, { text })
      setMessages((prev) => [...prev, res.data.data.message])
      setText("")
    } catch (err) {
      console.error(err)
    }
  }

  const ContactsList = (
    <div className="bg-white flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-bold text-gray-800 text-lg">Messaging</h2>
      </div>
      <div className="overflow-y-auto flex-1">
        {connectedUsers.length === 0 ? (
          <p className="text-gray-400 text-sm p-4">No connections yet</p>
        ) : (
          connectedUsers.map((u) => (
            <button
              key={u._id}
              onClick={() => setSelectedUser(u)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left transition ${selectedUser?._id === u._id ? "bg-blue-50 border-r-2 border-blue-500" : ""}`}
            >
              <img
                src={u.profilePicture || "/avatar.svg"}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <div>
                <p className="font-semibold text-sm text-gray-900">{u.name}</p>
                <p className="text-xs text-gray-400">{u.headline || "No headline"}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )

  const ConversationPanel = (
    <div className="flex-1 flex flex-col bg-gray-50 h-full">
      {!selectedUser ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Select a connection to start chatting
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
            {/* Back button — mobile only */}
            <button
              onClick={() => setSelectedUser(null)}
              className="md:hidden text-gray-500 hover:text-gray-700 mr-1"
            >
              <ArrowLeft size={20} />
            </button>
            <img
              src={selectedUser.profilePicture || "/avatar.svg"}
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900">{selectedUser.name}</p>
              <p className="text-xs text-gray-400">{selectedUser.headline || ""}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            {messages.length === 0 && (
              <p className="text-center text-gray-400 text-sm mt-10">
                No messages yet — say hi!
              </p>
            )}
            {messages.map((m) => {
              const isMe = m.sender === user?._id || m.sender?.toString() === user?._id?.toString()
              return (
                <div key={m._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-gray-800 shadow rounded-bl-none"}`}>
                    {m.text}
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t px-4 py-3 flex gap-3 items-center">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  )

  return (
    <div className="h-screen bg-gray-100 pt-14 flex overflow-hidden">

      {/* MOBILE: show contacts OR conversation, not both */}
      <div className="flex w-full md:hidden h-full">
        {!selectedUser ? (
          <div className="w-full">{ContactsList}</div>
        ) : (
          <div className="w-full flex flex-col">{ConversationPanel}</div>
        )}
      </div>

      {/* DESKTOP: side-by-side */}
      <div className="hidden md:flex w-full max-w-5xl mx-auto h-full shadow-sm">
        <div className="w-72 border-r shrink-0">{ContactsList}</div>
        {ConversationPanel}
      </div>

    </div>
  )
}
