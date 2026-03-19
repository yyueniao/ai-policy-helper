import Chat from "@/components/Chat";
import AdminPanel from "@/components/AdminPanel";
import Header from "@/components/Header";
import TestInstruction from "@/components/TestInstruction";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              System Control
            </h2>
          </div>
          <div className="p-6">
            <AdminPanel />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Chat />
          </div>

          <TestInstruction />
        </section>
      </main>
    </div>
  );
}
