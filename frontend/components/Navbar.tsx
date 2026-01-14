"use client";

import Link from "next/link";
import { Menu, Search, User } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-rose-500">Voyanero</span>
                        </Link>
                    </div>

                    {/* Center Search (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Where to?"
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-rose-500 shadow-sm"
                            />
                            <div className="absolute left-3 top-2.5 text-gray-400">
                                <Search size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Right Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/host"
                            className="text-sm font-medium text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full transition"
                        >
                            Become a host
                        </Link>
                        <button className="flex items-center gap-2 border border-gray-300 rounded-full p-2 hover:shadow-md transition">
                            <Menu size={20} className="text-gray-600 pl-1" />
                            <div className="bg-gray-500 rounded-full p-1 text-white">
                                <User size={20} fill="currentColor" />
                            </div>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <Menu size={24} className="text-gray-700" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
