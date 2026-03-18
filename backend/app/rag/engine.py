import hashlib
import json
import time
from cachetools import TTLCache
from typing import Generator, List, Dict, Tuple

from .pdpa import StreamGuard
from ..settings import settings
from ..ingest import doc_hash
from .embedder import LocalEmbedder
from .llms import StubLLM, OpenRouterLLM
from .metrics import Metrics
from .stores import QdrantStore, InMemoryStore

class RAGEngine:
    def __init__(self):
        self.embedder = LocalEmbedder(dim=384)
        # Vector store selection
        if settings.vector_store == "qdrant":
            try:
                self.store = QdrantStore(collection=settings.collection_name, dim=384)
            except Exception:
                self.store = InMemoryStore(dim=384)
        else:
            self.store = InMemoryStore(dim=384)

        # LLM selection
        if settings.llm_provider == "openrouter" and settings.openrouter_api_key:
            try:
                self.llm = OpenRouterLLM(
                    api_key=settings.openrouter_api_key,
                    model=settings.llm_model,
                )
                self.llm_name = f"openrouter:{settings.llm_model}"
            except Exception:
                self.llm = StubLLM()
                self.llm_name = "stub"
        else:
            self.llm = StubLLM()
            self.llm_name = "stub"

        self.metrics = Metrics()
        self._doc_titles = set()
        self._chunk_count = 0
        self.cache = TTLCache(maxsize=100, ttl=3600)

    def ingest_chunks(self, chunks: List[Dict]) -> Tuple[int, int]:
        vectors = []
        metas = []
        doc_titles_before = set(self._doc_titles)

        for ch in chunks:
            text = ch["text"]
            h = doc_hash(text)
            meta = {
                "id": h,
                "hash": h,
                "title": ch["title"],
                "section": ch.get("section"),
                "text": text,
            }
            v = self.embedder.embed(text)
            vectors.append(v)
            metas.append(meta)
            self._doc_titles.add(ch["title"])
            self._chunk_count += 1

        self.store.upsert(vectors, metas)
        return (len(self._doc_titles) - len(doc_titles_before), len(metas))

    def retrieve(self, query: str, k: int = 4) -> List[Dict]:
        t0 = time.time()
        qv = self.embedder.embed(query)
        results = self.store.search(qv, k=k)
        self.metrics.add_retrieval((time.time()-t0)*1000.0)
        return [meta for score, meta in results]

    def generate(self, query: str, contexts: List[Dict]) -> Generator[str,None,None]:
        t0 = time.time()
        token_stream = self.llm.generate(query, contexts)
        for token in token_stream:
            yield token
        self.metrics.add_generation((time.time()-t0)*1000.0)

    def stats(self) -> Dict:
        m = self.metrics.summary()
        return {
            "total_docs": len(self._doc_titles),
            "total_chunks": self._chunk_count,
            "embedding_model": settings.embedding_model,
            "llm_model": self.llm_name,
            **m
        }
    
    def ask_stream(self, query: str, k: int = 4) -> Generator[str, None, None]:
        cache_key = hashlib.md5(f"{query}:{k}".encode()).hexdigest()

        if cache_key in self.cache:
            cached_data = self.cache[cache_key]
            yield json.dumps(cached_data["metadata"]) + "\n[METADATA_END]\n"
            yield cached_data["answer"]
            return
        
        ctx = self.retrieve(query, k=k)
        citations = [
            {"title": c.get("title"), "section": c.get("section")} 
            for c in ctx
        ]
        chunks = [
            {"title": c.get("title"), "section": c.get("section"), "text": c.get("text")} 
            for c in ctx
        ]
        
        metadata = {
            "citations": citations,
            "chunks": chunks,
            "metrics": self.stats()
        }

        yield json.dumps(metadata) + "\n[METADATA_END]\n"

        raw_stream = self.generate(query, ctx)
        guard = StreamGuard()
        full_answer = []

        try:
            for token in guard.mask(raw_stream):
                full_answer.append(token) 
                yield token               
        finally:
            if full_answer:
                self.cache[cache_key] = {
                    "metadata": metadata,
                    "answer": "".join(full_answer)
                }
