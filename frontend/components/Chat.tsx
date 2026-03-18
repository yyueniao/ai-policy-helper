"use client";
import React, { useRef, useEffect } from "react";
import { apiAsk } from "@/lib/api";

type Message = {
  role: "user" | "assistant";
  content: string;
  citations?: { title: string; section?: string }[];
  chunks?: { title: string; section?: string; text: string }[];
};

export default function Chat() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [q, setQ] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async () => {
    if (!q.trim() || loading) return;
    const userMsg: Message = { role: "user", content: q };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setQ("");

    try {
      const res = await apiAsk(q);
      const aiMsg: Message = {
        role: "assistant",
        content: res.answer,
        citations: res.citations,
        chunks: res.chunks,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${e.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Policy Assistant
        </h3>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-slate-50/30"
      >
        {messages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-sm">
              Ask a question to start the policy search.
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] space-y-2 ${m.role === "user" ? "order-1" : "order-2"}`}
            >
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                }`}
              >
                {m.content}
              </div>

              {m.role === "assistant" && (
                <div className="space-y-3 px-1">
                  {m.citations && m.citations.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {m.citations.map((c, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 bg-slate-100 text-[10px] font-bold text-slate-600 rounded uppercase tracking-tight border border-slate-200"
                        >
                          {c.title} {c.section && `• ${c.section}`}
                        </span>
                      ))}
                    </div>
                  )}

                  {m.chunks && m.chunks.length > 0 && (
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
                        {m.chunks.map((c, idx) => (
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
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input
            className="w-full pl-4 pr-24 py-3 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-900 placeholder:text-slate-400"
            placeholder="Ask about company policy..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button
            onClick={send}
            disabled={loading || !q.trim()}
            className="absolute right-2 px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Thinking" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
