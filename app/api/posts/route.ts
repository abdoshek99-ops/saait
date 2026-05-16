import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    const posts = await prisma.post.findMany({
      where: { ...(category && { category }) },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profile: { select: { avatar: true, jobTitle: true } },
          },
        },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('GET posts error:', error)
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
    const { title, content, category, tags, imageUrl } = body

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'العنوان والمحتوى والتصنيف مطلوبة' }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        tags:     tags     || [],
        imageUrl: imageUrl || null,
        authorId: user.id,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('POST post error:', error)
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
