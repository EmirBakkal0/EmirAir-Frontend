'use client'

import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [cities, setCities] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  
  // Search form state
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    // Fetch 81 cities strictly from backend
    const fetchCities = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/cities');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCities(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch cities:', err);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  const handleSearch = async () => {
    try {
      setSearched(true);
      // Fetch all flights (Can be optimized via query params later)
      const res = await fetch('http://localhost:5000/api/flights');
      const json = await res.json();
      
      if (json.success && Array.isArray(json.data)) {
        let results = json.data;

        // Filter on the client side based on inputs
        if (origin) {
          results = results.filter(f => f.from_city && f.from_city._id === origin);
        }
        if (destination) {
          results = results.filter(f => f.to_city && f.to_city._id === destination);
        }
        if (date) {
            // Compare local date strings
            results = results.filter(f => {
                const flightDate = new Date(f.departure_time).toISOString().split('T')[0];
                return flightDate === date;
            });
        }

        setFlights(results);
      }
    } catch (err) {
      console.error('Failed to fetch flights:', err);
    }
  };

  const handleBook = (flightId) => {
    router.push(`/checkout?flightId=${flightId}`);
  };

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
                    <select 
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-full appearance-none focus:ring-2 focus:ring-primary/30 transition-all font-medium" 
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                    >
                      <option value="">Any Origin</option>
                      {!loadingCities && cities.map(city => (
                        <option key={city._id} value={city._id}>{city.city_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-4">Destination City</label>
                  <div className="relative">
                    <Icon icon="mdi:airplane" className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                    <select 
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-full appearance-none focus:ring-2 focus:ring-primary/30 transition-all font-medium" 
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    >
                      <option value="">Any Destination</option>
                      {!loadingCities && cities.map(city => (
                        <option key={city._id} value={city._id}>{city.city_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-4">Travel Date</label>
                  <div className="relative">
                    <Icon icon="mdi:calendar-today" className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                    <input 
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-full focus:ring-2 focus:ring-primary/30 transition-all font-medium" 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={handleSearch}
                    className="w-full hero-gradient text-white py-4 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-lg" 
                    style={{ background: 'linear-gradient(135deg, #0059bb 0%, #0070ea 100%)' }}
                  >
                    Search Flights
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Flight Results Section */}
        {searched && (
          <section className="max-w-5xl mx-auto px-8 py-20">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Available Flights</h2>
                <p className="text-on-surface-variant mt-2">
                  {flights.length} {flights.length === 1 ? 'result' : 'results'} found
                </p>
              </div>
            </div>
            
            {/* Results List */}
            <div className="space-y-6">
              {flights.length === 0 ? (
                <div className="text-center py-12 text-on-surface-variant bg-surface-container-lowest rounded-xl">
                  No flights actively matches your route on this day.
                </div>
              ) : (
                flights.map(flight => (
                  <div key={flight._id} className="group bg-surface-container-lowest p-8 rounded-xl flex flex-col md:flex-row items-center justify-between transition-all hover:bg-surface-bright hover:shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
                    <div className="flex items-center gap-12 w-full md:w-auto">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-primary mb-2 uppercase tracking-widest">{flight.flight_id}</span>
                        <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
                          <Icon icon="mdi:airplane" className="text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 flex items-center gap-8">
                        <div className="text-center md:text-left">
                          <span className="block text-2xl font-bold">
                            {new Date(flight.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          <span className="text-sm font-medium text-on-surface-variant">{flight.from_city?.city_name || 'N/A'}</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center px-4 min-w-[120px]">
                          <div className="w-full h-[2px] bg-surface-container-highest relative mt-2">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/40"></div>
                          </div>
                          <span className="text-[10px] font-bold text-primary mt-1">NON-STOP</span>
                        </div>
                        <div className="text-center md:text-right">
                          <span className="block text-2xl font-bold">
                            {new Date(flight.arrival_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          <span className="text-sm font-medium text-on-surface-variant">{flight.to_city?.city_name || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-12 mt-8 md:mt-0 w-full md:w-auto border-t md:border-t-0 border-surface-container pt-6 md:pt-0">
                      <div className="text-right">
                        <span className="block text-xs font-bold text-on-surface-variant uppercase">Available</span>
                        <span className="text-sm font-semibold text-secondary">{flight.seats_available} Seats Left</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-bold text-on-surface-variant uppercase">Price</span>
                        <span className="text-3xl font-extrabold">€{flight.price}</span>
                      </div>
                      <button 
                        onClick={() => handleBook(flight._id)}
                        disabled={flight.seats_available <= 0}
                        className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                      >
                        Book Ticket
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

