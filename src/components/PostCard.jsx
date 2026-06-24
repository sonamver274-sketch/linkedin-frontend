"use client"
import { useState } from "react"
import api from "@/lib/axios"
import useAuthStore from "@/store/authStore"
import { ThumbsUp, MessageSquare, Trash2 } from "lucide-react"

export default function PostCard({ post, onDelete }) {
  const user = useAuthStore((state) => state.user)
  const [likes, setLikes] = useState(post.likes || [])
  const [comments, setComments] = useState(post.comments || [])
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")

  const isLiked = likes.some(
    (id) => id === user?._id || id?.toString() === user?._id?.toString()
  )
  const isAuthor =
    post.author?._id === user?._id ||
    post.author?._id?.toString() === user?._id?.toString()

  const handleLike = async () => {
    try {
      await api.put(`/post/like/${post._id}`)
      setLikes((prev) =>
        isLiked
          ? prev.filter((id) => id?.toString() !== user?._id?.toString())
          : [...prev, user?._id]
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleComment = async () => {
    if (!commentText.trim()) return
    try {
      const res = await api.post(`/post/comment/${post._id}`, { text: commentText })
      setComments(res.data.data.post.comments)
      setCommentText("")
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/post/delete/${post._id}`)
      onDelete(post._id)
    } catch (err) {
      console.error(err)
    }
  }

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 60000)
    if (diff < 1) return "Just now"
    if (diff < 60) return `${diff}m ago`
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
    return `${Math.floor(diff / 1440)}d ago`
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Author */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <img
            src={post.author?.profilePicture || "/avatar.svg"}
            alt={post.author?.name}
            className="w-11 h-11 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-tight">{post.author?.name}</p>
            <p className="text-xs text-gray-400 leading-tight">{post.author?.headline || ""}</p>
            <p className="text-xs text-gray-400 mt-0.5">{timeAgo(post.createdAt)}</p>
          </div>
        </div>
        {isAuthor && (
          <button
            onClick={handleDelete}
            className="text-gray-300 hover:text-red-500 transition p-1"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Content */}
      <p className="px-4 pb-3 text-gray-800 text-sm leading-relaxed">{post.content}</p>

      {/* Counts */}
      {(likes.length > 0 || comments.length > 0) && (
        <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
          <span>
            {likes.length > 0 && `👍 ${likes.length}`}
          </span>
          <button
            onClick={() => setShowComments((v) => !v)}
            className="hover:underline"
          >
            {comments.length > 0 && `${comments.length} comment${comments.length > 1 ? "s" : ""}`}
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex border-t border-gray-100">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium hover:bg-gray-50 transition ${isLiked ? "text-blue-600" : "text-gray-500"}`}
        >
          <ThumbsUp size={17} fill={isLiked ? "currentColor" : "none"} />
          Like
        </button>
        <button
          onClick={() => setShowComments((v) => !v)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
        >
          <MessageSquare size={17} />
          Comment
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="border-t border-gray-100 px-4 py-3 flex flex-col gap-3 bg-gray-50">
          {comments.map((c, i) => (
            <div key={i} className="flex gap-2 items-start">
              <img
                src={c.user?.profilePicture || "/avatar.svg"}
                className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
              />
              <div className="bg-white rounded-2xl px-3 py-2 text-sm shadow-sm flex-1">
                <span className="font-semibold text-gray-900">{c.user?.name} </span>
                <span className="text-gray-700">{c.text}</span>
              </div>
            </div>
          ))}

          {/* Comment input */}
          <div className="flex gap-2 items-center">
            <img
              src={user?.profilePicture || "/avatar.svg"}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
              className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
        </div>
      )}
    </div>
  )
}
