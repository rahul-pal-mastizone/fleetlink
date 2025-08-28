export default function Header() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-slate-900/80 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="inline-block rounded bg-sky-500/20 text-sky-300 px-2 py-0.5">🚚</span>
          FleetLink
        </a>
        <nav className="flex gap-2">
          <a href="/" className="px-3 py-1.5 rounded border border-slate-700 text-slate-200 hover:bg-slate-800">Home</a>
          <a href="/add-vehicle" className="px-3 py-1.5 rounded border border-slate-700 text-slate-200 hover:bg-slate-800">Add Vehicle</a>
          <a href="/search-book" className="px-3 py-1.5 rounded border border-slate-700 text-slate-200 hover:bg-slate-800">Search & Book</a>
          <a href="/status" className="px-3 py-1.5 rounded border border-slate-700 text-slate-200 hover:bg-slate-800">Status</a>
        </nav>
      </div>
    </header>
  )
}
