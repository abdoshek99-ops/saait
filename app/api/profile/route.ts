import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        skills: { include: { skill: true } },
        badges: { include: { badge: true } },
        _count: { select: { ownedProjects: true, posts: true, events: true } },
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const body = await req.json()
    const {
      name, bio, age, gender, country, city,
      university, major, degree, gradYear, currentStatus,
      company, jobTitle, experience,
      github, linkedin, website,
      skills, interests, lookingFor,
    } = body

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    })

    await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        bio, age: age ? parseInt(age) : null,
        gender, country, city,
        university, major, degree,
        gradYear: gradYear ? parseInt(gradYear) : null,
        currentStatus, company, jobTitle,
        experience: experience ? parseInt(experience) : null,
        github, linkedin, website,
        interests: interests || [],
        lookingFor,
      },
      create: {
        userId: session.user.id,
        bio, age: age ? parseInt(age) : null,
        gender, country, city,
        university, major, degree,
        gradYear: gradYear ? parseInt(gradYear) : null,
        currentStatus, company, jobTitle,
        experience: experience ? parseInt(experience) : null,
        github, linkedin, website,
        interests: interests || [],
        lookingFor,
      },
    })

    if (skills && skills.length > 0) {
      await prisma.userSkill.deleteMany({ where: { userId: session.user.id } })
      for (const skillName of skills) {
        const skill = await prisma.skill.upsert({
          where: { name: skillName },
          update: {},
          create: { name: skillName, category: 'general' },
        })
        await prisma.userSkill.create({
          data: { userId: session.user.id, skillId: skill.id },
        })
      }
    }

    return NextResponse.json({ message: 'updated' })
  } catch (error) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

