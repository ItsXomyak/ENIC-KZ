import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Получение списка вопросов
export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    // Если пользователь админ или модератор - возвращаем все вопросы
    // Иначе возвращаем только вопросы пользователя
    const questions = await prisma.question.findMany({
      where: user?.role === "USER" ? { userId } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error("Error fetching questions:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

// Создание нового вопроса
export async function POST(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { question } = await request.json()

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

    return NextResponse.json(newQuestion)
  } catch (error) {
    console.error("Error creating question:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 