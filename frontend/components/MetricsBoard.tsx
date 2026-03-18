"use client";
import React from "react";
import { MetricCard } from "./MetricCard";
import { Metrics } from "@/lib/models";

interface Props {
  metrics: Metrics;
}

export default function MetricsBoard({ metrics }: Props) {
  const totalLatency = (
    metrics.avg_retrieval_latency_ms + metrics.avg_generation_latency_ms
  ).toFixed(0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Knowledge Base"
          value={metrics.total_docs.toLocaleString()}
          sub={`${metrics.total_chunks.toLocaleString()} Chunks Indexed`}
        />
        <MetricCard
          label="Avg Latency"
          value={`${totalLatency}ms`}
          color="text-indigo-600"
          sub={`R: ${metrics.avg_retrieval_latency_ms}ms | G: ${metrics.avg_generation_latency_ms}ms`}
        />
        <MetricCard
          label="Embedding Model"
          value={metrics.embedding_model.split("/").pop() || "Default"}
          sub="Vector Generation"
        />
        <MetricCard
          label="Inference LLM"
          value={metrics.llm_model.split("/").pop() || "Default"}
          sub="Response Generation"
        />
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg w-fit">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-xs font-medium text-emerald-700 uppercase tracking-wider">
          System Operational: {metrics.llm_model} active
        </span>
      </div>
    </div>
  );
}
