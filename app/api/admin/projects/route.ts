import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'ØºÙŠØ± Ù…ØµØ±Ø­' }, { status: 403 })
    }

    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(projects)

  } catch (error) {
    console.error('PROJECTS ERROR:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

