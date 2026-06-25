"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import api from "@/lib/axios"
import useAuthStore from "@/store/authStore"
import { Users, Briefcase } from "lucide-react"

export default function UserProfilePage() {
  const { id } = useParams()
  const currentUser = useAuthStore((state) => state.user)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!id) return
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/user/profile/${id}`)
        setProfile(res.data.data.profile)
      } catch (err) {
        console.error(err)
      }
    }
    fetchProfile()
  }, [id])

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 md:pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f3f2ef] md:pt-16">
      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-3">

        {/* ── MAIN CARD ── */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="h-40 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400" />
          <div className="px-6 pb-5">
            <div className="flex items-end justify-between -mt-14 mb-2">
              <img
                src={profile.profilePicture || "/avatar.svg"}
                alt={profile.name}
                className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-md"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
            <p className="text-gray-500 mt-1 text-sm">
              {profile.headline || <span className="italic text-gray-400">No headline</span>}
            </p>
            <p className="text-gray-400 text-xs mt-1">{profile.email}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1 text-blue-600 font-semibold text-sm">
                <Users size={15} />
                {profile.connection?.length || 0} connections
              </span>
            </div>
          </div>
        </div>

        {/* ── ABOUT ── */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-2">About</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {profile.headline || "No bio added yet."}
          </p>
        </div>

        {/* ── STATS ── */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4">Analytics</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Users size={16} /> Connections
              </div>
              <p className="text-2xl font-bold text-gray-900">{profile.connection?.length || 0}</p>
            </div>
            <div className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Briefcase size={16} /> Profile Status
              </div>
              <p className="text-sm font-semibold text-green-600 mt-1">Active</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
