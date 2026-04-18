"use client";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const [cities, setCities] = useState([]);
  const [flights, setFlights] = useState([]);
  const [flightAmount, setFlightAmount] = useState(0);

  const fetchCities = async () => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND + "/api/cities");
      if (!res.ok) {
        throw new Error(
          `Failed to fetch cities: ${res.status} ${res.statusText}`,
        );
      }
      const data = await res.json();
      setCities(data);
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  const fetchActiveFlights = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/flights/active`,
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch flights: ${response.status} ${response.statusText}`,
        );
      }
      const json = await response.json();
      if (json.success && Array.isArray(json.data)) {
        let results = json.data;
        setFlights(results);
        setFlightAmount(results.length);
      }
    } catch (errrooor) {
      console.error("error while fetching flights", errrooor);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchCities();
    fetchActiveFlights();
  }, [router]);

  async function deleteFlight(id) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/flights/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error(
          `Failed to delete flight: ${res.status} ${res.statusText}`,
        );
      }
      fetchActiveFlights();
    } catch (error) {
      console.error("Error deleting flight:", error);
    }
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* TopAppBar Component */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl fixed top-0 right-0 w-[calc(100%-16rem)] z-40 flex justify-between items-center px-8 h-16">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <Icon
                icon="material-symbols:search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-body"
                placeholder="Search flights, routes or IDs..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-500 hover:text-blue-500 transition-colors opacity-80 hover:opacity-100">
                <Icon icon="material-symbols:notifications" />
              </button>
              <button className="p-2 text-slate-500 hover:text-blue-500 transition-colors opacity-80 hover:opacity-100">
                <Icon icon="material-symbols:help-outline" />
              </button>
            </div>
            <div className="h-8 w-[1px] bg-outline-variant/20"></div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-manrope font-bold text-blue-600">
                Dashboard
              </span>
              <img
                alt="Administrator"
                className="w-8 h-8 rounded-full border border-outline-variant/30"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEm-ztTrdnjtVhdPWknbWEsaCWpQgbvWjSm1QDzqmR7Wr-QjpK4jz6_B1pGNaoCp1wNW6a2-plkd73awfXWMoMwB56sDJJAbPcWHwMjjvAS6G5bhGaEq3VLnLJjHjaVgI-OBV5nddKAH6RWJm2V9Fk9W-D1sbY3qpOcPHt_oAQt_9cwS0cA6WgZt9cQju-JZQEftX50HYIAGjYqmkExI-ml_fBxVDkLhKDZDPXfcZQTwtGh3fKfdhxUOqvlKPbeNWM8puwHRNP0XU"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <div className="mt-16 p-8 flex-1 overflow-y-auto">
          {/* Header Section */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-primary font-bold text-xs tracking-widest uppercase mb-2 block">
                Flight Operations
              </span>
              <h2 className="text-4xl font-extrabold text-on-surface tracking-tight">
                Active Flight Schedules
              </h2>
            </div>
            <Link
              href={"admin/add-flight"}
              className="bg-gradient-to-r from-primary to-primary-container text-white px-8 py-3.5 rounded-full font-headline font-bold text-sm flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Icon icon="material-symbols:add" />
              Add New Flight
            </Link>
          </div>

          {/* Bento Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-transparent hover:border-primary/10 transition-all">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                Total Flights
              </p>
              <h3 className="text-3xl font-black text-on-surface">
                {flightAmount}
              </h3>
              <div className="mt-4 flex items-center text-xs text-green-600 font-bold">
                <Icon icon="material-symbols:trending-up" className="text-sm" />
                <span>+12% vs last month</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-transparent">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                On-Time Rate
              </p>
              <h3 className="text-3xl font-black text-on-surface">94.2%</h3>
              <div className="mt-4 flex items-center text-xs text-blue-600 font-bold">
                <Icon
                  icon="material-symbols:check-circle"
                  className="text-sm"
                />
                <span>Industry leading</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-transparent">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                Active Routes
              </p>
              <h3 className="text-3xl font-black text-on-surface">86</h3>
              <div className="mt-4 flex items-center text-xs text-slate-500 font-bold">
                <Icon icon="material-symbols:map" className="text-sm" />
                <span>24 Countries</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-transparent">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                Revenue Today
              </p>
              <h3 className="text-3xl font-black text-on-surface">$42.5k</h3>
              <div className="mt-4 flex items-center text-xs text-primary font-bold">
                <Icon icon="material-symbols:payments" className="text-sm" />
                <span>Peak season active</span>
              </div>
            </div>
          </div>

          {/* Data Table Section */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 bg-surface-container-low/50 flex justify-between items-center">
              <div className="flex gap-4">
                <button className="bg-secondary text-white px-4 py-1.5 rounded-full text-xs font-bold">
                  All Flights
                </button>
                <button className="bg-surface-container-high text-on-surface-variant px-4 py-1.5 rounded-full text-xs font-bold hover:bg-surface-container-highest transition-colors">
                  Domestic
                </button>
                <button className="bg-surface-container-high text-on-surface-variant px-4 py-1.5 rounded-full text-xs font-bold hover:bg-surface-container-highest transition-colors">
                  International
                </button>
              </div>
              <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                <Icon icon="material-symbols:filter-list" className="text-sm" />
                Advanced Filters
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/30 border-b border-outline-variant/10">
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">
                      Flight ID
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">
                      Route
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">
                      Departure
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">
                      Arrival
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">
                      Empty Seats
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">
                      Price
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {/* Row 1 */}
                  {flights.map((flight) => (
                    <tr
                      key={flight._id}
                      className="hover:bg-surface-container-low transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <span className="font-manrope font-bold text-on-surface">
                          {flight.flight_id}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="text-sm">
                            <p className="font-bold text-on-surface">
                              {flight.from_city?.city_name
                                .slice(0, 3)
                                .toUpperCase()}
                            </p>
                            <p className="text-xs text-slate-400">
                              {flight.to_city?.city_name}
                            </p>
                          </div>
                          <Icon
                            icon="material-symbols:arrow-forward"
                            className="text-primary/40 text-sm"
                          />
                          <div className="text-sm">
                            <p className="font-bold text-on-surface">
                              {flight.to_city?.city_name
                                .slice(0, 3)
                                .toUpperCase()}
                            </p>
                            <p className="text-xs text-slate-400">
                              {flight.to_city?.city_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-on-surface">
                          {new Date(flight.departure_time).toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-on-surface">
                          {new Date(flight.arrival_time).toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                          {flight.seats_available} seats available
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-primary">
                          {"€" + flight.price.toFixed(2)}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                            <Icon
                              icon="material-symbols:edit"
                              className="text-sm"
                            />
                          </button>
                          <button onClick={() => deleteFlight(flight._id)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-error hover:bg-error-container/20 transition-all">
                            <Icon
                              icon="material-symbols:delete"
                              className="text-sm"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {/* <div className="px-6 py-4 bg-surface-container-low/20 flex justify-between items-center border-t border-outline-variant/5">
              <p className="text-xs text-slate-500 font-medium">
                Showing <span className="text-on-surface font-bold">1-10</span> of 1,284 flights
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-slate-400 disabled:opacity-30"
                  disabled
                >
                  <Icon icon="material-symbols:chevron-left" />
                </button>
                <button className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold">
                  1
                </button>
                <button className="w-8 h-8 rounded-full hover:bg-surface-container-high text-xs font-bold transition-colors">
                  2
                </button>
                <button className="w-8 h-8 rounded-full hover:bg-surface-container-high text-xs font-bold transition-colors">
                  3
                </button>
                <span className="text-slate-400 px-1">...</span>
                <button className="w-8 h-8 rounded-full hover:bg-surface-container-high text-xs font-bold transition-colors">
                  128
                </button>
                <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-slate-600">
                  <Icon icon="material-symbols:chevron-right" />
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}
