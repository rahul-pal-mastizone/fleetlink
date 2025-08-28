import { useState, useEffect } from 'react'
import Layout from '../components/Layout.jsx'

export default function SearchBook() {
  const [form, setForm] = useState({ capacityRequired: '', fromPincode: '', toPincode: '', startTime: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [bookingStatus, setBookingStatus] = useState('')

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function onSearch(e) {
    e.preventDefault()
    setLoading(true); setError(''); setResult(null)
    try {
      const params = new URLSearchParams({
        capacityRequired: String(form.capacityRequired || ''),
        fromPincode: form.fromPincode || '',
        toPincode: form.toPincode || '',
        // ✅ send ISO string for Zod .datetime()
        startTime: form.startTime ? new Date(form.startTime).toISOString() : ''
      })
      const res = await fetch('/api/vehicles/available?' + params.toString())
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Search failed')
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function onBook(vehicleId) {
    setBookingStatus('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId,
          customerId: 'demo-user',
          fromPincode: form.fromPincode,
          toPincode: form.toPincode,
          // ✅ send ISO string here too (this was the cause of "Validation error")
          startTime: new Date(form.startTime).toISOString()
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Booking failed')
      setBookingStatus('Booked!')
    } catch (err) {
      setBookingStatus(err.message || 'Booking failed')
    }
  }

  async function cancelBooking(id) {
    try {
      const res = await fetch('/api/bookings/' + id, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Cancel failed')
      setBookingStatus('Cancelled booking: ' + id)
    } catch (err) {
      setBookingStatus(err.message || 'Cancel failed')
    }
  }

  return (
    <Layout>
      <div className="py-2">
        <div className="max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Search & Book</h2>
          <form onSubmit={onSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm mb-1">Capacity (kg)</label>
              <input name="capacityRequired" type="number" min="1" required value={form.capacityRequired} onChange={onChange} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-600" />
            </div>
            <div>
              <label className="block text-sm mb-1">From PIN</label>
              <input name="fromPincode" required value={form.fromPincode} onChange={onChange} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-600" />
            </div>
            <div>
              <label className="block text-sm mb-1">To PIN</label>
              <input name="toPincode" required value={form.toPincode} onChange={onChange} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-600" />
            </div>
            <div>
              <label className="block text-sm mb-1">Start DateTime</label>
              <input name="startTime" type="datetime-local" required value={form.startTime} onChange={onChange} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-600" />
            </div>
            <div className="md:col-span-4">
              <button disabled={loading} className="px-5 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-500">
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {error && <p className="text-red-600 mt-3">{error}</p>}

          {result && (
            <div className="mt-6">
              <p className="text-gray-400 mb-2">Estimated ride duration: <b>{result.estimatedRideDurationHours} hour(s)</b></p>
              {result.available.length === 0 && <p className="text-gray-500">No vehicles available for that time window.</p>}
              <ul className="divide-y divide-slate-800">
                {result.available.map(v => (
                  <li key={v._id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-100">{v.name}</div>
                      <div className="text-sm text-gray-400">Capacity: {v.capacityKg} kg · Tyres: {v.tyres}</div>
                    </div>
                    <button className="px-3 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700" onClick={() => onBook(v._id)}>Book</button>
                  </li>
                ))}
              </ul>
              {bookingStatus && <p className="mt-3">{bookingStatus}</p>}
            </div>
          )}

          <a href="/" className="inline-block mt-5 text-sky-400 underline">Back</a>
        </div>
      </div>
    </Layout>
  )
}
