"use client"
import React from 'react'

export default function MyTrips() {

  const [mail,setMail] = React.useState("")
  const [tickets,setTickets] = React.useState([])

  const getTicket = async() => {
    try{
      const res= await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/tickets/user/${mail}`,{
        method:"GET",
        headers:{
          "Content-Type":"application/json"
        }
      })
      const json = await res.json();

      if(!res.ok){
        throw new Error(json.message || "Failed to fetch tickets");
      }
      console.log("User Tickets:", json);
      setTickets(json.data);

    }catch(err){
      console.error("Error fetching tickets", err);
    }
  }



  return (
    <div className='mx-auto container px-4 py-8'>
        
        
        <form className="mb-8 max-w-sm" onSubmit={(e) => {
          e.preventDefault();
          getTicket();
        }}>
            <label htmlFor="trip-search" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Enter Email to Get Trips</label>
            <div className="flex gap-2">
              <input 
                id="trip-search"
                type='email' 
                placeholder='email@example.com' 
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-400"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                required
              />            
              <button 
                type="submit" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 transition-colors dark:focus:ring-offset-slate-900"
              >
                Search
              </button>
            </div>
        </form>

        {tickets.length > 0 && (
          <div>

            <h1 className='text-xl font-bold ml-1 pb-4 '>Your Trips</h1>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                <tr>
                  <th scope="col" className="px-6 py-3">Booking ID</th>
                  <th scope="col" className="px-6 py-3">Flight ID</th>
                  <th scope="col" className="px-6 py-3">Flight</th>
                  <th scope="col" className="px-6 py-3">Seat</th>
                  <th scope="col" className="px-6 py-3">Price</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, index) => (
                  <tr key={index} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                      {ticket.ticket_id}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                      {ticket.flight_id.flight_id}
                    </td>
                    <td className="px-6 py-4">
                      {ticket.flight_id.from_city.city_name} - {ticket.flight_id.to_city.city_name}
                    </td>
                    <td className="px-6 py-4">
                      {ticket.seat_number || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {ticket.price ? `$${ticket.price}` : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
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
    </div>

    
  )
}

