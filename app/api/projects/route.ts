import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const field  = searchParams.get('field')
    const status = searchParams.get('status')
    const mine   = searchParams.get('mine')

    // âœ… Ø¥Ø°Ø§ Ø·Ù„Ø¨ Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… Ù…Ø´Ø§Ø±ÙŠØ¹Ù‡ ÙÙ‚Ø·
    let currentUserId: string | null = null
    if (mine === 'true') {
      const session = await getServerSession(authOptions)
      if (session?.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true }
        })
        currentUserId = user?.id || null
      }
    }

    const projects = await prisma.project.findMany({
      where: {
        ...(field  && { field }),
        ...(status && { status }),
        ...(mine === 'true' && currentUserId && { ownerId: currentUserId }),
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
            user: {
              select: {
                id: true,
                name: true,
                profile: { select: { avatar: true } },
              },
            },
          },
        },
        _count: { select: { members: true, comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('GET projects error:', error)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'ÙŠØ¬Ø¨ ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø£ÙˆÙ„Ø§Ù‹' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, banned: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯' }, { status: 404 })
    }

    if (user.banned) {
      return NextResponse.json({ error: 'Ø­Ø³Ø§Ø¨Ùƒ Ù…Ø­Ø¸ÙˆØ±' }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, field, codeUrl, demoUrl } = body

    if (!title || !description || !field) {
      return NextResponse.json({ error: 'Ø§Ù„Ø¹Ù†ÙˆØ§Ù† ÙˆØ§Ù„ÙˆØµÙ ÙˆØ§Ù„Ù…Ø¬Ø§Ù„ Ù…Ø·Ù„ÙˆØ¨Ø©' }, { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        field,
        codeUrl:    codeUrl    || null,
        demoUrl:    demoUrl    || null,
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
    return NextResponse.json({ error: 'Ø­Ø¯Ø« Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ø®Ø§Ø¯Ù…' }, { status: 500 })
  }
}

