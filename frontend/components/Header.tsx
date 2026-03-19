export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          AI Policy & Product Helper
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Local-first RAG starter. Ingest sample docs, ask questions, and see
          citations.
        </p>
      </div>
    </header>
  );
}
