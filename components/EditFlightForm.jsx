"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";

function asId(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return value._id || "";
}

function toDateTimeLocal(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const timezoneOffsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - timezoneOffsetMs).toISOString().slice(0, 16);
}

function resolveCityValue(cityValue, fallbackId, cities) {
  if (cityValue && typeof cityValue === "object" && cityValue.city_name) {
    return cityValue;
  }

  const cityId = typeof cityValue === "string" ? cityValue : fallbackId;
  return cities.find((city) => city._id === cityId) || cityValue || null;
}

export default function EditFlightForm({
  flight,
  onUpdated,
  onCancel,
  submitLabel = "Save Changes",
  compact = false,
}) {
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const initialFormState = useMemo(
    () => ({
      from_city: asId(flight?.from_city),
      to_city: asId(flight?.to_city),
      departure_time: toDateTimeLocal(flight?.departure_time),
      arrival_time: toDateTimeLocal(flight?.arrival_time),
      price: String(flight?.price ?? ""),
      seats_available: String(flight?.seats_available ?? 150),
    }),
    [flight],
  );

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    setFormData(initialFormState);
  }, [initialFormState]);

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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/flights/${flight._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to update flight");
      }

      const rawUpdatedFlight = data.data || { ...flight, ...formData };
      const updatedFlight = {
        ...flight,
        ...rawUpdatedFlight,
        departure_time: rawUpdatedFlight?.departure_time || formData.departure_time,
        arrival_time: rawUpdatedFlight?.arrival_time || formData.arrival_time,
        price: Number(rawUpdatedFlight?.price ?? formData.price ?? flight?.price ?? 0),
        seats_available: Number(
          rawUpdatedFlight?.seats_available ??
            formData.seats_available ??
            flight?.seats_available ??
            0,
        ),
        from_city: resolveCityValue(
          rawUpdatedFlight?.from_city,
          formData.from_city,
          cities,
        ),
        to_city: resolveCityValue(
          rawUpdatedFlight?.to_city,
          formData.to_city,
          cities,
        ),
      };

      setSuccess("Flight updated successfully!");

      if (onUpdated) {
        onUpdated(updatedFlight);
      }
    } catch (err) {
      setError(err.message || "Failed to update flight");
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
