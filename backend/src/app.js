import express from 'express'
import cors from 'cors'

import messageRoutes from './routes/messageRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import skillRoutes from './routes/skillRoutes.js'
import authRoutes from './routes/authRoutes.js'
import statsRoutes from './routes/statsRoutes.js'
import certificateRoutes from './routes/certificateRoutes.js'

import errorMiddleware from './middleware/errorMiddleware.js'

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://annadata-hemanth-portfolio.vercel.app',
  'https://annadata-hemanth-portfolio-3iog.vercel.app',
]

app.use(
  cors({
    origin: allowedOrigins,
  }),
)

app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    message: 'Annadata Hemanth Portfolio API is running',
  })
})

app.use('/api/messages', messageRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/certificates', certificateRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/stats', statsRoutes)

app.use(errorMiddleware)

export default app