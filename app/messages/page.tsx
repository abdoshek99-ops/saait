'use client'
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function MessagesContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const withUserId = searchParams.get('with')
  const [conversations, setConversations] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showUsers, setShowUsers] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [searchUser, setSearchUser] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') {
      fetchConversations()
      fetchUsers()
    }
  }, [status])

  useEffect(() => {
    if (withUserId && users.length > 0) {
      const user = users.find(u => u.id === withUserId)
      if (user) selectUser(user)
    }
  }, [withUserId, users])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!selectedUser) return
    const interval = setInterval(() => fetchMessages(selectedUser.id), 3000)
    return () => clearInterval(interval)
  }, [selectedUser])

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/messages')
      const data = await res.json()
      setConversations(Array.isArray(data) ? data : [])
    } catch {}
    setLoading(false)
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch {}
  }

  const fetchMessages = async (userId: string) => {
    try {
      const res = await fetch(`/api/messages?with=${userId}`)
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch {}
  }

  const selectUser = async (user: any) => {
    setSelectedUser(user)
    setShowChat(true)
    setShowUsers(false)
    await fetchMessages(user.id)
    router.push(`/messages?with=${user.id}`, { scroll: false })
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || sending) return
    setSending(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: selectedUser.id, content: newMessage.trim() }),
      })
      if (res.ok) {
        setNewMessage('')
        await fetchMessages(selectedUser.id)
      }
    } catch {}
    setSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getConversationUsers = () => {
    const seen = new Set<string>()
    const convUsers: any[] = []
    conversations.forEach(msg => {
      const currentId = (session?.user as any)?.id
      const other = msg.senderId === currentId ? msg.receiver : msg.sender
      if (other && !seen.has(other.id)) {
        seen.add(other.id)
        convUsers.push({ ...other, lastMessage: msg })
      }
    })
    return convUsers
  }

  const filteredUsers = users.filter(u =>
    u.name !== session?.user?.name &&
    u.name?.toLowerCase().includes(searchUser.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col" dir="rtl">

      {/* Navbar */}
      <nav className="border-b border-purple-900/40 bg-[#080810] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center font-bold text-white">S</div>
            <span className="font-bold text-white hidden sm:block">SAAIT</span>
          </Link>
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm transition">
            ← لوحة التحكم
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-2 sm:px-4 py-4 gap-4 overflow-hidden" style={{ height: 'calc(100vh - 65px)' }}>

        {/* Sidebar - قائمة المحادثات */}
        <div className={`${showChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 bg-[#0a0a12] border border-gray-800/80 rounded-2xl flex-col overflow-hidden`}>
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-bold text-lg">الرسائل</h2>
              <button
                onClick={() => setShowUsers(!showUsers)}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
              >
                + محادثة جديدة
              </button>
            </div>
            {showUsers && (
              <input
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                className="w-full bg-[#13131f] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-purple-500 focus:outline-none text-sm"
                placeholder="ابحث عن عضو..."
              />
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {showUsers ? (
              <div className="p-2">
                {filteredUsers.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">لا يوجد أعضاء</p>
                )}
                {filteredUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => selectUser(user)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-purple-900/20 transition text-right"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center font-bold flex-shrink-0 overflow-hidden">
                      {user.profile?.avatar
                        ? <img src={user.profile.avatar} alt="" className="w-full h-full object-cover" />
                        : user.name?.charAt(0)
                      }
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{user.name}</p>
                      <p className="text-gray-500 text-xs">{user.profile?.jobTitle || 'عضو'}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-2">
                {getConversationUsers().length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">💬</div>
                    <p className="text-gray-500 text-sm">لا توجد محادثات بعد</p>
                    <button
                      onClick={() => setShowUsers(true)}
                      className="mt-3 text-purple-400 text-xs hover:underline"
                    >
                      ابدأ محادثة جديدة
                    </button>
                  </div>
                ) : (
                  getConversationUsers().map(user => (
                    <button
                      key={user.id}
                      onClick={() => selectUser(user)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition text-right ${
                        selectedUser?.id === user.id ? 'bg-purple-900/30' : 'hover:bg-purple-900/20'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center font-bold flex-shrink-0 overflow-hidden">
                        {user.profile?.avatar
                          ? <img src={user.profile.avatar} alt="" className="w-full h-full object-cover" />
                          : user.name?.charAt(0)
                        }
                      </div>
                      <div className="flex-1 overflow-hidden text-right">
                        <p className="text-white text-sm font-medium">{user.name}</p>
                        <p className="text-gray-500 text-xs truncate">{user.lastMessage?.content}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${showChat ? 'flex' : 'hidden md:flex'} flex-1 bg-[#0a0a12] border border-gray-800/80 rounded-2xl flex-col overflow-hidden`}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-800 flex items-center gap-3">
                {/* زر الرجوع على الموبايل */}
                <button
                  onClick={() => { setShowChat(false); setSelectedUser(null) }}
                  className="md:hidden text-gray-400 hover:text-white ml-1"
                >
                  ←
                </button>
                <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center font-bold overflow-hidden flex-shrink-0">
                  {selectedUser.profile?.avatar
                    ? <img src={selectedUser.profile.avatar} alt="" className="w-full h-full object-cover" />
                    : selectedUser.name?.charAt(0)
                  }
                </div>
                <div>
                  <p className="text-white font-medium">{selectedUser.name}</p>
                  <p className="text-gray-500 text-xs">{selectedUser.profile?.jobTitle || 'عضو'}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-8 text-gray-600 text-sm">
                    ابدأ المحادثة مع {selectedUser.name}
                  </div>
                )}
                {messages.map((msg: any) => {
                  const currentId = (session?.user as any)?.id
                  const isMe = msg.senderId === currentId
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${
                        isMe
                          ? 'bg-purple-600 text-white rounded-tr-sm'
                          : 'bg-[#13131f] text-gray-200 rounded-tl-sm'
                      }`}>
                        {msg.imageUrl && (
                          <img src={msg.imageUrl} alt="صورة" className="rounded-lg mb-2 max-w-full" />
                        )}
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-purple-200' : 'text-gray-500'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString('ar-SA', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-800">
                <div className="flex items-end gap-3">
                  <div className="flex-1 bg-[#13131f] rounded-2xl border border-gray-700 focus-within:border-purple-500 transition">
                    <textarea
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={1}
                      className="w-full bg-transparent text-white px-4 py-3 focus:outline-none resize-none text-sm"
                      placeholder="اكتب رسالتك... (Enter للإرسال)"
                      style={{ maxHeight: '120px' }}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={sending || !newMessage.trim()}
                    className="w-12 h-12 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-2xl flex items-center justify-center transition flex-shrink-0"
                  >
                    {sending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="text-lg">➤</span>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-white font-bold text-xl mb-2">ابدأ محادثة</h3>
                <p className="text-gray-600 text-sm">اختر محادثة من القائمة أو ابدأ محادثة جديدة</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense>
      <MessagesContent />
    </Suspense>
  )
}
