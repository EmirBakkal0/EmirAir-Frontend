import Image from "next/image"

function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none">
        <div className="flex justify-between items-center h-20 px-8 max-w-screen-2xl mx-auto font-['Manrope'] tracking-tight">
            <div><Image src="/logo.webp" height={50} width={100} className="w-full h-full object-cover" alt="EmirAir Logo"  /></div>
          {/* <div className="text-2xl font-black text-blue-700 dark:text-blue-400 tracking-tighter">EmirAir</div> */}
          <div className="hidden md:flex items-center gap-8">
            <a className="text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 transition-colors duration-300" href="#">Explore</a>
            <a className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-500 transition-colors duration-300" href="#">My Trips</a>
            <a className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-500 transition-colors duration-300" href="#">Support</a>
            <a className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-500 transition-colors duration-300" href="#">Check-in</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-600 font-medium hover:text-blue-500 transition-colors duration-300">Sign In</button>
            <button className="bg-primary text-white px-6 py-2.5 rounded-full font-bold hover:opacity-90 active:scale-95 transition-all">Join Rewards</button>
          </div>
        </div>
      </nav>
  )
}

export default Navbar