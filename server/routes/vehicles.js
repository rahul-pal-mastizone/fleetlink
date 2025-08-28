import Vehicle from '../models/Vehicle.js'
import Booking from '../models/Booking.js'
import { z } from 'zod'
import { calculateRideDuration } from '../utils/rideDuration.js'

const addVehicleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  capacityKg: z.number().positive('Capacity must be positive'),
  tyres: z.number().positive('Tyres must be positive')
})

const availabilityQuerySchema = z.object({
  capacityRequired: z.string().transform(v => parseInt(v)).refine(v => !Number.isNaN(v) && v > 0, 'Invalid capacity'),
  fromPincode: z.string().min(1, 'From pincode is required'),
  toPincode: z.string().min(1, 'To pincode is required'),
  startTime: z.string().datetime('Invalid start time format')
})

export const addVehicle = async (req, res) => {
  try {
    const parsed = addVehicleSchema.parse(req.body)
    const vehicle = await Vehicle.create(parsed)
    res.status(201).json({ message: 'Vehicle added', vehicle })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: err.errors })
    }
    console.error('Error adding vehicle:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getAvailableVehicles = async (req, res) => {
  try {
    const q = availabilityQuerySchema.parse(req.query)
    const estimatedRideDurationHours = calculateRideDuration(q.fromPincode, q.toPincode)
    const start = new Date(q.startTime)
    const end = new Date(start.getTime() + estimatedRideDurationHours * 60 * 60 * 1000)

    const candidates = await Vehicle.find({ capacityKg: { $gte: q.capacityRequired } }).lean()
    if (!candidates.length) {
      return res.json({ available: [], estimatedRideDurationHours })
    }

    const vehicleIds = candidates.map(v => v._id)
    const overlaps = await Booking.find({
      vehicleId: { $in: vehicleIds },
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }]
    }).select('vehicleId startTime endTime').lean()

    const busy = new Set(overlaps.map(b => String(b.vehicleId)))
    const available = candidates.filter(v => !busy.has(String(v._id)))

    res.json({ available, estimatedRideDurationHours })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: err.errors })
    }
    console.error('Error finding available vehicles:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
