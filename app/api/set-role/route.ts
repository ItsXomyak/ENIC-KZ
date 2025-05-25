import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request)
  
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { role } = await request.json()
    
    // Здесь должна быть логика установки роли
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error setting role:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 