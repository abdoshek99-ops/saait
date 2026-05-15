import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const existing = await prisma.projectMember.findFirst({
      where: { userId: session.user.id, projectId: id }
    })

    if (existing) {
      return NextResponse.json({ error: 'already member' }, { status: 400 })
    }

    await prisma.projectMember.create({
      data: { userId: session.user.id, projectId: id, role: 'member' }
    })

    await prisma.user.update({
      where: { id: session.user.id },
      data: { points: { increment: 5 } }
    })

    return NextResponse.json({ message: 'joined' })
  } catch (error) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}