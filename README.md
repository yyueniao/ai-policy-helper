# 🤖 AI Policy & Product Helper

An enterprise-ready RAG (Retrieval-Augmented Generation) system built with **FastAPI**, **Next.js 14**, and **Qdrant**.

## 🚀 Quick Start

1. **Environment Setup**:
   Copy the example environment file and add your `OPENROUTER_API_KEY`.

   ```bash
   cp .env.example .env
   ```

2. **Launch with Docker**:
   The entire stack (Frontend, Backend, and Vector DB) initializes with a single command.

   ```bash
   docker compose up --build
   ```

   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **Vector DB**: [http://localhost:6333](http://localhost:6333)

---

## 🛠 Features & Major Enhancements

I have extended the base requirements with a production-ready RAG pipeline focusing on data privacy, retrieval accuracy, and system performance:

### 1. PDPA Privacy Guardrails (Streaming Mask)

To comply with Malaysian data protection standards, I implemented a **Sliding Window Privacy Guard**.

- **The Problem**: LLM tokens often split sensitive data (e.g., an NRIC number split into two tokens), which causes traditional regex to fail.
- **The Solution**: A 25-character look-ahead buffer that intercepts the LLM stream, re-assembles partial tokens, and masks NRICs and Malaysian phone numbers before they reach the client.

### 2. Advanced Retrieval & Ingestion

- **Smart Chunking**: Switched from fixed-size splitting to **Recursive Character Text Splitting** with overlapping windows, preserving the semantic context of policy headers.
- **MMR Reranking**: Implemented **Maximal Marginal Relevance (MMR)** to balance result relevance with diversity, reducing redundancy in the retrieved context.
- **Semantic Caching**: Added an in-memory cache layer to store frequent policy queries, reducing LLM costs and providing sub-10ms response times for common questions.

### 3. UX & DX Polish

- **Real-time Streaming**: Full implementation of server-sent events (SSE) to deliver the "typing" experience users expect from modern AI.
- **UI/UX Refinement**: Built a responsive, high-contrast interface using Tailwind CSS.
- **Optimized Prompting**: Engineered a "Chain-of-Thought" system prompt that forces the LLM to verify citations against the retrieved context before generating the final answer.

---

## 🏗 Architecture

The system follows a clean separation of concerns:

```
[User] <-> [Next.js Frontend]
|
[FastAPI Controller]
|
[RAG Engine Logic]
/ | \
 [Qdrant] [LLM Provider] [PDPA Masker]
```

---

## 🧪 Testing & Evaluation

### Automated Tests

Run the suite to verify API integrity and RAG logic:

```bash
docker compose run --rm backend pytest
```
