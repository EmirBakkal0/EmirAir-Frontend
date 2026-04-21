"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import AddFlightForm from "@/components/AddFlightForm";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="container mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-1 border rounded-2xl p-6 bg-surface-container shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Icon icon="material-symbols:flight-smode-outline" className="text-primary text-2xl" />
              Add New Flight
            </h2>

            <AddFlightForm />
          </div>

          
        </div>
      </div>
    </div>
  );
}
