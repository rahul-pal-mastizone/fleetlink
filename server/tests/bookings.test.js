import request from 'supertest'
import app from '../app.js'

async function addVehicle(name = 'V1', capacityKg = 300) {
  const v = await request(app).post('/api/vehicles').send({ name, capacityKg, tyres: 4 })
  return v.body.vehicle
}

describe('Bookings API', () => {
  test('POST /api/bookings creates a booking when available', async () => {
    const vehicle = await addVehicle('Mahindra SUV', 210)

    const start = new Date().toISOString()

    const res = await request(app)
      .post('/api/bookings')
      .send({
        vehicleId: vehicle._id,
        customerId: 'tester-1',
        fromPincode: '474009',
        toPincode: '474223',
        startTime: start,
      })

    expect(res.statusCode).toBe(201)
    expect(res.body?.booking?.vehicleId).toBe(vehicle._id)
  })

  test('POST /api/bookings rejects overlapping booking', async () => {
    const vehicle = await addVehicle('Tata 407', 500)
    const start = new Date().toISOString()

    // first booking ok
    const ok = await request(app).post('/api/bookings').send({
      vehicleId: vehicle._id,
      customerId: 'tester-2',
      fromPincode: '100000',
      toPincode: '100050',
      startTime: start,
    })
    expect(ok.statusCode).toBe(201)

    // second booking overlapping the same window should fail
    const conflict = await request(app).post('/api/bookings').send({
      vehicleId: vehicle._id,
      customerId: 'tester-3',
      fromPincode: '100010',
      toPincode: '100060',
      startTime: start,
    })

    // status can be 400 or 409 depending on implementation
    expect([400, 409]).toContain(conflict.statusCode)
    // accept your current message and common alternatives
    expect(conflict.body?.error || '').toMatch(/already booked|not available|overlap|conflict/i)
  })
})
