'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProfilePage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const currentUserId = (session?.user as any)?.id
  const isOwner = currentUserId === params.id

  useEffect(() => { fetchUser() }, [params.id])

  const fetchUser = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${params.id}`)
      if (!res.ok) { router.push('/404'); return }
      const data = await res.json()
      setUser(data)
    } catch {
      router.push('/404')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-violet-400 text-sm">جاري تحميل الملف الشخصي...</p>
      </div>
    </div>
  )

  if (!user) return null

  const profile = user.profile || {}
  const tabs = [
    { id: 'overview',  label: 'نظرة عامة',  icon: '👤' },
    { id: 'projects',  label: 'المشاريع',   icon: '🚀' },
    { id: 'skills',    label: 'المهارات',   icon: '💻' },
    { id: 'activity',  label: 'النشاط',     icon: '📊' },
  ]

  const statusMap: any = {
    student:    { label: 'طالب',       icon: '🎓' },
    graduate:   { label: 'خريج',       icon: '📜' },
    employed:   { label: 'موظف',       icon: '💼' },
    freelancer: { label: 'مستقل',      icon: '🌐' },
    researcher: { label: 'باحث',       icon: '🔬' },
  }

  const degreeMap: any = {
    bachelor: 'بكالوريوس',
    master:   'ماجستير',
    phd:      'دكتوراه',
    diploma:  'دبلوم',
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white" dir="rtl"
      style={{ backgroundImage: `radial-gradient(ellipse at top, rgba(124,58,237,0.07) 0%, transparent 55%)` }}>

      {/* Navbar */}
      <nav className="border-b border-violet-900/20 bg-[#08080f]/90 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700
                            flex items-center justify-center font-black text-sm
                            shadow-[0_0_15px_rgba(124,58,237,0.3)]">⚡</div>
            <span className="font-black text-white tracking-widest hidden sm:block">SAAIT</span>
          </Link>
          <div className="flex items-center gap-2">
            {isOwner && (
              <Link href="/profile/edit"
                className="flex items-center gap-2 bg-violet-600/20 border border-violet-500/30
                           text-violet-400 hover:text-white hover:bg-violet-600/30
                           px-4 py-2 rounded-xl text-sm font-medium transition">
                ✏️ تعديل الملف
              </Link>
            )}
            {!isOwner && session && (
              <Link href={`/messages?with=${user.id}`}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600
                           hover:from-violet-500 hover:to-indigo-500
                           text-white px-4 py-2 rounded-xl text-sm font-bold transition
                           hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                💬 مراسلة
              </Link>
            )}
            <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm transition">
              ← لوحة التحكم
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ✦ Cover + Avatar */}
        <div className="relative mb-6">
          {/* Cover */}
          <div className="h-48 rounded-3xl overflow-hidden bg-gradient-to-r
                          from-violet-900/40 via-indigo-900/30 to-violet-900/40
                          border border-violet-900/20 relative">
            <div className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.3) 0%, transparent 60%),
                                   radial-gradient(ellipse at 70% 50%, rgba(79,70,229,0.2) 0%, transparent 60%)`,
              }} />
            {/* Pattern */}
            <div className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle, #7c3aed 1px, transparent 1px)`,
                backgroundSize: '30px 30px'
              }} />
            {/* AI Lines Decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden opacity-20">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="absolute bottom-0 w-px bg-gradient-to-t from-violet-500 to-transparent"
                  style={{ left: `${15 + i * 18}%`, height: `${40 + i * 15}px` }} />
              ))}
            </div>
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-8 right-6 flex items-end gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700
                              flex items-center justify-center font-black text-4xl text-white
                              border-4 border-[#050508]
                              shadow-[0_0_30px_rgba(124,58,237,0.4)]">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt={user.name}
                    className="w-full h-full object-cover rounded-xl" />
                ) : user.name?.charAt(0)}
              </div>
              {/* Online Indicator */}
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-emerald-400 rounded-full
                              border-2 border-[#050508] animate-pulse"></div>
            </div>
          </div>

          {/* Role Badge */}
          <div className="absolute top-4 left-4">
            {user.role === 'admin' && (
              <span className="bg-red-900/60 text-red-300 border border-red-500/40
                               text-xs px-3 py-1.5 rounded-full font-bold backdrop-blur-sm">
                🛡️ مدير النظام
              </span>
            )}
          </div>
        </div>

        {/* ✦ Name + Info Bar */}
        <div className="mt-10 mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-white">{user.name}</h1>
              {user.emailVerified && (
                <span className="text-blue-400 text-xl" title="بريد موثق">✅</span>
              )}
              {user.banned && (
                <span className="bg-red-900/30 text-red-400 border border-red-700/30
                                 text-xs px-2.5 py-1 rounded-full">🚫 محظور</span>
              )}
            </div>

            {(profile?.jobTitle || profile?.company) && (
              <p className="text-violet-400 font-medium mb-1">
                {profile.jobTitle}{profile.company && ` في ${profile.company}`}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-gray-500 text-sm">
              {profile?.country && (
                <span className="flex items-center gap-1">📍 {profile.country}{profile.city && `، ${profile.city}`}</span>
              )}
              {profile?.currentStatus && statusMap[profile.currentStatus] && (
                <span className="flex items-center gap-1">
                  {statusMap[profile.currentStatus].icon} {statusMap[profile.currentStatus].label}
                </span>
              )}
              <span className="flex items-center gap-1">
                📅 انضم {new Date(user.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}
              </span>
            </div>

            {profile?.bio && (
              <p className="text-gray-400 mt-3 max-w-xl leading-relaxed text-sm">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Points Badge */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/10
                            border border-amber-500/30 rounded-2xl px-5 py-3 text-center
                            shadow-[0_0_20px_rgba(245,158,11,0.1)]">
              <p className="text-amber-400 font-black text-2xl">{user.points || 0}</p>
              <p className="text-gray-500 text-xs">نقطة</p>
            </div>
          </div>
        </div>

        {/* ✦ Stats Row */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'المشاريع',  value: user._count?.ownedProjects || 0, icon: '🚀', color: 'violet' },
            { label: 'المواضيع',  value: user._count?.posts         || 0, icon: '💬', color: 'blue'   },
            { label: 'الرسائل',   value: user._count?.sentMessages  || 0, icon: '📨', color: 'cyan'   },
            { label: 'النقاط',    value: user.points                || 0, icon: '⭐', color: 'amber'  },
          ].map((s, i) => (
            <div key={i} className="bg-[#0a0a16] border border-violet-900/15 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="text-white font-black text-xl">{s.value}</p>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ✦ Social Links */}
        {(profile?.github || profile?.facebook || profile?.instagram || profile?.linkedin) && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-800/60 hover:bg-gray-700/60
                           border border-gray-700/40 text-gray-300 hover:text-white
                           px-4 py-2 rounded-xl text-sm transition">
                <span>🐙</span> GitHub
              </a>
            )}
            {profile.facebook && (
              <a href={profile.facebook} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-900/20 hover:bg-blue-900/30
                           border border-blue-700/30 text-blue-300 hover:text-white
                           px-4 py-2 rounded-xl text-sm transition">
                <span>📘</span> Facebook
              </a>
            )}
            {profile.instagram && (
              <a href={profile.instagram} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-pink-900/20 hover:bg-pink-900/30
                           border border-pink-700/30 text-pink-300 hover:text-white
                           px-4 py-2 rounded-xl text-sm transition">
                <span>📸</span> Instagram
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-900/20 hover:bg-blue-900/30
                           border border-blue-500/30 text-blue-300 hover:text-white
                           px-4 py-2 rounded-xl text-sm transition">
                <span>💼</span> LinkedIn
              </a>
            )}
          </div>
        )}

        {/* ✦ Tabs */}
        <div className="flex gap-2 mb-6 border-b border-violet-900/20 pb-2 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold
                         whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-violet-900/20'
              }`}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* ==================== OVERVIEW TAB ==================== */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* المعلومات الشخصية */}
            <div className="bg-[#0a0a16] border border-violet-900/20 rounded-2xl p-5">
              <h3 className="text-white font-black mb-4 flex items-center gap-2">
                <span>👤</span> المعلومات الشخصية
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'الاسم الكامل',  value: user.name },
                  { label: 'البريد الإلكتروني', value: user.email },
                  { label: 'الجنس',          value: profile?.gender === 'male' ? 'ذكر' : profile?.gender === 'female' ? 'أنثى' : null },
                  { label: 'الدولة',          value: profile?.country },
                  { label: 'المدينة',         value: profile?.city },
                  { label: 'الحالة',          value: profile?.currentStatus ? statusMap[profile.currentStatus]?.label : null },
                ].filter(i => i.value).map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2
                                          border-b border-violet-900/10 last:border-0">
                    <span className="text-gray-500 text-sm">{item.label}</span>
                    <span className="text-white text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* التعليم */}
            {(profile?.university || profile?.major) && (
              <div className="bg-[#0a0a16] border border-violet-900/20 rounded-2xl p-5">
                <h3 className="text-white font-black mb-4 flex items-center gap-2">
                  <span>🎓</span> التعليم
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'الجامعة',         value: profile?.university },
                    { label: 'التخصص',          value: profile?.major },
                    { label: 'الدرجة العلمية',  value: profile?.degree ? degreeMap[profile.degree] : null },
                    { label: 'سنة التخرج',      value: profile?.gradYear },
                  ].filter(i => i.value).map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2
                                            border-b border-violet-900/10 last:border-0">
                      <span className="text-gray-500 text-sm">{item.label}</span>
                      <span className="text-white text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* الخبرة المهنية */}
            {(profile?.company || profile?.jobTitle) && (
              <div className="bg-[#0a0a16] border border-violet-900/20 rounded-2xl p-5">
                <h3 className="text-white font-black mb-4 flex items-center gap-2">
                  <span>💼</span> الخبرة المهنية
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'الشركة',           value: profile?.company },
                    { label: 'المسمى الوظيفي',   value: profile?.jobTitle },
                    { label: 'سنوات الخبرة',     value: profile?.experience ? `${profile.experience} سنوات` : null },
                  ].filter(i => i.value).map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2
                                            border-b border-violet-900/10 last:border-0">
                      <span className="text-gray-500 text-sm">{item.label}</span>
                      <span className="text-white text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* الاهتمامات */}
            {profile?.interests?.length > 0 && (
              <div className="bg-[#0a0a16] border border-violet-900/20 rounded-2xl p-5">
                <h3 className="text-white font-black mb-4 flex items-center gap-2">
                  <span>❤️</span> الاهتمامات
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest: string, i: number) => (
                    <span key={i} className="bg-violet-900/20 text-violet-300 text-xs
                                             px-3 py-1.5 rounded-full border border-violet-700/20">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ما يبحث عنه */}
            {profile?.lookingFor && (
              <div className="bg-[#0a0a16] border border-violet-900/20 rounded-2xl p-5">
                <h3 className="text-white font-black mb-3 flex items-center gap-2">
                  <span>🎯</span> يبحث عن
                </h3>
                <div className="flex items-center gap-3 bg-violet-900/10 rounded-xl p-3">
                  <span className="text-2xl">🔍</span>
                  <p className="text-gray-300 text-sm">
                    {profile.lookingFor === 'team' && 'إيجاد فريق لمشروع'}
                    {profile.lookingFor === 'job' && 'فرصة عمل'}
                    {profile.lookingFor === 'learn' && 'التعلم والتطوير'}
                    {profile.lookingFor === 'collaborate' && 'التعاون في مشاريع'}
                    {profile.lookingFor === 'network' && 'بناء شبكة علاقات'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== PROJECTS TAB ==================== */}
        {activeTab === 'projects' && (
          <div>
            {user.ownedProjects?.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-white mb-2">لا توجد مشاريع بعد</h3>
                <p className="text-gray-600">لم ينشر هذا العضو أي مشروع حتى الآن</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {user.ownedProjects?.map((project: any) => (
                  <Link key={project.id} href={`/projects/${project.id}`}
                    className="bg-[#0a0a16] border border-violet-900/15
                               hover:border-violet-500/40 rounded-2xl p-5
                               transition-all duration-300
                               hover:shadow-[0_0_20px_rgba(124,58,237,0.08)] group">
                    <div className="flex items-start justify-between mb-3">
                      <span className="bg-violet-900/20 text-violet-300 text-xs px-2.5 py-1
                                       rounded-full border border-violet-700/20">{project.field}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${
                        project.status === 'active'
                          ? 'bg-emerald-900/20 text-emerald-400 border-emerald-700/20'
                          : 'bg-gray-800/60 text-gray-500 border-gray-700/20'
                      }`}>
                        {project.status === 'active' ? '🟢 نشط' : '✅ مكتمل'}
                      </span>
                    </div>
                    <h3 className="text-white font-black mb-2 group-hover:text-violet-400 transition">
                      {project.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{project.description}</p>
                    <div className="w-full bg-gray-800/80 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-violet-600 to-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${project.progress}%` }} />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-700 text-xs">{project.progress}% مكتمل</span>
                      <div className="flex items-center gap-2 text-gray-600 text-xs">
                        <span>👥 {project._count?.members || 0}</span>
                        <span>⭐ {project.votes || 0}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== SKILLS TAB ==================== */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* المهارات التقنية */}
            <div className="bg-[#0a0a16] border border-violet-900/20 rounded-2xl p-5">
              <h3 className="text-white font-black mb-4 flex items-center gap-2">
                <span>💻</span> المهارات التقنية
              </h3>
              {user.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((us: any, i: number) => (
                    <div key={i} className="bg-[#0d0d1a] border border-violet-900/30
                                            rounded-xl px-3 py-2 flex items-center gap-2">
                      <span className="text-violet-400 font-bold text-sm">
                        {us.skill?.name || us}
                      </span>
                      {us.level && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          us.level === 'expert'        ? 'bg-emerald-900/30 text-emerald-400' :
                          us.level === 'intermediate'  ? 'bg-blue-900/30 text-blue-400' :
                                                         'bg-gray-800 text-gray-400'
                        }`}>
                          {us.level === 'expert' ? 'خبير' : us.level === 'intermediate' ? 'متوسط' : 'مبتدئ'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">لم يتم إضافة مهارات بعد</p>
              )}
            </div>

            {/* مستوى الخبرة */}
            <div className="bg-[#0a0a16] border border-violet-900/20 rounded-2xl p-5">
              <h3 className="text-white font-black mb-4 flex items-center gap-2">
                <span>📈</span> مستوى النشاط
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'المشاريع المنشورة', value: user._count?.ownedProjects || 0, max: 20,  color: 'from-violet-600 to-indigo-500' },
                  { label: 'المواضيع',          value: user._count?.posts         || 0, max: 50,  color: 'from-blue-600 to-cyan-500'    },
                  { label: 'الرسائل',           value: user._count?.sentMessages  || 0, max: 100, color: 'from-emerald-600 to-teal-500'  },
                  { label: 'النقاط المكتسبة',   value: user.points                || 0, max: 500, color: 'from-amber-600 to-orange-500'  },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-400">{item.label}</span>
                      <span className="text-white font-bold">{item.value}</span>
                    </div>
                    <div className="w-full bg-gray-800/80 rounded-full h-2">
                      <div className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all`}
                        style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================== ACTIVITY TAB ==================== */}
        {activeTab === 'activity' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* إحصائيات */}
            <div className="bg-[#0a0a16] border border-violet-900/20 rounded-2xl p-5">
              <h3 className="text-white font-black mb-4 flex items-center gap-2">
                <span>📊</span> إحصائيات النشاط
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '🚀', label: 'مشاريع منشورة',  value: user._count?.ownedProjects || 0, color: 'text-violet-400' },
                  { icon: '💬', label: 'مواضيع نشرتها',  value: user._count?.posts         || 0, color: 'text-blue-400'   },
                  { icon: '📨', label: 'رسائل مرسلة',    value: user._count?.sentMessages  || 0, color: 'text-cyan-400'   },
                  { icon: '⭐', label: 'إجمالي النقاط',  value: user.points                || 0, color: 'text-amber-400'  },
                ].map((s, i) => (
                  <div key={i} className="bg-[#0d0d1a] border border-violet-900/15 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">{s.icon}</div>
                    <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-gray-500 text-xs mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* معلومات الحساب */}
            <div className="bg-[#0a0a16] border border-violet-900/20 rounded-2xl p-5">
              <h3 className="text-white font-black mb-4 flex items-center gap-2">
                <span>🔐</span> معلومات الحساب
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'تاريخ الانضمام',   value: new Date(user.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }) },
                  { label: 'حالة البريد',       value: user.emailVerified ? '✅ موثق' : '❌ غير موثق' },
                  { label: 'الدور',             value: user.role === 'admin' ? '🛡️ مدير' : '👤 عضو' },
                  { label: 'حالة الحساب',       value: user.banned ? '🚫 محظور' : '✅ نشط' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2
                                          border-b border-violet-900/10 last:border-0">
                    <span className="text-gray-500 text-sm">{item.label}</span>
                    <span className="text-white text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
