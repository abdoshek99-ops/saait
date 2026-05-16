import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    const services = await prisma.service.findMany({
      where: {
        ...(category && category !== 'الكل' && { category }),
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            profile: { select: { avatar: true, jobTitle: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('GET services error:', error)
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user!.email! },
      select: { id: true, banned: true },
    })

    if (!user) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    if (user.banned) return NextResponse.json({ error: 'حسابك محظور' }, { status: 403 })

    const body = await req.json()
    const { title, description, category, price, deliveryTime, contactInfo } = body

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'العنوان والوصف والتصنيف مطلوبة' }, { status: 400 })
    }

    const service = await prisma.service.create({
      data: {
        title,
        description,
        category,
        price:        price        || null,
        deliveryTime: deliveryTime || null,
        contactInfo:  contactInfo  || null,
        providerId:   user.id,
      },
      include: {
        provider: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('POST service error:', error)
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
