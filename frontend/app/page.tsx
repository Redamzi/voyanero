"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import ListingCard from '@/components/ListingCard';
import SearchMask from '@/components/SearchMask';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BentoCard from '@/components/BentoCard';
import WeatherWidget from '@/components/WeatherWidget';
import { MOCK_LISTINGS } from '@/constants';

const CITIES = [
  {
    name: "Bali",
    country: "Indonesia",
    lat: -8.4095,
    lon: 115.1889,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80",
    weatherImage: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
    desc: "Perfekt für Surfer und Entdecker.",
    title: "Escape to Paradise.",
    photographer: "Alfatih Yukrie"
  },
  {
    name: "Tokio",
    country: "Japan",
    lat: 35.6762,
    lon: 139.6503,
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80",
    weatherImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
    desc: "Neonlichter und alte Traditionen.",
    title: "Discover the Future.",
    photographer: "Jezael Melgoza"
  },
  {
    name: "New York",
    country: "USA",
    lat: 40.7128,
    lon: -74.0060,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&q=80",
    weatherImage: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80",
    desc: "Die Stadt, die niemals schläft.",
    title: "Wake Up in NYC.",
    photographer: "New York C"
  },
  {
    name: "London",
    country: "UK",
    lat: 51.5074,
    lon: -0.1278,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80",
    weatherImage: "https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=800&q=80",
    desc: "Königliche Geschichte erleben.",
    title: "Live the Royal Life.",
    photographer: "Marcin Nowak"
  },
  {
    name: "Dubai",
    country: "UAE",
    lat: 25.2048,
    lon: 55.2708,
    image: "https://images.unsplash.com/photo-1512453979798-5ea904ac66de?auto=format&fit=crop&w=1600&q=80",
    weatherImage: "https://images.unsplash.com/photo-1544945582-1e42ba9d2e11?auto=format&fit=crop&w=800&q=80",
    desc: "Luxus in der Wüste.",
    title: "Touch the Sky.",
    photographer: "ZQ Lee"
  },
  {
    name: "Sydney",
    country: "Australien",
    lat: -33.8688,
    lon: 151.2093,
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=80",
    weatherImage: "https://images.unsplash.com/photo-1524332219808-f46323c2a61f?auto=format&fit=crop&w=800&q=80",
    desc: "Hafenstadt mit Flair.",
    title: "Adventure Awaits.",
    photographer: "Dan Freeman"
  }
];

export default function Home() {
  const [showWizard, setShowWizard] = useState(false);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);

  useEffect(() => {
    // 1. Preload the NEXT TWO images at exactly 8 seconds
    // This ensures a deeper buffer for smooth transitions
    const preloadTimeout = setTimeout(() => {
      const nextIndex = (currentCityIndex + 1) % CITIES.length;
      const nextNextIndex = (currentCityIndex + 2) % CITIES.length;

      const img1 = new window.Image();
      img1.src = CITIES[nextIndex].image;

      const img2 = new window.Image();
      img2.src = CITIES[nextNextIndex].image;
    }, 8000);

    // 2. Rotate every 10 seconds
    const interval = setInterval(() => {
      setCurrentCityIndex((prev) => (prev + 1) % CITIES.length);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(preloadTimeout);
    };
  }, [currentCityIndex]);

  const currentCity = CITIES[currentCityIndex];

  return (
    <div className="min-h-screen font-sans bg-white text-slate-900 pb-20">
      <Navbar />

      <main className="space-y-12 md:space-y-16 lg:space-y-24 bg-white">

        {/* 1. HERO BENTO GRID */}
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 gap-6 auto-rows-[minmax(180px,auto)]">

            {/* HERO (Span 3) */}
            <BentoCard className="relative min-h-[65dvh] lg:min-h-[600px] flex flex-col items-center justify-center text-center !p-0 border-0 shadow-2xl overflow-hidden group">
              {/* Background Image - Synced with Weather Widget */}
              <div className="absolute inset-0 z-0 bg-slate-900">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={currentCity.image}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1.0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: { duration: 1.5, ease: "easeInOut" },
                      scale: { duration: 10, ease: "linear" }
                    }}
                    className="absolute inset-0 w-full h-full"
                    style={{ willChange: "transform, opacity" }}
                  >
                    <Image
                      src={currentCity.image}
                      alt="Hero Background"
                      fill
                      className="object-cover opacity-90"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Content */}
              <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-44 pb-12 md:py-12 flex flex-col items-center justify-center gap-10 text-center">
                <div className="space-y-6 flex flex-col items-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold shadow-lg transform transition-all hover:scale-105 cursor-default">
                    <i className="fa-solid fa-star text-amber-300"></i>
                    Premium Travel Experience
                  </span>

                  <div className="space-y-4 max-w-4xl mx-auto h-[160px] flex flex-col justify-center items-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentCity.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex flex-col items-center space-y-4"
                      >
                        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl">
                          {currentCity.title.split(' ').slice(0, -1).join(' ')} <span className="text-orange-500 italic font-serif">{currentCity.title.split(' ').slice(-1)}</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg p-2 rounded-lg backdrop-blur-[2px]">
                          Exklusive Unterkünfte in <span className="font-bold text-white border-b-2 border-orange-500">{currentCity.name}</span> und weltweit.
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="w-full max-w-3xl mx-auto">
                  <SearchMask variant="hero" />
                </div>


              </div>

              {/* Weather Widget - Responsive Positionierung */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-64 md:top-[10px] md:right-[10px] md:left-auto md:translate-x-0">
                <WeatherWidget city={{
                  ...currentCity,
                  image: currentCity.weatherImage || currentCity.image
                }} />
              </div>
            </BentoCard>

            {/* SIDE WIDGET 2: Promo / Login */}
            <BentoCard className="bg-white flex flex-col justify-center items-center text-center gap-4 shadow-xl mx-auto max-w-md w-full">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-2xl mb-2 mx-auto">
                <i className="fa-solid fa-user-astronaut"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">Melde dich an</h3>
                <p className="text-xs text-slate-500 mt-1 px-4">Speichere deine Favoriten und erhalte exklusive Deals.</p>
              </div>
              <button onClick={() => setShowWizard(true)} className="mt-2 px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-slate-800 transition-colors">
                Login
              </button>
            </BentoCard>

          </div>
        </section>

        {/* 2. POPULAR DESTINATIONS (Bento Style) */}
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-8 md:mb-12 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-3">
                Popular Destinations
              </h2>
              <p className="text-slate-500 text-lg font-medium opacity-70">
                Die beliebtesten Aufenthalte dieses Wochenendes.
              </p>
            </div>
            {/* Navigation Pills */}
            <div className="flex gap-3">
              <button className="w-11 h-11 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm group">
                <i className="fa-solid fa-chevron-left text-xs text-slate-400 group-hover:text-white"></i>
              </button>
              <button className="w-11 h-11 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm group">
                <i className="fa-solid fa-chevron-right text-xs text-slate-400 group-hover:text-white"></i>
              </button>
            </div>
          </div>

          {/* Grid Layout replacing legacy flex/grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_LISTINGS.slice(0, 4).map((listing) => (
              <div key={listing.id} className="h-full">
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        </section>

        {/* 3. PROMO CARD (Bento Style) */}
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <BentoCard noPadding={true} className="relative overflow-hidden bg-[#111827] text-white min-h-[500px] md:min-h-[400px]">
            {/* Inner Flex Container to bypass BentoCard's internal div block */}
            <div className="flex flex-col md:flex-row h-full w-full">
              {/* Background Accents */}
              <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-amber-600/20 to-transparent skew-x-[-20deg] translate-x-32 pointer-events-none" />

              {/* Content Side */}
              <div className="flex-1 p-8 md:p-16 flex flex-col justify-center items-start space-y-8 relative z-10 w-full">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                  Voyanero Vergleichsportal
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.95]">
                  Vergleiche & spare <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">bei jeder Buchung.</span>
                </h2>
                <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
                  Finde die besten Angebote für Hotels, Flüge und Reisepakete – alles an einem Ort mit unserer Tiefpreisgarantie.
                </p>
                <button
                  onClick={() => setShowWizard(true)}
                  className="group bg-white text-slate-900 px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-amber-400 transition-colors shadow-lg shadow-white/5 hover:shadow-amber-400/20 flex items-center gap-3"
                >
                  Jetzt vergleichen
                  <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                </button>
              </div>

              {/* Banner Image */}
              <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                <Image
                  src="/images/destinations/voyanero-promo.jpg"
                  alt="Travel Promo"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                  <span className="text-white/80 font-bold uppercase tracking-widest text-sm mb-2">Exklusiver Deal</span>
                  <span className="text-white font-black text-3xl">Bali & Malediven</span>
                </div>
              </div>
            </div>
          </BentoCard>
        </section>

        {/* 4. WHY VOYANERO? (Bento Grid) */}
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl mb-4">
              <i className="fa-solid fa-star text-2xl text-orange-600"></i>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-3">Warum Voyanero?</h2>
            <p className="text-slate-500 text-lg font-medium opacity-60">Lokale Authentizität trifft globale Zuverlässigkeit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Preisvergleich", desc: "Vergleiche Millionen von Angeboten.", icon: "fa-chart-line", bg: "bg-rose-50", text: "text-rose-600" },
              { title: "AI Concierge", desc: "Reiseplanung mit Gemini AI.", icon: "fa-robot", bg: "bg-indigo-50", text: "text-indigo-600" },
              { title: "Geprüft", desc: "Über 2 Millionen verifizierte Hotels.", icon: "fa-check-double", bg: "bg-emerald-50", text: "text-emerald-600" },
              { title: "Bestpreis", desc: "Wir garantieren den besten Preis.", icon: "fa-shield-halved", bg: "bg-amber-50", text: "text-amber-600" }
            ].map((item, i) => (
              <BentoCard key={i} className="flex flex-col items-center justify-center text-center p-8 hover:bg-slate-50/80 transition-colors group border-slate-100 shadow-sm hover:shadow-lg">
                <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`fa-solid ${item.icon} text-2xl ${item.text}`}></i>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
              </BentoCard>
            ))}
          </div>
        </section>

      </main>

      {showWizard && <SearchMask variant="compact" isOpen={true} onClose={() => setShowWizard(false)} />}

      <Footer />
    </div>
  );
}
