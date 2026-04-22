"use client";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AddFlightForm from "@/components/AddFlightForm";
import EditFlightForm from "@/components/EditFlightForm";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState([]);
  const [flightAmount, setFlightAmount] = useState(0);
  const [isAddFlightModalOpen, setIsAddFlightModalOpen] = useState(false);
  const [isEditFlightModalOpen, setIsEditFlightModalOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [activeTab, setActiveTab] = useState("active");

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
        setActiveTab("active");
      }
    } catch (errrooor) {
      console.error("error while fetching flights", errrooor);
      
    }finally {
      setLoading(false);
    }
  };

  const fetchOldFlights = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/flights/old`,
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
        // setFlightAmount(results.length);
        setActiveTab("old");

      }
    } catch (error) {
      console.error("error while fetching flights", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchActiveFlights();
  }, [router]);

  useEffect(() => {
    if (!isAddFlightModalOpen && !isEditFlightModalOpen) {
      return;
    }

    const handleEscClose = (event) => {
      if (event.key === "Escape") {
        setIsAddFlightModalOpen(false);
        setIsEditFlightModalOpen(false);
        setSelectedFlight(null);
      }
    };

    window.addEventListener("keydown", handleEscClose);
    return () => {
      window.removeEventListener("keydown", handleEscClose);
    };
  }, [isAddFlightModalOpen, isEditFlightModalOpen]);

  const handleFlightCreated = (newFlight) => {
    setFlights((prevFlights) => [...prevFlights, newFlight]);
    setFlightAmount((prevAmount) => prevAmount + 1);
    setIsAddFlightModalOpen(false);
  };

  const handleOpenEditModal = (flight) => {
    setSelectedFlight(flight);
    setIsEditFlightModalOpen(true);
  };

  const handleFlightUpdated = (updatedFlight) => {
    setFlights((prevFlights) =>
      prevFlights.map((flight) =>
        flight._id === updatedFlight._id ? updatedFlight : flight,
      ),
    );
    setIsEditFlightModalOpen(false);
    setSelectedFlight(null);
  };

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
    <div className="container mx-auto bg-background text-on-background min-h-screen p-8 flex  overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 min-h-screen flex w-full flex-col">
      
       

        {/* Dashboard Canvas */}
        <div className=" flex-1 overflow-y-auto">
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
            <button
              type="button"
              onClick={() => setIsAddFlightModalOpen(true)}
              className="bg-gradient-to-r from-primary to-primary-container text-white  cursor-pointer px-8 py-3.5 rounded-full font-headline font-bold text-sm flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Icon icon="material-symbols:add" />
              Add New Flight
            </button>
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
                {/* <div className="mt-4 flex items-center text-xs text-green-600 font-bold">
                  <Icon icon="material-symbols:trending-up" className="text-sm" />
                  <span>+12% vs last month</span>
                </div> */}
            </div>  
          </div>

          {/* Data Table Section */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 bg-surface-container-low/50 flex justify-between items-center">
              <div className="flex gap-4">
                <button onClick={() => fetchActiveFlights()} className={`${activeTab === "active" ? "bg-secondary text-white" : "bg-surface-container-lowest text-on-surface-variant"} px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer hover:bg-secondary/90 transition-colors`}>
                  Active Flights
                </button>
                <button onClick={() => fetchOldFlights()} className={`${activeTab === "old" ? "bg-secondary text-white" : "bg-surface-container-lowest text-on-surface-variant"} px-4 py-1.5 rounded-full text-xs font-bold hover:bg-secondary/90 transition-colors cursor-pointer`}>
                  Old Flights
                </button>
                {/* 
                <button className="bg-surface-container-high text-on-surface-variant px-4 py-1.5 rounded-full text-xs font-bold hover:bg-surface-container-highest transition-colors">
                  International
                </button> */}
              </div>
              {/* <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                <Icon icon="material-symbols:filter-list" className="text-sm" />
                Advanced Filters
              </button> */}
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
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-5 text-center text-slate-500">
                        Loading flights...
                      </td>
                    </tr>
                  ) : (
                    flights.map((flight) => (
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
                                ?.slice(0, 3)
                                .toUpperCase() || "N/A"}
                            </p>
                            <p className="text-xs text-slate-400">
                              {flight.from_city?.city_name || "Unknown"}
                            </p>
                          </div>
                          <Icon
                            icon="material-symbols:arrow-forward"
                            className="text-primary/40 text-sm"
                          />
                          <div className="text-sm">
                            <p className="font-bold text-on-surface">
                              {flight.to_city?.city_name
                                ?.slice(0, 3)
                                .toUpperCase() || "N/A"}
                            </p>
                            <p className="text-xs text-slate-400">
                              {flight.to_city?.city_name || "Unknown"}
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
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(flight)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          >
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
                  )))}
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

      {isAddFlightModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex items-center justify-center px-4"
          onClick={() => setIsAddFlightModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface-container-lowest p-6 md:p-8 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-black text-on-surface">Add New Flight</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Create a new flight schedule without leaving this page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddFlightModalOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-surface-container-high transition-colors"
                aria-label="Close add flight form"
              >
                <Icon icon="material-symbols:close" className="text-xl" />
              </button>
            </div>

            <AddFlightForm
              onCreated={handleFlightCreated}
              onCancel={() => setIsAddFlightModalOpen(false)}
              compact
            />
          </div>
        </div>
      )}

      {isEditFlightModalOpen && selectedFlight && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex items-center justify-center px-4"
          onClick={() => {
            setIsEditFlightModalOpen(false);
            setSelectedFlight(null);
          }}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface-container-lowest p-6 md:p-8 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-black text-on-surface">Edit Flight</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Update flight details without leaving this page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditFlightModalOpen(false);
                  setSelectedFlight(null);
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-surface-container-high transition-colors"
                aria-label="Close edit flight form"
              >
                <Icon icon="material-symbols:close" className="text-xl" />
              </button>
            </div>

            <EditFlightForm
              flight={selectedFlight}
              onUpdated={handleFlightUpdated}
              onCancel={() => {
                setIsEditFlightModalOpen(false);
                setSelectedFlight(null);
              }}
              compact
            />
          </div>
        </div>
      )}
    </div>
  );
    }
