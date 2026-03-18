export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function* apiAsk(query: string, k: number = 4) {
  const r = await fetch(`${API_BASE}/api/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, k }),
  });

  if (!r.ok) throw new Error("Ask failed");

  const reader = r.body?.getReader();
  const decoder = new TextDecoder();
  let isMetadataParsed = false;

  if (!reader) return;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });

    if (!isMetadataParsed && chunk.includes("[METADATA_END]")) {
      const [metaPart, textPart] = chunk.split("[METADATA_END]");

      try {
        const metadata = JSON.parse(metaPart.trim());
        yield { type: "metadata", ...metadata }; // First yield is the citations/chunks
      } catch (e) {
        console.error("Metadata parse error", e);
      }

      isMetadataParsed = true;
      if (textPart) yield { type: "text", content: textPart };
    } else {
      yield isMetadataParsed
        ? { type: "text", content: chunk }
        : { type: "raw", content: chunk };
    }
  }
}

export async function apiIngest() {
  const r = await fetch(`${API_BASE}/api/ingest`, { method: "POST" });
  if (!r.ok) throw new Error("Ingest failed");
  return r.json();
}

export async function apiMetrics() {
  const r = await fetch(`${API_BASE}/api/metrics`);
  if (!r.ok) throw new Error("Metrics failed");
  return r.json();
}
