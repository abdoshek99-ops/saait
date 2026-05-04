import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const { content } = await req.json()
    if (!content) return NextResponse.json({ error: 'missing content' }, { status: 400 })

    const comment = await prisma.comment.create({
      data: { content, projectId: params.id }
    })

    await prisma.user.update({
      where: { id: session.user.id },
      data: { points: { increment: 2 } }
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}