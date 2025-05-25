import { currentUser } from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Получаем пользователя из базы данных
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Обновляем метаданные в Clerk
    await (await clerkClient()).users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: dbUser.role
      }
    })

    return NextResponse.json({ role: dbUser.role })
  } catch (error) {
    console.error('Error syncing role:', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 