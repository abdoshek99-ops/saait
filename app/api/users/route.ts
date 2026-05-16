import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const skill   = searchParams.get('skill')
    const country = searchParams.get('country')
    const status  = searchParams.get('status')

    const users = await prisma.user.findMany({
      where: {
        banned: false,
        ...(country && { profile: { country } }),
        ...(status  && { profile: { currentStatus: status } }),
        ...(skill   && {
          skills: { some: { skill: { name: { contains: skill, mode: 'insensitive' } } } },
        }),
      },
      select: {
        id: true,
        name: true,
        points: true,
        createdAt: true,
        profile: {
          select: {
            avatar: true,
            jobTitle: true,
            country: true,
            city: true,
            currentStatus: true,
            university: true,
            bio: true,
          },
        },
        skills: {
          include: { skill: true },
          take: 4,
        },
        _count: {
          select: { ownedProjects: true, posts: true },
        },
      },
      orderBy: { points: 'desc' },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('GET users error:', error)
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
