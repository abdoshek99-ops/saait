import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import CommunityPostClient from './CommunityPostClient'

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: {
        include: { profile: true }
      },
      comments: {
        include: { author: true }, // ✅ الآن يشتغل
        orderBy: { createdAt: 'asc' }
      },
      _count: { select: { comments: true } }
    }
  })

  if (!post) return notFound()

  await prisma.post.update({
    where: { id: params.id },
    data: { views: { increment: 1 } }
  })

  return <CommunityPostClient post={JSON.parse(JSON.stringify(post))} />
}