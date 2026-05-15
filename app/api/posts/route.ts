import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    const posts = await prisma.post.findMany({
      where: {
        ...(category && { category }),
      },
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
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, content, category, tags, imageUrl } = body

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        tags: tags || [],
        imageUrl: imageUrl || null,
        authorId: (session.user as any).id,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
