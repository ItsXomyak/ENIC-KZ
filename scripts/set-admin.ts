import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setAdmin(email: string) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    })
    console.log(`Пользователь ${email} успешно получил роль администратора`)
    return user
  } catch (error) {
    console.error('Ошибка при установке роли администратора:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Проверяем, что email передан как аргумент
const email = process.argv[2]
if (!email) {
  console.error('Пожалуйста, укажите email пользователя')
  process.exit(1)
}

setAdmin(email)
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 