import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    const tools = await prisma.aITool.findMany({
      where: {
        ...(category && category !== 'الكل' && { category }),
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(tools)
  } catch (error) {
    console.error('GET ai-tools error:', error)
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
    const { name, description, category, url, imageUrl, isFree, pricing } = body

    if (!name || !description || !url) {
      return NextResponse.json({ error: 'الاسم والوصف والرابط مطلوبة' }, { status: 400 })
    }

    const tool = await prisma.aITool.create({
      data: {
        name,
        description,
        category:  category  || 'عام',
        url,
        imageUrl:  imageUrl  || null,
        isFree:    isFree    ?? true,
        pricing:   pricing   || null,
      },
    })

    return NextResponse.json(tool, { status: 201 })
  } catch (error) {
    console.error('POST ai-tool error:', error)
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
