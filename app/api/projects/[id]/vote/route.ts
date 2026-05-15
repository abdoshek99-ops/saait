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

    await prisma.project.update({
      where: { id: id },
      data: { votes: { increment: 1 } }
    })

    return NextResponse.json({ message: 'voted' })
  } catch (error) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}