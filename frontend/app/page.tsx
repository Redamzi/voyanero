"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import api from "@/lib/api";
import { Search } from "lucide-react";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<string>("Checking backend...");

  useEffect(() => {
    // Check backend health on load
    api.get("/health")
      .then((res) => setBackendStatus(`Online ✅ (${res.data.status})`))
      .catch(() => setBackendStatus("Offline ❌ (Connection failed)"));
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Debug Banner */}
        <div className={`text-center py-2 text-sm font-medium ${backendStatus.includes("Online") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          Backend Status: {backendStatus}
        </div>

        {/* Hero Section */}
        <div className="relative bg-rose-500 h-[500px] flex items-center justify-center text-white">
          <div className="absolute inset-0 bg-black/20 z-0"></div>
          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find your next adventure
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Discover unique homes and authentic experiences around the world.
            </p>

            {/* Search Bar Widget */}
            <div className="bg-white p-2 rounded-full max-w-4xl mx-auto shadow-2xl flex flex-col md:flex-row items-center text-gray-800">
              <div className="flex-1 px-6 py-3 border-b md:border-b-0 md:border-r border-gray-200 w-full">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Location</label>
                <input type="text" placeholder="Where are you going?" className="w-full outline-none font-medium" />
              </div>
              <div className="flex-1 px-6 py-3 border-b md:border-b-0 md:border-r border-gray-200 w-full">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Check in</label>
                <input type="text" placeholder="Add dates" className="w-full outline-none font-medium" />
              </div>
              <div className="flex-1 px-6 py-3 border-b md:border-b-0 md:border-r border-gray-200 w-full">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Check out</label>
                <input type="text" placeholder="Add dates" className="w-full outline-none font-medium" />
              </div>
              <div className="flex-1 px-6 py-3 w-full relative">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Guests</label>
                <input type="text" placeholder="Add guests" className="w-full outline-none font-medium" />
                <button className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-rose-500 hover:bg-rose-600 text-white p-3 rounded-full transition shadow-lg items-center gap-2">
                  <Search size={20} />
                  <span className="md:hidden">Search</span>
                </button>
              </div>
              <button className="md:hidden w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-full mt-2 transition shadow-lg">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Categories / Content Placeholder */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold mb-6">Explore the world</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 1, img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80", title: "Nature & Mountains" },
              { id: 2, img: "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=800&q=80", title: "City Trips" },
              { id: 3, img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", title: "Beach Vacations" }
            ].map((item) => (
              <div key={item.id} className="bg-gray-100 h-64 rounded-xl flex items-center justify-center overflow-hidden group cursor-pointer relative">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition flex items-end p-6">
                  <h3 className="text-white text-xl font-bold">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
