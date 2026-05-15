import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import CommunityPostClient from './CommunityPostClient'

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { include: { profile: true } },
        comments: { orderBy: { createdAt: 'asc' } },
        _count: { select: { comments: true } }
      }
    })

    if (!post) return notFound()

    await prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } }
    })

    return <CommunityPostClient post={JSON.parse(JSON.stringify(post))} />
  } catch (error) {
    console.error('Post page error:', error)
    return notFound()
  }
}
