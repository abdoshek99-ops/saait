'use client'
import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Navbar() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notifications, setNotifications] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [showNotif, setShowNotif] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [activeNotifTab, setActiveNotifTab] = useState('notifications')
  const searchRef = useRef<HTMLInputElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const unreadNotif = notifications.filter(n => !n.read).length
  const unreadMessages = messages.filter(m => !m.read && m.receiverId === session?.user?.id).length
  const totalUnread = unreadNotif + unreadMessages

  useEffect(() => {
    if (session) {
      fetchNotifications()
      fetchMessages()
      const interval = setInterval(() => {
        fetchNotifications()
        fetchMessages()
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [session])

  useEffect(() => {
    if (showSearch) searchRef.current?.focus()
  }, [showSearch])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false)
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications')
      const data = await res.json()
      setNotifications(Array.isArray(data) ? data : [])
    } catch {}
  }

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages')
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch {}
  }

  const markNotifAsRead = async () => {
    await fetch('/api/notifications', { method: 'PUT' })
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSearch(false)
      setSearchQuery('')
    }
  }

  const getConversationUsers = () => {
    const seen = new Set()
    const convUsers: any[] = []
    messages.forEach(msg => {
      const other = msg.senderId === session?.user?.id ? msg.receiver : msg.sender
      if (other && !seen.has(other.id)) {
        seen.add(other.id)
        convUsers.push({ ...other, lastMessage: msg })
      }
    })
    return convUsers.slice(0, 5)
  }

  const formatTime = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return 'الآن'
    if (mins < 60) return `${mins} دقيقة`
    if (hours < 24) return `${hours} ساعة`
    return `${days} يوم`
  }

  // ✅ دالة لعرض صورة أو حرف المستخدم
  const UserAvatar = ({ size = 'sm' }: { size?: 'sm' | 'md' }) => {
    const dimension = size === 'sm' ? 'w-7 h-7 text-sm' : 'w-10 h-10 text-base'
    if (session?.user?.image) {
      return (
        <img
          src={session.user.image}
          alt={session.user.name || ''}
          className={`${dimension} rounded-full object-cover`}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      )
    }
    return (
      <div className={`${dimension} rounded-full bg-purple-700 flex items-center justify-center font-bold text-white`}>
        {session?.user?.name?.charAt(0).toUpperCase() || '?'}
      </div>
    )
  }

  // ✅ رابط الملف الشخصي آمن — لا يذهب لـ /profile/undefined
  const profileHref = session?.user?.id ? `/profile/${session.user.id}` : '/dashboard'

  return (
    <nav className="border-b border-purple-900/40 bg-[#080810] sticky top-0 z-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center font-bold">S</div>
          <div className="hidden sm:block">
            <span className="font-bold text-white">SAAIT</span>
            <p className="text-purple-400 text-xs">Building Syria's Tech Future</p>
          </div>
        </Link>

        {/* Search Bar Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input
              ref={searchRef}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#13131f] text-white rounded-xl pr-10 pl-4 py-2 border border-gray-700 focus:border-purple-500 focus:outline-none text-sm"
              placeholder="ابحث في المنصة..."
            />
          </div>
        </form>

        {/* Right Side */}
        <div className="flex items-center gap-2">

          {/* Search Mobile */}
          <button onClick={() => setShowSearch(!showSearch)}
            className="md:hidden w-9 h-9 bg-[#13131f] hover:bg-[#1a1a2e] rounded-xl flex items-center justify-center transition">
            🔍
          </button>

          {status === 'loading' ? (
            <div className="w-8 h-8 rounded-full bg-purple-900/30 animate-pulse" />
          ) : session ? (
            <>
              {/* Notifications Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => { setShowNotif(!showNotif); setShowMenu(false) }}
                  className="relative w-9 h-9 bg-[#13131f] hover:bg-[#1a1a2e] rounded-xl flex items-center justify-center transition">
                  <span>🔔</span>
                  {totalUnread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                      {totalUnread > 9 ? '9+' : totalUnread}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotif && (
                  <div className="absolute left-0 mt-2 w-96 bg-[#0a0a12] border border-gray-700/80 rounded-2xl shadow-2xl overflow-hidden">

                    <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                      <span className="text-white font-bold">الإشعارات والرسائل</span>
                      <button onClick={() => setShowNotif(false)} className="text-gray-500 hover:text-white transition">✕</button>
                    </div>

                    <div className="flex border-b border-gray-800">
                      <button
                        onClick={() => { setActiveNotifTab('notifications'); markNotifAsRead() }}
                        className={`flex-1 py-2.5 text-sm font-medium transition flex items-center justify-center gap-2 ${activeNotifTab === 'notifications' ? 'text-white border-b-2 border-purple-500' : 'text-gray-500 hover:text-gray-300'}`}>
                        🔔 الإشعارات
                        {unreadNotif > 0 && (
                          <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {unreadNotif}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => setActiveNotifTab('messages')}
                        className={`flex-1 py-2.5 text-sm font-medium transition flex items-center justify-center gap-2 ${activeNotifTab === 'messages' ? 'text-white border-b-2 border-purple-500' : 'text-gray-500 hover:text-gray-300'}`}>
                        ✉️ الرسائل
                        {unreadMessages > 0 && (
                          <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {unreadMessages}
                          </span>
                        )}
                      </button>
                    </div>

                    {activeNotifTab === 'notifications' && (
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="text-center py-10">
                            <div className="text-4xl mb-2">🔔</div>
                            <p className="text-gray-500 text-sm">لا توجد إشعارات</p>
                          </div>
                        ) : (
                          notifications.map(n => (
                            <div key={n.id}
                              className={`px-4 py-3 border-b border-gray-800/50 hover:bg-gray-800/30 transition cursor-pointer ${!n.read ? 'bg-purple-900/10' : ''}`}
                              onClick={() => { if (n.link) router.push(n.link); setShowNotif(false) }}>
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center text-sm flex-shrink-0">
                                  {n.type === 'message' ? '✉️' : n.type === 'project' ? '🚀' : '🔔'}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                  <p className="text-white text-sm font-medium">{n.title}</p>
                                  <p className="text-gray-400 text-xs mt-0.5 truncate">{n.message}</p>
                                  <p className="text-gray-600 text-xs mt-1">{formatTime(n.createdAt)}</p>
                                </div>
                                {!n.read && (
                                  <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-1" />
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {activeNotifTab === 'messages' && (
                      <div className="max-h-80 overflow-y-auto">
                        {getConversationUsers().length === 0 ? (
                          <div className="text-center py-10">
                            <div className="text-4xl mb-2">✉️</div>
                            <p className="text-gray-500 text-sm">لا توجد رسائل</p>
                          </div>
                        ) : (
                          getConversationUsers().map((user: any) => (
                            <div key={user.id}
                              className="px-4 py-3 border-b border-gray-800/50 hover:bg-gray-800/30 transition cursor-pointer"
                              onClick={() => { router.push(`/messages?with=${user.id}`); setShowNotif(false) }}>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center font-bold flex-shrink-0">
                                  {user.name?.charAt(0)}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                  <p className="text-white text-sm font-medium">{user.name}</p>
                                  <p className="text-gray-400 text-xs truncate">{user.lastMessage?.content}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-gray-600 text-xs">{formatTime(user.lastMessage?.createdAt)}</p>
                                  {!user.lastMessage?.read && user.lastMessage?.receiverId === session?.user?.id && (
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-auto mt-1" />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    <div className="px-4 py-3 border-t border-gray-800 grid grid-cols-2 gap-2">
                      <Link href="/messages" onClick={() => setShowNotif(false)}
                        className="bg-[#13131f] hover:bg-gray-800 text-gray-400 hover:text-white text-xs py-2 rounded-xl transition text-center">
                        كل الرسائل ←
                      </Link>
                      <button
                        onClick={() => { markNotifAsRead(); setShowNotif(false) }}
                        className="bg-[#13131f] hover:bg-gray-800 text-gray-400 hover:text-white text-xs py-2 rounded-xl transition">
                        تحديد كمقروء ✓
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => { setShowMenu(!showMenu); setShowNotif(false) }}
                  className="flex items-center gap-2 bg-[#13131f] hover:bg-[#1a1a2e] rounded-xl px-2 py-1.5 transition">
                  {/* ✅ صورة المستخدم أو حرفه */}
                  <UserAvatar size="sm" />
                  <span className="text-white text-sm hidden md:block">{session.user?.name}</span>
                  <span className="text-gray-400 text-xs">▼</span>
                </button>

                {showMenu && (
                  <div className="absolute left-0 mt-2 w-52 bg-[#0a0a12] border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
                    {/* ✅ رابط آمن لا يذهب لـ /profile/undefined */}
                    <Link href={profileHref} onClick={() => setShowMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 transition text-sm">
                      👤 الملف الشخصي
                    </Link>
                    <Link href="/profile/edit" onClick={() => setShowMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 transition text-sm">
                      ✏️ تعديل الملف
                    </Link>
                    <Link href="/messages" onClick={() => setShowMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 transition text-sm">
                      ✉️ الرسائل
                    </Link>
                    <Link href="/leaderboard" onClick={() => setShowMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 transition text-sm">
                      🏆 المتصدرون
                    </Link>
                    <Link href="/dashboard" onClick={() => setShowMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 transition text-sm">
                      🏠 لوحة التحكم
                    </Link>
                    {session.user?.role === 'admin' && (
                      <Link href="/admin" onClick={() => setShowMenu(false)}
                        className="flex items-center gap-2 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-gray-800 transition text-sm">
                        ⚙️ لوحة الإدارة
                      </Link>
                    )}
                    <div className="border-t border-gray-800">
                      <button onClick={() => signOut({ callbackUrl: '/login' })}
                        className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-gray-800 transition text-sm">
                        🚪 تسجيل الخروج
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm text-gray-400 hover:text-white transition px-3 py-2">دخول</Link>
              <Link href="/register" className="text-sm bg-purple-600 hover:bg-purple-700 transition text-white px-3 py-2 rounded-lg font-medium">انضم</Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search */}
      {showSearch && (
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#13131f] text-white rounded-xl pr-10 pl-4 py-2.5 border border-gray-700 focus:border-purple-500 focus:outline-none text-sm"
                placeholder="ابحث في المنصة..."
                autoFocus
              />
            </div>
          </form>
        </div>
      )}
    </nav>
  )
}