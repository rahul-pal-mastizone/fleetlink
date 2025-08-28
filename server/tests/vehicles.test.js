import request from 'supertest'
import app from '../app.js'
import mongoose from 'mongoose'

describe('Vehicles API', () => {
  test('POST /api/vehicles creates a vehicle', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .send({ name: 'Mahindra SUV', capacityKg: 210, tyres: 4 })

    expect(res.statusCode).toBe(201)
    expect(res.body?.vehicle?.name).toBe('Mahindra SUV')
    expect(res.body?.vehicle?.capacityKg).toBe(210)
  })

  test('GET /api/vehicles/available returns vehicles & duration', async () => {
    // seed
    await request(app).post('/api/vehicles').send({ name: 'Tata 407', capacityKg: 500, tyres: 6 })
    await request(app).post('/api/vehicles').send({ name: 'Mahindra Thar', capacityKg: 280, tyres: 4 })

    const start = new Date().toISOString()

    const res = await request(app)
      .get('/api/vehicles/available')
      .query({
        capacityRequired: 200,
        fromPincode: '474009',
        toPincode: '410099',
        startTime: start,
      })

    expect(res.statusCode).toBe(200)
    expect(typeof res.body.estimatedRideDurationHours).toBe('number')
    expect(Array.isArray(res.body.available)).toBe(true)
    expect(res.body.available.length).toBeGreaterThan(0)
  })
})
