'use client'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const { data: session, status } = useSession()
  console.log('USER SESSION:', session?.user)
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')

  // ما الجديد
  const [newProjects, setNewProjects] = useState<any[]>([])
  const [newEvents, setNewEvents] = useState<any[]>([])
  const [newJobs, setNewJobs] = useState<any[]>([])
  const [feedLoading, setFeedLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') fetchFeed()
  }, [status])

  const fetchFeed = async () => {
    setFeedLoading(true)
    try {
      const [pRes, eRes, jRes] = await Promise.all([
        fetch('/api/projects?limit=4'),
        fetch('/api/events'),
        fetch('/api/jobs'),
      ])
      const [pData, eData, jData] = await Promise.all([
        pRes.json(), eRes.json(), jRes.json()
      ])

      setNewProjects(Array.isArray(pData) ? pData.slice(0, 4) : [])
      setNewEvents(Array.isArray(eData) ? eData.slice(0, 3) : [])
      setNewJobs(Array.isArray(jData) ? jData.slice(0, 3) : [])
    } finally {
      setFeedLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search.trim())}`)
  }

  const menuItems = [
    { href: '/dashboard',   label: ' الرئيسية ',  icon: ' 🏠 ' },
    { href: '/projects',    label: ' المشاريع ',   icon: ' 🚀 ' },
    { href: '/events',      label: ' الفعاليات ',  icon: ' 📅 ' },
    { href: '/community',   label: ' المجتمع ',    icon: ' 👥 ' },
    { href: '/news',        label: ' الأخبار ',    icon: ' 📰 ' },
  ]

  const quickLinks = [
    { href: '/my-projects', icon: ' 🚀 ', title: ' مشاريعي ',         color: 'from-violet-600/20 to-indigo-600/10 border-violet-500/20 hover:border-violet-500/50' },
    { href: '/messages',    icon: ' 💬 ', title: ' الرسائل ',          color: 'from-blue-600/20 to-cyan-600/10 border-blue-500/20 hover:border-blue-500/50'     },
    { href: '/courses',     icon: ' 🎓 ', title: ' التعليم ',          color: 'from-emerald-600/20 to-teal-600/10 border-emerald-500/20 hover:border-emerald-500/50' },
    { href: '/ai-tools',    icon: ' 🤖 ', title: ' أدوات AI',         color: 'from-purple-600/20 to-pink-600/10 border-purple-500/20 hover:border-purple-500/50'  },
    { href: '/jobs',        icon: ' 💼 ', title: ' فرص العمل ',        color: 'from-amber-600/20 to-orange-600/10 border-amber-500/20 hover:border-amber-500/50'   },
    { href: '/events',      icon: ' 📅 ', title: ' الفعاليات ',        color: 'from-cyan-600/20 to-blue-600/10 border-cyan-500/20 hover:border-cyan-500/50'        },
  ]

  if (status === 'loading') return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-violet-400 text-sm"> جاري التحميل ...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050508] text-white" dir="rtl"
      style={{ backgroundImage: `radial-gradient(ellipse at top right, rgba(124,58,237,0.07) 0%, transparent 55%), radial-gradient(ellipse at bottom left, rgba(79,70,229,0.05) 0%, transparent 55%)` }}>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 h-full w-72 bg-[#08080f] border-l border-violet-900/20
                         z-50 transform transition-transform duration-300
                         ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}>
        <div className="p-6 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700
                              flex items-center justify-center font-black
                              shadow-[0_0_15px_rgba(124,58,237,0.4)]"> ⚡ </div>
              <div>
                <p className="font-black text-white tracking-widest text-sm">SAAIT</p>
                <p className="text-violet-400/60 text-xs">AI Platform</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-white w-8 h-8 flex items-center justify-center"> ✕ </button>
          </div>

          {/* User Info */}
          <div className="bg-violet-900/10 border border-violet-500/20 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700
                              flex items-center justify-center font-black text-white">
                {session?.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">{session?.user?.name}</p>
                <p className="text-gray-500 text-xs truncate">{session?.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="space-y-1 flex-1">
            {menuItems.map((item, i) => (
              <Link key={i} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  pathname === item.href
                    ? 'bg-violet-600/20 text-white border border-violet-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-violet-900/20'
                }`}>
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            {(session?.user as any)?.role === 'admin' && (
              <Link href="/admin" onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400
                           hover:text-red-300 hover:bg-red-900/20 transition">
                 <span> 🛡️ </span><span className="font-medium"> لوحة الإدارة </span>
              </Link>
            )}
          </nav>

          <button onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                       text-red-400 hover:text-red-300 hover:bg-red-900/20 transition mt-4">
             🚪 تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Navbar */}
      <nav className="border-b border-violet-900/20 bg-[#08080f]/90 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 bg-[#0d0d1a] border border-violet-900/30 rounded-xl
                         flex flex-col items-center justify-center gap-1 transition
                         hover:border-violet-500/50 lg:hidden">
              <span className="w-4 h-0.5 bg-gray-400 rounded" />
              <span className="w-4 h-0.5 bg-gray-400 rounded" />
              <span className="w-4 h-0.5 bg-gray-400 rounded" />
            </button>
            <Link href="/" className="hidden lg:flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700
                              flex items-center justify-center font-black text-sm
                              shadow-[0_0_15px_rgba(124,58,237,0.3)]"> ⚡ </div>
              <div>
                <p className="font-black text-white text-sm tracking-widest">SAAIT</p>
                <p className="text-violet-400/60 text-xs">AI Platform</p>
              </div>
            </Link>
          </div>

          {/* Center Menu */}
          <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {menuItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link key={item.href} href={item.href}
                  className={`relative px-4 py-2 rounded-lg text-sm transition ${
                    active ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-violet-900/20'
                  }`}>
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-0.5
                                     bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <Link href="/notifications"
              className="w-10 h-10 bg-[#0d0d1a] border border-violet-900/30 rounded-full
                         flex items-center justify-center hover:border-violet-500/50 hover:bg-violet-900/20 transition">
               🔔
            </Link>
            <Link href={`/profile/${(session?.user as any)?.id}`}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700
                         flex items-center justify-center font-black text-base cursor-pointer
                         border-2 border-violet-500/30 hover:border-violet-400 text-white
                         shadow-lg hover:shadow-[0_0_20px_rgba(124,58,237,0.6)] transition-all duration-300 transform hover:scale-105">
              {session?.user?.name?.charAt(0).toUpperCase() || '👤'}
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-1">
            التحالف السوري للذكاء الصطناعي والتكنلوجيا المتورة
          </h1>
          <p className="text-gray-500 text-sm"> ما الذي تريد فعله اليوم؟ </p>
        </div>

        {/* ✦  Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600
                            blur-2xl opacity-10 group-focus-within:opacity-20 transition
                            pointer-events-none rounded-2xl" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="relative z-10 w-full bg-[#0a0a16] text-white rounded-2xl
                         pr-14 pl-32 py-5 border border-violet-900/30
                         focus:border-violet-500 focus:outline-none
                         focus:ring-1 focus:ring-violet-500/20 text-base
                         shadow-[0_0_30px_rgba(124,58,237,0.05)]
                         placeholder-gray-700 transition"
              placeholder=" ابحث عن مشاريع، أعضاء، كورسات، وظائف ..."
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl z-10"> 🔍 </span>
            <button type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10
                         bg-gradient-to-r from-violet-600 to-indigo-600
                         hover:from-violet-500 hover:to-indigo-500
                         text-white px-6 py-2.5 rounded-xl transition font-bold text-sm
                         hover:shadow-[0_0_15px_rgba(124,58,237,0.4)]">
               بحث
            </button>
          </div>
        </form>

        {/* ✦  Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {quickLinks.map((item, i) => (
            <Link key={i} href={item.href}
              className={`relative bg-gradient-to-br ${item.color}
                         border rounded-2xl p-5 h-28 flex flex-col justify-between
                         overflow-hidden group transition-all duration-300
                         hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(124,58,237,0.1)]`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent
                              opacity-0 group-hover:opacity-100 transition duration-300" />
              <div className="text-3xl">{item.icon}</div>
              <h3 className="text-white font-black text-sm group-hover:text-violet-300 transition">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>

        {/* ✦   ما الجديد  */}
        <div className="mb-4 flex items-center gap-3">
          <div className="w-1 h-6 bg-gradient-to-b from-violet-600 to-indigo-600 rounded-full"></div>
          <h2 className="text-xl font-black text-white"> ما الجديد في المنصة </h2>
          <div className="flex-1 h-px bg-violet-900/20"></div>
          <span className="text-violet-400/50 text-xs"> آخر التحديثات </span>
        </div>

        {feedLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* أحدث المشاريع  */}
            <div className="bg-[#0a0a16] border border-violet-900/20 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-violet-900/15">
                <div className="flex items-center gap-2">
                  <span className="text-lg"> 🚀 </span>
                  <h3 className="text-white font-black text-sm"> أحدث المشاريع </h3>
                </div>
                <Link href="/projects" className="text-violet-400 text-xs hover:text-violet-300 transition">
                   عرض الكل ←
                </Link>
              </div>
              <div className="divide-y divide-violet-900/10">
                {newProjects.length === 0 ? (
                  <p className="text-gray-600 text-sm text-center py-8"> لا توجد مشاريع بعد </p>
                ) : newProjects.map(p => (
                  <Link key={p.id} href={`/projects/${p.id}`}
                    className="flex items-start gap-3 px-5 py-3.5 hover:bg-violet-900/5 transition group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20
                                    border border-violet-500/20 flex items-center justify-center
                                    text-sm flex-shrink-0 font-black text-violet-400">
                      {p.title?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate
                                     group-hover:text-violet-400 transition">{p.title}</p>
                      <p className="text-gray-600 text-xs truncate">{p.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-violet-400/70 bg-violet-900/20
                                         px-2 py-0.5 rounded-full">{p.field}</span>
                        <span className="text-xs text-gray-700">{p.owner?.name}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* أحدث الفعاليات  */}
            <div className="bg-[#0a0a16] border border-violet-900/20 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-violet-900/15">
                <div className="flex items-center gap-2">
                  <span className="text-lg"> 📅 </span>
                  <h3 className="text-white font-black text-sm"> الفعاليات القادمة </h3>
                </div>
                <Link href="/events" className="text-violet-400 text-xs hover:text-violet-300 transition">
                   عرض الكل ←
                </Link>
              </div>
              <div className="divide-y divide-violet-900/10">
                {newEvents.length === 0 ? (
                  <p className="text-gray-600 text-sm text-center py-8"> لا توجد فعاليات قادمة </p>
                ) : newEvents.map(e => (
                  <div key={e.id} className="px-5 py-3.5 hover:bg-violet-900/5 transition">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20
                                      border border-emerald-500/20 flex items-center justify-center
                                      text-sm flex-shrink-0"> 📅 </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-bold truncate">{e.title}</p>
                        <p className="text-gray-600 text-xs mt-0.5">
                          {new Date(e.date).toLocaleDateString('ar-SA', { month: 'long', day: 'numeric' })}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-emerald-400/70 bg-emerald-900/20
                                           px-2 py-0.5 rounded-full">{e.type}</span>
                          <span className="text-xs text-gray-700">
                             {e.isOnline ? ' 🌐 أونلاين ' : ` 📍 ${e.location || ''}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* أحدث فرص العمل  */}
            <div className="bg-[#0a0a16] border border-violet-900/20 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-violet-900/15">
                <div className="flex items-center gap-2">
                  <span className="text-lg"> 💼 </span>
                  <h3 className="text-white font-black text-sm"> أحدث فرص العمل </h3>
                </div>
                <Link href="/jobs" className="text-violet-400 text-xs hover:text-violet-300 transition">
                   عرض الكل ←
                </Link>
              </div>
              <div className="divide-y divide-violet-900/10">
                {newJobs.length === 0 ? (
                  <p className="text-gray-600 text-sm text-center py-8"> لا توجد وظائف بعد </p>
                ) : newJobs.map(j => (
                  <div key={j.id} className="px-5 py-3.5 hover:bg-violet-900/5 transition">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600/20 to-orange-600/20
                                      border border-amber-500/20 flex items-center justify-center
                                      text-sm flex-shrink-0"> 💼 </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-bold truncate">{j.title}</p>
                        <p className="text-amber-400/70 text-xs">{j.company}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-amber-400/70 bg-amber-900/20
                                           px-2 py-0.5 rounded-full">{j.type}</span>
                          {j.isRemote && (
                            <span className="text-xs text-emerald-400/70"> 🌐 عن بُعد </span>
                          )}
                        </div>
                      </div>
                      {j.url && (
                        <a href={j.url} target="_blank" rel="noopener noreferrer"
                           className="text-xs text-violet-400 hover:text-violet-300
                                     bg-violet-900/20 px-2 py-1 rounded-lg transition flex-shrink-0">
                           تقدّم
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Chat Button */}
      <Link href="/ai-chat"
        className="fixed bottom-6 left-6 w-14 h-14
                   bg-gradient-to-r from-violet-600 to-indigo-600
                   rounded-full flex items-center justify-center text-2xl
                   shadow-[0_0_25px_rgba(124,58,237,0.5)]
                   hover:shadow-[0_0_35px_rgba(124,58,237,0.7)]
                   hover:scale-110 transition-all duration-300 z-50">
         🤖
      </Link>
    </div>
  )
}
