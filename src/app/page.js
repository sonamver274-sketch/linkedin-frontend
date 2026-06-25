"use client"
import useAuthStore from "@/store/authStore"
import Post from "@/components/Post"
import PostCard from "@/components/PostCard"
import { useEffect, useState } from "react"
import api from "@/lib/axios"
import Link from "next/link"
import { Users, Briefcase, BookMarked } from "lucide-react"

export default function Home() {
  const user = useAuthStore((state) => state.user)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/post/all")
        setPosts(res.data.data.posts)
      } catch (err) {
        console.error(err)
      }
    }
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-[#f3f2ef] md:pt-16">
      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-5">

        {/* ── LEFT SIDEBAR ── */}
        <div className="hidden md:flex flex-col gap-3 w-60 shrink-0">
          {/* Profile mini card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-14 bg-gradient-to-r from-blue-600 to-cyan-400" />
            <div className="flex flex-col items-center -mt-7 pb-4 px-4">
              <Link href="/profile">
                <img
                  src={user?.profilePicture || "/avatar.svg"}
                  alt="profile"
                  className="w-14 h-14 rounded-full border-2 border-white object-cover shadow hover:opacity-90 transition"
                />
              </Link>
              <Link href="/profile" className="font-semibold text-gray-900 mt-2 text-sm hover:underline text-center">
                {user?.name || "Your Name"}
              </Link>
              <p className="text-gray-400 text-xs text-center mt-0.5 line-clamp-2">
                {user?.headline || "Add a headline"}
              </p>
              <div className="w-full border-t my-3" />
              <div className="w-full flex justify-between text-xs text-gray-500 px-1">
                <span>Connections</span>
                <span className="font-semibold text-blue-600">{user?.connection?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-xl shadow-sm p-3 flex flex-col gap-1">
            <Link href="/network" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 font-medium transition">
              <Users size={18} className="text-gray-500" /> My Network
            </Link>
            <Link href="/jobs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 font-medium transition">
              <Briefcase size={18} className="text-gray-500" /> Jobs
            </Link>
            <Link href="/notification" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 font-medium transition">
              <BookMarked size={18} className="text-gray-500" /> Notifications
            </Link>
          </div>
        </div>

        {/* ── MIDDLE FEED ── */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <Post onPostCreated={(newPost) => setPosts((prev) => [newPost, ...prev])} />
          {posts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400 text-sm">
              Koi post nahi hai — pehle post karo!
            </div>
          ) : (
            posts.map((p) => (
              <PostCard
                key={p._id}
                post={p}
                onDelete={(id) => setPosts((prev) => prev.filter((x) => x._id !== id))}
              />
            ))
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="hidden lg:flex flex-col gap-3 w-64 shrink-0">
          {/* LinkedIn news style */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-3">LinkedIn News</h3>
            <div className="flex flex-col gap-3">
              {[
                "AI tools reshaping job market in 2025",
                "Top skills employers want this year",
                "Remote work trends: What's changed",
                "How to ace your next interview",
              ].map((news, i) => (
                <div key={i} className="flex gap-2 cursor-pointer group">
                  <span className="text-gray-400 font-bold text-xs mt-0.5">•</span>
                  <p className="text-xs text-gray-700 group-hover:text-blue-600 font-medium leading-snug transition">
                    {news}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer links */}
          <div className="px-2">
            <p className="text-xs text-gray-400 leading-relaxed">
              About · Help · Privacy · Terms · Advertising · More
            </p>
            <p className="text-xs text-gray-400 mt-2">LinkedIn Clone © 2025</p>
          </div>
        </div>

      </div>
    </div>
  )
}
