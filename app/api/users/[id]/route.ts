import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'معرف المستخدم مطلوب' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        points: true,
        banned: true,
        createdAt: true,
        profile: true,
        skills: {
          include: {
            skill: { select: { name: true, category: true } },
          },
        },
        ownedProjects: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            description: true,
            field: true,
            status: true,
            progress: true,
            votes: true,
            imageUrl: true,
            createdAt: true,
            _count: { select: { members: true, comments: true } },
          },
        },
        badges: {
          include: { badge: true },
        },
        _count: {
          select: {
            ownedProjects: true,
            posts: true,
            sentMessages: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('GET user profile error:', error)
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
