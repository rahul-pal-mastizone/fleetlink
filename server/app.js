import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import { handleDemo } from './routes/demo.js'
import { addVehicle, getAvailableVehicles } from './routes/vehicles.js'
import { createBooking, deleteBooking, listBookings } from './routes/bookings.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

// health/ping
app.get('/api/ping', (_req, res) => res.json({ message: process.env.PING_MESSAGE ?? 'ping' }))

// demo
app.get('/api/demo', handleDemo)

// vehicles
app.post('/api/vehicles', addVehicle)
app.get('/api/vehicles/available', getAvailableVehicles)

// bookings
app.post('/api/bookings', createBooking)
app.get('/api/bookings', listBookings)
app.delete('/api/bookings/:id', deleteBooking)

export default app
