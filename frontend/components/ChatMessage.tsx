"use client";
import { Message } from "@/lib/models";
import React from "react";

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  return (
    <div
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] space-y-2 ${message.role === "user" ? "order-1" : "order-2"}`}
      >
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
            message.role === "user"
              ? "bg-indigo-600 text-white rounded-tr-none"
              : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
          }`}
        >
          {message.content}
        </div>

        {message.role === "assistant" && (
          <div className="space-y-3 px-1">
            {message.citations && message.citations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {message.citations.map((c, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-1 bg-slate-100 text-[10px] font-bold text-slate-600 rounded uppercase tracking-tight border border-slate-200"
                  >
                    {c.title} {c.section && `• ${c.section}`}
                  </span>
                ))}
              </div>
            )}

            {message.chunks && message.chunks.length > 0 && (
              <details className="group border border-slate-200 rounded-lg bg-white overflow-hidden transition-all">
                <summary className="list-none px-3 py-2 text-[11px] font-semibold text-slate-500 cursor-pointer hover:bg-slate-50 flex items-center justify-between">
                  VERIFY SOURCES
                  <svg
                    className="w-3 h-3 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      d="M19 9l-7 7-7-7"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </summary>
                <div className="p-3 space-y-3 border-t border-slate-100 bg-slate-50/50">
                  {message.chunks.map((c, idx) => (
                    <div
                      key={idx}
                      className="text-[11px] text-slate-600 leading-normal border-l-2 border-indigo-400 pl-3 py-1"
                    >
                      <span className="font-bold text-slate-800 block mb-1">
                        {c.title} — {c.section}
                      </span>
                      {c.text}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
