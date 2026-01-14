"use client";

import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function AIConcierge() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hello! I'm your Voyanero AI Concierge. I can help you find destinations, recommend property types, or give you local travel tips. What's on your mind today?"
        }
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

        // Placeholder response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "This is a demo response. The AI Concierge feature will be available soon!"
            }]);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <i className="fa-solid fa-robot text-2xl"></i>
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900">AI Concierge</h1>
                        <p className="text-sm text-slate-500">Your personal travel assistant</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                : 'bg-slate-50 text-slate-800'
                                }`}>
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>

                <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
                    <input
                        type="text"
                        placeholder="Ask me anything... e.g. 'Help me plan a 5 day trip to Bali'"
                        className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        className="bg-indigo-600 text-white w-14 rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30"
                    >
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </form>
            </div>

            <Footer />
        </div>
    );
}
