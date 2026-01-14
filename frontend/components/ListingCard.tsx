"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Listing, ListingType } from '../types';

interface ListingCardProps {
    listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, offsetWidth } = scrollRef.current;
            setCurrentImageIndex(Math.round(scrollLeft / offsetWidth));
        }
    };

    return (
        <div className="group flex flex-col h-full cursor-pointer">
            <div className="relative aspect-square md:aspect-[20/19] rounded-[1.2rem] overflow-hidden bg-slate-100 shadow-sm border border-slate-50">
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide no-scrollbar"
                >
                    {listing.images.map((img, idx) => (
                        <img key={idx} src={img} className="w-full h-full object-cover snap-start flex-shrink-0" alt="" />
                    ))}
                </div>

                <div className="absolute top-3 left-3 pointer-events-none">
                    {listing.rating >= 4.8 && (
                        <div className="bg-white px-3 py-1.5 rounded-full shadow-sm">
                            <span className="text-[12px] font-black text-slate-900 tracking-tight">Gäste-Favorit</span>
                        </div>
                    )}
                </div>

                <button className="absolute top-3 right-3 p-2 text-white/90 drop-shadow-md hover:scale-110 transition-transform">
                    <i className="fa-solid fa-heart text-2xl" style={{ WebkitTextStroke: '1px rgba(0,0,0,0.1)' }}></i>
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
                    {listing.images.map((_, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white scale-110' : 'bg-white/50'}`} />
                    ))}
                </div>
            </div>

            {listing.type === ListingType.AFFILIATE && listing.affiliateUrl ? (
                <a href={listing.affiliateUrl} target="_blank" rel="noopener noreferrer" className="mt-3 text-left block">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-[15px] text-slate-900 truncate leading-tight">{listing.location.address}</h3>
                        <div className="flex items-center gap-1 font-bold text-slate-900 text-[13px]">
                            <i className="fa-solid fa-star text-[10px]"></i>
                            {listing.rating}
                        </div>
                    </div>
                    <p className="text-slate-500 text-[14px] leading-tight font-medium">Fluggesellschaft: {listing.title}</p>
                    <div className="pt-2">
                        <span className="font-bold text-[15px] text-slate-900">€{listing.price}</span>
                        <span className="text-slate-500 font-medium ml-1 text-sm">pro Person</span>
                    </div>
                </a>
            ) : (
                <Link href={`/listing/${listing.id}`} className="mt-3 text-left block">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-[15px] text-slate-900 truncate leading-tight">{listing.location.address}</h3>
                        <div className="flex items-center gap-1 font-bold text-slate-900 text-[13px]">
                            <i className="fa-solid fa-star text-[10px]"></i>
                            {listing.rating}
                        </div>
                    </div>
                    <p className="text-slate-500 text-[14px] leading-tight font-medium">Gastgeber: Sarah</p>
                    <div className="pt-2">
                        <span className="font-bold text-[15px] text-slate-900">€{listing.price}</span>
                        <span className="text-slate-500 font-medium ml-1 text-sm">Nacht</span>
                    </div>
                </Link>
            )}
        </div>
    );
};

export default ListingCard;
