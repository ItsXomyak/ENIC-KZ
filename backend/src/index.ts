import express from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import { config } from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import { PrismaClient } from '@prisma/client'
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'
import { questionRoutes } from './routes/questions'
import { uploadRoutes } from './routes/upload'

config()

const app = express()
const prisma = new PrismaClient()

// Конфигурация Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use(express.json())
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  useTempFiles: true,
  tempFileDir: '/tmp/'
}))

// Маршруты
app.use('/api/questions', ClerkExpressRequireAuth(), questionRoutes)
app.use('/api/upload', ClerkExpressRequireAuth(), uploadRoutes)

// Обработка ошибок
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error' })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
}) 