import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const field = searchParams.get('field')
    const status = searchParams.get('status')

    const projects = await prisma.project.findMany({
      where: {
        isApproved: true,
        ...(field  && field  !== 'الكل' && { field }),
        ...(status && status !== 'الكل' && { status }),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            profile: { select: { avatar: true } },
          },
        },
        members: {
          include: {
            user: { select: { id: true, name: true, profile: { select: { avatar: true } } } },
          },
        },
        _count: { select: { members: true, comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('GET projects error:', error)
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, banned: true },
    })

    if (!user) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    if (user.banned) return NextResponse.json({ error: 'حسابك محظور' }, { status: 403 })

    const body = await req.json()
    const { title, description, field, codeUrl, demoUrl, imageUrl } = body

    if (!title || !description || !field) {
      return NextResponse.json({ error: 'العنوان والوصف والمجال مطلوبة' }, { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        field,
        codeUrl:    codeUrl    || null,
        demoUrl:    demoUrl    || null,
        imageUrl:   imageUrl   || null,
        ownerId:    user.id,
        isApproved: true,
        progress:   0,
        status:     'active',
      },
    })

    await prisma.projectMember.create({
      data: {
        userId:    user.id,
        projectId: project.id,
        role:      'owner',
      },
    })

    await prisma.user.update({
      where: { id: user.id },
      data:  { points: { increment: 10 } },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('POST project error:', error)
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
