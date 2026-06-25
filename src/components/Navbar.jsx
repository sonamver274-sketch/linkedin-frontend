"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, Users, Briefcase, Bell, MessageSquareDotIcon, UserCircle2Icon, LogOut, Plus } from 'lucide-react'
import api from '@/lib/axios'
import useAuthStore from '@/store/authStore'

const Navbar = () => {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (!user) return
    const fetchUnread = async () => {
      try {
        const res = await api.get("/notification")
        const unread = res.data.data.notifications.filter((n) => !n.read).length
        setUnreadCount(unread)
      } catch {
        // ignore
      }
    }
    fetchUnread()
  }, [user])

  const handleLogout = async () => {
    try {
      await api.delete("/auth/logout")
    } catch {
      // ignore
    }
    logout()
    router.push("/login")
  }

  return (
    <>
      {/* ── DESKTOP NAVBAR ── */}
      <nav className="bg-white shadow fixed top-0 w-full z-10">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <span className="text-blue-600 font-bold text-2xl">in</span>
          <span>
            <input type="text" placeholder='Search' className="bg-gray-100 rounded-full px-4 outline-none ml-4 text-sm w-50" />
          </span>
          <div className="hidden md:flex gap-6 items-center">
            <Link href={"/"} className="flex flex-col items-center text-gray-800 hover:text-black text-xs">
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link href={"/network"} className="flex flex-col items-center text-gray-800 hover:text-black text-xs">
              <Users size={20} />
              <span>Network</span>
            </Link>
            <Link href={"/jobs"} className="flex flex-col items-center text-gray-800 hover:text-black text-xs">
              <Briefcase size={20} />
              <span>Jobs</span>
            </Link>
            <Link href={"/messaging"} className="flex flex-col items-center text-gray-800 hover:text-black text-xs">
              <MessageSquareDotIcon size={20} />
              <span>Messaging</span>
            </Link>
            <Link href={"/notification"} className="relative flex flex-col items-center text-gray-800 hover:text-black text-xs">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
              <span>Notification</span>
            </Link>
            <Link href={"/profile"} className="flex flex-col items-center text-gray-800 hover:text-black text-xs">
              <UserCircle2Icon size={20} />
              <span>Me</span>
            </Link>
            {user && (
              <button
                onClick={handleLogout}
                className="flex flex-col items-center text-gray-500 hover:text-red-500 text-xs transition"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── MOBILE TOP NAVBAR ── */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-10 px-3 h-14 flex items-center gap-3">
        {user ? (
          <Link href="/profile">
            <img
              src={user.profilePicture || "/avatar.svg"}
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
          </Link>
        ) : (
          <Link href="/login">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
              <UserCircle2Icon size={22} className="text-gray-400" />
            </div>
          </Link>
        )}
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-gray-400 text-sm">🔍</span>
          <span className="text-gray-400 text-sm">Search</span>
        </div>
        <Link href="/messaging" className="shrink-0">
          <MessageSquareDotIcon size={24} className="text-gray-600" />
        </Link>
      </div>

      {/* ── MOBILE BOTTOM NAVBAR ── */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-10">
        <div className="flex justify-around items-center h-14">
          {!user ? (
            <>
              <Link href={"/login"} className="flex-1 flex flex-col items-center justify-center text-gray-600 text-xs gap-0.5">
                <span className="font-semibold text-blue-600 text-sm">Sign in</span>
              </Link>
              <Link href={"/register"} className="flex-1 flex flex-col items-center justify-center text-xs gap-0.5">
                <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full font-semibold text-sm">Join now</span>
              </Link>
            </>
          ) : (
            <>
              <Link href={"/"} className="flex flex-col items-center text-gray-600 text-xs gap-0.5">
                <Home size={22} />
                <span>Home</span>
              </Link>
              <Link href={"/network"} className="flex flex-col items-center text-gray-600 text-xs gap-0.5">
                <Users size={22} />
                <span>My Network</span>
              </Link>
              <Link href={"/"} className="flex flex-col items-center text-gray-600 text-xs gap-0.5">
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                  <Plus size={22} className="text-gray-600" />
                </div>
                <span>Post</span>
              </Link>
              <Link href={"/notification"} className="relative flex flex-col items-center text-gray-600 text-xs gap-0.5">
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                <span>Notifications</span>
              </Link>
              <Link href={"/jobs"} className="flex flex-col items-center text-gray-600 text-xs gap-0.5">
                <Briefcase size={22} />
                <span>Jobs</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar
