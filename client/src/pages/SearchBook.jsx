import { useEffect, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { api } from '../lib/api'

export default function SearchBook() {
  const [form, setForm] = useState({
    capacityRequired: '',
    fromPincode: '',
    toPincode: '',
    startTime: '',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [bookingStatus, setBookingStatus] = useState('')
  const [bookings, setBookings] = useState([])

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
        startTime: form.startTime ? new Date(form.startTime).toISOString() : ''
      })
      const res = await fetch(api('/api/vehicles/available?' + params.toString()))
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Search failed')
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function onBook(vehicleId, vehicleName) {
    setBookingStatus('')
    try {
      const res = await fetch(api('/api/bookings'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId,
          customerId: 'demo-user',
          fromPincode: form.fromPincode,
          toPincode: form.toPincode,
          startTime: form.startTime
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Booking failed')
      // Success banner ABOVE the booking list
      setBookingStatus(`Booked!`)
      // refresh bookings
      await fetchBookings()
    } catch (err) {
      setBookingStatus(err.message)
    }
  }

  async function cancelBooking(id) {
    setBookingStatus('')
    try {
      const res = await fetch(api('/api/bookings/' + id), { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Cancel failed')
      setBookingStatus(`Cancelled booking for: ${data?.vehicleName || 'Vehicle'}`)
      await fetchBookings()
    } catch (err) {
      setBookingStatus(err.message)
    }
  }

  async function fetchBookings() {
    try {
      const res = await fetch(api('/api/bookings'))
      const data = await res.json()
      // handle either {bookings: []} or {items: []}
      if (res.ok) setBookings(data.bookings || data.items || [])
    } catch {
      /* ignore */
    }
  }

  useEffect(() => { fetchBookings() }, [])

  // --- Helpers -------------------------------------------------------------

  // Normalize datetime to minute precision for comparison
  const normalize = (d) => {
    if (!d) return ''
    const t = new Date(d)
    // same minute precision
    return t.toISOString().slice(0, 16)
  }
  const selectedKey = normalize(form.startTime)

  // Build a Set of vehicleIds (or names) that are already booked at the selected time
  const bookedAtSelected = (() => {
    const byId = new Set()
    const byName = new Set()
    bookings.forEach(b => {
      const bKey = normalize(b.startTime)
      if (bKey && bKey === selectedKey) {
        if (b.vehicleId) byId.add(String(b.vehicleId))
        if (b.vehicleName) byName.add(String(b.vehicleName))
      }
    })
    return { byId, byName }
  })()

  const isBookedNow = (vehicle) => {
    // Prefer vehicleId if available
    if (vehicle._id && bookedAtSelected.byId.has(String(vehicle._id))) return true
    if (vehicle.name && bookedAtSelected.byName.has(String(vehicle.name))) return true
    return false
  }

  // ------------------------------------------------------------------------

  return (
    <Layout>
      <div className="py-2">
        <div className="max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Search &amp; Book</h2>

          <form onSubmit={onSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm mb-1">Capacity (kg)</label>
              <input
                name="capacityRequired"
                type="number"
                min="1"
                required
                value={form.capacityRequired}
                onChange={onChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">From PIN</label>
              <input
                name="fromPincode"
                required
                value={form.fromPincode}
                onChange={onChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">To PIN</label>
              <input
                name="toPincode"
                required
                value={form.toPincode}
                onChange={onChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Start DateTime</label>
              <input
                name="startTime"
                type="datetime-local"
                required
                value={form.startTime}
                onChange={onChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>
            <div className="md:col-span-4">
              <button disabled={loading} className="px-5 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-500">
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Error */}
          {error && <p className="text-red-500 mt-3">{error}</p>}

          {/* SUCCESS / STATUS banner - now ABOVE bookings */}
          {bookingStatus && (
            <div className="mt-4 rounded-lg bg-slate-800 text-slate-200 px-4 py-2 border border-slate-700">
              {bookingStatus}
            </div>
          )}

          {/* Results list (without the old “Estimated ride duration”) */}
          {result && (
            <div className="mt-6">
              {result.available?.length === 0 && (
                <p className="text-gray-400">No vehicles available for that time window.</p>
              )}
              <ul className="divide-y divide-slate-800">
                {result.available?.map(v => {
                  const disabled = isBookedNow(v)
                  return (
                    <li key={v._id || v.name} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-200">{v.name}</div>
                        <div className="text-sm text-gray-400">
                          Capacity: {v.capacityKg} kg · Tyres: {v.tyres}
                        </div>
                      </div>
                      <button
                        disabled={disabled}
                        className={
                          'px-3 py-2 rounded-lg ' +
                          (disabled
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-800 text-white hover:bg-slate-700')
                        }
                        onClick={() => onBook(v._id, v.name)}
                        title={disabled ? 'Already booked for the selected time' : 'Book'}
                      >
                        {disabled ? 'Booked' : 'Book'}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* My Bookings */}
          <div className="mt-8">
            <h3 className="font-semibold text-slate-200 mb-2">My Bookings</h3>
            {bookings.length === 0 && (
              <p className="text-gray-400">No bookings yet.</p>
            )}
            <ul className="divide-y divide-slate-800">
              {bookings.map(b => (
                <li key={b._id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-200">{b.vehicleName || 'Vehicle'}</div>
                    <div className="text-sm text-gray-400">
                      {b.fromPincode} → {b.toPincode},{' '}
                      {new Date(b.startTime).toLocaleString()}
                    </div>
                  </div>
                  <button
                    className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500"
                    onClick={() => cancelBooking(b._id)}
                  >
                    Cancel
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <a href="/" className="inline-block mt-5 text-sky-400 underline">Back</a>
        </div>
      </div>
    </Layout>
  )
}
