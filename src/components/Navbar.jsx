"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, Users, Briefcase, Bell, MessageSquareDotIcon, UserCircle2Icon, LogOut } from 'lucide-react'
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
      // ignore error
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
                <span>Network</span>
              </Link>
              <Link href={"/jobs"} className="flex flex-col items-center text-gray-600 text-xs gap-0.5">
                <Briefcase size={22} />
                <span>Jobs</span>
              </Link>
              <Link href={"/messaging"} className="flex flex-col items-center text-gray-600 text-xs gap-0.5">
                <MessageSquareDotIcon size={22} />
                <span>Messaging</span>
              </Link>
              <Link href={"/notification"} className="relative flex flex-col items-center text-gray-600 text-xs gap-0.5">
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-3 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                <span>Alerts</span>
              </Link>
              <Link href={"/profile"} className="flex flex-col items-center text-gray-600 text-xs gap-0.5">
                <UserCircle2Icon size={22} />
                <span>Me</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar
