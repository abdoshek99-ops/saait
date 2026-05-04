import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      name, email, password,
      age, gender, country, city, bio,
      university, major, degree, gradYear, currentStatus,
      company, jobTitle, experience,
      skills, github, facebook, instagram,
      interests, lookingFor,
    } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'missing required fields' }, { status: 400 })
    }

    if (password.length < 10) {
      return NextResponse.json({ error: 'password too short' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'email already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })

    await prisma.profile.create({
      data: {
        userId: user.id,
        age: age ? parseInt(age) : null,
        gender: gender || null,
        country: country || null,
        city: city || null,
        bio: bio || null,
        university: university || null,
        major: major || null,
        degree: degree || null,
        gradYear: gradYear ? parseInt(gradYear) : null,
        currentStatus: currentStatus || null,
        company: company || null,
        jobTitle: jobTitle || null,
        experience: experience ? parseInt(experience) : null,
        github: github || null,
        facebook: facebook || null,
        instagram: instagram || null,
        interests: interests || [],
        lookingFor: lookingFor || null,
      },
    })

    if (skills && skills.length > 0) {
      for (const skillName of skills) {
        const skill = await prisma.skill.upsert({
          where: { name: skillName },
          update: {},
          create: { name: skillName, category: 'general' },
        })
        await prisma.userSkill.create({
          data: { userId: user.id, skillId: skill.id },
        })
      }
    }

    return NextResponse.json(
      { message: 'user created', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

