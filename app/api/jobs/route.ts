import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')

    const jobs = await prisma.job.findMany({
      where: { ...(type && { type }) },
      include: {
        postedBy: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('GET jobs error:', error)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول اولا' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user!.email! },
      select: { id: true, banned: true }
    })
    if (!user) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    if (user.banned) return NextResponse.json({ error: 'حسابك محظور' }, { status: 403 })

    const body = await req.json()
    const { title, company, description, location, type, salary, url, isRemote } = body

    if (!title || !company || !description) {
      return NextResponse.json({ error: 'العنوان والشركة والوصف مطلوبة' }, { status: 400 })
    }

    const job = await prisma.job.create({
      data: {
        title,
        company,
        description,
        location:   location || null,
        type:       type     || 'دوام كامل',
        salary:     salary   || null,
        url:        url      || null,
        isRemote:   isRemote || false,
        postedById: user.id,
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error('POST job error:', error)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
