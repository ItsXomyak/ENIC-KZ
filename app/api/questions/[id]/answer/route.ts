import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth()
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    // Только админы и модераторы могут отвечать на вопросы
    if (user?.role !== "ADMIN" && user?.role !== "MODERATOR") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const { answer } = await request.json()
    const questionId = params.id

    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: {
        answer,
        status: "ANSWERED"
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    })

    return NextResponse.json(updatedQuestion)
  } catch (error) {
    console.error("Error answering question:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 