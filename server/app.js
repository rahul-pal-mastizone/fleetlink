import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/database.js'

import { handleDemo } from './routes/demo.js'
import { addVehicle, getAvailableVehicles, listVehicles, deleteVehicle } from './routes/vehicles.js'
import { createBooking, deleteBooking, listBookings } from './routes/bookings.js'

const app = express()

// DB
connectDB().catch(err => console.error(err))

// Middleware
app.use(cors())
app.use(express.json())

// Health/Ping
app.get('/api/ping', (_req, res) => {
  const ping = process.env.PING_MESSAGE ?? 'ping'
  res.json({ message: ping })
})

// Demo
app.get('/api/demo', handleDemo)

// Vehicles
app.post('/api/vehicles', addVehicle)
app.get('/api/vehicles/available', getAvailableVehicles)
app.get('/api/vehicles', listVehicles)           // NEW
app.delete('/api/vehicles/:id', deleteVehicle)   // NEW

// Bookings
app.post('/api/bookings', createBooking)
app.get('/api/bookings', listBookings)
app.delete('/api/bookings/:id', deleteBooking)

export default app
