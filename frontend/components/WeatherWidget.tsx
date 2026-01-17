"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import BentoCard from './BentoCard';

// 1. Safe/Public Data Sources (OpenMeteo for Weather)
// No API Key required, completely open.
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

// 2. Curated City List with Coordinates & High-Quality Images
const CITIES = [
    {
        name: "Bali",
        country: "Indonesia",
        lat: -8.4095,
        lon: 115.1889,
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1000",
        desc: "Perfekt für Surfer und Entdecker."
    },
    {
        name: "Tokio",
        country: "Japan",
        lat: 35.6762,
        lon: 139.6503,
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1000",
        desc: "Neonlichter und alte Traditionen."
    },
    {
        name: "New York",
        country: "USA",
        lat: 40.7128,
        lon: -74.0060,
        image: "https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?auto=format&fit=crop&q=80&w=1000",
        desc: "Die Stadt, die niemals schläft."
    },
    {
        name: "London",
        country: "UK",
        lat: 51.5074,
        lon: -0.1278,
        image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=1000",
        desc: "Königliche Geschichte erleben."
    },
    {
        name: "Dubai",
        country: "UAE",
        lat: 25.2048,
        lon: 55.2708,
        image: "https://images.unsplash.com/photo-1512453979798-5ea904ac6605?auto=format&fit=crop&q=80&w=1000",
        desc: "Luxus in der Wüste."
    },
    {
        name: "Sydney",
        country: "Australien",
        lat: -33.8688,
        lon: 151.2093,
        image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=1000",
        desc: "Hafenstadt mit Flair."
    }
];

export default function WeatherWidget() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [weather, setWeather] = useState<{ temp: number, code: number } | null>(null);
    const [loading, setLoading] = useState(false);

    const city = CITIES[currentIndex];

    // 3. Rotation Logic (Every 30s as requested)
    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${WEATHER_API}?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code`);
                const data = await res.json();
                setWeather({
                    temp: Math.round(data.current.temperature_2m),
                    code: data.current.weather_code
                });
            } catch (err) {
                console.error("Weather fetch failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % CITIES.length);
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [currentIndex, city.lat, city.lon]);

    // Icon & Label Mapping (WMO Weather Codes)
    const getWeatherInfo = (code: number) => {
        if (code === 0) return { icon: "fa-sun", label: "Klar", color: "text-amber-400" };
        if (code >= 1 && code <= 3) return { icon: "fa-cloud-sun", label: "Bewölkt", color: "text-blue-200" };
        if (code >= 45 && code <= 48) return { icon: "fa-smog", label: "Nebel", color: "text-slate-300" };
        if (code >= 51 && code <= 67) return { icon: "fa-cloud-rain", label: "Regen", color: "text-blue-400" };
        if (code >= 71 && code <= 77) return { icon: "fa-snowflake", label: "Schnee", color: "text-white" };
        if (code >= 95) return { icon: "fa-bolt", label: "Gewitter", color: "text-purple-400" };
        return { icon: "fa-cloud", label: "Wetter", color: "text-white" };
    };

    const weatherInfo = weather ? getWeatherInfo(weather.code) : { icon: "fa-circle-notch fa-spin", label: "Laden...", color: "text-white" };

    // 4. Mouse Move Animation (Parallax)
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    // Background movement (opposite to rotation for depth)
    const bgX = useTransform(mouseXSpring, [-0.5, 0.5], ["-10%", "10%"]);
    const bgY = useTransform(mouseYSpring, [-0.5, 0.5], ["-10%", "10%"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 1000,
                transformStyle: "preserve-3d",
                rotateX,
                rotateY
            }}
            className="h-full w-full"
        >
            <BentoCard className="h-full !p-0 relative overflow-hidden group shadow-xl border-0 bg-slate-900">
                {/* Dynamic Background Image with Scale & Parallax */}
                <motion.div
                    className="absolute inset-0 z-0"
                    style={{ x: bgX, y: bgY, scale: 1.2 }}
                >
                    <Image
                        src={city.image}
                        alt={city.name}
                        fill
                        className="object-cover transition-opacity duration-1000 ease-in-out"
                        priority
                        key={city.image} // Force re-mount for fade effect
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                </motion.div>

                {/* Content Overlay */}
                <div className="relative z-10 p-6 flex flex-col justify-between h-full text-white">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-80 bg-black/30 px-2 py-1 rounded-full backdrop-blur-md">
                            Live Wetter
                        </span>
                        <div className={`w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg ${weatherInfo.color}`}>
                            <i className={`fa-solid ${weatherInfo.icon} text-sm`}></i>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <motion.div
                            key={weather?.temp || "loading"}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-1"
                        >
                            <span className="text-6xl font-black tracking-tighter leading-none shadow-black drop-shadow-lg">
                                {weather ? `${weather.temp}°` : '--'}
                            </span>
                        </motion.div>

                        <motion.div
                            key={city.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h3 className="text-xl font-bold mt-2 leading-tight drop-shadow-md">{city.name}</h3>
                            <p className="text-xs text-white/80 font-medium">{city.country}</p>
                        </motion.div>

                        <div className="mt-4 pt-4 border-t border-white/20">
                            <p className="text-[10px] font-medium opacity-90 leading-relaxed truncate">
                                {city.desc}
                            </p>
                        </div>
                    </div>
                </div>
            </BentoCard>
        </motion.div>
    );
}
