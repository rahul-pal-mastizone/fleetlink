import { useEffect, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { addVehicleAPI, getVehicles, deleteVehicleAPI } from '../lib/api.js'

export default function AddVehicle() {
  const [form, setForm] = useState({ name: '', capacityKg: '', tyres: '' })
  const [submitting, setSubmitting] = useState(false)
  const [vehicles, setVehicles] = useState([])
  const [loadingList, setLoadingList] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    loadVehicles()
  }, [])

  async function loadVehicles() {
    setLoadingList(true)
    setErr('')
    try {
      const data = await getVehicles()
      setVehicles(data.vehicles || [])
    } catch (e) {
      setErr(e.message || 'Failed to load vehicles')
    } finally {
      setLoadingList(false)
    }
  }

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setErr('')
    try {
      await addVehicleAPI({
        name: form.name?.trim(),
        capacityKg: Number(form.capacityKg),
        tyres: Number(form.tyres),
      })
      setForm({ name: '', capacityKg: '', tyres: '' })
      await loadVehicles() // refresh list
    } catch (e) {
      setErr(e.message || 'Failed to add vehicle')
    } finally {
      setSubmitting(false)
    }
  }

  async function onDelete(id) {
    if (!confirm('Delete this vehicle?')) return
    setErr('')
    try {
      await deleteVehicleAPI(id)
      await loadVehicles()
    } catch (e) {
      setErr(e.message || 'Failed to delete vehicle')
    }
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-2xl font-bold mb-1 text-white">Add New Vehicle</h2>
          <p className="text-slate-400 mb-6">
            Enter the details of the vehicle you want to add to the fleet
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Vehicle Name</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Enter vehicle name"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Capacity (KG)</label>
              <input
                name="capacityKg"
                type="number"
                min="1"
                value={form.capacityKg}
                onChange={onChange}
                placeholder="Enter capacity in kg"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Number of Tyres</label>
              <input
                name="tyres"
                type="number"
                min="1"
                value={form.tyres}
                onChange={onChange}
                placeholder="Enter number of tyres"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-600"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                disabled={submitting}
                className="px-5 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-500 disabled:opacity-60"
              >
                {submitting ? 'Adding…' : 'Add Vehicle'}
              </button>
            </div>
          </form>

          {err && <p className="mt-4 text-red-500">{err}</p>}

          {/* Registered list */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-3">Registered Vehicles</h3>

            {loadingList ? (
              <p className="text-slate-400">Loading…</p>
            ) : vehicles.length === 0 ? (
              <p className="text-slate-400">No vehicles added yet.</p>
            ) : (
              <ul className="divide-y divide-slate-800">
                {vehicles.map(v => (
                  <li key={v._id} className="py-3 flex items-center justify-between">
                    <div className="text-slate-200">
                      <div className="font-medium">{v.name}</div>
                      <div className="text-xs text-slate-400">
                        Capacity: {v.capacityKg} kg · Tyres: {v.tyres}
                      </div>
                    </div>
                    <button
                      onClick={() => onDelete(v._id)}
                      className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-500"
                    >
                      Cancel
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
