"use client";
import React from "react";
import { apiIngest, apiMetrics } from "@/lib/api";
import MetricsBoard from "./MetricsBoard";
import { Metrics } from "@/lib/models";

export default function AdminPanel() {
  const [metrics, setMetrics] = React.useState<Metrics>(null);
  const [busy, setBusy] = React.useState(false);

  const refresh = async () => {
    const m = await apiMetrics();
    setMetrics(m);
  };

  const ingest = async () => {
    setBusy(true);
    try {
      await apiIngest();
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  React.useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">Admin</h3>

        <div className="flex gap-3">
          <button
            onClick={refresh}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <svg
              className={`w-4 h-4 mr-2 ${busy ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh metrics
          </button>

          <button
            onClick={ingest}
            disabled={busy}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all shadow-sm shadow-indigo-200"
          >
            {busy ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Indexing...
              </>
            ) : (
              "Ingest Sample Docs"
            )}
          </button>
        </div>
      </div>

      {metrics ? (
        <MetricsBoard metrics={metrics} />
      ) : (
        <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl">
          <span className="text-slate-400 text-sm italic">
            No metrics available
          </span>
        </div>
      )}
    </div>
  );
}
