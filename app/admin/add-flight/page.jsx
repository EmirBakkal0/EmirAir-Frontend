"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

export default function AdminDashboard() {
  const router = useRouter();
  const [flights, setFlights] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    from_city: "",
    to_city: "",
    departure_time: "",
    arrival_time: "",
    price: "",
    seats_available: 150,
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [flightsRes, citiesRes] = await Promise.all([
          fetch("http://localhost:5000/api/flights"),
          fetch("http://localhost:5000/api/cities"),
        ]);

        const flightsData = await flightsRes.json();
        const citiesData = await citiesRes.json();

        // Extract the array from the 'data' property if it exists, otherwise use it directly if it's an array
        const extractedFlights = Array.isArray(flightsData.data) ? flightsData.data : (Array.isArray(flightsData) ? flightsData : []);
        const extractedCities = Array.isArray(citiesData.data) ? citiesData.data : (Array.isArray(citiesData) ? citiesData : []);

        setFlights(extractedFlights);
        setCities(extractedCities);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const token = localStorage.getItem("adminToken");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/flights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to add flight");
      }

      setSuccess("Flight added successfully!");
      setFlights([...flights, data.data]);
      setFormData({
        from_city: "",
        to_city: "",
        departure_time: "",
        arrival_time: "",
        price: "",
        seats_available: 150,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon icon="material-symbols:progress-activity" className="animate-spin text-5xl text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Icon icon="material-symbols:admin-panel-settings" className="text-primary text-4xl" />
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition"
          >
            <Icon icon="material-symbols:logout" /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 border rounded-2xl p-6 bg-surface-container shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Icon icon="material-symbols:flight-smode-outline" className="text-primary text-2xl" />
              Add New Flight
            </h2>
            
            {error && <p className="text-red-500 text-sm mb-4 font-semibold">{error}</p>}
            {success && <p className="text-green-600 text-sm mb-4 font-semibold">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">From City</label>
                <select
                  name="from_city"
                  value={formData.from_city}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-highest border-none rounded-xl p-3 outline-none"
                  required
                >
                  <option value="">Select Origin...</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.city_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">To City</label>
                <select
                  name="to_city"
                  value={formData.to_city}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-highest border-none rounded-xl p-3 outline-none"
                  required
                >
                  <option value="">Select Destination...</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.city_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Departure Time</label>
                <input
                  type="datetime-local"
                  name="departure_time"
                  value={formData.departure_time}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-highest border-none rounded-xl p-3 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Arrival Time</label>
                <input
                  type="datetime-local"
                  name="arrival_time"
                  value={formData.arrival_time}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-highest border-none rounded-xl p-3 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-highest border-none rounded-xl p-3 outline-none"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Seats</label>
                  <input
                    type="number"
                    name="seats_available"
                    value={formData.seats_available}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-highest border-none rounded-xl p-3 outline-none"
                    required
                    min="1"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold uppercase tracking-wide hover:bg-primary/90 transition shadow-md mt-6"
              >
                Create Flight
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 border rounded-2xl p-6 bg-surface-container shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Icon icon="material-symbols:list-alt" className="text-primary text-2xl" />
              Manage Flights
            </h2>

            {flights.length === 0 ? (
              <p className="text-on-surface-variant text-center py-8">No flights available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-outline-variant/50">
                      <th className="p-3 font-semibold text-sm">Route</th>
                      <th className="p-3 font-semibold text-sm">Departure</th>
                      <th className="p-3 font-semibold text-sm">Arrival</th>
                      <th className="p-3 font-semibold text-sm">Price / Seats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flights.map((flight) => (
                      <tr key={flight._id} className="border-b border-outline-variant/30 hover:bg-surface-container-highest transition">
                        <td className="p-3 font-semibold">
                          {flight.from_city?.city_name} → {flight.to_city?.city_name}
                        </td>
                        <td className="p-3 text-sm">
                          {new Date(flight.departure_time).toLocaleString()}
                        </td>
                        <td className="p-3 text-sm">
                          {new Date(flight.arrival_time).toLocaleString()}
                        </td>
                        <td className="p-3">
                          <span className="font-bold block">${flight.price}</span>
                          <span className="text-xs text-secondary">{flight.seats_available} seats</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
