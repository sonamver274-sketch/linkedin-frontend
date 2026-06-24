"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Home, Users, Briefcase, Bell, MessageSquareDotIcon, UserCircle2Icon } from 'lucide-react'
import api from '@/lib/axios'
import useAuthStore from '@/store/authStore'

const Navbar = () => {
  const user = useAuthStore((state) => state.user)
  const [unreadCount, setUnreadCount] = useState(0)

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

  return (
    <nav className="bg-white shadow fixed top-0 w-full z-10">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <span className="text-blue-600 font-bold text-2xl">in</span>
        <span>
          <input type="text" placeholder='Search' className="bg-gray-100 rounded-full px-4 outline-none ml-4 text-sm w-50" />
        </span>
        <div className="hidden md:flex gap-6">
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
        </div>
      </div>
    </nav>
  )
}

export default Navbar
