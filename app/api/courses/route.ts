import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    const courses = await prisma.course.findMany({
      where: { ...(category && { category }) },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(courses)
  } catch (error) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, category, url, imageUrl, instructor, duration, level, isFree } = body

    if (!title || !description || !url) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 })
    }

    const course = await prisma.course.create({
      data: { title, description, category, url, imageUrl, instructor, duration, level, isFree },
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

