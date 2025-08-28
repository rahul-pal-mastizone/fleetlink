import 'dotenv/config'
import { connectDB } from './config/database.js'
import app from './app.js'

const port = process.env.PORT || 5174

async function start() {
  await connectDB()
  app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))
}

start().catch(err => {
  console.error('Startup failed:', err)
  process.exit(1)
})
