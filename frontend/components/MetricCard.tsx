'use client';
import React from 'react';

export function MetricCard({ label, value, sub, color = "text-slate-900" }: { label: string; value: string | number; sub: string; color?: string; }) {
    return (
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
            <p className={`mt-1 text-xl font-bold ${color}`}>{value}</p>
            <p className="mt-1 text-[10px] text-slate-400 font-medium">{sub}</p>
        </div>
    );
}
