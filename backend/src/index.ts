import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

import applicationsRouter from './routes/applications'
import uploadRouter from './routes/upload'
import adminRouter from './routes/admin'

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/applications', applicationsRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/admin', adminRouter)

app.listen(port, () => {
  console.log(`Backend running on port ${port}`)
})

export default app
