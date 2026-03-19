export interface Metrics {
  total_docs: number;
  total_chunks: number;
  avg_retrieval_latency_ms: number;
  avg_generation_latency_ms: number;
  embedding_model: string;
  llm_model: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: { title: string; section?: string }[];
  chunks?: { title: string; section?: string; text: string }[];
};