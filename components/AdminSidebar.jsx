'use client';
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";     
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
    const router = useRouter();
    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
    };
  
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return null;
  }

      return (<aside className="bg-slate-950 dark:bg-slate-950 h-screen w-64 fixed left-0 top-0 flex flex-col py-6 shadow-2xl shadow-blue-900/20 z-50">
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Icon icon="material-symbols:flight-takeoff" className="text-white" style={{ fontVariationSettings: "'FILL' 1" }} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white">EmirAir</h1>
            <p className="text-slate-500 text-xs font-mono tracking-tight font-medium uppercase">
              Admin
            </p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {/* Flights Tab (Active) */}
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-full mx-2 font-manrope tracking-tight font-medium scale-95 active:scale-90 duration-150"
          >
            <Icon icon="material-symbols:flight-takeoff" />
            <span>Flights</span>
          </Link>
          {/* Bookings Tab (Inactive) */}
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors duration-200 font-manrope tracking-tight font-medium hover:bg-white/5 rounded-full"
          >
            <Icon icon="material-symbols:confirmation-number" />
            <span>Bookings</span>
          </Link>
        </nav>
        <div className="mt-auto px-2 space-y-1">
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors duration-200 font-manrope tracking-tight font-medium hover:bg-white/5 rounded-full"
          >
            <Icon icon="material-symbols:settings" />
            <span>Settings</span>
          </Link>
          <button
           
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors duration-200 font-manrope tracking-tight font-medium hover:bg-white/5 rounded-full"
            onClick={handleLogout}
          >
            <Icon icon="material-symbols:logout" />
            <span>Logout</span>
          </button>
          <div className="mt-4 px-4 py-4 bg-slate-900/50 rounded-2xl flex items-center gap-3 mx-2">
            <img
              alt="Admin Profile"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full bg-slate-800"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJrSgBk3JKKwNye6-4Uv214Nd1ekRnmha2jnce9jwPBuAc1kbTY1S-TDGJ8Rtq_b8Py2oJY15Y48PkEcg-LawcrulsnCYYqO1RCP_t7Rsz8xI3ypGfl4PS6Iye4rcYuY07XmZH9KfCWkOY307OdgDLDrYYZogDQoHRwc4Wy19Xcx4NDIFzliTgcKJG-FGhjrragloWP6e6RIOWjf1ctXfEaistOzNZwysrsA5dP4Ic2UXIxYX_MmKXsbYt-Iloq9pdeS_XVI9MLmY"
            />
            <div className="overflow-hidden">
              <p className="text-white text-sm font-bold truncate">Admin Profile</p>
              <p className="text-slate-500 text-xs truncate">System Controller</p>
            </div>
          </div>
        </div>
      </aside>)
}