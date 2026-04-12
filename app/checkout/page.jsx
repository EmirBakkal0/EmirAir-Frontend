'use client'

import { Icon } from "@iconify/react";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Checkout() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const flightId = searchParams.get('flightId');
    
    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        passenger_name: '',
        passenger_surname: '',
        passenger_email: ''
    });

    const [bookingSuccess, setBookingSuccess] = useState(null);

    useEffect(() => {
        if (flightId) {
            const fetchFlight = async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/flights/${flightId}`);
                    const json = await res.json();
                    if (json.success) {
                        setFlight(json.data);
                    } else {
                        setError('Flight not found.');
                    }
                } catch (err) {
                    setError('Failed to fetch flight details.');
                } finally {
                    setLoading(false);
                }
            };
            fetchFlight();
        } else {
            setError('No flight selected. Please go back to the home page.');
            setLoading(false);
        }
    }, [flightId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        
        try {
            const res = await fetch('http://localhost:5000/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    flight_id: flightId,
                    ...formData
                })
            });
            const json = await res.json();

            if (json.success) {
                setBookingSuccess(json.data.ticket_id);
            } else {
                alert(`Booking failed: ${json.error}`);
            }
        } catch (err) {
            console.error('Failed to book', err);
            alert('Failed to book. Please try again.');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">Loading flight details...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">{error}</div>;

    if (bookingSuccess) {
        return (
            <div className="bg-background min-h-screen flex items-center justify-center pt-20">
                <div className="bg-surface-container-lowest p-12 rounded-xl shadow-lg max-w-lg text-center border-t-8 border-primary">
                    <Icon icon="mdi:check-circle" className="text-secondary text-8xl mx-auto mb-6" />
                    <h2 className="text-3xl font-extrabold mb-4">Booking Confirmed!</h2>
                    <p className="text-on-surface-variant mb-6">Your flight from {flight.from_city?.city_name} to {flight.to_city?.city_name} is confirmed.</p>
                    <div className="bg-surface-container-highest p-6 rounded-lg mb-8">
                        <span className="block text-sm uppercase tracking-widest font-bold text-on-surface-variant mb-2">Your Ticket ID</span>
                        <span className="text-4xl font-black text-primary tracking-widest">{bookingSuccess}</span>
                    </div>
                    <button onClick={() => router.push('/')} className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-all">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

  return (
    <div className="text-on-surface">
      {/* Main Content Canvas */}
      <main className="pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-12">
          <nav className="flex mb-4 gap-2 text-sm text-on-surface-variant">
            <span>Flights</span>
            <Icon icon="material-symbols:chevron-right" className="text-xs self-center" />
            <span>Search Results</span>
            <Icon icon="material-symbols:chevron-right" className="text-xs self-center" />
            <span className="text-primary font-medium">Checkout</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-background">
            Secure Your Seat
          </h1>
          <p className="text-on-surface-variant mt-2 text-lg">
            Review your flight details and finalize passenger information.
          </p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Passenger Info */}
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-surface-container-lowest rounded-lg p-8 md:p-10 shadow-[0_20px_40px_rgba(25,28,30,0.04)]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                  <Icon icon="material-symbols:person" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Passenger Information
                </h2>
              </div>
              <form onSubmit={handleBooking} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant ml-1">
                      Passenger Name
                    </label>
                    <input
                      required
                      name="passenger_name"
                      value={formData.passenger_name}
                      onChange={handleInputChange}
                      className="w-full h-14 px-6 rounded-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-outline/60"
                      placeholder="e.g. Alexander"
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant ml-1">
                      Passenger Surname
                    </label>
                    <input
                      required
                      name="passenger_surname"
                      value={formData.passenger_surname}
                      onChange={handleInputChange}
                      className="w-full h-14 px-6 rounded-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-outline/60"
                      placeholder="e.g. Mitchell"
                      type="text"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant ml-1">
                    Email Address
                  </label>
                  <input
                    required
                    name="passenger_email"
                    value={formData.passenger_email}
                    onChange={handleInputChange}
                    className="w-full h-14 px-6 rounded-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-outline/60"
                    placeholder="alex.mitchell@example.com"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                      Seat Number
                    </label>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      Optional
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      disabled
                      className="w-full h-14 px-6 rounded-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest opacity-50 cursor-not-allowed transition-all placeholder:text-outline/60"
                      placeholder="Auto Assigned"
                      type="text"
                    />
                    <Icon icon="material-symbols:event-seat" className="absolute right-6 top-1/2 -translate-y-1/2 text-outline" />
                  </div>
                </div>
                <div className="pt-6">
                  <button
                    className="w-full h-16 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-bold text-lg shadow-[0_10px_25px_rgba(0,89,187,0.25)] hover:shadow-[0_15px_30px_rgba(0,89,187,0.35)] active:scale-[0.98] transition-all duration-300"
                    type="submit"
                  >
                    Confirm Booking
                  </button>
                  <p className="text-center text-xs text-outline mt-4">
                    By confirming, you agree to our Terms of Service and Privacy
                    Policy.
                  </p>
                </div>
              </form>
            </div>
            {/* Complementary Information Card (Bento Style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container-low rounded-lg p-6 flex flex-col gap-4">
                <Icon icon="material-symbols:verified-user" className="text-primary text-3xl" />
                <div>
                  <h3 className="font-bold text-lg">Secure Payment</h3>
                  <p className="text-sm text-on-surface-variant">
                    Your data is protected by industry-standard 256-bit SSL
                    encryption.
                  </p>
                </div>
              </div>
              <div className="bg-surface-container-low rounded-lg p-6 flex flex-col gap-4">
                <Icon icon="material-symbols:support-agent" className="text-primary text-3xl" />
                <div>
                  <h3 className="font-bold text-lg">24/7 Support</h3>
                  <p className="text-sm text-on-surface-variant">
                    Our dedicated concierge team is available around the clock
                    for any assistance.
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* Right Column: Order Summary */}
          <aside className="space-y-6">
            <div className="bg-surface-container-low rounded-lg p-8 border-0">
              <h2 className="text-xl font-bold tracking-tight mb-8">
                Order Summary
              </h2>
              {/* Flight Detail Card */}
              <div className="bg-surface-container-lowest rounded-lg p-6 mb-8 relative overflow-hidden">
                {/* Decorative sky background element */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12"></div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-outline mb-1">
                      Outbound
                    </p>
                    <h3 className="text-xl font-extrabold tracking-tight">
                      {flight.from_city?.city_name.slice(0, 3).toUpperCase()} → {flight.to_city?.city_name.slice(0, 3).toUpperCase()}
                    </h3>
                  </div>
                  <Icon icon="material-symbols:flight-takeoff" className="text-primary" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant">
                      {flight.from_city?.city_name} to {flight.to_city?.city_name}
                    </span>
                    <span className="text-sm font-semibold">Non-stop</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant">
                      Departure
                    </span>
                    <span className="text-sm font-semibold">
                      {new Date(flight.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant">
                      Arrival
                    </span>
                    <span className="text-sm font-semibold">
                      {new Date(flight.arrival_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-on-surface-variant">
                    Adult Passenger x1
                  </span>
                  <span className="text-sm font-medium">${flight.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-on-surface-variant">
                    Taxes & Fees
                  </span>
                  <span className="text-sm font-medium">${(flight.price * 0.15).toFixed(2)}</span>
                </div>
                <div className="h-[1px] bg-outline-variant/30 my-4"></div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total Price</span>
                  <span className="text-2xl font-black text-primary tracking-tighter">
                    ${(flight.price + (flight.price * 0.15)).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="bg-primary/5 rounded-xl p-4 flex items-start gap-3">
                <Icon icon="material-symbols:info" className="text-primary text-xl w-20! h-20!" ></Icon>
                <p>Prices include all mandatory taxes and carrier surcharges.
                  Baggage allowance: 23kg check-in.
                </p>
              </div>
            </div>

            {/* Destination Preview Card */}
            <div className="rounded-lg overflow-hidden group relative h-48">
              <img
                alt="Eiffel Tower at sunset"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                data-alt="romantic sunset view of the eiffel tower in paris with soft golden lighting and clear evening sky"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7vn4Op_t4LIZBsG54Xer5yMA-_qHZ1RE5G7-RggdTK-YkMaTHQOb3qE74rA0_PB-cdIuNbgOV5K_d-YC6OAI7FvsMU0k1_I7VVzat5hjjTnSFlBk4LE0YzdkAI45OFNBifuGmMMr0MxH3k60PL6YGgqkLhczRl4AC3Tqkhk_n_xeBIsza2B2NujxDtQVgYI3DruaGWAUYjjmX_5ocTbSWSDV18nuOxp86qQKr7sgDl_6q2RN-9wZZO79qYaqz50LUb31crRigGQU"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-6 text-white">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-80">
                  Next Stop
                </p>
                <h4 className="text-xl font-bold tracking-tight">
                  Paris, France
                </h4>
              </div>
            </div>
          </aside>
        </div>
      </main>
      
      
    </div>
  );
}
