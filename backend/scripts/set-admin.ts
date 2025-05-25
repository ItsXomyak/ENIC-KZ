import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

// Загружаем переменные окружения
config()

const prisma = new PrismaClient()

async function setAdmin(userId: string) {
  try {
    // Проверяем существует ли пользователь
    let user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      console.error('Пользователь не найден. Сначала войдите в систему через веб-интерфейс.')
      process.exit(1)
    }

    // Обновляем роль пользователя
    user = await prisma.user.update({
      where: { id: userId },
      data: { role: 'ADMIN' }
    })

    console.log(`Пользователь ${user.email} успешно получил роль администратора`)
    return user
  } catch (error) {
    console.error('Ошибка при установке роли администратора:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Проверяем, что ID пользователя передан как аргумент
const userId = process.argv[2]
if (!userId) {
  console.error('Пожалуйста, укажите ID пользователя из Clerk')
  process.exit(1)
}

setAdmin(userId)
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 