'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NotificationsPage() {
  const router = useRouter()

  const [notifications, setNotifications] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'notifications' | 'messages'>('notifications')
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [loading, setLoading] = useState(true)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [notifRes, msgRes] = await Promise.all([
        fetch('/api/notifications'),
        fetch('/api/messages')
      ])

      const notifData = await notifRes.json()
      const msgData = await msgRes.json()

      setNotifications(Array.isArray(notifData) ? notifData : [])
      setMessages(Array.isArray(msgData) ? msgData : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const markAllAsRead = async () => {
    await fetch('/api/notifications', { method: 'PUT' })
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotif = async (id: string) => {
    await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' })
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const formatTime = (date: string) => {
    const d = new Date(date)
    const diff = Date.now() - d.getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (mins < 1) return 'الآن'
    if (mins < 60) return `${mins} دقيقة`
    if (hours < 24) return `${hours} ساعة`
    return `${days} يوم`
  }

  const filtered = notifications.filter(n =>
    filter === 'all' ? true : !n.read
  )

  return (
    <div className="min-h-screen bg-[#080810] text-white p-4 md:p-8" dir="rtl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">الإشعارات</h1>

        <div className="flex gap-2">
          <button
            onClick={markAllAsRead}
            className="bg-[#13131f] hover:bg-gray-800 text-sm px-4 py-2 rounded-xl transition"
          >
            تحديد الكل كمقروء
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 mb-4">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 py-3 ${activeTab === 'notifications' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-500'}`}
        >
          🔔 الإشعارات ({unreadCount})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex-1 py-3 ${activeTab === 'messages' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-500'}`}
        >
          ✉️ الرسائل
        </button>
      </div>

      {/* Filter */}
      {activeTab === 'notifications' && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm ${filter === 'all' ? 'bg-purple-600' : 'bg-gray-800'}`}
          >
            الكل
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-lg text-sm ${filter === 'unread' ? 'bg-purple-600' : 'bg-gray-800'}`}
          >
            غير المقروء
          </button>
        </div>
      )}

      {/* Content */}
      <div className="bg-[#0a0a12] border border-gray-800 rounded-2xl overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-gray-500">جاري التحميل...</div>
        ) : activeTab === 'notifications' ? (

          filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              لا توجد إشعارات
            </div>
          ) : (
            filtered.map(n => (
              <div
                key={n.id}
                className={`p-4 border-b border-gray-800 hover:bg-gray-800/30 transition cursor-pointer ${!n.read ? 'bg-purple-900/10' : ''}`}
              >
                <div className="flex items-start gap-3">

                  <div className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center">
                    {n.type === 'message' ? '✉️' : '🔔'}
                  </div>

                  <div
                    className="flex-1"
                    onClick={() => {
                      if (n.link) router.push(n.link)
                    }}
                  >
                    <p className="font-medium">{n.title}</p>
                    <p className="text-gray-400 text-sm">{n.message}</p>
                    <p className="text-gray-600 text-xs mt-1">
                      {formatTime(n.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {!n.read && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    )}

                    <button
                      onClick={() => deleteNotif(n.id)}
                      className="text-red-400 text-xs hover:text-red-300"
                    >
                      حذف
                    </button>
                  </div>

                </div>
              </div>
            ))
          )

        ) : (

          messages.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              لا توجد رسائل
            </div>
          ) : (
            messages.map((m: any) => (
              <div
                key={m.id}
                className="p-4 border-b border-gray-800 hover:bg-gray-800/30 transition cursor-pointer"
                onClick={() => router.push(`/messages?with=${m.senderId}`)}
              >
                <p className="font-medium">{m.content}</p>
                <p className="text-gray-600 text-xs mt-1">
                  {formatTime(m.createdAt)}
                </p>
              </div>
            ))
          )

        )}

      </div>
    </div>
  )
}