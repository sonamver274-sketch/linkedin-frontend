 import React from 'react'
 import Link from 'next/link'
 import { Home , User ,Bell , Briefcase,  PlusSquare } from 'lucide-react'
 
 const Footer = () => {
   return (
     <nav className="fixed bottom-0 w-full bg-white border-t md:hidden">
  <div className="flex justify-around py-2">
     <Link href={"/"}  className="flex flex-col items-center text-gray-800 hover:text-black text-xs">
             <Home size={20} />
            </Link>
             <Link href={"/network"}  className="flex flex-col items-center text-gray-800 hover:text-black text-xs">
             <User size={20} />
            </Link>
            <Link href={"/"}  className="flex flex-col items-center text-gray-800 hover:text-black text-xs">
             <PlusSquare size={20} />
            </Link>
             <Link href={"/notification"}  className="flex flex-col items-center text-gray-800 hover:text-black text-xs">
             < Bell size={20} />
            </Link>
             
             <Link href={"/jobs"}  className="flex flex-col items-center text-gray-800 hover:text-black text-xs">
             <Briefcase size={20} />
            </Link>

  </div>
</nav>
   )
 }
 
 export default Footer