"use client"
import React from 'react'
import { Icon } from '@iconify/react';

export default function MyTrips() {

  const [mail, setMail] = React.useState("")
  const [tickets, setTickets] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const getTicket = async() => {
    setLoading(true)
    setError(null)
    try{
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/tickets/user/${mail}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const json = await res.json();

      if(!res.ok) {
        throw new Error(json.message || "Failed to fetch tickets");
      }
      console.log("User Tickets:", json);
      setTickets(json.data || []);
    } catch(err) {
      console.error("Error fetching tickets", err);
      setError(err.message)
      setTickets([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-background text-on-surface min-h-screen flex flex-col'>
      <main className="grow px-4 py-8 md:py-12">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2">My Trips</h1>
            <p className="text-on-surface-variant text-lg">View and manage your flight bookings</p>
          </div>

          {/* Search Form */}
          <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-sm mb-8">
            <form onSubmit={(e) => {
              e.preventDefault();
              getTicket();
            }} className="space-y-4">
              <div>
                <label htmlFor="trip-search" className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider px-4 mb-2">Enter Email to Find Your Trips</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Icon icon="mdi:email" className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                    <input 
                      id="trip-search"
                      type='email' 
                      placeholder='you@example.com' 
                      className="w-full pl-12 pr-4 py-3 bg-surface-container-highest border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium text-on-surface placeholder:text-on-surface-variant"
                      value={mail}
                      onChange={(e) => setMail(e.target.value)}
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg font-bold hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon icon="mdi:magnify" className="text-lg" />
                    {loading ? "Searching..." : "Search"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-800">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Results */}
          {tickets.length > 0 && (
            <div className="space-y-6">
              <h2 className='text-2xl font-bold'>Your Bookings ({tickets.length})</h2>
              <div className="overflow-x-auto rounded-xl shadow-sm border border-outline-variant">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-surface-container text-on-surface border-b border-outline-variant">
                      <th scope="col" className="px-4 md:px-6 py-4 font-bold">Booking ID</th>
                      <th scope="col" className="px-4 md:px-6 py-4 font-bold">Flight</th>
                      <th scope="col" className="px-4 md:px-6 py-4 font-bold">Route</th>
                      <th scope="col" className="px-4 md:px-6 py-4 font-bold">Seat</th>
                      <th scope="col" className="px-4 md:px-6 py-4 font-bold">Price</th>
                      <th scope="col" className="px-4 md:px-6 py-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket, index) => (
                      <tr key={index} className="bg-surface-container-lowest border-b border-outline-variant hover:bg-surface-container-highest transition-colors">
                        <td className="px-4 md:px-6 py-4 font-mono text-sm font-medium">
                          {ticket.ticket_id}
                        </td>
                        <td className="px-4 md:px-6 py-4 font-medium">
                          {ticket.flight_id?.flight_id || "N/A"}
                        </td>
                        <td className="px-4 md:px-6 py-4 text-on-surface-variant">
                          {ticket.flight_id?.from_city?.city_name || "N/A"} → {ticket.flight_id?.to_city?.city_name || "N/A"}
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          {ticket.seat_number || "N/A"}
                        </td>
                        <td className="px-4 md:px-6 py-4 font-semibold text-primary">
                          ${ticket.price?.toFixed(2) || "N/A"}
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                            <Icon icon="mdi:check-circle" />
                            {ticket.status || "Confirmed"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && tickets.length === 0 && !error && mail && (
            <div className="bg-surface-container rounded-lg p-8 text-center">
              <Icon icon="mdi:inbox-multiple-outline" className="text-5xl text-on-surface-variant mx-auto mb-4" />
              <p className="text-on-surface-variant text-lg font-medium">No trips found for this email address.</p>
            </div>
          )}

          {/* Initial State */}
          {!loading && tickets.length === 0 && !error && !mail && (
            <div className="bg-surface-container rounded-lg p-8 text-center">
              <Icon icon="mdi:airplane-search" className="text-5xl text-on-surface-variant mx-auto mb-4" />
              <p className="text-on-surface-variant text-lg font-medium">Enter your email above to view your bookings</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

