'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const CATEGORIES = ['الكل', 'الذكاء الاصطناعي', 'الأمن السيبراني', 'البرمجة', 'تحليل البيانات', 'تعلم الآلة', 'عام']
const SKILLS_FILTER = ['الكل', 'Python', 'JavaScript', 'Machine Learning', 'Deep Learning', 'Cyber Security', 'Data Science', 'React', 'Node.js']
const COUNTRIES_FILTER = ['الكل', 'سوريا', 'مصر', 'السعودية', 'الإمارات', 'الأردن', 'لبنان', 'العراق', 'تونس', 'المغرب']
const STATUS_LABELS: any = { student: 'طالب', graduate: 'خريج', employed: 'موظف', freelancer: 'مستقل', researcher: 'باحث' }

export default function CommunityPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('forum')
  const [posts, setPosts] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('الكل')
  const [skillFilter, setSkillFilter] = useState('الكل')
  const [countryFilter, setCountryFilter] = useState('الكل')
  const [memberSearch, setMemberSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', category: 'عام' })
  const [submitting, setSubmitting] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { href: '/dashboard', icon: '', label: 'الرئيسية' },
    { href: '/projects', icon: '', label: 'المشاريع' },
    { href: '/events', icon: '', label: 'الفعاليات' },
    { href: '/community', icon: '', label: 'المجتمع' },
    { href: '/news', icon: '', label: 'الأخبار' },
  ]

  useEffect(() => {
    if (activeTab === 'forum') fetchPosts()
    if (activeTab === 'members') fetchMembers()
  }, [activeTab, category, skillFilter, countryFilter])

  const fetchPosts = async () => {
    setLoading(true)
    const query = category !== 'الكل' ? `?category=${encodeURIComponent(category)}` : ''
    const res = await fetch(`/api/posts${query}`)
    const data = await res.json()
    setPosts(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const fetchMembers = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (skillFilter !== 'الكل') params.set('skill', skillFilter)
    if (countryFilter !== 'الكل') params.set('country', countryFilter)
    const res = await fetch(`/api/users?${params}`)
    const data = await res.json()
    setMembers(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!form.title || !form.content) return
    setSubmitting(true)
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ title: '', content: '', category: 'عام' })
      setShowForm(false)
      fetchPosts()
    }
    setSubmitting(false)
  }

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.profile?.jobTitle?.toLowerCase().includes(memberSearch.toLowerCase())
  )

  const formatDate = (date: string) => new Date(date).toLocaleDateString('ar-SA', {
    month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })

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

      {/* Navbar - نفس التصميم الاحترافي من Dashboard */}
<nav className="border-b border-purple-900/40 bg-[#080810]/80 backdrop-blur sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

    {/* Logo + Name (يمين) */}
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="white" strokeWidth="1.5"/>
          <path d="M3 17L12 22L21 17" stroke="white" strokeWidth="1.5"/>
          <path d="M3 12L12 17L21 12" stroke="white" strokeWidth="1.5"/>
        </svg>
      </div>

      <div>
        <span className="font-bold text-white text-sm">SAAIT</span>
        <p className="text-purple-400 text-xs">Building Syria's Tech Future</p>
      </div>
    </div>

    {/* Center Menu */}
    <div className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
      {menuItems.map((item) => {
        const active = item.href === '/community'
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={`relative px-6 py-2 rounded-lg text-sm transition
              ${active ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-purple-900/20'}`}
          >
            {item.label}
            {active && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></span>
            )}
          </Link>
        )
      })}
    </div>

    {/* Right Side */}
    <div className="flex items-center gap-3">
      {session && activeTab === 'forum' && (
        <button 
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-sm px-4 py-2 rounded-lg"
        >
          + نشر موضوع
        </button>
      )}
    </div>

  </div>
</nav>

      <div className="max-w-7xl mx-auto px-4 py-6">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-1">💬 المجتمع التقني</h1>
          <p className="text-gray-500">تواصل وتعلم وتعاون مع المجتمع التقني السوري</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4">
          {[
            { id: 'forum', icon: '💬', label: 'المنتدى' },
            { id: 'members', icon: '👥', label: 'الأعضاء' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === tab.id ? 'bg-purple-600 text-white' : 'bg-[#0d0d18] text-gray-400 border border-gray-800 hover:border-purple-700/50'}`}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Forum Tab */}
        {activeTab === 'forum' && (
          <div className="flex gap-6">
            <div className="flex-1">

              {showForm && (
                <div className="bg-[#0a0a12] border border-purple-700/50 rounded-2xl p-6 mb-6">
                  <h3 className="text-white font-bold mb-4">نشر موضوع جديد</h3>
                  <div className="space-y-4">
                    <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                      className="w-full bg-[#13131f] text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                      placeholder="عنوان الموضوع" />
                    <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                      rows={4} className="w-full bg-[#13131f] text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
                      placeholder="اكتب موضوعك هنا..." />
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.filter(c => c !== 'الكل').map(c => (
                        <button key={c} onClick={() => setForm(p => ({ ...p, category: c }))}
                          className={`px-3 py-1.5 rounded-lg text-sm transition ${form.category === c ? 'bg-purple-600 text-white' : 'bg-[#13131f] text-gray-400 border border-gray-700'}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleSubmit} disabled={submitting}
                        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium px-6 py-2 rounded-lg transition">
                        {submitting ? 'جاري النشر...' : 'نشر'}
                      </button>
                      <button onClick={() => setShowForm(false)}
                        className="border border-gray-700 text-gray-400 hover:text-white px-6 py-2 rounded-lg transition">
                        إلغاء
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 flex-wrap mb-5">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c)}
                    className={`px-4 py-2 rounded-full text-sm transition ${category === c ? 'bg-purple-600 text-white' : 'bg-[#0d0d18] text-gray-400 border border-gray-800 hover:border-purple-700/50'}`}>
                    {c}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-bold text-white mb-2">لا توجد مواضيع بعد</h3>
                  {session && (
                    <button onClick={() => setShowForm(true)}
                      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition">
                      نشر موضوع جديد
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post: any) => (
                    <div key={post.id} className="bg-[#0a0a12] border border-gray-800/80 hover:border-purple-700/50 rounded-2xl p-6 transition">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {post.author?.name?.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="text-white font-medium">{post.author?.name}</span>
                              {post.author?.profile?.jobTitle && (
                                <span className="text-gray-500 text-sm mr-2">• {post.author.profile.jobTitle}</span>
                              )}
                            </div>
                            <span className="text-gray-600 text-xs">{formatDate(post.createdAt)}</span>
                          </div>
                          <span className="bg-purple-900/30 text-purple-300 text-xs px-2 py-0.5 rounded-full border border-purple-700/30 mb-2 inline-block">
                            {post.category}
                          </span>
                          <h3 className="text-white font-bold text-lg mb-2">{post.title}</h3>
                          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{post.content}</p>
                          <div className="flex items-center gap-4 mt-4 text-gray-500 text-sm">
                            <button className="hover:text-purple-400 transition flex items-center gap-1">
                              <span>👍</span><span>{post.likes}</span>
                            </button>
                            <button className="hover:text-purple-400 transition flex items-center gap-1">
                              <span>💬</span><span>{post._count?.comments} تعليق</span>
                            </button>
                            <button className="hover:text-purple-400 transition flex items-center gap-1">
                              <span>👁</span><span>{post.views} مشاهدة</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block w-64 space-y-4">
              <div className="bg-[#0a0a12] border border-gray-800/80 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-3">التخصصات</h3>
                <div className="space-y-1">
                  {CATEGORIES.filter(c => c !== 'الكل').map(c => (
                    <button key={c} onClick={() => setCategory(c)}
                      className="w-full text-right text-gray-400 hover:text-purple-400 text-sm py-1.5 transition">
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div>
            {/* Filters */}
            <div className="bg-[#0a0a12] border border-gray-800/80 rounded-2xl p-4 mb-6">
              <div className="relative mb-4">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                <input value={memberSearch} onChange={e => setMemberSearch(e.target.value)}
                  className="w-full bg-[#13131f] text-white rounded-xl pr-10 pl-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none text-sm"
                  placeholder="ابحث بالاسم أو المسمى الوظيفي..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 text-xs mb-1">المهارة</label>
                  <select value={skillFilter} onChange={e => setSkillFilter(e.target.value)}
                    className="w-full bg-[#13131f] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-purple-500 focus:outline-none text-sm">
                    {SKILLS_FILTER.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 text-xs mb-1">الدولة</label>
                  <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)}
                    className="w-full bg-[#13131f] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-purple-500 focus:outline-none text-sm">
                    {COUNTRIES_FILTER.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {!loading && (
              <p className="text-gray-500 text-sm mb-4">{filteredMembers.length} عضو</p>
            )}

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-white mb-2">لا توجد نتائج</h3>
                <p className="text-gray-600">جرب تغيير الفلاتر</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredMembers.map((member: any) => (
                  <Link key={member.id} href={`/profile/${member.id}`}
                    className="bg-[#0a0a12] border border-gray-800/80 hover:border-purple-700/50 rounded-2xl p-5 transition group">
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

                    {member.profile?.bio && (
                      <p className="text-gray-500 text-xs line-clamp-2 mb-3">{member.profile.bio}</p>
                    )}

                    <div className="space-y-1 mb-3">
                      {member.profile?.country && (
                        <p className="text-gray-600 text-xs">📍 {member.profile.country}{member.profile?.city && `, ${member.profile.city}`}</p>
                      )}
                      {member.profile?.currentStatus && (
                        <p className="text-gray-600 text-xs">💼 {STATUS_LABELS[member.profile.currentStatus] || member.profile.currentStatus}</p>
                      )}
                    </div>

                    {member.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {member.skills.slice(0, 3).map((us: any, i: number) => (
                          <span key={i} className="bg-purple-900/20 text-purple-300 text-xs px-2 py-0.5 rounded-full border border-purple-800/30">
                            {us.skill.name}
                          </span>
                        ))}
                        {member.skills.length > 3 && (
                          <span className="text-gray-600 text-xs">+{member.skills.length - 3}</span>
                        )}
                      </div>
                    )}

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
        )}
      </div>
    </div>
  )
}
