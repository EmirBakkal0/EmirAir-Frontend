"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href) => {
    return pathname === href;
  }

  useEffect(() => {
    // Close mobile menu on route change
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Explore" },
    { href: "/my-trips", label: "My Trips" },
  ];

  return (
    <nav className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow-sm dark:shadow-none">
      <div className="flex justify-between items-center h-20 px-8 max-w-screen-2xl mx-auto font-['Manrope'] tracking-tight">
        <div>
          <Link href="/" className="block w-24 h-12 relative">
            <Image src="/logo.webp" height={50} width={100} className="w-full h-full object-cover" alt="EmirAir Logo" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link 
              key={link.href}
              href={link.href}
              className={isActive(link.href) 
                ? "text-primary font-bold border-b-2 border-primary transition-colors duration-300" 
                : "text-slate-600 dark:text-slate-400 font-medium hover:text-primary transition-colors duration-300"}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(true)} className="p-2">
            <Icon icon="material-symbols:menu" className="w-6 h-6" />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link className="bg-primary text-white px-6 py-2.5 rounded-full font-bold hover:opacity-90 active:scale-95 transition-all" href="/admin">
            Admin Panel
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0  z-50  md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 min-h-svh w-72 bg-surface-container shadow-xl z-60 transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b border-outline-variant ">
          <h2 className="font-bold text-lg text-on-surface ">Menu</h2>
          <button onClick={() => setIsMenuOpen(false)} className="p-2 text-on-surface-variant">
            <Icon icon="material-symbols:close" className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 space-y-2 ">
          {navLinks.map(link => (
            <Link 
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-lg font-medium ${isActive(link.href) ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-highest'}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 bg-white" >
            <Link className="block text-center bg-primary text-on-primary px-6 py-3 rounded-full font-bold hover:opacity-90 active:scale-95 transition-all" href="/admin">
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar