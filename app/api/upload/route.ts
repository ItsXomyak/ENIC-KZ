import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { writeFile } from 'fs/promises'
import { join } from 'path'
import NodeClam from 'clamscan'
import { Turnstile } from '@marsidev/react-turnstile'

const ClamScan = new NodeClam().init({
  removeInfected: true,
  quarantineInfected: false,
  scanLog: null,
  debugMode: false,
  fileList: null,
  scanRecursively: true,
  clamscan: {
    path: '/usr/bin/clamscan',
    db: null,
    scanArchives: true,
    active: true
  },
  preference: 'clamscan'
})

const UPLOAD_DIR = join(process.cwd(), 'uploads')
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

export async function POST(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const turnstileToken = formData.get('cf-turnstile-response')
    const questionId = formData.get('questionId')

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
      return new NextResponse("Invalid captcha", { status: 400 })
    }

    const uploadedFiles = []

    for (const file of files) {
      // Проверка размера файла
      if (file.size > MAX_FILE_SIZE) {
        return new NextResponse(`File ${file.name} is too large`, { status: 400 })
      }

      // Проверка типа файла
      if (!ALLOWED_TYPES.includes(file.type)) {
        return new NextResponse(`File type ${file.type} is not allowed`, { status: 400 })
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Генерируем уникальное имя файла
      const uniqueFilename = `${Date.now()}-${file.name}`
      const filePath = join(UPLOAD_DIR, uniqueFilename)

      // Сохраняем файл
      await writeFile(filePath, buffer)

      // Сканируем файл на вирусы
      const {isInfected, viruses} = await ClamScan.isInfected(filePath)
      const scanStatus = isInfected ? 'INFECTED' : 'CLEAN'
      const scanResult = isInfected ? viruses.join(', ') : null

      // Если файл заражен, удаляем его
      if (isInfected) {
        await unlink(filePath)
        return new NextResponse(`File ${file.name} is infected with ${viruses.join(', ')}`, { status: 400 })
      }

      // Сохраняем информацию о файле в базе данных
      const fileRecord = await prisma.file.create({
        data: {
          filename: file.name,
          path: filePath,
          mimetype: file.type,
          size: file.size,
          scanStatus,
          scanResult,
          questionId: questionId as string
        }
      })

      uploadedFiles.push(fileRecord)
    }

    return NextResponse.json(uploadedFiles)
  } catch (error) {
    console.error('Error uploading files:', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 