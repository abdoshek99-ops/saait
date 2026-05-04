'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const SKILLS = ['الكل', 'Python', 'JavaScript', 'Machine Learning', 'Deep Learning', 'Cyber Security', 'Data Science', 'React', 'Node.js', 'TensorFlow']
const COUNTRIES = ['الكل', 'سوريا', 'مصر', 'السعودية', 'الإمارات', 'الأردن', 'لبنان', 'العراق', 'تونس', 'المغرب']
const STATUSES = ['الكل', 'student', 'graduate', 'employed', 'freelancer', 'researcher']
const STATUS_LABELS: any = { student: 'طالب', graduate: 'خريج', employed: 'موظف', freelancer: 'مستقل', researcher: 'باحث' }

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [skill, setSkill] = useState('الكل')
  const [country, setCountry] = useState('الكل')
  const [status, setStatus] = useState('الكل')
  const [search, setSearch] = useState('')
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
    { href: '/members', icon: '👥', label: 'الأعضاء' },
    { href: '/ai-chat', icon: '✨', label: 'دردشة AI' },
  ]

  useEffect(() => { fetchMembers() }, [skill, country, status])

  const fetchMembers = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (skill !== 'الكل') params.set('skill', skill)
    if (country !== 'الكل') params.set('country', country)
    if (status !== 'الكل') params.set('status', status)
    const res = await fetch(`/api/users?${params}`)
    const data = await res.json()
    setMembers(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.profile?.jobTitle?.toLowerCase().includes(search.toLowerCase())
  )

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
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-1">👥 أعضاء المنصة</h1>
          <p className="text-gray-500">تواصل مع المطورين والباحثين السوريين</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-[#0a0a12] border border-gray-800/80 rounded-2xl p-4 mb-6">
          <div className="relative mb-4">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#13131f] text-white rounded-xl pr-10 pl-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none text-sm"
              placeholder="ابحث بالاسم أو المسمى الوظيفي..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-500 text-xs mb-1">المهارة</label>
              <select value={skill} onChange={e => setSkill(e.target.value)}
                className="w-full bg-[#13131f] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-purple-500 focus:outline-none text-sm">
                {SKILLS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-500 text-xs mb-1">الدولة</label>
              <select value={country} onChange={e => setCountry(e.target.value)}
                className="w-full bg-[#13131f] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-purple-500 focus:outline-none text-sm">
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-500 text-xs mb-1">الحالة</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="w-full bg-[#13131f] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-purple-500 focus:outline-none text-sm">
                {STATUSES.map(s => <option key={s} value={s}>{s === 'الكل' ? 'الكل' : STATUS_LABELS[s]}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="text-gray-500 text-sm mb-4">{filtered.length} عضو</p>
        )}

        {/* Members Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-white mb-2">لا توجد نتائج</h3>
            <p className="text-gray-600">جرب تغيير الفلاتر</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((member: any) => (
              <Link key={member.id} href={`/profile/${member.id}`}
                className="bg-[#0a0a12] border border-gray-800/80 hover:border-purple-700/50 rounded-2xl p-5 transition group">

                {/* Avatar & Name */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {member.name?.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-white font-semibold truncate group-hover:text-purple-400 transition">{member.name}</p>
                    {member.profile?.jobTitle && (
                      <p className="text-purple-400 text-xs truncate">{member.profile.jobTitle}</p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {member.profile?.bio && (
                  <p className="text-gray-500 text-xs line-clamp-2 mb-3">{member.profile.bio}</p>
                )}

                {/* Info */}
                <div className="space-y-1 mb-3">
                  {member.profile?.country && (
                    <p className="text-gray-600 text-xs flex items-center gap-1">
                      📍 {member.profile.country}{member.profile?.city && `, ${member.profile.city}`}
                    </p>
                  )}
                  {member.profile?.currentStatus && (
                    <p className="text-gray-600 text-xs flex items-center gap-1">
                      💼 {STATUS_LABELS[member.profile.currentStatus] || member.profile.currentStatus}
                    </p>
                  )}
                  {member.profile?.university && (
                    <p className="text-gray-600 text-xs flex items-center gap-1">
                      🎓 {member.profile.university}
                    </p>
                  )}
                </div>

                {/* Skills */}
                {member.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {member.skills.slice(0, 3).map((us: any, i: number) => (
                      <span key={i} className="bg-purple-900/20 text-purple-300 text-xs px-2 py-0.5 rounded-full border border-purple-800/30">
                        {us.skill.name}
                      </span>
                    ))}
                    {member.skills.length > 3 && (
                      <span className="text-gray-600 text-xs px-1">+{member.skills.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-800/50">
                  <div className="flex items-center gap-3 text-gray-600 text-xs">
                    <span>🚀 {member._count?.ownedProjects || 0}</span>
                    <span>💬 {member._count?.posts || 0}</span>
                  </div>
                  <span className="text-yellow-500 text-xs font-medium">⭐ {member.points}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}