'use client';
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";     
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminSidebar() {
  const [name, setName] = useState("Admin");

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("adminName");
        if (stored) setName(stored);
      }
    } catch (e) {
      // ignore access errors
    }
  }, []);

  const user = { name };

  const router = useRouter();
  const handleLogout = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminName");
      }
    } catch (e) {
      console.error("Error clearing localStorage during logout", e);
    }
    router.push("/admin/login");
  };
  
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change for mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (pathname === '/admin/login') {
    return null;
  }

  const navLinks = [
    { name: "Flights", icon: "material-symbols:flight-takeoff", href: "/admin" },
    { name: "Bookings", icon: "material-symbols:confirmation-number", href: "/admin/bookings" }
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      {!isOpen && (
        <button 
          className="md:hidden fixed top-6 left-6 z-[60] p-3 bg-slate-950 text-white rounded-xl shadow-lg border border-slate-800"
          onClick={() => setIsOpen(true)}
        >
          <Icon icon="material-symbols:menu" width="24" height="24" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`bg-slate-950 dark:bg-slate-950 h-screen fixed md:sticky w-64 left-0 top-0 flex flex-col py-6 shadow-2xl shadow-blue-900/20 z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="px-6 mb-10 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
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
          {/* Close Menu Button (Mobile Only) */}
          <button 
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <Icon icon="material-symbols:close" width="24" height="24" />
          </button>
        </div>
        <nav className="flex-1 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-full font-manrope tracking-tight font-medium transition-all duration-200 ${
                  isActive 
                    ? "text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-md scale-95" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon icon={link.icon} width="20" height="20" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto px-2 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors duration-200 font-manrope tracking-tight font-medium hover:bg-white/5 rounded-full"
          >
            <Icon icon="material-symbols:home" />
            <span>Return to site</span>
          </Link>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors duration-200 font-manrope tracking-tight font-medium hover:bg-white/5 rounded-full"
            onClick={handleLogout}
          >
            <Icon icon="material-symbols:logout" />
            <span>Logout</span>
          </button>
          <div className="mt-4 px-4 py-4 bg-slate-900/50 rounded-2xl flex items-center gap-3 mx-2">
            <Icon className="text-white" icon="material-symbols:person" />
            <div className="overflow-hidden">
              <p className="text-white text-sm font-bold truncate">{user?.name || "Admin"}</p>
              <p className="text-slate-500 text-xs truncate">System Controller</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}