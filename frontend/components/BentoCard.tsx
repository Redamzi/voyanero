import React from 'react';


interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    colSpan?: 1 | 2 | 3 | 4;
    rowSpan?: 1 | 2 | 3 | 4;
    noPadding?: boolean;
}

const BentoCard: React.FC<BentoCardProps> = ({
    children,
    className,
    colSpan = 1,
    rowSpan = 1,
    noPadding = false,
    ...props
}) => {
    return (
        <div
            className={`
                group relative overflow-hidden bg-white rounded-[2.5rem] shadow-xl border border-slate-100/50
                transition-all duration-500 hover:shadow-2xl hover:-translate-y-1
                ${colSpan === 2 ? 'md:col-span-2' : ''}
                ${colSpan === 3 ? 'md:col-span-3' : ''}
                ${colSpan === 4 ? 'md:col-span-4' : ''}
                ${rowSpan === 2 ? 'md:row-span-2' : ''}
                ${className || ''}
            `}
            {...props}
        >
            <div className={`h-full w-full ${noPadding ? '' : 'p-6 md:p-8'}`}>
                {children}
            </div>

            {/* Optional: Subtle Glass/Shimmer effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </div>
    );
};

export default BentoCard;
