'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function MyProjectsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const isAdmin = (session?.user as any)?.role === 'admin'

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') fetchMyProjects()
  }, [status])

  const fetchMyProjects = async () => {
    setLoading(true)
    const res = await fetch('/api/projects?mine=true')
    const data = await res.json()
    setProjects(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('هل أنت متأكد من حذف هذا المشروع نهائياً؟')) return
    setDeleting(id)
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    if (res.ok) setProjects(p => p.filter(x => x.id !== id))
    setDeleting(null)
  }

  if (status === 'loading' || loading) return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-violet-400 text-sm">جاري تحميل مشاريعك...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050508] text-white" dir="rtl"
      style={{ backgroundImage: `radial-gradient(ellipse at top right, rgba(124,58,237,0.07) 0%, transparent 60%)` }}>

      {/* Navbar */}
      <nav className="border-b border-violet-900/20 bg-[#08080f]/90 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700
                            flex items-center justify-center font-black text-sm
                            shadow-[0_0_15px_rgba(124,58,237,0.3)]">⚡</div>
            <span className="font-black text-white tracking-widest hidden sm:block">SAAIT</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/projects"
              className="text-gray-400 hover:text-white text-sm transition">
              كل المشاريع
            </Link>
            <Link href="/projects/new"
              className="bg-gradient-to-r from-violet-600 to-indigo-600
                         hover:from-violet-500 hover:to-indigo-500
                         text-white text-sm font-bold px-4 py-2 rounded-xl transition
                         hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              + مشروع جديد
            </Link>
            <Link href="/dashboard"
              className="text-gray-400 hover:text-white text-sm transition">
              ← لوحة التحكم
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white mb-1 flex items-center gap-3">
              <span className="text-3xl">🚀</span> مشاريعي
            </h1>
            <p className="text-gray-500 text-sm">
              المشاريع التي أنشأتها —
              <span className="text-violet-400 font-bold mr-1">{projects.length}</span>
              مشروع
            </p>
          </div>
          <Link href="/projects/new"
            className="bg-gradient-to-r from-violet-600 to-indigo-600
                       hover:from-violet-500 hover:to-indigo-500
                       text-white font-bold px-6 py-3 rounded-xl transition
                       hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]
                       flex items-center gap-2">
            + نشر مشروع جديد
          </Link>
        </div>

        {/* Empty State */}
        {projects.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-violet-600/10 border-2 border-violet-500/20
                            rounded-3xl flex items-center justify-center text-5xl
                            mx-auto mb-6">🚀</div>
            <h3 className="text-2xl font-black text-white mb-3">لم تنشر أي مشروع بعد</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              شارك مشروعك التقني مع مجتمع SAAIT وابحث عن زملاء للفريق
            </p>
            <Link href="/projects/new"
              className="bg-gradient-to-r from-violet-600 to-indigo-600
                         text-white font-bold px-8 py-4 rounded-2xl
                         hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] transition">
              🚀 انشر مشروعك الأول
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div key={project.id} className="relative group">
                <Link href={`/projects/${project.id}`}
                  className="block bg-[#0a0a16] border border-violet-900/15
                             hover:border-violet-500/40 rounded-3xl p-6 overflow-hidden
                             transition-all duration-300
                             hover:shadow-[0_0_25px_rgba(124,58,237,0.1)]">

                  {/* Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-indigo-600/5
                                  opacity-0 group-hover:opacity-100 transition duration-300 rounded-3xl" />

                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <span className="bg-violet-900/20 text-violet-300 text-xs px-3 py-1
                                     rounded-full border border-violet-700/20">
                      {project.field}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${
                      project.status === 'active'
                        ? 'bg-emerald-900/20 text-emerald-400 border-emerald-700/20'
                        : 'bg-gray-800/60 text-gray-500 border-gray-700/20'
                    }`}>
                      {project.status === 'active' ? '🟢 نشط' : '✅ مكتمل'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-black text-lg mb-2 relative z-10
                                  group-hover:text-violet-400 transition">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 text-sm mb-4 relative z-10 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Progress */}
                  <div className="mb-4 relative z-10">
                    <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                      <span>التقدم</span>
                      <span className="text-violet-400 font-bold">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-800/80 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-violet-600 to-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3 text-gray-600 text-xs">
                      <span>👥 {project._count?.members || 0} عضو</span>
                      <span>💬 {project._count?.comments || 0} تعليق</span>
                      <span>⭐ {project.votes || 0}</span>
                    </div>
                    <span className="text-gray-700 text-xs">
                      {new Date(project.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </Link>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                  <Link href={`/projects/${project.id}/edit`}
                    className="flex-1 py-2.5 text-center text-sm font-medium
                               bg-violet-600/10 hover:bg-violet-600/20
                               border border-violet-500/20 hover:border-violet-500/40
                               text-violet-400 rounded-xl transition">
                    ✏️ تعديل
                  </Link>
                  <Link href={`/projects/${project.id}`}
                    className="flex-1 py-2.5 text-center text-sm font-medium
                               bg-[#0a0a16] hover:bg-violet-900/10
                               border border-violet-900/20 hover:border-violet-500/30
                               text-gray-400 hover:text-white rounded-xl transition">
                    👁️ عرض
                  </Link>
                  <button
                    onClick={(e) => handleDelete(project.id, e)}
                    disabled={deleting === project.id}
                    className="px-4 py-2.5 text-sm font-medium
                               bg-red-900/10 hover:bg-red-900/30
                               border border-red-700/20 hover:border-red-500/40
                               text-red-400 rounded-xl transition disabled:opacity-50">
                    {deleting === project.id ? '⏳' : '🗑️'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}