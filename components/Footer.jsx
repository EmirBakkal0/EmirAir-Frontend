import Link from "next/link"

function Footer() {
  return (
     
      <footer className="w-full py-12 mt-auto bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:justify-between px-8 max-w-screen-2xl mx-auto">
          <div className="mb-8 lg:mb-0">
            <div className="text-lg font-bold text-slate-900 dark:text-white mb-2">EmirAir</div>
            <p className="text-slate-500 dark:text-slate-400 font-['Inter'] text-sm">© 2026 EmirAir. The perfect travel experience.</p>
          </div>
          <div className="flex flex-wrap gap-8">
            <Link className="text-slate-500 dark:text-slate-400 text-sm font-['Inter'] hover:underline hover:text-blue-500" href="#">
              Privacy Policy
            </Link>
            <Link className="text-slate-500 dark:text-slate-400 text-sm font-['Inter'] hover:underline hover:text-blue-500" href="#">
              Terms of Service
            </Link>
            <Link className="text-slate-500 dark:text-slate-400 text-sm font-['Inter'] hover:underline hover:text-blue-500" href="#">
              Cookie Settings
            </Link>
            <Link className="text-slate-500 dark:text-slate-400 text-sm font-['Inter'] hover:underline hover:text-blue-500" href="#">
              Accessibility
            </Link>
          </div>
        </div>
      </footer>
  )
}

export default Footer