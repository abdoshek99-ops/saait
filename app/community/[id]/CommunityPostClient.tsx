'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function CommunityPostClient({ post }: { post: any }) {
  const { data: session } = useSession()
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState(post.comments || [])
  const [submitting, setSubmitting] = useState(false)
  const [likes, setLikes] = useState(post.likes || 0)
  const [liked, setLiked] = useState(false)

  const formatDate = (date: string) => new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  const handleComment = async () => {
    if (!comment.trim() || !session) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: comment }),
      })
      if (res.ok) {
        const newComment = await res.json()
        setComments((p: any[]) => [...p, newComment])
        setComment('')
      }
    } catch {}
    setSubmitting(false)
  }

  const handleLike = async () => {
    if (!session || liked) return
    setLiked(true)
    setLikes((p: number) => p + 1)
    await fetch(`/api/posts/${post.id}/like`, { method: 'POST' }).catch(() => {})
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white" dir="rtl"
      style={{ backgroundImage: `radial-gradient(ellipse at top, rgba(124,58,237,0.05) 0%, transparent 60%)` }}>

      <nav className="border-b border-purple-900/40 bg-[#080810]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold text-sm">S</div>
            <span className="font-bold text-white hidden sm:block">SAAIT</span>
          </Link>
          <Link href="/community" className="text-gray-400 hover:text-white transition text-sm">
            ← العودة للمجتمع
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="bg-[#0a0a12] border border-purple-900/20 rounded-3xl p-7 mb-6 shadow-[0_0_40px_rgba(124,58,237,0.05)]">
          <div className="h-0.5 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 -mt-7 mb-7 -mx-7 rounded-t-3xl"></div>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center font-bold text-lg overflow-hidden flex-shrink-0">
              {post.author?.image
                ? <img src={post.author.image} alt={post.author.name} className="w-12 h-12 object-cover" />
                : post.author?.name?.charAt(0)
              }
            </div>
            <div>
              <Link href={`/profile/${post.author?.id}`} className="text-white font-bold hover:text-purple-400 transition">
                {post.author?.name}
              </Link>
              {post.author?.profile?.jobTitle && (
                <p className="text-purple-400 text-xs">{post.author.profile.jobTitle}</p>
              )}
              <p className="text-gray-600 text-xs">{formatDate(post.createdAt)}</p>
            </div>
            <span className="mr-auto bg-purple-900/30 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-700/30">
              {post.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white mb-5 leading-relaxed">
            {post.title}
          </h1>

          {post.image && (
            <div className="mb-6 rounded-2xl overflow-hidden border border-purple-900/20">
              <img src={post.image} alt={post.title} className="w-full max-h-96 object-cover" />
            </div>
          )}

          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-base mb-6">
            {post.content}
          </div>

          <div className="flex items-center gap-4 pt-5 border-t border-purple-900/20">
            <button onClick={handleLike} disabled={liked || !session}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                liked
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-900/20 text-gray-400 hover:text-white hover:bg-purple-900/40 border border-purple-900/30'
              } disabled:cursor-not-allowed`}>
              👍 {likes}
            </button>
            <span className="flex items-center gap-1 text-gray-500 text-sm">💬 {comments.length} تعليق</span>
            <span className="flex items-center gap-1 text-gray-500 text-sm">👁 {post.views || 0} مشاهدة</span>
          </div>
        </div>

        <div className="bg-[#0a0a12] border border-purple-900/20 rounded-3xl p-7 shadow-[0_0_40px_rgba(124,58,237,0.03)]">
          <h2 className="text-xl font-black text-white mb-6">💬 التعليقات ({comments.length})</h2>

          {session ? (
            <div className="mb-6">
              <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
                className="w-full bg-[#13131f] text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none resize-none placeholder-gray-600 text-sm mb-3"
                placeholder="اكتب تعليقك هنا..." />
              <button onClick={handleComment} disabled={submitting || !comment.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm">
                {submitting ? 'جاري الإرسال...' : '💬 إرسال التعليق'}
              </button>
            </div>
          ) : (
            <div className="bg-purple-900/10 border border-purple-900/30 rounded-xl p-4 mb-6 text-center">
              <p className="text-gray-400 text-sm">
                <Link href="/login" className="text-purple-400 hover:text-purple-300 transition">سجّل دخول</Link> للمشاركة في النقاش
              </p>
            </div>
          )}

          {comments.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-gray-600 text-sm">لا توجد تعليقات بعد — كن أول من يعلّق!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((c: any) => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-800 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    💬
                  </div>
                  <div className="flex-1 bg-[#13131f] rounded-2xl px-4 py-3 border border-gray-800/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-purple-300 text-sm font-semibold">عضو</span>
                      <span className="text-gray-600 text-xs">{formatDate(c.createdAt)}</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}