import express from 'express'
import { PrismaClient } from '@prisma/client'
import { v2 as cloudinary } from 'cloudinary'
import NodeClam from 'node-clamav'
import { UploadedFile } from 'express-fileupload'
import fs from 'fs/promises'

const router = express.Router()
const prisma = new PrismaClient()

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

// Инициализация ClamAV
const ClamScan = new NodeClam().init({
  removeInfected: true,
  quarantineInfected: false,
  scanLog: null,
  debugMode: false,
  fileList: null,
  scanRecursively: true,
  preference: 'clamdscan'
})

router.post('/', async (req, res) => {
  try {
    const userId = req.auth.userId
    const questionId = req.body.questionId
    const turnstileToken = req.body['cf-turnstile-response']

    // Проверка токена Turnstile
    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: turnstileToken
      })
    })

    const turnstileData = await turnstileResponse.json()
    if (!turnstileData.success) {
      return res.status(400).json({ error: 'Invalid captcha' })
    }

    if (!req.files || !req.files.files) {
      return res.status(400).json({ error: 'No files uploaded' })
    }

    const files = Array.isArray(req.files.files) 
      ? req.files.files 
      : [req.files.files]

    const uploadedFiles = []

    for (const file of files) {
      const uploadedFile = file as UploadedFile

      // Проверка типа файла
      if (!ALLOWED_TYPES.includes(uploadedFile.mimetype)) {
        return res.status(400).json({ error: `File type ${uploadedFile.mimetype} is not allowed` })
      }

      // Сканирование файла на вирусы
      const {isInfected, viruses} = await ClamScan.isInfected(uploadedFile.tempFilePath)
      
      if (isInfected) {
        await fs.unlink(uploadedFile.tempFilePath)
        return res.status(400).json({ 
          error: `File ${uploadedFile.name} is infected with ${viruses.join(', ')}` 
        })
      }

      // Загрузка файла в Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(uploadedFile.tempFilePath, {
        resource_type: 'auto',
        folder: 'enic-kz/questions'
      })

      // Удаление временного файла
      await fs.unlink(uploadedFile.tempFilePath)

      // Сохранение информации о файле в базе данных
      const fileRecord = await prisma.file.create({
        data: {
          filename: uploadedFile.name,
          url: cloudinaryResponse.secure_url,
          publicId: cloudinaryResponse.public_id,
          mimetype: uploadedFile.mimetype,
          size: uploadedFile.size,
          scanStatus: 'CLEAN',
          questionId
        }
      })

      uploadedFiles.push(fileRecord)
    }

    res.json(uploadedFiles)
  } catch (error) {
    console.error('Error uploading files:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

export const uploadRoutes = router 