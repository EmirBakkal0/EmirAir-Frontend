

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminBookings() {
    const router = useRouter();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/login");
            return;
        }

        const fetchTickets = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:5000'}/api/tickets`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch tickets: ${response.status}`);
                }
                
                const json = await response.json();
                if (json.success) {
                    setTickets(json.data);
                } else {
                    setError(json.error || "Failed to fetch tickets");
                }
            } catch (err) {
                console.error("Error fetching tickets", err);
                setError("An error occurred while fetching tickets.");
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [router]);

    if (loading) {
        return (
            <div className="mx-auto min-h-screen w-full bg-surface flex items-center justify-center p-4">
                <div className="text-xl font-bold">Loading bookings...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto min-h-screen w-full bg-surface flex items-center justify-center p-4">
                <div className="text-xl font-bold text-red-500">{error}</div>
            </div>
        );
    }

    // Group tickets by flight
    const groupedTickets = tickets.reduce((acc, ticket) => {
        // Handle case where flight_id might be populated object or just ID
        const flightRef = ticket.flight_id || ticket.flight;
        const flightIdentifier = typeof flightRef === 'object' && flightRef !== null 
            ? (flightRef.flight_id || flightRef._id) 
            : flightRef;
            
        const key = flightIdentifier || 'Unknown Flight';
        
        if (!acc[key]) {
            acc[key] = {
                flightObj: typeof flightRef === 'object' && flightRef !== null ? flightRef : null,
                tickets: []
            };
        }
        acc[key].tickets.push(ticket);
        return acc;
    }, {});

    return (
        <div className="mx-auto min-h-screen w-full bg-background flex flex-col p-8">
            <h1 className="text-2xl font-black text-primary mb-8">All Bookings by Flight</h1>
            
            {Object.keys(groupedTickets).length === 0 ? (
                <div className="p-8 bg-surface-container rounded-xl shadow-md text-center">
                    <p className="text-on-surface-variant font-medium text-lg">No tickets found.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedTickets).map(([flightId, data]) => (
                        <div key={flightId} className="bg-surface-container-lowest p-6 rounded-xl shadow-md border-t-4 border-primary">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-sm">Flight: {flightId}</span>
                                {data.flightObj && data.flightObj.from_city && data.flightObj.to_city && (
                                    <span className="text-on-surface-variant text-base">
                                        {data.flightObj.from_city.city_name} to {data.flightObj.to_city.city_name}
                                    </span>
                                )}
                            </h2>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-surface-container text-on-surface">
                                            <th className="p-3 border-b border-outline-variant font-bold">Ticket ID</th>
                                            <th className="p-3 border-b border-outline-variant font-bold">Passenger Name</th>
                                            <th className="p-3 border-b border-outline-variant font-bold">Email</th>
                                            <th className="p-3 border-b border-outline-variant font-bold">Date Booked</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.tickets.map(ticket => (
                                            <tr key={ticket._id} className="hover:bg-surface-container-highest transition-colors">
                                                <td className="p-3 border-b border-outline-variant font-mono text-sm">{ticket.ticket_id || ticket._id}</td>
                                                <td className="p-3 border-b border-outline-variant">
                                                    {ticket.passenger_name} {ticket.passenger_surname}
                                                </td>
                                                <td className="p-3 border-b border-outline-variant text-sm text-on-surface-variant">
                                                    {ticket.passenger_email}
                                                </td>
                                                <td className="p-3 border-b border-outline-variant text-sm text-on-surface-variant">
                                                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
