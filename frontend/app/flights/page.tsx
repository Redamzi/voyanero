"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function FlightsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-10">
                <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                    Flugsuche
                </h1>
                <p className="text-lg text-slate-600 mb-8">
                    Finde die besten Flüge zu deinem Traumziel
                </p>

                {/* Travelpayouts Search Form */}
                <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden" style={{ minHeight: '600px' }}>
                    <iframe
                        src="https://www.travelpayouts.com/widgets/353305.html?marker=575179&locale=de&currency=eur&powered_by=true"
                        width="100%"
                        height="600"
                        frameBorder="0"
                        scrolling="no"
                        style={{ border: 'none', display: 'block' }}
                        title="Flugsuche"
                    />
                </div>
            </div>

            <Footer />
        </div>
    );
}
