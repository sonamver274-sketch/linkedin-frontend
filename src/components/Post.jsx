"use client"
import { useState } from "react"
import api from "@/lib/axios"
import useAuthStore from "@/store/authStore"
import { Image, FileText } from "lucide-react"

const Post = ({ onPostCreated }) => {
  const [content, setContent] = useState("")
  const [focused, setFocused] = useState(false)
  const [posting, setPosting] = useState(false)
  const user = useAuthStore((state) => state.user)

  const handlePost = async () => {
    if (!content.trim() || posting) return
    setPosting(true)
    try {
      const res = await api.post("/post/create", { content })
      setContent("")
      setFocused(false)
      if (onPostCreated) onPostCreated(res.data.data.post)
    } catch (error) {
      console.log(error)
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex gap-3 items-center">
        <img
          src={user?.profilePicture || "/avatar.svg"}
          className="w-11 h-11 rounded-full object-cover shrink-0"
        />
        <button
          onClick={() => setFocused(true)}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm text-gray-400 text-left hover:bg-gray-50 hover:border-gray-400 transition"
        >
          {focused ? "" : "Start a post..."}
        </button>
      </div>

      {focused && (
        <div className="mt-3 flex flex-col gap-3">
          <textarea
            autoFocus
            placeholder="What do you want to talk about?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 resize-none"
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-3 text-gray-500">
              <button className="flex items-center gap-1.5 text-xs hover:text-blue-600 transition">
                <Image size={18} /> Photo
              </button>
              <button className="flex items-center gap-1.5 text-xs hover:text-blue-600 transition">
                <FileText size={18} /> Article
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setFocused(false); setContent("") }}
                className="px-4 py-1.5 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={!content.trim() || posting}
                className="px-5 py-1.5 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      {!focused && (
        <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100">
          <button onClick={() => setFocused(true)} className="flex items-center gap-2 text-xs text-gray-500 font-medium hover:text-blue-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition">
            <Image size={18} /> Photo
          </button>
          <button onClick={() => setFocused(true)} className="flex items-center gap-2 text-xs text-gray-500 font-medium hover:text-blue-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition">
            <FileText size={18} /> Write article
          </button>
        </div>
      )}
    </div>
  )
}

export default Post
