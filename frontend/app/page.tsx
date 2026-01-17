"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import ListingCard from '@/components/ListingCard';
import SearchMask from '@/components/SearchMask';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MOCK_LISTINGS } from '@/constants';

export default function Home() {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div className="min-h-screen font-sans bg-white text-slate-900">
      <Navbar />

      <div className="space-y-16 md:space-y-24 pb-32 bg-white">
        {/* 1. HERO & SEARCH */}
        <section className="w-full relative min-h-[60vh] md:min-h-[75vh] flex flex-col items-center justify-center px-4 pt-10 pb-16 md:py-24">
          {/* Background Canvas */}
          <div className="absolute inset-x-4 top-4 bottom-0 bg-[#0F172A] rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2000"
              className="w-full h-full object-cover opacity-60"
              alt="Hero Background"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70"></div>
          </div>

          {/* Content Overlay */}
          <div className="relative text-center space-y-8 md:space-y-14 max-w-6xl px-4 md:px-8 w-full flex flex-col items-center">
            <div className="space-y-4 md:space-y-6">
              <span className="inline-flex items-center gap-3 px-4 md:px-6 py-2 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full text-white text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">
                <i className="fa-solid fa-star text-amber-400"></i>
                Premium Travel Experience
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[7.5rem] font-black text-white leading-[0.9] tracking-tighter">
                Escape the <span className="text-rose-400 italic">Ordinary.</span>
              </h1>
              <p className="text-white/80 text-base md:text-2xl font-medium max-w-2xl mx-auto tracking-tight px-4">
                Entdecke exklusive Unterkünfte weltweit – handverlesen für unvergessliche Momente.
              </p>
            </div>

            <div className="w-full max-w-5xl mx-auto">
              <SearchMask variant="hero" />
            </div>
          </div>
        </section>

        {/* 2. AVAILABLE THIS WEEKEND */}
        <section className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 text-left">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 md:mb-16 gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">Popular Destinations</h2>
              <p className="text-slate-500 text-lg font-medium opacity-70">Die beliebtesten Aufenthalte dieses Wochenendes.</p>
            </div>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm">
                <i className="fa-solid fa-chevron-left text-xs text-slate-400"></i>
              </button>
              <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm">
                <i className="fa-solid fa-chevron-right text-xs text-slate-400"></i>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {MOCK_LISTINGS.slice(0, 4).map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>

        {/* 3. PROMOTION CARD */}
        <section className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="bg-[#111827] rounded-[2.5rem] md:rounded-[4.5rem] p-8 md:p-24 flex flex-col md:flex-row items-center gap-12 md:gap-20 overflow-hidden relative text-left group">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-r from-amber-500 to-orange-600 skew-x-[-12deg] translate-x-48 opacity-10 md:block hidden group-hover:translate-x-32 transition-transform duration-1000"></div>

            <div className="flex-1 space-y-6 md:space-y-8 relative z-10">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600/10 border border-amber-500/20 rounded-full text-amber-400 text-[10px] font-black uppercase tracking-[0.3em]">
                Voyanero Vergleichsportal
              </div>
              <h2 className="text-3xl md:text-7xl font-black text-white tracking-tighter leading-none">Vergleiche & spare <br /> bei jeder Buchung.</h2>
              <p className="text-slate-400 font-medium text-base md:text-xl leading-relaxed max-w-xl">Finde die besten Angebote für Hotels, Flüge und Reisepakete – alles an einem Ort.</p>
              <button
                onClick={() => setShowWizard(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-10 md:px-12 py-4 md:py-5 rounded-[1.2rem] md:rounded-[1.5rem] font-black text-[10px] md:text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-amber-500/30 active:scale-95 transition-all hover:shadow-amber-500/50 cursor-pointer">
                Jetzt Angebote vergleichen
              </button>
            </div>

            <div className="w-full md:w-[450px] aspect-square rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-[0_48px_80px_-16px_rgba(0,0,0,0.5)] relative z-10 border-[8px] border-white/5 transform md:rotate-3 md:hover:rotate-0 transition-all duration-700">
              <Image
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800"
                alt="Travel Comparison"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* 4. WHY VOYANERO? */}
        <section className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 text-left pb-10 md:pb-0">
          <div className="mb-10 md:mb-20">
            <h2 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-none text-center md:text-left">Warum Voyanero?</h2>
            <p className="text-slate-500 text-lg md:text-xl font-medium opacity-60 text-center md:text-left">Lokale Authentizität trifft globale Zuverlässigkeit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { title: "Preisvergleich", desc: "Vergleiche Millionen von Angeboten und finde garantiert den besten Preis.", icon: "fa-chart-line", color: "bg-rose-50 text-rose-600" },
              { title: "AI Concierge", desc: "Dein persönlicher Reiseplaner, angetrieben von Google Gemini.", icon: "fa-robot", color: "bg-indigo-50 text-indigo-600" },
              { title: "Portfolio", desc: "Zugriff auf über 2 Millionen Hotels weltweit über unsere Partner.", icon: "fa-globe", color: "bg-blue-50 text-blue-600" },
              { title: "Bestpreis", desc: "Wir garantieren dir den besten Preis für deine nächste Reise.", icon: "fa-shield-halved", color: "bg-emerald-50 text-emerald-600" }
            ].map((item, i) => (
              <div key={i} className="group p-8 md:p-10 bg-slate-50 rounded-[2.5rem] hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-slate-100">
                <div className={`w-14 h-14 md:w-16 md:h-16 ${item.color} rounded-2xl flex items-center justify-center mb-8 md:mb-10 shadow-sm group-hover:scale-110 transition-transform`}>
                  <i className={`fa-solid ${item.icon} text-xl md:text-2xl`}></i>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 md:mb-5 tracking-tight">{item.title}</h3>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium opacity-80">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Compact Search Wizard Modal */}
      {showWizard && <SearchMask variant="compact" isOpen={true} onClose={() => setShowWizard(false)} />}

      <Footer />
    </div>
  );
}
