"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const initialFormState = {
  from_city: "",
  to_city: "",
  departure_time: "",
  arrival_time: "",
  price: "5",
  seats_available: 150,
};

export default function AddFlightForm({
  onCreated,
  onCancel,
  submitLabel = "Create Flight",
  compact = false,
}) {
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/cities`);
        if (!response.ok) {
          throw new Error(`Failed to fetch cities: ${response.status} ${response.statusText}`);
        }

        const payload = await response.json();
        const extractedCities = Array.isArray(payload.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

        setCities(extractedCities);
      } catch (err) {
        setError(err.message || "Could not load city list");
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("adminToken");
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
      setFormData(initialFormState);

      if (onCreated) {
        onCreated(data.data);
      }
    } catch (err) {
      setError(err.message || "Failed to add flight");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {error && <p className="text-red-500 text-sm mb-4 font-semibold">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-4 font-semibold">{success}</p>}

      {loadingCities ? (
        <div className="min-h-40 flex items-center justify-center">
          <Icon icon="material-symbols:progress-activity" className="animate-spin text-3xl text-primary" />
        </div>
      ) : (
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

          <div className={`flex items-center ${onCancel ? "justify-end gap-3" : "justify-start"}`}>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-xl font-semibold border border-outline-variant/40 hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className={`bg-primary text-on-primary rounded-xl font-bold uppercase tracking-wide hover:bg-primary/90 transition shadow-md ${compact ? "px-5 py-2.5" : "w-full py-3 mt-6"} ${submitting ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {submitting ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
