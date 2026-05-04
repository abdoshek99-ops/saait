'use client'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// ==================== TYPES ====================
type User = {
  id: string; name: string; email: string; role: string; points: number;
  banned: boolean; emailVerified: boolean; createdAt: string;
  country?: string; city?: string; bio?: string; university?: string;
  major?: string; degree?: string; company?: string; jobTitle?: string;
  experience?: string; github?: string; facebook?: string; instagram?: string;
  gender?: string; currentStatus?: string; skills?: string[];
  interests?: string[]; lookingFor?: string; password?: string;
  _count?: { projects: number; posts: number; messages: number; comments: number }
}
type Project = {
  id: string; title: string; field: string; status: string;
  progress: number; createdAt: string;
  owner?: { name: string; email: string }
}
type Event = {
  id: string; title: string; type: string; date: string;
  location?: string; createdAt: string
}
type Message = {
  id: string; content: string; createdAt: string;
  sender?: { name: string; email: string }
  receiver?: { name: string }
}

// ==================== STAT CARD ====================
function StatCard({ icon, label, value, color, sub }: any) {
  const colors: any = {
    violet: 'from-violet-600/20 to-violet-900/10 border-violet-500/20 text-violet-400',
    blue:   'from-blue-600/20 to-blue-900/10 border-blue-500/20 text-blue-400',
    green:  'from-emerald-600/20 to-emerald-900/10 border-emerald-500/20 text-emerald-400',
    yellow: 'from-amber-600/20 to-amber-900/10 border-amber-500/20 text-amber-400',
    red:    'from-red-600/20 to-red-900/10 border-red-500/20 text-red-400',
    cyan:   'from-cyan-600/20 to-cyan-900/10 border-cyan-500/20 text-cyan-400',
  }
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-5`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {sub !== undefined && <span className="text-xs text-gray-600 bg-gray-800/50 px-2 py-0.5 rounded-full">{sub}</span>}
      </div>
      <div className="text-3xl font-black text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}

// ==================== BADGE ====================
function Badge({ text, type }: { text: string; type: 'admin'|'user'|'banned'|'active'|'done'|'green'|'red'|'yellow' }) {
  const s: any = {
    admin:  'bg-red-900/30 text-red-400 border-red-700/30',
    user:   'bg-gray-800/60 text-gray-400 border-gray-700/30',
    banned: 'bg-red-900/50 text-red-300 border-red-600/40',
    active: 'bg-emerald-900/30 text-emerald-400 border-emerald-700/30',
    done:   'bg-blue-900/30 text-blue-400 border-blue-700/30',
    green:  'bg-emerald-900/30 text-emerald-400 border-emerald-700/30',
    red:    'bg-red-900/30 text-red-400 border-red-700/30',
    yellow: 'bg-amber-900/30 text-amber-400 border-amber-700/30',
  }
  return <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${s[type]}`}>{text}</span>
}

// ==================== CONFIRM MODAL ====================
function ConfirmModal({ msg, onConfirm, onCancel }: { msg: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0f0f1e] border border-red-500/30 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">⚠️</div>
          <p className="text-white font-bold mb-1">تأكيد الإجراء</p>
          <p className="text-gray-400 text-sm">{msg}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition text-sm">إلغاء</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition text-sm">تأكيد</button>
        </div>
      </div>
    </div>
  )
}

// ==================== USER DETAIL MODAL ====================
function UserDetailModal({ user, onClose, onBan, onUnban, onForceLogout, onDelete }: any) {
  const [showPass, setShowPass] = useState(false)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto py-8">
      <div className="bg-[#0a0a16] border border-violet-500/20 rounded-3xl p-6 max-w-2xl w-full mx-4 shadow-[0_0_60px_rgba(124,58,237,0.15)]">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-xl font-black text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]">
              {user.name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-white font-black text-xl">{user.name}</h2>
              <p className="text-violet-400 text-sm">{user.email}</p>
              <div className="flex gap-2 mt-1">
                <Badge text={user.role} type={user.role === 'admin' ? 'admin' : 'user'} />
                {user.banned && <Badge text="محظور" type="banned" />}
                {user.emailVerified && <Badge text="بريد موثق" type="green" />}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition text-xl w-8 h-8 flex items-center justify-center">✕</button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: 'الدولة', value: user.country || '—' },
            { label: 'المدينة', value: user.city || '—' },
            { label: 'الجنس', value: user.gender === 'male' ? 'ذكر' : user.gender === 'female' ? 'أنثى' : '—' },
            { label: 'الحالة', value: user.currentStatus || '—' },
            { label: 'الجامعة', value: user.university || '—' },
            { label: 'التخصص', value: user.major || '—' },
            { label: 'الدرجة', value: user.degree || '—' },
            { label: 'الشركة', value: user.company || '—' },
            { label: 'المسمى الوظيفي', value: user.jobTitle || '—' },
            { label: 'سنوات الخبرة', value: user.experience || '—' },
            { label: 'النقاط', value: user.points || 0 },
            { label: 'تاريخ التسجيل', value: new Date(user.createdAt).toLocaleDateString('ar-SA') },
          ].map((item, i) => (
            <div key={i} className="bg-[#0d0d1a] border border-violet-900/20 rounded-xl px-4 py-3">
              <p className="text-gray-500 text-xs mb-0.5">{item.label}</p>
              <p className="text-white text-sm font-medium">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="bg-[#0d0d1a] border border-violet-900/20 rounded-xl px-4 py-3 mb-3">
            <p className="text-gray-500 text-xs mb-1">النبذة التعريفية</p>
            <p className="text-gray-300 text-sm">{user.bio}</p>
          </div>
        )}

        {/* Skills */}
        {user.skills?.length > 0 && (
          <div className="bg-[#0d0d1a] border border-violet-900/20 rounded-xl px-4 py-3 mb-3">
            <p className="text-gray-500 text-xs mb-2">المهارات</p>
            <div className="flex flex-wrap gap-1.5">
              {user.skills.map((s: string) => (
                <span key={s} className="text-xs bg-violet-900/30 text-violet-300 border border-violet-700/30 px-2 py-0.5 rounded-lg">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Password */}
        <div className="bg-[#0d0d1a] border border-amber-500/20 rounded-xl px-4 py-3 mb-5">
          <div className="flex items-center justify-between">
            <p className="text-amber-400/70 text-xs">كلمة المرور (مشفّرة)</p>
            <button onClick={() => setShowPass(!showPass)} className="text-amber-400 text-xs hover:text-amber-300 transition">
              {showPass ? '🙈 إخفاء' : '👁️ إظهار'}
            </button>
          </div>
          {showPass && <p className="text-gray-400 text-xs mt-1 font-mono break-all">{user.password || '—'}</p>}
        </div>

        {/* Activity */}
        {user._count && (
          <div className="grid grid-cols-4 gap-2 mb-5">
            {[
              { label: 'مشاريع', value: user._count.projects, icon: '🚀' },
              { label: 'مواضيع', value: user._count.posts, icon: '💬' },
              { label: 'رسائل', value: user._count.messages, icon: '📨' },
              { label: 'تعليقات', value: user._count.comments, icon: '💭' },
            ].map((item, i) => (
              <div key={i} className="bg-[#0d0d1a] border border-violet-900/20 rounded-xl p-3 text-center">
                <div className="text-lg mb-0.5">{item.icon}</div>
                <div className="text-white font-black">{item.value}</div>
                <div className="text-gray-500 text-xs">{item.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Social Links */}
        {(user.github || user.facebook || user.instagram) && (
          <div className="flex gap-2 mb-5">
            {user.github && <a href={user.github} target="_blank" className="text-xs bg-gray-800 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition border border-gray-700">GitHub</a>}
            {user.facebook && <a href={user.facebook} target="_blank" className="text-xs bg-blue-900/30 text-blue-300 hover:text-white px-3 py-1.5 rounded-lg transition border border-blue-700/30">Facebook</a>}
            {user.instagram && <a href={user.instagram} target="_blank" className="text-xs bg-pink-900/30 text-pink-300 hover:text-white px-3 py-1.5 rounded-lg transition border border-pink-700/30">Instagram</a>}
          </div>
        )}

        {/* Actions */}
        {user.role !== 'admin' && (
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => { user.banned ? onUnban(user.id) : onBan(user.id); onClose() }}
              className={`py-2.5 rounded-xl text-sm font-bold transition ${user.banned ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30' : 'bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30'}`}>
              {user.banned ? '✅ رفع الحظر' : '🚫 حظر'}
            </button>
            <button onClick={() => { onForceLogout(user.id); onClose() }}
              className="py-2.5 rounded-xl text-sm font-bold bg-amber-600/20 border border-amber-500/30 text-amber-400 hover:bg-amber-600/30 transition">
              🔌 تسجيل خروج
            </button>
            <button onClick={() => { onDelete(user.id); onClose() }}
              className="py-2.5 rounded-xl text-sm font-bold bg-red-700/20 border border-red-600/30 text-red-300 hover:bg-red-700/30 transition">
              🗑️ حذف
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== MAIN ADMIN PAGE ====================
export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [stats, setStats] = useState({ users: 0, projects: 0, events: 0, posts: 0, messages: 0, banned: 0 })
  const [users, setUsers] = useState<User[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [confirm, setConfirm] = useState<{ msg: string; action: () => void } | null>(null)

  const [botLoading, setBotLoading] = useState(false)
  const [botResult, setBotResult] = useState('')
  const [customUrls, setCustomUrls] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') {
      if (session?.user?.role !== 'admin') router.push('/dashboard')
      else fetchAll()
    }
  }, [status, session])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [uRes, pRes, eRes, mRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/projects'),
        fetch('/api/admin/events'),
        fetch('/api/admin/messages'),
      ])
      const [uData, pData, eData, mData] = await Promise.all([
        uRes.json(), pRes.json(), eRes.json(), mRes.json()
      ])
      const usersArr = Array.isArray(uData) ? uData : []
      const projArr  = Array.isArray(pData) ? pData : []
      const evArr    = Array.isArray(eData) ? eData : []
      const msgArr   = Array.isArray(mData) ? mData : []
      setUsers(usersArr)
      setProjects(projArr)
      setEvents(evArr)
      setMessages(msgArr)
      setStats({
        users: usersArr.length,
        projects: projArr.length,
        events: evArr.length,
        posts: 0,
        messages: msgArr.length,
        banned: usersArr.filter((u: User) => u.banned).length,
      })
    } finally {
      setLoading(false)
    }
  }

  // ===== USER ACTIONS =====
  const banUser = async (id: string) => {
    await fetch(`/api/admin/users/${id}/ban`, { method: 'POST' })
    setUsers(u => u.map(x => x.id === id ? { ...x, banned: true } : x))
    setStats(s => ({ ...s, banned: s.banned + 1 }))
  }
  const unbanUser = async (id: string) => {
    await fetch(`/api/admin/users/${id}/unban`, { method: 'POST' })
    setUsers(u => u.map(x => x.id === id ? { ...x, banned: false } : x))
    setStats(s => ({ ...s, banned: s.banned - 1 }))
  }
  const forceLogout = async (id: string) => {
    await fetch(`/api/admin/users/${id}/logout`, { method: 'POST' })
  }
  const deleteUser = (id: string) => {
    setConfirm({
      msg: 'سيتم حذف هذا العضو وجميع بياناته نهائياً. هل أنت متأكد؟',
      action: async () => {
        await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
        setUsers(u => u.filter(x => x.id !== id))
        setStats(s => ({ ...s, users: s.users - 1 }))
        setConfirm(null)
      }
    })
  }

  // ===== PROJECT ACTIONS =====
  const deleteProject = (id: string) => {
    setConfirm({
      msg: 'سيتم حذف هذا المشروع نهائياً.',
      action: async () => {
        await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
        setProjects(p => p.filter(x => x.id !== id))
        setStats(s => ({ ...s, projects: s.projects - 1 }))
        setConfirm(null)
      }
    })
  }

  // ===== EVENT ACTIONS =====
  const deleteEvent = (id: string) => {
    setConfirm({
      msg: 'سيتم حذف هذه الفعالية نهائياً.',
      action: async () => {
        await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
        setEvents(e => e.filter(x => x.id !== id))
        setStats(s => ({ ...s, events: s.events - 1 }))
        setConfirm(null)
      }
    })
  }

  // ===== MESSAGE ACTIONS =====
  const deleteMessage = (id: string) => {
    setConfirm({
      msg: 'سيتم حذف هذه الرسالة نهائياً.',
      action: async () => {
        await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
        setMessages(m => m.filter(x => x.id !== id))
        setStats(s => ({ ...s, messages: s.messages - 1 }))
        setConfirm(null)
      }
    })
  }

  // ===== NEWS BOT =====
  const runNewsBot = async () => {
    setBotLoading(true); setBotResult('')
    const urls = customUrls.trim() ? customUrls.split('\n').map(u => u.trim()).filter(Boolean) : undefined
    const res = await fetch('/api/news-bot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ urls }) })
    const data = await res.json()
    setBotResult(data.message || 'تم')
    setBotLoading(false)
  }

  // ===== FILTER =====
  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const tabs = [
    { id: 'overview',  label: 'نظرة عامة',  icon: '📊' },
    { id: 'users',     label: 'الأعضاء',     icon: '👥' },
    { id: 'projects',  label: 'المشاريع',    icon: '🚀' },
    { id: 'events',    label: 'الفعاليات',   icon: '📅' },
    { id: 'messages',  label: 'الرسائل',     icon: '💬' },
    { id: 'bot',       label: 'بوت الأخبار', icon: '🤖' },
  ]

  if (loading) return (
    <div className="min-h-screen bg-[#060610] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-violet-400 text-sm">تحميل لوحة الإدارة...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#060610] text-white" dir="rtl">

      {/* Modals */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onBan={banUser} onUnban={unbanUser}
          onForceLogout={forceLogout} onDelete={deleteUser}
        />
      )}
      {confirm && <ConfirmModal msg={confirm.msg} onConfirm={confirm.action} onCancel={() => setConfirm(null)} />}

      {/* ✦ Navbar */}
      <nav className="border-b border-violet-900/20 bg-[#08080f]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(124,58,237,0.4)]">⚡</div>
            <div>
              <span className="font-black text-white tracking-widest">SAAIT</span>
              <span className="text-violet-400/50 text-xs mx-1">|</span>
              <span className="text-violet-400 text-xs tracking-wider">AI PLATFORM</span>
            </div>
            <span className="bg-red-900/40 text-red-400 text-xs px-2.5 py-0.5 rounded-full border border-red-600/30 font-bold">
              🛡️ ADMIN
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-white text-sm font-medium">{session?.user?.name}</p>
              <p className="text-gray-500 text-xs">مدير النظام</p>
            </div>
            <button onClick={() => fetchAll()} className="w-8 h-8 bg-violet-600/20 border border-violet-500/30 rounded-lg flex items-center justify-center text-violet-400 hover:bg-violet-600/30 transition text-sm" title="تحديث">🔄</button>
            <Link href="/dashboard" className="text-xs text-gray-400 hover:text-white transition bg-gray-800/50 border border-gray-700/50 px-3 py-1.5 rounded-lg">لوحة التحكم</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

        {/* ✦ Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1 flex items-center gap-3">
            <span className="text-2xl">🛡️</span> لوحة الإدارة
          </h1>
          <p className="text-gray-500 text-sm">مراقبة وإدارة كل شيء داخل منصة SAAIT</p>
        </div>

        {/* ✦ Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <StatCard icon="👥" label="إجمالي الأعضاء"  value={stats.users}    color="violet" />
          <StatCard icon="🚀" label="المشاريع"         value={stats.projects} color="blue"   />
          <StatCard icon="📅" label="الفعاليات"        value={stats.events}   color="green"  />
          <StatCard icon="💬" label="الرسائل"          value={stats.messages} color="cyan"   />
          <StatCard icon="🚫" label="المحظورون"        value={stats.banned}   color="red"    />
          <StatCard icon="✅" label="الموثقون"
            value={users.filter(u => u.emailVerified).length}
            color="yellow" />
        </div>

        {/* ✦ Tabs */}
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                  : 'text-gray-400 hover:text-white bg-gray-900/50 border border-gray-800 hover:border-violet-800/50'
              }`}>
              <span>{tab.icon}</span> {tab.label}
              {tab.id === 'users' && <span className="bg-white/20 text-xs px-1.5 rounded-full">{stats.users}</span>}
            </button>
          ))}
        </div>

        {/* ==================== OVERVIEW TAB ==================== */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Quick Actions */}
            <div className="bg-[#0a0a16] border border-violet-900/20 rounded-2xl p-5">
              <h3 className="text-white font-black mb-4 flex items-center gap-2">⚡ إجراءات سريعة</h3>
              <div className="space-y-2">
                {[
                  { href: '/admin/events/new', icon: '📅', title: 'إضافة فعالية', sub: 'نشر هاكاثون أو ندوة', color: 'hover:border-emerald-600/40' },
                  { href: '/admin/news/new',   icon: '📰', title: 'نشر خبر تقني',  sub: 'إضافة مقال أو خبر',  color: 'hover:border-blue-600/40'   },
                  { href: '/admin/users',      icon: '👥', title: 'إدارة الأعضاء', sub: 'عرض وإدارة الأعضاء', color: 'hover:border-violet-600/40' },
                  { href: '/projects/new',     icon: '🚀', title: 'إضافة مشروع',   sub: 'نشر مشروع جديد',    color: 'hover:border-cyan-600/40'   },
                ].map((item, i) => (
                  <Link key={i} href={item.href}
                    className={`flex items-center gap-3 bg-[#0d0d1a] border border-violet-900/15 ${item.color} rounded-xl p-3.5 transition-all duration-200 group`}>
                    <span className="text-xl w-9 h-9 flex items-center justify-center bg-violet-600/10 rounded-lg">{item.icon}</span>
                    <div>
                      <p className="text-white text-sm font-bold">{item.title}</p>
                      <p className="text-gray-500 text-xs">{item.sub}</p>
                    </div>
                    <span className="mr-auto text-gray-600 group-hover:text-gray-400 transition">←</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Latest Users */}
            <div className="bg-[#0a0a16] border border-violet-900/20 rounded-2xl p-5">
              <h3 className="text-white font-black mb-4 flex items-center gap-2">🆕 آخر الأعضاء المسجلين</h3>
              <div className="space-y-2.5">
                {users.slice(0, 6).map((user) => (
                  <button key={user.id} onClick={() => setSelectedUser(user)}
                    className="w-full flex items-center gap-3 hover:bg-violet-900/10 rounded-xl p-2 transition text-right">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 ${user.banned ? 'bg-red-700/50' : 'bg-gradient-to-br from-violet-600 to-indigo-700'}`}>
                      {user.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate">{user.name}</p>
                      <p className="text-gray-500 text-xs truncate">{user.email}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {user.banned
                        ? <Badge text="محظور" type="banned" />
                        : <Badge text={user.role} type={user.role === 'admin' ? 'admin' : 'user'} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Latest Projects */}
            <div className="bg-[#0a0a16] border border-violet-900/20 rounded-2xl p-5">
              <h3 className="text-white font-black mb-4 flex items-center gap-2">🚀 آخر المشاريع</h3>
              <div className="space-y-2.5">
                {projects.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center gap-3 bg-[#0d0d1a] rounded-xl p-3 border border-violet-900/10">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate">{p.title}</p>
                      <p className="text-gray-500 text-xs">{p.owner?.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-800 rounded-full h-1.5">
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-500 h-1.5 rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-gray-500 text-xs w-7">{p.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-[#0a0a16] border border-violet-900/20 rounded-2xl p-5">
              <h3 className="text-white font-black mb-4 flex items-center gap-2">🖥️ حالة النظام</h3>
              <div className="space-y-3">
                {[
                  { label: 'قاعدة البيانات', status: 'متصل', color: 'emerald' },
                  { label: 'Resend API', status: 'نشط', color: 'emerald' },
                  { label: 'chat AI', status: 'نشط', color: 'emerald' },
                  { label: 'نظام التحقق', status: 'مفعّل', color: 'emerald' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#0d0d1a] rounded-xl px-4 py-3 border border-violet-900/10">
                    <span className="text-gray-300 text-sm">{item.label}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-emerald-400 text-xs">{item.status}</span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between bg-[#0d0d1a] rounded-xl px-4 py-3 border border-violet-900/10">
                  <span className="text-gray-300 text-sm">الأعضاء المحظورون</span>
                  <span className="text-red-400 text-sm font-bold">{stats.banned}</span>
                </div>
                <div className="flex items-center justify-between bg-[#0d0d1a] rounded-xl px-4 py-3 border border-violet-900/10">
                  <span className="text-gray-300 text-sm">الأعضاء الموثقون</span>
                  <span className="text-violet-400 text-sm font-bold">{users.filter(u => u.emailVerified).length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== USERS TAB ==================== */}
        {activeTab === 'users' && (
          <div>
            {/* Search + Filter Bar */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="ابحث بالاسم أو البريد..."
                  className="w-full bg-[#0a0a16] border border-violet-900/30 text-white rounded-xl pr-9 pl-4 py-2.5 focus:outline-none focus:border-violet-500 text-sm" />
              </div>
              <button className="px-4 py-2.5 bg-violet-600/20 border border-violet-500/30 text-violet-400 rounded-xl text-sm hover:bg-violet-600/30 transition">
                {filteredUsers.length} عضو
              </button>
            </div>

            <div className="bg-[#0a0a16] border border-violet-900/20 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-violet-900/20 bg-[#0d0d1a]">
                      {['العضو', 'البريد', 'الدور', 'البلد', 'النقاط', 'التوثيق', 'الحالة', 'الإجراءات'].map((h, i) => (
                        <th key={i} className="text-right text-gray-500 text-xs font-bold px-4 py-3.5 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-violet-900/10 hover:bg-violet-900/5 transition">
                        <td className="px-4 py-3.5">
                          <button onClick={() => setSelectedUser(user)} className="flex items-center gap-2.5 group">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${user.banned ? 'bg-red-700/50' : 'bg-gradient-to-br from-violet-600 to-indigo-700'}`}>
                              {user.name?.charAt(0)}
                            </div>
                            <span className="text-white text-sm font-medium group-hover:text-violet-400 transition">{user.name}</span>
                          </button>
                        </td>
                        <td className="px-4 py-3.5 text-gray-400 text-sm">{user.email}</td>
                        <td className="px-4 py-3.5">
                          <Badge text={user.role === 'admin' ? 'مدير' : 'عضو'} type={user.role === 'admin' ? 'admin' : 'user'} />
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 text-sm">{user.country || '—'}</td>
                        <td className="px-4 py-3.5 text-violet-400 text-sm font-bold">{user.points || 0}</td>
                        <td className="px-4 py-3.5">
                          {user.emailVerified
                            ? <Badge text="موثق" type="green" />
                            : <Badge text="غير موثق" type="yellow" />}
                        </td>
                        <td className="px-4 py-3.5">
                          {user.banned
                            ? <Badge text="محظور" type="banned" />
                            : <Badge text="نشط" type="active" />}
                        </td>
                        <td className="px-4 py-3.5">
                          {user.role !== 'admin' && (
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => setSelectedUser(user)}
                                className="w-7 h-7 flex items-center justify-center bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 rounded-lg text-xs transition" title="تفاصيل">👁️</button>
                              <button onClick={() => user.banned ? unbanUser(user.id) : banUser(user.id)}
                                className={`w-7 h-7 flex items-center justify-center border rounded-lg text-xs transition ${user.banned ? 'bg-emerald-600/20 hover:bg-emerald-600/40 border-emerald-500/30' : 'bg-red-600/20 hover:bg-red-600/40 border-red-500/30'}`}
                                title={user.banned ? 'رفع الحظر' : 'حظر'}>
                                {user.banned ? '✅' : '🚫'}
                              </button>
                              <button onClick={() => forceLogout(user.id)}
                                className="w-7 h-7 flex items-center justify-center bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/30 rounded-lg text-xs transition" title="تسجيل خروج">🔌</button>
                              <button onClick={() => deleteUser(user.id)}
                                className="w-7 h-7 flex items-center justify-center bg-red-700/20 hover:bg-red-700/40 border border-red-600/30 rounded-lg text-xs transition" title="حذف">🗑️</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== PROJECTS TAB ==================== */}
        {activeTab === 'projects' && (
          <div className="bg-[#0a0a16] border border-violet-900/20 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-violet-900/20 bg-[#0d0d1a]">
                    {['المشروع', 'المجال', 'الحالة', 'التقدم', 'تاريخ الإنشاء', 'الإجراءات'].map((h, i) => (
                      <th key={i} className="text-right text-gray-500 text-xs font-bold px-4 py-3.5 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id} className="border-b border-violet-900/10 hover:bg-violet-900/5 transition">
                      <td className="px-4 py-3.5">
                        <p className="text-white text-sm font-bold">{p.title}</p>
                        <p className="text-gray-500 text-xs">{p.owner?.name}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs bg-violet-900/30 text-violet-300 border border-violet-700/30 px-2.5 py-1 rounded-full">{p.field}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge text={p.status === 'active' ? 'نشط' : 'مكتمل'} type={p.status === 'active' ? 'active' : 'done'} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-800 rounded-full h-1.5">
                            <div className="bg-gradient-to-r from-violet-600 to-indigo-500 h-1.5 rounded-full" style={{ width: `${p.progress}%` }} />
                          </div>
                          <span className="text-gray-400 text-xs">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-sm">{new Date(p.createdAt).toLocaleDateString('ar-SA')}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-1.5">
                          <Link href={`/projects/${p.id}`}
                            className="w-7 h-7 flex items-center justify-center bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 rounded-lg text-xs transition" title="عرض">👁️</Link>
                          <button onClick={() => deleteProject(p.id)}
                            className="w-7 h-7 flex items-center justify-center bg-red-700/20 hover:bg-red-700/40 border border-red-600/30 rounded-lg text-xs transition" title="حذف">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== EVENTS TAB ==================== */}
        {activeTab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-black">الفعاليات ({events.length})</h3>
              <Link href="/admin/events/new"
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold rounded-xl hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition">
                + إضافة فعالية
              </Link>
            </div>
            <div className="grid gap-3">
              {events.length === 0 && (
                <div className="text-center py-12 text-gray-600">
                  <div className="text-4xl mb-3">📅</div>
                  <p>لا توجد فعاليات بعد</p>
                </div>
              )}
              {events.map(ev => (
                <div key={ev.id} className="bg-[#0a0a16] border border-violet-900/20 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-600/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📅</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold">{ev.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-gray-500 text-xs">{new Date(ev.date).toLocaleDateString('ar-SA')}</span>
                      {ev.location && <span className="text-gray-600 text-xs">📍 {ev.location}</span>}
                      <span className="text-xs bg-emerald-900/30 text-emerald-400 border border-emerald-700/30 px-2 py-0.5 rounded-full">{ev.type}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Link href={`/events/${ev.id}/edit`}
                      className="w-8 h-8 flex items-center justify-center bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 rounded-lg text-xs transition">✏️</Link>
                    <button onClick={() => deleteEvent(ev.id)}
                      className="w-8 h-8 flex items-center justify-center bg-red-700/20 hover:bg-red-700/40 border border-red-600/30 rounded-lg text-xs transition">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== MESSAGES TAB ==================== */}
        {activeTab === 'messages' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-black">الرسائل المباشرة ({messages.length})</h3>
            </div>
            <div className="bg-[#0a0a16] border border-violet-900/20 rounded-2xl overflow-hidden">
              {messages.length === 0 && (
                <div className="text-center py-12 text-gray-600">
                  <div className="text-4xl mb-3">💬</div>
                  <p>لا توجد رسائل</p>
                </div>
              )}
              <div className="divide-y divide-violet-900/10">
                {messages.map(msg => (
                  <div key={msg.id} className="flex items-start gap-4 p-4 hover:bg-violet-900/5 transition">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-sm font-black flex-shrink-0">
                      {msg.sender?.name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white text-sm font-bold">{msg.sender?.name}</span>
                        <span className="text-gray-600 text-xs">←</span>
                        <span className="text-gray-400 text-sm">{msg.receiver?.name}</span>
                        <span className="text-gray-600 text-xs mr-auto">{new Date(msg.createdAt).toLocaleString('ar-SA')}</span>
                      </div>
                      <p className="text-gray-400 text-sm truncate">{msg.content}</p>
                    </div>
                    <button onClick={() => deleteMessage(msg.id)}
                      className="w-8 h-8 flex items-center justify-center bg-red-700/20 hover:bg-red-700/40 border border-red-600/30 rounded-lg text-xs transition flex-shrink-0">🗑️</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== BOT TAB ==================== */}
        {activeTab === 'bot' && (
          <div className="max-w-xl">
            <div className="bg-[#0a0a16] border border-violet-900/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-violet-600/10 border border-violet-500/20 rounded-xl flex items-center justify-center text-2xl">🤖</div>
                <div>
                  <h3 className="text-white font-black text-lg">بوت الأخبار التلقائي</h3>
                  <p className="text-gray-500 text-sm">ينشر أخباراً تقنية باستخدام Claude AI</p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2 font-medium">روابط مخصصة (اختياري — رابط في كل سطر)</label>
                <textarea value={customUrls} onChange={e => setCustomUrls(e.target.value)} rows={4}
                  className="w-full bg-[#0d0d1a] text-white rounded-xl px-4 py-3 border border-violet-900/30 focus:border-violet-500 focus:outline-none resize-none text-sm"
                  placeholder="https://example.com/news&#10;https://another-site.com/blog" />
              </div>
              {botResult && (
                <div className="mb-4 bg-emerald-900/20 border border-emerald-700/40 text-emerald-400 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                  <span>✅</span> {botResult}
                </div>
              )}
              <button onClick={runNewsBot} disabled={botLoading}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl transition hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center justify-center gap-2">
                {botLoading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> جاري نشر الأخبار...</>
                ) : (
                  <>🚀 تشغيل بوت الأخبار</>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
