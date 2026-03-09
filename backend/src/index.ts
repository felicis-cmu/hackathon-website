import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

import applicationsRouter from './routes/applications'
import uploadRouter from './routes/upload'
import adminRouter from './routes/admin'

const app = express()
const port = process.env.PORT || 3001

const allowedOrigins = [
  'https://www.venturehacks.dev',
  'https://venturehacks.dev',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ...(process.env.CORS_ORIGINS?.split(',').map((o) => o.trim()).filter(Boolean) ?? []),
]
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
      cb(null, false)
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)
app.use(express.json())

app.use('/api/applications', applicationsRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/admin', adminRouter)

// Ensure all errors return JSON (with CORS headers already set by cors middleware)
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

app.listen(port, () => {
  console.log(`Backend running on port ${port}`)
})

export default app
