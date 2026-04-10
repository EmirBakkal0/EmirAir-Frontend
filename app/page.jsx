import { Icon } from '@iconify/react';
import Image from 'next/image';

function BuyTicket() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
     
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image src="/emirair.webp " className="w-full h-full object-cover" alt="cinematic wide shot of a modern white airplane flying above a sea of soft white clouds during a vibrant blue day"  fill priority />
            <div className="absolute inset-0 bg-blue-900/20 backdrop-brightness-90"></div>
          </div>
          <div className="relative z-10 w-full max-w-5xl px-8">
            <div className="mb-12 text-center md:text-left">
              <span className="label-md uppercase tracking-[0.2em] text-white/90 font-bold mb-4 block">Elevate Your Journey</span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-tight">Beyond the <br/>Horizon.</h1>
            </div>
            {/* Elevated Search Form */}
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(25,28,30,0.06)] backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-4">Origin City</label>
                  <div className="relative">
                    <Icon icon="mdi:location" className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                    <select className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-full appearance-none focus:ring-2 focus:ring-primary/30 transition-all font-medium" defaultValue="Istanbul (IST)">
                      <option value="Istanbul (IST)">Istanbul (IST)</option>
                      <option value="London (LHR)">London (LHR)</option>
                      <option value="New York (JFK)">New York (JFK)</option>
                      <option value="Tokyo (NRT)">Tokyo (NRT)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-4">Destination City</label>
                  <div className="relative">
                    <Icon icon="mdi:airplane" className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                    <select className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-full appearance-none focus:ring-2 focus:ring-primary/30 transition-all font-medium" defaultValue="">
                      <option disabled value="">Where to?</option>
                      <option value="Paris (CDG)">Paris (CDG)</option>
                      <option value="Dubai (DXB)">Dubai (DXB)</option>
                      <option value="Singapore (SIN)">Singapore (SIN)</option>
                      <option value="Rome (FCO)">Rome (FCO)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-4">Travel Date</label>
                  <div className="relative">
                    <Icon icon="mdi:calendar-today" className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                    <input className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-full focus:ring-2 focus:ring-primary/30 transition-all font-medium" type="date" />
                  </div>
                </div>
                <div className="flex items-end">
                  <button className="w-full hero-gradient text-white py-4 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-lg" style={{ background: 'linear-gradient(135deg, #0059bb 0%, #0070ea 100%)' }}>
                    Search Flights
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Flight Results Section */}
        <section className="max-w-5xl mx-auto px-8 py-20">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Available Flights</h2>
              <p className="text-on-surface-variant mt-2">Showing results for Istanbul to Paris</p>
            </div>
            <div className="flex gap-2">
              <span className="bg-secondary text-on-secondary px-4 py-2 rounded-full text-sm font-semibold">Cheapest</span>
              <span className="bg-surface-container-low text-on-surface-variant px-4 py-2 rounded-full text-sm font-semibold">Fastest</span>
            </div>
          </div>
          {/* Results List */}
          <div className="space-y-6">
            {/* Flight Card 1 */}
            <div className="group bg-surface-container-lowest p-8 rounded-xl flex flex-col md:flex-row items-center justify-between transition-all hover:bg-surface-bright hover:shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
              <div className="flex items-center gap-12 w-full md:w-auto">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-primary mb-2 uppercase tracking-widest">TK-182</span>
                  <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
                    <Icon icon="mdi:airplane" className="text-primary" />
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-8">
                  <div className="text-center md:text-left">
                    <span className="block text-2xl font-bold">08:45</span>
                    <span className="text-sm font-medium text-on-surface-variant">IST</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center px-4 min-w-[120px]">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter mb-1">3h 40m</span>
                    <div className="w-full h-[2px] bg-surface-container-highest relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/40"></div>
                    </div>
                    <span className="text-[10px] font-bold text-primary mt-1">NON-STOP</span>
                  </div>
                  <div className="text-center md:text-right">
                    <span className="block text-2xl font-bold">11:25</span>
                    <span className="text-sm font-medium text-on-surface-variant">CDG</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-12 mt-8 md:mt-0 w-full md:w-auto border-t md:border-t-0 border-surface-container pt-6 md:pt-0">
                <div className="text-right">
                  <span className="block text-xs font-bold text-on-surface-variant uppercase">Available</span>
                  <span className="text-sm font-semibold text-secondary">12 Seats Left</span>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-bold text-on-surface-variant uppercase">Price</span>
                  <span className="text-3xl font-black text-primary tracking-tighter">$24</span>
                </div>
                <button className="bg-surface-container-high text-primary px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-all active:scale-95">
                  Book
                </button>
              </div>
            </div>
            {/* Flight Card 2 */}
            <div className="group bg-surface-container-lowest p-8 rounded-xl flex flex-col md:flex-row items-center justify-between transition-all hover:bg-surface-bright hover:shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
              <div className="flex items-center gap-12 w-full md:w-auto">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-primary mb-2 uppercase tracking-widest">TK-412</span>
                  <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
                    <Icon icon="mdi:airplane" className="text-primary" />

                  </div>
                </div>
                <div className="flex-1 flex items-center gap-8">
                  <div className="text-center md:text-left">
                    <span className="block text-2xl font-bold">14:20</span>
                    <span className="text-sm font-medium text-on-surface-variant">IST</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center px-4 min-w-[120px]">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter mb-1">3h 45m</span>
                    <div className="w-full h-[2px] bg-surface-container-highest relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/40"></div>
                    </div>
                    <span className="text-[10px] font-bold text-primary mt-1">NON-STOP</span>
                  </div>
                  <div className="text-center md:text-right">
                    <span className="block text-2xl font-bold">17:05</span>
                    <span className="text-sm font-medium text-on-surface-variant">CDG</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-12 mt-8 md:mt-0 w-full md:w-auto border-t md:border-t-0 border-surface-container pt-6 md:pt-0">
                <div className="text-right">
                  <span className="block text-xs font-bold text-on-surface-variant uppercase">Available</span>
                  <span className="text-sm font-semibold text-secondary">4 Seats Left</span>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-bold text-on-surface-variant uppercase">Price</span>
                  <span className="text-3xl font-black text-primary tracking-tighter">$31</span>
                </div>
                <button className="bg-surface-container-high text-primary px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-all active:scale-95">
                  Book
                </button>
              </div>
            </div>
            {/* Flight Card 3 */}
            <div className="group bg-surface-container-lowest p-8 rounded-xl flex flex-col md:flex-row items-center justify-between transition-all hover:bg-surface-bright hover:shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
              <div className="flex items-center gap-12 w-full md:w-auto">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-primary mb-2 uppercase tracking-widest">TK-901</span>
                  <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
                    <Icon icon="mdi:airplane" className="text-primary" />
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-8">
                  <div className="text-center md:text-left">
                    <span className="block text-2xl font-bold">21:00</span>
                    <span className="text-sm font-medium text-on-surface-variant">IST</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center px-4 min-w-[120px]">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter mb-1">3h 40m</span>
                    <div className="w-full h-[2px] bg-surface-container-highest relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/40"></div>
                    </div>
                    <span className="text-[10px] font-bold text-primary mt-1">NON-STOP</span>
                  </div>
                  <div className="text-center md:text-right">
                    <span className="block text-2xl font-bold">23:40</span>
                    <span className="text-sm font-medium text-on-surface-variant">CDG</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-12 mt-8 md:mt-0 w-full md:w-auto border-t md:border-t-0 border-surface-container pt-6 md:pt-0">
                <div className="text-right">
                  <span className="block text-xs font-bold text-on-surface-variant uppercase">Available</span>
                  <span className="text-sm font-semibold text-secondary">28 Seats Left</span>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-bold text-on-surface-variant uppercase">Price</span>
                  <span className="text-3xl font-black text-primary tracking-tighter">$19</span>
                </div>
                <button className="bg-surface-container-high text-primary px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-all active:scale-95">
                  Book
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
     
    </div>
  )
}

export default BuyTicket