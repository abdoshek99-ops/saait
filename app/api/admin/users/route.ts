import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// âœ… Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ù€ Admin Cookie Ø¨Ø¯Ù„Ø§Ù‹ Ù…Ù† NextAuth
function isAdminAuthorized(req: NextRequest): boolean {
  const token = req.cookies.get('admin_token')?.value
  return token === 'Saait@2025#Secure' // Ù†ÙØ³ Ø§Ù„ÙƒÙ„Ù…Ø©
}

export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return NextResponse.json({ error: 'ØºÙŠØ± Ù…ØµØ±Ø­' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        points: true,
        banned: true,
        emailVerified: true,
        createdAt: true,
        profile: {
          select: {
            bio: true, country: true, city: true, gender: true,
            university: true, major: true, degree: true,
            company: true, jobTitle: true, experience: true,
            github: true, facebook: true, instagram: true,
            currentStatus: true, interests: true, lookingFor: true,
          }
        },
        _count: {
          select: {
            ownedProjects: true,
            posts: true,
            sentMessages: true,
          }
        }
      }
    })

    const formatted = users.map(u => ({
      ...u,
      ...u.profile,
      profile: undefined,
      _count: {
        projects: u._count.ownedProjects,
        posts:    u._count.posts,
        messages: u._count.sentMessages,
      }
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Admin users GET error:', error)
    return NextResponse.json({ error: 'Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ø®Ø§Ø¯Ù…' }, { status: 500 })
  }
}

