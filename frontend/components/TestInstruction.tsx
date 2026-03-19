export default function TestInstruction() {
  return (
    <aside className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
        <h3 className="text-blue-900 font-semibold flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          How to test
        </h3>
        <ol className="mt-4 space-y-4 text-sm text-blue-800/80 list-decimal list-inside">
          <li className="pl-2">
            <span className="font-medium text-blue-900">Ingest:</span> Click
            "Ingest sample docs" in the panel.
          </li>
          <li className="pl-2">
            <span className="font-medium text-blue-900">Ask:</span> Can a
            customer return a damaged blender after 20 days?
          </li>
          <li className="pl-2">
            <span className="font-medium text-blue-900">Ask:</span> What’s the
            shipping SLA to East Malaysia for bulky items?
          </li>
        </ol>
      </div>
    </aside>
  );
}
