import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Получаем заголовки для верификации вебхука
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Если нет необходимых заголовков, возвращаем ошибку
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Получаем тело запроса
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Создаем экземпляр Webhook для верификации
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '')

  let evt: WebhookEvent

  // Верифицируем вебхук
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse('Error occured', {
      status: 400
    })
  }

  // Обрабатываем различные события
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, public_metadata } = evt.data;
    const email = email_addresses[0]?.email_address;

    if (email) {
      await prisma.user.create({
        data: {
          id,
          email,
          role: (public_metadata.role as string)?.toUpperCase() || 'USER',
          status: 'ACTIVE'
        }
      })
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, public_metadata } = evt.data;
    const email = email_addresses[0]?.email_address;

    if (email) {
      await prisma.user.update({
        where: { id },
        data: {
          email,
          role: (public_metadata.role as string)?.toUpperCase() || 'USER'
        }
      })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;
    await prisma.user.delete({
      where: { id }
    })
  }

  return new NextResponse('', { status: 200 })
} 