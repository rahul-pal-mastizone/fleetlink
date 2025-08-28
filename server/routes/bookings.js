import Vehicle from '../models/Vehicle.js'
import Booking from '../models/Booking.js'
import { z } from 'zod'
import { calculateRideDuration, calculateEndTime } from '../utils/rideDuration.js'

const createBookingSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle ID is required'),
  customerId: z.string().min(1, 'Customer ID is required'),
  fromPincode: z.string().min(1, 'From pincode is required'),
  toPincode: z.string().min(1, 'To pincode is required'),
  startTime: z.string().datetime('Invalid start time format')
})

export const createBooking = async (req, res) => {
  try {
    const data = createBookingSchema.parse(req.body)
    const vehicle = await Vehicle.findById(data.vehicleId)
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' })

    const estimatedRideDurationHours = calculateRideDuration(data.fromPincode, data.toPincode)
    const endTime = calculateEndTime(data.startTime, data.fromPincode, data.toPincode)

    // check overlap
    const overlap = await Booking.findOne({
      vehicleId: data.vehicleId,
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: new Date(data.startTime) } }]
    })

    if (overlap) {
      return res.status(409).json({ error: 'Vehicle is already booked in that time window' })
    }

    const booking = await Booking.create({
      vehicleId: data.vehicleId,
      customerId: data.customerId,
      fromPincode: data.fromPincode,
      toPincode: data.toPincode,
      startTime: new Date(data.startTime),
      endTime,
      estimatedRideDurationHours,
      status: 'active'
    })

    // populate so client sees vehicle name right away
    const saved = await booking.populate('vehicleId', 'name capacityKg tyres')

    res.status(201).json({
      message: 'Booking created',
      booking: {
        ...saved.toObject(),
        vehicle: saved.vehicleId,
        vehicleId: saved.vehicleId._id
      }
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: err.errors })
    }
    console.error('Error creating booking:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const listBookings = async (_req, res) => {
  try {
    const raw = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(25)
      .populate('vehicleId', 'name capacityKg tyres')
      .lean()

    const items = raw.map(b => ({
      ...b,
      vehicle: b.vehicleId && typeof b.vehicleId === 'object' ? b.vehicleId : null,
      vehicleId: b.vehicleId && typeof b.vehicleId === 'object' ? b.vehicleId._id : b.vehicleId
    }))

    res.json({ items })
  } catch (err) {
    console.error('Error listing bookings:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params
    const booking = await Booking.findByIdAndDelete(id)
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    res.json({ message: 'Booking cancelled', booking })
  } catch (err) {
    console.error('Error deleting booking:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
