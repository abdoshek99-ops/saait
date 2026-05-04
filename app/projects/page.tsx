'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const FIELDS = ['الكل', 'الذكاء الاصطناعي', 'تعلم الآلة', 'الأمن السيبراني', 'البرمجة', 'تحليل البيانات', 'الروبوتيكس', 'الحوسبة السحابية']

export default function ProjectsPage() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<any[]>([])
  const [myProjects, setMyProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [field, setField] = useState('الكل')
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  const currentUserId = (session?.user as any)?.id
  const isAdmin = (session?.user as any)?.role === 'admin'

  useEffect(() => { fetchProjects() }, [field])
  useEffect(() => { if (session) fetchMyProjects() }, [session])

  const fetchProjects = async () => {
    setLoading(true)
    const q = field !== 'الكل' ? `?field=${encodeURIComponent(field)}` : ''
    const res = await fetch(`/api/projects${q}`)
    const data = await res.json()
    setProjects(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const fetchMyProjects = async () => {
    const res = await fetch('/api/projects?mine=true')
    const data = await res.json()
    setMyProjects(Array.isArray(data) ? data : [])
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return
    setDeleting(id)
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setProjects(p => p.filter(x => x.id !== id))
      setMyProjects(p => p.filter(x => x.id !== id))
    }
    setDeleting(null)
  }

  const displayedProjects = activeTab === 'mine' ? myProjects : projects

  const ProjectCard = ({ project }: { project: any }) => {
    const isOwner = project.ownerId === currentUserId || project.owner?.id === currentUserId
    const canDelete = isOwner || isAdmin

    return (
      <Link href={`/projects/${project.id}`}
        className="relative bg-[#0a0a16] border border-violet-900/15
                   rounded-3xl p-6 overflow-hidden group
                   transition-all duration-300
                   hover:scale-[1.02] hover:border-violet-500/40
                   hover:shadow-[0_0_25px_rgba(124,58,237,0.1)]
                   block">

        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-indigo-600/5
                        opacity-0 group-hover:opacity-100 transition duration-300" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <span className="bg-violet-900/20 text-violet-300 text-xs px-3 py-1
                           rounded-full border border-violet-700/20">
            {project.field}
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full border ${
              project.status === 'active'
                ? 'bg-emerald-900/20 text-emerald-400 border-emerald-700/20'
                : 'bg-gray-800/60 text-gray-500 border-gray-700/20'
            }`}>
              {project.status === 'active' ? '🟢 نشط' : '✅ مكتمل'}
            </span>
            {canDelete && (
              <button
                onClick={(e) => handleDelete(project.id, e)}
                disabled={deleting === project.id}
                className="w-7 h-7 flex items-center justify-center
                           bg-red-900/20 hover:bg-red-900/40 border border-red-700/30
                           rounded-lg text-xs transition
                           opacity-0 group-hover:opacity-100 z-20">
                {deleting === project.id ? '⏳' : '🗑️'}
              </button>
            )}
          </div>
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
            <div className="bg-gradient-to-r from-violet-600 to-indigo-500 h-1.5 rounded-full transition-all"
              style={{ width: `${project.progress}%` }} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700
                            flex items-center justify-center text-xs font-black text-white">
              {project.owner?.name?.charAt(0)}
            </div>
            <span className="text-gray-400 text-sm">{project.owner?.name}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 text-xs">
            <span>👥 {project._count?.members || 0}</span>
            <span>💬 {project._count?.comments || 0}</span>
            <span>⭐ {project.votes || 0}</span>
          </div>
        </div>

        {/* Edit Button للمالك */}
        {isOwner && (
          <div className="mt-4 pt-4 border-t border-violet-900/10 relative z-10
                          opacity-0 group-hover:opacity-100 transition">
            <Link href={`/projects/${project.id}/edit`}
              onClick={e => e.stopPropagation()}
              className="text-xs text-violet-400 hover:text-violet-300 transition flex items-center gap-1">
              ✏️ تعديل المشروع
            </Link>
          </div>
        )}
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white" dir="rtl"
      style={{ backgroundImage: `radial-gradient(ellipse at top right, rgba(124,58,237,0.07) 0%, transparent 60%)` }}>

      {/* Navbar */}
      <nav className="border-b border-violet-900/20 bg-[#08080f]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700
                            flex items-center justify-center font-black text-sm
                            shadow-[0_0_15px_rgba(124,58,237,0.3)]">⚡</div>
            <div className="hidden sm:block">
              <p className="font-black text-white text-sm tracking-widest">SAAIT</p>
              <p className="text-violet-400/60 text-xs">AI Platform</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {[
              { href: '/dashboard', label: 'الرئيسية' },
              { href: '/projects', label: 'المشاريع' },
              { href: '/events', label: 'الفعاليات' },
              { href: '/community', label: 'المجتمع' },
              { href: '/news', label: 'الأخبار' },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className={`relative px-4 py-2 rounded-lg text-sm transition ${
                  item.href === '/projects'
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white hover:bg-violet-900/20'
                }`}>
                {item.label}
                {item.href === '/projects' && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-0.5
                                   bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          <Link href="/projects/new"
            className="bg-gradient-to-r from-violet-600 to-indigo-600
                       hover:from-violet-500 hover:to-indigo-500
                       text-white text-sm font-bold px-5 py-2.5 rounded-xl
                       transition hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]">
            + نشر مشروع
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">المشاريع التقنية 🚀</h1>
          <p className="text-gray-500">اكتشف المشاريع وانضم إلى الفرق أو انشر مشروعك الخاص</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                : 'bg-[#0a0a16] text-gray-400 border border-violet-900/20 hover:border-violet-500/40'
            }`}>
            🌐 كل المشاريع
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'all' ? 'bg-white/20' : 'bg-gray-800'}`}>
              {projects.length}
            </span>
          </button>

          {session && (
            <button onClick={() => setActiveTab('mine')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'mine'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                  : 'bg-[#0a0a16] text-gray-400 border border-violet-900/20 hover:border-violet-500/40'
              }`}>
              🚀 مشاريعي
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'mine' ? 'bg-white/20' : 'bg-gray-800'}`}>
                {myProjects.length}
              </span>
            </button>
          )}
        </div>

        {/* Field Filter — فقط في كل المشاريع */}
        {activeTab === 'all' && (
          <div className="flex gap-2 flex-wrap mb-8">
            {FIELDS.map(f => (
              <button key={f} onClick={() => setField(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  field === f
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_10px_rgba(124,58,237,0.3)]'
                    : 'bg-[#0a0a16] text-gray-400 border border-violet-900/15 hover:border-violet-500/40 hover:text-white'
                }`}>
                {f}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {loading && activeTab === 'all' ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : displayedProjects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-white mb-2">
              {activeTab === 'mine' ? 'لم تنشر أي مشروع بعد' : 'لا توجد مشاريع بعد'}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'mine' ? 'انشر مشروعك الأول الآن!' : 'كن أول من ينشر مشروعاً تقنياً'}
            </p>
            <Link href="/projects/new"
              className="bg-gradient-to-r from-violet-600 to-indigo-600
                         text-white font-bold px-6 py-3 rounded-xl
                         hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition">
              + نشر مشروع جديد
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}