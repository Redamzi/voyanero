"use client";

import React, { useEffect } from 'react';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function FlightsPage() {
    useEffect(() => {
        // Initialize widget after script loads
        const initWidget = () => {
            if (typeof window !== 'undefined' && (window as any).TPWidgetLoader) {
                (window as any).TPWidgetLoader.init();
            }
        };

        // Try to init if script already loaded
        initWidget();

        // Set up interval to check if script loaded
        const interval = setInterval(initWidget, 500);

        return () => clearInterval(interval);
    }, []);

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

                {/* Travelpayouts Widget Container */}
                <div className="w-full min-h-[600px] bg-white rounded-2xl shadow-lg p-6">
                    <div
                        data-tpwdgt-widget="search_form"
                        data-tpwdgt-marker="575179"
                        data-tpwdgt-locale="de"
                        data-tpwdgt-currency="EUR"
                        data-tpwdgt-powered-by="true"
                        data-tpwdgt-border-radius="30"
                        data-tpwdgt-color-button="#000000"
                        data-tpwdgt-color-button-text="#ffffff"
                    />
                </div>
            </div>

            {/* Load Travelpayouts Widget Script */}
            <Script
                src="https://tpwdg.com/widget-init.js"
                strategy="afterInteractive"
                onLoad={() => {
                    if (typeof window !== 'undefined' && (window as any).TPWidgetLoader) {
                        (window as any).TPWidgetLoader.init();
                    }
                }}
            />

            <Footer />
        </div>
    );
}
