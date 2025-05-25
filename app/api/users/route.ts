import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Получение списка пользователей
export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    // Только админы и модераторы могут просматривать список пользователей
    if (currentUser?.role !== "ADMIN" && currentUser?.role !== "MODERATOR") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    // Модераторы видят только обычных пользователей
    // Админы видят всех пользователей
    const users = await prisma.user.findMany({
      where: currentUser.role === "MODERATOR" ? { role: "USER" } : undefined,
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 