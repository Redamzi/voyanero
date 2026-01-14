"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MOCK_USERS } from '@/constants';

export default function Dashboard() {
    const user = MOCK_USERS[1]; // Default to host user for demo

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar user={user} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Dashboard</h1>
                    <p className="text-slate-500">Welcome back, {user.name}!</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Stats</h3>
                            <div className="grid grid-cols-3 gap-6">
                                {[
                                    { label: 'Total Bookings', value: '24', icon: 'fa-calendar-check', color: 'text-indigo-600' },
                                    { label: 'Revenue', value: '€8,400', icon: 'fa-euro-sign', color: 'text-emerald-600' },
                                    { label: 'Avg Rating', value: '4.9', icon: 'fa-star', color: 'text-amber-500' }
                                ].map((stat, i) => (
                                    <div key={i} className="text-center p-6 bg-slate-50 rounded-2xl">
                                        <i className={`fa-solid ${stat.icon} ${stat.color} text-2xl mb-3`}></i>
                                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                                        <p className="text-xs text-slate-500 font-medium mt-1">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <i className="fa-solid fa-check text-indigo-600"></i>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-900">New booking confirmed</p>
                                        <p className="text-sm text-slate-500">Luxury Beachfront Villa - 2 hours ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl text-white shadow-xl shadow-indigo-200">
                            <h3 className="text-xl font-bold mb-2">Voyanero Rewards</h3>
                            <p className="text-indigo-100 text-sm mb-6">You&apos;re 2 trips away from unlocking Platinum status.</p>
                            <div className="w-full bg-white/20 h-2 rounded-full mb-2 overflow-hidden">
                                <div className="w-[60%] bg-white h-full"></div>
                            </div>
                            <p className="text-right text-[10px] font-bold uppercase tracking-widest">600 / 1000 Points</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
