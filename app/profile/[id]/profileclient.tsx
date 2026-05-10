'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const STATUS_LABELS: any = {
  student: 'طالب', graduate: 'خريج',
  employed: 'موظف', freelancer: 'مستقل', researcher: 'باحث'
}

export default function ProfileClient({ user }: { user: any }) {
  const { data: session } = useSession()
  const router = useRouter()

  const isOwner = session?.user?.id === user.id

  const formatDate = (date: string) => new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-[#050508] text-white" dir="rtl"
      style={{ backgroundImage: `radial-gradient(ellipse at top, rgba(124,58,237,0.06) 0%, transparent 60%)` }}>

      {/* Navbar */}
      <nav className="border-b border-purple-900/40 bg-[#080810]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold text-sm">S</div>
            <span className="font-bold text-white hidden sm:block">SAAIT</span>
          </Link>
          <div className="flex items-center gap-2">
            {isOwner && (
              <Link href="/profile/edit"
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition">
                ✏️ تعديل الملف
              </Link>
            )}
            <button onClick={() => router.back()}
              className="text-gray-400 hover:text-white transition text-sm">
              ← رجوع
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Cover + Avatar */}
        <div className="bg-[#0a0a12] border border-purple-900/20 rounded-3xl overflow-hidden mb-6 shadow-[0_0_40px_rgba(124,58,237,0.05)]">
          {/* Cover */}
          <div className="h-32 sm:h-48 bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-[#0a0a12] relative">
            {user.profile?.coverImage && (
              <img src={user.profile.coverImage} alt="cover" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] to-transparent"></div>
          </div>

          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-10 mb-4">
              {/* Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-3xl font-black text-white border-4 border-[#0a0a12] flex-shrink-0 overflow-hidden shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                {user.profile?.avatar
                  ? <img src={user.profile.avatar} alt={user.name} className="w-full h-full object-cover" />
                  : user.name?.charAt(0)
                }
              </div>
              <div className="flex-1 pb-1">
                <h1 className="text-xl sm:text-2xl font-black text-white">{user.name}</h1>
                {user.profile?.jobTitle && (
                  <p className="text-purple-400 text-sm">{user.profile.jobTitle}</p>
                )}
                {user.profile?.currentStatus && (
                  <span className="text-xs bg-purple-900/30 text-purple-300 border border-purple-700/30 px-2 py-0.5 rounded-full">
                    {STATUS_LABELS[user.profile.currentStatus] || user.profile.currentStatus}
                  </span>
                )}
              </div>

              {/* Message Button */}
              {!isOwner && session && (
                <Link href={`/messages?with=${user.id}`}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-xl transition flex-shrink-0">
                  ✉️ مراسلة
                </Link>
              )}
            </div>

            {/* Bio */}
            {user.profile?.bio && (
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{user.profile.bio}</p>
            )}

            {/* Info Row */}
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              {user.profile?.country && (
                <span>📍 {user.profile.country}{user.profile.city && `, ${user.profile.city}`}</span>
              )}
              {user.profile?.university && <span>🎓 {user.profile.university}</span>}
              {user.profile?.company && <span>🏢 {user.profile.company}</span>}
              <span>📅 عضو منذ {formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* العمود الأيمن */}
          <div className="space-y-5">

            {/* الإحصائيات */}
            <div className="bg-[#0a0a12] border border-purple-900/20 rounded-2xl p-5">
              <h3 className="text-white font-bold mb-4">📊 الإحصائيات</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'مشروع', value: user._count?.ownedProjects || 0, icon: '🚀' },
                  { label: 'موضوع', value: user._count?.posts || 0, icon: '💬' },
                  { label: 'نقطة', value: user.points || 0, icon: '⭐' },
                ].map((item, i) => (
                  <div key={i} className="text-center bg-[#0d0d1a] rounded-xl p-3 border border-purple-900/20">
                    <div className="text-lg mb-1">{item.icon}</div>
                    <div className="text-white font-black text-lg">{item.value}</div>
                    <div className="text-gray-500 text-xs">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* المهارات */}
            {user.skills?.length > 0 && (
              <div className="bg-[#0a0a12] border border-purple-900/20 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-4">💡 المهارات</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((us: any) => (
                    <span key={us.id} className="bg-purple-900/20 text-purple-300 text-xs px-3 py-1.5 rounded-full border border-purple-700/30">
                      {us.skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* التواصل الاجتماعي */}
            {(user.profile?.github || user.profile?.linkedin || user.profile?.facebook || user.profile?.instagram || user.profile?.website) && (
              <div className="bg-[#0a0a12] border border-purple-900/20 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-4">🔗 التواصل</h3>
                <div className="space-y-2">
                  {user.profile?.github && (
                    <a href={user.profile.github} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm">
                      <span>🐙</span> GitHub
                    </a>
                  )}
                  {user.profile?.linkedin && (
                    <a href={user.profile.linkedin} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm">
                      <span>💼</span> LinkedIn
                    </a>
                  )}
                  {user.profile?.facebook && (
                    <a href={user.profile.facebook} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm">
                      <span>📘</span> Facebook
                    </a>
                  )}
                  {user.profile?.instagram && (
                    <a href={user.profile.instagram} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm">
                      <span>📸</span> Instagram
                    </a>
                  )}
                  {user.profile?.website && (
                    <a href={user.profile.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm">
                      <span>🌐</span> الموقع الشخصي
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* العمود الأيسر */}
          <div className="lg:col-span-2 space-y-5">

            {/* المشاريع */}
            <div className="bg-[#0a0a12] border border-purple-900/20 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">🚀 المشاريع</h3>
                <Link href="/projects" className="text-purple-400 text-xs hover:text-purple-300 transition">
                  كل المشاريع ←
                </Link>
              </div>
              {user.ownedProjects?.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-6">لا توجد مشاريع بعد</p>
              ) : (
                <div className="space-y-3">
                  {user.ownedProjects.map((project: any) => (
                    <Link key={project.id} href={`/projects/${project.id}`}
                      className="flex items-center gap-3 bg-[#0d0d1a] rounded-xl p-3 border border-purple-900/20 hover:border-purple-500/40 transition">
                      <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center text-lg flex-shrink-0">
                        🚀
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{project.title}</p>
                        <p className="text-gray-500 text-xs">{project.field}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                        project.status === 'active'
                          ? 'bg-emerald-900/30 text-emerald-400'
                          : 'bg-gray-800 text-gray-400'
                      }`}>
                        {project.status === 'active' ? 'نشط' : project.status}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* المواضيع */}
            <div className="bg-[#0a0a12] border border-purple-900/20 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">💬 المواضيع</h3>
                <Link href="/community" className="text-purple-400 text-xs hover:text-purple-300 transition">
                  كل المواضيع ←
                </Link>
              </div>
              {user.posts?.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-6">لا توجد مواضيع بعد</p>
              ) : (
                <div className="space-y-3">
                  {user.posts.map((post: any) => (
                    <Link key={post.id} href={`/community/${post.id}`}
                      className="block bg-[#0d0d1a] rounded-xl p-3 border border-purple-900/20 hover:border-purple-500/40 transition">
                      <p className="text-white font-semibold text-sm mb-1">{post.title}</p>
                      <div className="flex items-center gap-3 text-gray-600 text-xs">
                        <span>💬 {post._count?.comments || 0}</span>
                        <span>👍 {post.likes || 0}</span>
                        <span>👁 {post.views || 0}</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}