import Layout from '../components/Layout.jsx'

export default function Index() {
  return (
    <Layout>
      {/* Hero */}
      <section className="text-center mb-10">
        <div className="mx-auto max-w-2xl">
          <div className="text-5xl font-extrabold tracking-tight text-white">FleetLink</div>
          <p className="mt-4 text-slate-300">
            Comprehensive logistics vehicle booking for B2B clients. Manage your fleet, check availability, and book with confidence.
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <a href="/add-vehicle" className="px-5 py-3 rounded-lg bg-sky-600 text-white hover:bg-sky-500">Add Vehicle</a>
            <a href="/search-book" className="px-5 py-3 rounded-lg bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700">Search & Book</a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-4 mb-12">
        {[
          { title:'Capacity Management', desc:'Smart matching based on vehicle capacity and cargo requirements' },
          { title:'Real-time Availability', desc:'Accurate availability with conflict prevention' },
          { title:'Reliable Booking', desc:'Race-condition safe booking flow with re-verification' }
        ].map((f, i) => (
          <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="text-2xl font-semibold mb-2">{f.title}</div>
            <p className="text-slate-300 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n:1, title:'Add Vehicles', desc:'Register fleet vehicles with capacity and tyres' },
            { n:2, title:'Search Available', desc:'Find vehicles by capacity, route and start time' },
            { n:3, title:'Book Instantly', desc:'Confirm booking after overlap re-check' }
          ].map(step => (
            <div key={step.n} className="rounded-xl border border-slate-800 p-6 text-center bg-slate-950/40">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800 grid place-content-center">{step.n}</div>
              <div className="font-semibold">{step.title}</div>
              <p className="text-slate-300 text-sm mt-1">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}
