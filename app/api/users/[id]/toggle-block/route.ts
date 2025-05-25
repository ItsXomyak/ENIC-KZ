import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request)
  
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { blocked } = await request.json()
    
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    // Только админы и модераторы могут блокировать пользователей
    if (currentUser?.role !== "ADMIN" && currentUser?.role !== "MODERATOR") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: { role: true, status: true }
    })

    if (!targetUser) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Модераторы могут блокировать только обычных пользователей
    if (currentUser.role === "MODERATOR" && targetUser.role !== "USER") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    // Админы не могут блокировать других админов
    if (currentUser.role === "ADMIN" && targetUser.role === "ADMIN") {
      return new NextResponse("Cannot block admin users", { status: 403 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        status: targetUser.status === "ACTIVE" ? "BLOCKED" : "ACTIVE"
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error toggling block status:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 