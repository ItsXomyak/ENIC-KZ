import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { password } = await request.json()

    let role = "user"
    if (password === "admin123") {
      role = "admin"
    } else if (password === "moderator123") {
      role = "moderator"
    } else {
      return new NextResponse("Invalid password", { status: 400 })
    }

    // В реальном приложении здесь должна быть проверка пароля через безопасное хранилище
    // и установка роли через API Clerk или вашу базу данных

    return NextResponse.json({ role })
  } catch (error) {
    console.error("Error setting role:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 