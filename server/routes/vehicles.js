import Vehicle from '../models/Vehicle.js'
import Booking from '../models/Booking.js'

// POST /api/vehicles
export const addVehicle = async (req, res) => {
  try {
    const { name, capacityKg, tyres } = req.body
    if (!name || !capacityKg || !tyres) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const vehicle = await Vehicle.create({ name, capacityKg, tyres })
    res.status(201).json({ vehicle })
  } catch (err) {
    console.error('addVehicle error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// GET /api/vehicles/available
export const getAvailableVehicles = async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query
    if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
      return res.status(400).json({ error: 'Validation error' })
    }

    const start = new Date(startTime)
    if (Number.isNaN(start.getTime())) {
      return res.status(400).json({ error: 'Invalid start time' })
    }

    // Duration heuristic (same as before so tests/UI keep working)
    const durationHrs = Math.abs(Number(toPincode) - Number(fromPincode)) % 24
    const end = new Date(start.getTime() + durationHrs * 60 * 60 * 1000)

    // Find vehicles meeting capacity
    const all = await Vehicle.find({ capacityKg: { $gte: Number(capacityRequired) } }).lean()

    // Pull existing bookings that overlap with [start, end)
    const bookings = await Booking.find({
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }, // overlap
      ],
    }).select('vehicleId startTime endTime').lean()

    const bookedIds = new Set(bookings.map(b => String(b.vehicleId)))
    const available = all.filter(v => !bookedIds.has(String(v._id)))

    res.json({
      estimatedRideDurationHours: durationHrs,
      available,
    })
  } catch (err) {
    console.error('getAvailableVehicles error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// NEW: GET /api/vehicles  (list all)
export const listVehicles = async (_req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 }).lean()
    res.json({ vehicles })
  } catch (err) {
    console.error('listVehicles error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// NEW: DELETE /api/vehicles/:id  (delete one)
export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params

    // Prevent deletion if the vehicle has any future booking
    const hasFutureBooking = await Booking.exists({
      vehicleId: id,
      endTime: { $gte: new Date() },
    })
    if (hasFutureBooking) {
      return res.status(409).json({ error: 'Vehicle has active/future bookings' })
    }

    const deleted = await Vehicle.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ error: 'Vehicle not found' })

    res.json({ message: 'Vehicle deleted', vehicle: deleted })
  } catch (err) {
    console.error('deleteVehicle error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
