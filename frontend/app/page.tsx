import Chat from '@/components/Chat';
import AdminPanel from '@/components/AdminPanel';

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            AI Policy & Product Helper
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Local-first RAG starter. Ingest sample docs, ask questions, and see citations.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 space-y-8">

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">System Control</h2>
          </div>
          <div className="p-6">
            <AdminPanel />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">
            <Chat />
          </div>

          <aside className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h3 className="text-blue-900 font-semibold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                How to test
              </h3>
              <ol className="mt-4 space-y-4 text-sm text-blue-800/80 list-decimal list-inside">
                <li className="pl-2">
                  <span className="font-medium text-blue-900">Ingest:</span> Click "Ingest sample docs" in the panel.
                </li>
                <li className="pl-2">
                  <span className="font-medium text-blue-900">Ask:</span> Can a customer return a damaged blender after 20 days?
                </li>
                <li className="pl-2">
                  <span className="font-medium text-blue-900">Ask:</span> What’s the shipping SLA to East Malaysia for bulky items?
                </li>
              </ol>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}