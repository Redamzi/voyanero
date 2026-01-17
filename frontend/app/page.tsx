"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import ListingCard from '@/components/ListingCard';
import SearchMask from '@/components/SearchMask';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BentoCard from '@/components/BentoCard';
import { MOCK_LISTINGS } from '@/constants';

export default function Home() {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div className="min-h-screen font-sans bg-slate-100/50 text-slate-900 pb-20">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ROW 1: Hero & Side Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">

          {/* HERO BENTO (Span 3) */}
          <BentoCard className="lg:col-span-3 lg:row-span-2 relative min-h-[500px] lg:min-h-[600px] flex flex-col items-center justify-center text-center !p-0 border-0">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2000"
                alt="Hero Background"
                fill
                className="object-cover opacity-90 transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-4xl px-6 py-12 flex flex-col items-center gap-8">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-[10px] uppercase tracking-[0.2em] font-bold shadow-lg">
                  <i className="fa-solid fa-star text-amber-300"></i>
                  Premium Travel
                </span>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-xl">
                  Escape the <span className="text-orange-400 italic">Ordinary.</span>
                </h1>
              </div>

              <div className="w-full">
                <SearchMask variant="hero" />
              </div>
            </div>
          </BentoCard>

          {/* SIDE WIDGET 1: Weather / Status (Span 1) */}
          <BentoCard className="lg:col-span-1 bg-gradient-to-br from-blue-500 to-indigo-600 border-0 text-white flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest opacity-70">Wetter</span>
              <i className="fa-solid fa-cloud-sun text-yellow-300 text-xl"></i>
            </div>
            <div className="mt-4">
              <div className="text-5xl font-black tracking-tighter">24°</div>
              <div className="text-sm font-medium opacity-90 mt-1">Bali, Indonesia</div>
            </div>
            <div className="mt-8 text-xs font-medium opacity-70">
              Perfektes Reisewetter für deinen nächsten Trip.
            </div>
          </BentoCard>

          {/* SIDE WIDGET 2: Promo / Login (Span 1) */}
          <BentoCard className="lg:col-span-1 bg-white flex flex-col justify-center items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-2xl mb-2">
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

        {/* ROW 2: Listings Header */}
        <div className="flex items-end justify-between px-2 pt-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Beliebte Ziele</h2>
            <p className="text-slate-500 text-sm">Die gefragtesten Orte dieser Woche.</p>
          </div>
          <button className="text-xs font-bold text-orange-600 hover:text-orange-700 uppercase tracking-wider">
            Alle anzeigen <i className="fa-solid fa-arrow-right ml-1"></i>
          </button>
        </div>

        {/* ROW 3: Listing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_LISTINGS.slice(0, 4).map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {/* ROW 4: Large Promo Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* TEXT PROMO (Span 2) */}
          <BentoCard className="lg:col-span-2 bg-[#111827] text-white flex flex-col md:flex-row items-center !p-0 overflow-hidden group border-0">
            <div className="flex-1 p-8 md:p-12 z-10">
              <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-orange-500/20">
                Voyanero Exclusive
              </span>
              <h3 className="text-3xl md:text-5xl font-black mb-4 leading-none">Vergleiche &<br />Spare bis zu 40%</h3>
              <p className="text-slate-400 text-sm md:text-base mb-8 max-w-md">
                Finde die besten Angebote für Hotels, Flüge und Reisepakete – alles an einem Ort, powered by AI.
              </p>
              <button onClick={() => setShowWizard(true)} className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl text-white text-xs font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-orange-500/30 transition-all transform active:scale-95">
                Jetzt Vergleichen
              </button>
            </div>
            <div className="relative w-full md:w-1/2 h-64 md:h-full">
              <Image
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800"
                alt="Travel"
                fill
                className="object-cover md:group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent to-[#111827]"></div>
            </div>
          </BentoCard>

          {/* FEATURES GRID (Span 1) */}
          <div className="grid grid-cols-1 gap-6">
            {[
              { icon: 'fa-robot', title: 'AI Concierge', desc: 'Smarte Planung mit Gemini.', color: 'text-indigo-500', bg: 'bg-indigo-50' },
              { icon: 'fa-shield-halved', title: 'Bestpreis', desc: 'Garantierte Tiefstpreise.', color: 'text-emerald-500', bg: 'bg-emerald-50' }
            ].map((item, i) => (
              <BentoCard key={i} className="flex items-center gap-4 hover:border-orange-200">
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color} text-xl shrink-0`}>
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>

      </main>

      {/* Compact Search Wizard Modal */}
      {showWizard && <SearchMask variant="compact" isOpen={true} onClose={() => setShowWizard(false)} />}

      <Footer />
    </div>
  );
}
