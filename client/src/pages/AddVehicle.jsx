import { useState } from 'react'
import Layout from '../components/Layout.jsx'
import { api } from '../lib/api.js'

export default function AddVehicle() {
  const [form, setForm] = useState({ name: '', capacityKg: '', tyres: '' })
  const [status, setStatus] = useState({ loading: false, ok: null, message: '' })

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setStatus({ loading: true, ok: null, message: '' })
    try {
      const res = await fetch(api('/api/vehicles'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: form.name.trim(), 
          capacityKg: Number(form.capacityKg), 
          tyres: Number(form.tyres) 
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to add vehicle')
      setStatus({ loading: false, ok: true, message: 'Vehicle added successfully' })
      setForm({ name: '', capacityKg: '', tyres: '' })
    } catch (err) {
      setStatus({ loading: false, ok: false, message: err.message })
    }
  }

  return (
    <Layout>
      <section className="max-w-3xl mx-auto">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
          <h2 className="text-2xl font-bold mb-1 text-white">Add New Vehicle</h2>
          <p className="text-slate-300 mb-6">Enter the details of the vehicle you want to add to the fleet</p>
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-1 text-slate-300">Vehicle Name</label>
              <input name="name" value={form.name} onChange={onChange} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-600" required />
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-300">Capacity (KG)</label>
              <input name="capacityKg" type="number" min="1" value={form.capacityKg} onChange={onChange} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-600" required />
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-300">Number of Tyres</label>
              <input name="tyres" type="number" min="1" value={form.tyres} onChange={onChange} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-600" required />
            </div>
            <button disabled={status.loading} className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white">
              {status.loading ? 'Saving…' : 'Add Vehicle'}
            </button>
            {status.ok === true && <p className="text-green-400">{status.message}</p>}
            {status.ok === false && <p className="text-red-400">{status.message}</p>}
          </form>
        </div>
      </section>
    </Layout>
  )
}
