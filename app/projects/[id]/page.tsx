'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { data: session } = useSession()
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [voting, setVoting] = useState(false)
  const [comment, setComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { href: '/dashboard', icon: '🏠', label: 'الرئيسية' },
    { href: '/projects', icon: '🚀', label: 'المشاريع' },
    { href: '/events', icon: '📅', label: 'الفعاليات' },
    { href: '/community', icon: '💬', label: 'المجتمع' },
    { href: '/news', icon: '📰', label: 'الأخبار' },
    { href: '/courses', icon: '🎓', label: 'التعليم' },
    { href: '/ai-tools', icon: '🤖', label: 'أدوات AI' },
    { href: '/jobs', icon: '💼', label: 'فرص العمل' },
    { href: '/ai-chat', icon: '✨', label: 'دردشة AI' },
  ]

  useEffect(() => { fetchProject() }, [id])

  const fetchProject = async () => {
    setLoading(true)
    const res = await fetch(`/api/projects/${id}`)
    const data = await res.json()
    setProject(data)
    setLoading(false)
  }

  const handleJoin = async () => {
    if (!session) { router.push('/login'); return }
    setJoining(true)
    await fetch(`/api/projects/${id}/join`, { method: 'POST' })
    await fetchProject()
    setJoining(false)
  }

  const handleVote = async () => {
    if (!session) { router.push('/login'); return }
    setVoting(true)
    await fetch(`/api/projects/${id}/vote`, { method: 'POST' })
    await fetchProject()
    setVoting(false)
  }

  const handleComment = async () => {
    if (!comment.trim() || !session) return
    setSubmittingComment(true)
    await fetch(`/api/projects/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: comment }),
    })
    setComment('')
    await fetchProject()
    setSubmittingComment(false)
  }

  const isOwner = session?.user?.id === project?.ownerId
  const isMember = project?.members?.some((m: any) => m.userId === session?.user?.id)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!project || project.error) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">المشروع غير موجود</h2>
          <Link href="/projects" className="text-purple-400 hover:underline">العودة للمشاريع</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white" dir="rtl">

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-0 right-0 h-full w-72 bg-[#0a0a12] border-l border-purple-900/30 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center font-bold">S</div>
              <span className="font-bold text-white">SAAIT</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white text-2xl">✕</button>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item, i) => (
              <Link key={i} href={item.href} onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-purple-900/20 transition">
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <nav className="border-b border-purple-900/40 bg-[#080810] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="w-10 h-10 bg-[#13131f] hover:bg-[#1a1a2e] rounded-xl flex flex-col items-center justify-center gap-1.5 transition lg:hidden">
              <span className="w-5 h-0.5 bg-gray-400" />
              <span className="w-5 h-0.5 bg-gray-400" />
              <span className="w-5 h-0.5 bg-gray-400" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center font-bold">S</div>
              <span className="font-bold text-white hidden sm:block">SAAIT</span>
            </Link>
          </div>
          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item, i) => (
              <Link key={i} href={item.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-purple-900/20 transition text-sm">
                <span>{item.icon}</span><span>{item.label}</span>
              </Link>
            ))}
          </div>
          <Link href="/projects" className="text-gray-400 hover:text-white transition text-sm">
            ← المشاريع
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Project Header */}
            <div className="bg-[#0a0a12] border border-gray-800/80 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-purple-900/30 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-700/30">
                      {project.field}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                      {project.status === 'active' ? 'نشط' : 'مكتمل'}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">{project.title}</h1>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleVote} disabled={voting}
                    className="flex items-center gap-1 bg-[#13131f] hover:bg-yellow-900/20 border border-gray-700 hover:border-yellow-700/50 text-gray-400 hover:text-yellow-400 px-3 py-2 rounded-xl transition text-sm">
                    ⭐ {project.votes}
                  </button>
                </div>
              </div>

              <p className="text-gray-400 leading-relaxed mb-6">{project.description}</p>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">تقدم المشروع</span>
                  <span className="text-purple-400 font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }} />
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-3">
                {project.codeUrl && (
                  <a href={project.codeUrl} target="_blank"
                    className="flex items-center gap-2 bg-[#13131f] hover:bg-gray-800 border border-gray-700 text-gray-400 hover:text-white px-4 py-2 rounded-xl transition text-sm">
                    💻 GitHub
                  </a>
                )}
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank"
                    className="flex items-center gap-2 bg-purple-900/20 hover:bg-purple-900/30 border border-purple-700/30 text-purple-400 px-4 py-2 rounded-xl transition text-sm">
                    🌐 العرض التجريبي
                  </a>
                )}
              </div>
            </div>

            {/* Comments */}
            <div className="bg-[#0a0a12] border border-gray-800/80 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">التعليقات ({project._count?.comments || 0})</h3>

              {session && (
                <div className="flex gap-3 mb-6">
                  <div className="w-9 h-9 rounded-full bg-purple-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {session.user?.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      rows={2}
                      className="w-full bg-[#13131f] text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none resize-none text-sm"
                      placeholder="اكتب تعليقك..."
                    />
                    <button onClick={handleComment} disabled={submittingComment || !comment.trim()}
                      className="mt-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition">
                      {submittingComment ? 'جاري الإرسال...' : 'إرسال'}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {project.comments?.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">
                    <p>لا توجد تعليقات بعد — كن أول من يعلّق!</p>
                  </div>
                ) : (
                  project.comments?.map((c: any) => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-800 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        ?
                      </div>
                      <div className="flex-1 bg-[#13131f] rounded-xl p-4">
                        <p className="text-gray-300 text-sm">{c.content}</p>
                        <p className="text-gray-600 text-xs mt-2">
                          {new Date(c.createdAt).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Owner */}
            <div className="bg-[#0a0a12] border border-gray-800/80 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">صاحب المشروع</h3>
              <Link href={`/profile/${project.owner?.id}`} className="flex items-center gap-3 hover:bg-[#13131f] rounded-xl p-2 transition">
                <div className="w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center text-lg font-bold">
                  {project.owner?.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium">{project.owner?.name}</p>
                  {project.owner?.profile?.jobTitle && (
                    <p className="text-gray-500 text-sm">{project.owner.profile.jobTitle}</p>
                  )}
                  {project.owner?.profile?.country && (
                    <p className="text-gray-600 text-xs">📍 {project.owner.profile.country}</p>
                  )}
                </div>
              </Link>
            </div>

            {/* Members */}
            <div className="bg-[#0a0a12] border border-gray-800/80 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">
                أعضاء الفريق ({project._count?.members || 0})
              </h3>
              <div className="space-y-3 mb-4">
                {project.members?.map((member: any) => (
                  <Link key={member.userId} href={`/profile/${member.userId}`}
                    className="flex items-center gap-3 hover:bg-[#13131f] rounded-xl p-2 transition">
                    <div className="w-9 h-9 rounded-full bg-purple-800 flex items-center justify-center text-sm font-bold">
                      {member.user?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{member.user?.name}</p>
                      <p className="text-gray-500 text-xs">{member.role === 'owner' ? 'المالك' : 'عضو'}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {!isMember && !isOwner && session && (
                <button onClick={handleJoin} disabled={joining}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl transition text-sm">
                  {joining ? 'جاري الانضمام...' : '+ انضم للفريق'}
                </button>
              )}

              {isMember && !isOwner && (
                <div className="bg-green-900/20 border border-green-700/30 text-green-400 text-sm text-center py-2 rounded-xl">
                  ✓ أنت عضو في هذا المشروع
                </div>
              )}

              {!session && (
                <Link href="/login"
                  className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-xl transition text-sm text-center">
                  سجل دخول للانضمام
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="bg-[#0a0a12] border border-gray-800/80 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">إحصائيات</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">الأعضاء</span>
                  <span className="text-white font-medium">👥 {project._count?.members}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">التعليقات</span>
                  <span className="text-white font-medium">💬 {project._count?.comments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">التصويتات</span>
                  <span className="text-white font-medium">⭐ {project.votes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">تاريخ الإنشاء</span>
                  <span className="text-white text-sm">
                    {new Date(project.createdAt).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit - Owner Only */}
            {isOwner && (
              <Link href={`/projects/${id}/edit`}
                className="block w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-2.5 rounded-xl transition text-sm text-center">
                ✏️ تعديل المشروع
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}