import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json({ projects: [], users: [], articles: [], courses: [], jobs: [] })
    }

    const [projects, users, articles, courses, jobs] = await Promise.all([
      prisma.project.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { field: { contains: query, mode: 'insensitive' } },
          ],
          isApproved: true,
        },
        include: {
          owner: { select: { name: true } },
        },
        take: 5,
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { profile: { jobTitle: { contains: query, mode: 'insensitive' } } },
            { profile: { major: { contains: query, mode: 'insensitive' } } },
          ],
        },
        select: {
          id: true, name: true,
          profile: { select: { jobTitle: true, country: true, avatar: true } },
        },
        take: 5,
      }),
      prisma.article.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
      prisma.course.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
      prisma.job.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { company: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
    ])

    return NextResponse.json({ projects, users, articles, courses, jobs })
  } catch (error) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

