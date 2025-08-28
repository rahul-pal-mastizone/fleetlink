// Centralized API base
export const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5174'

// Compose absolute API URL
export function api(path) {
  return `${API_BASE}${path}`
}

// ---------- Vehicles ----------
export async function addVehicleAPI(payload) {
  const res = await fetch(api('/api/vehicles'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Failed to add vehicle')
  return data
}

export async function getVehicles() {
  const res = await fetch(api('/api/vehicles'))
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Failed to load vehicles')
  return data
}

export async function deleteVehicleAPI(id) {
  const res = await fetch(api(`/api/vehicles/${id}`), { method: 'DELETE' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Failed to delete vehicle')
  return data
}

// ---------- Availability ----------
export async function searchAvailable(params) {
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(api(`/api/vehicles/available?${qs}`))
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Search failed')
  return data
}

// ---------- Bookings ----------
export async function createBookingAPI(payload) {
  const res = await fetch(api('/api/bookings'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Booking failed')
  return data
}

export async function listBookingsAPI() {
  const res = await fetch(api('/api/bookings'))
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Failed to load bookings')
  return data
}

export async function cancelBookingAPI(id) {
  const res = await fetch(api(`/api/bookings/${id}`), { method: 'DELETE' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Cancel failed')
  return data
}
