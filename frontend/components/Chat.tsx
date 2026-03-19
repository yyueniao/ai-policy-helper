"use client";
import React, { useRef, useEffect } from "react";
import { apiAsk } from "@/lib/api";
import ChatMessage from "./ChatMessage";
import { Message } from "@/lib/models";

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
    const aiPlaceholder: Message = { role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMsg, aiPlaceholder]);
    setLoading(true);
    const currentQuery = q;
    setQ("");

    try {
      const stream = apiAsk(currentQuery);

      for await (const chunk of stream) {
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          const lastMsg = newMessages[lastIndex];

          if (chunk.type === "metadata") {
            newMessages[lastIndex] = {
              ...lastMsg,
              citations: chunk.citations,
              chunks: chunk.chunks,
            };
          } else if (chunk.type === "text") {
            newMessages[lastIndex] = {
              ...lastMsg,
              content: lastMsg.content + chunk.content,
            };
          }
          return newMessages;
        });
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
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

        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
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
