from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from .models import IngestResponse, AskRequest, AskResponse, MetricsResponse, Citation, Chunk
from .settings import settings
from .ingest import load_documents
from .rag.engine import RAGEngine
from .rag.utils import build_chunks_from_docs

app = FastAPI(title="AI Policy & Product Helper")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = RAGEngine()

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/metrics", response_model=MetricsResponse)
def metrics():
    s = engine.stats()
    return MetricsResponse(**s)

@app.post("/api/ingest", response_model=IngestResponse)
def ingest():
    docs = load_documents(settings.data_dir)
    chunks = build_chunks_from_docs(docs, settings.chunk_size, settings.chunk_overlap)
    new_docs, new_chunks = engine.ingest_chunks(chunks)
    return IngestResponse(indexed_docs=new_docs, indexed_chunks=new_chunks)

@app.post("/api/ask", response_model=AskResponse)
def ask(req: AskRequest):
    stream = engine.ask_stream(
        query=req.query, 
        k=req.k or 4
    )

    return StreamingResponse(
        stream, 
        media_type="text/event-stream"
    )
