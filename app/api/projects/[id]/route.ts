import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const project = await prisma.project.findUnique({
      where: { id: id },
      include: {
        owner: {
          select: {
            id: true, name: true,
            profile: { select: { avatar: true, jobTitle: true, country: true } }
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true, name: true,
                profile: { select: { avatar: true, jobTitle: true } }
              }
            }
          }
        },
        comments: {
          include: {
            post: false,
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: { select: { members: true, comments: true } }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const body = await req.json()
    const { title, description, field, codeUrl, demoUrl, progress, status } = body

    const project = await prisma.project.findUnique({
      where: { id: id }
    })

    if (!project || project.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const updated = await prisma.project.update({
      where: { id: id },
      data: {
        title, description, field,
        codeUrl: codeUrl || null,
        demoUrl: demoUrl || null,
        progress: progress ? parseInt(progress) : undefined,
        status,
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}