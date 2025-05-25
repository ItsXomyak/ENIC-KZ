import express from 'express'
import { PrismaClient } from '@prisma/client'
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'

const router = express.Router()
const prisma = new PrismaClient()

// Проверка роли пользователя
router.get('/me', async (req, res) => {
  try {
    const userId = req.auth.userId
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        email: true,
        role: true,
        status: true
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Получение списка вопросов
router.get('/', async (req, res) => {
  try {
    const userId = req.auth.userId
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    const questions = await prisma.question.findMany({
      where: user?.role === 'USER' ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            email: true
          }
        },
        files: true
      }
    })

    res.json(questions)
  } catch (error) {
    console.error('Error fetching questions:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Создание нового вопроса
router.post('/', async (req, res) => {
  try {
    const userId = req.auth.userId
    const { question } = req.body

    const newQuestion = await prisma.question.create({
      data: {
        question,
        userId
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    })

    res.json(newQuestion)
  } catch (error) {
    console.error('Error creating question:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Ответ на вопрос
router.post('/:id/answer', async (req, res) => {
  try {
    const userId = req.auth.userId
    const questionId = req.params.id
    const { answer } = req.body

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    if (user?.role !== 'ADMIN' && user?.role !== 'MODERATOR') {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: {
        answer,
        status: 'ANSWERED'
      },
      include: {
        user: {
          select: {
            email: true
          }
        },
        files: true
      }
    })

    res.json(updatedQuestion)
  } catch (error) {
    console.error('Error answering question:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

export const questionRoutes = router 