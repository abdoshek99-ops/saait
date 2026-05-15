import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }
    const project = await prisma.project.findUnique({ where: { id: id } })
    if (!project) return NextResponse.json({ error: 'المشروع غير موجود' }, { status: 404 })

    await prisma.$transaction([
      prisma.projectMember.deleteMany({ where: { projectId: id } }),
      prisma.comment.deleteMany({ where: { projectId: id } }),
      prisma.project.delete({ where: { id: id } }),
    ])

    return NextResponse.json({ success: true, message: 'تم حذف المشروع' })
  } catch (error) {
    console.error('Admin project DELETE error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }
    const body = await req.json()
    const project = await prisma.project.update({
      where: { id: id },
      data: {
        ...(body.title    !== undefined && { title: body.title }),
        ...(body.status   !== undefined && { status: body.status }),
        ...(body.progress !== undefined && { progress: body.progress }),
      }
    })
    return NextResponse.json({ success: true, project })
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}