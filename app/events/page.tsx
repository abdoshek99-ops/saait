'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const TYPES = ['الكل', 'هاكاثون', 'ندوة', 'ورشة عمل', 'مؤتمر', 'بث مباشر']

const menuItems = [
  { href: '/dashboard', icon: '', label: 'الرئيسية' },
  { href: '/projects', icon: '', label: 'المشاريع' },
  { href: '/events', icon: '', label: 'الفعاليات' },
  { href: '/community', icon: '', label: 'المجتمع' },
  { href: '/news', icon: '', label: 'الأخبار' },
]

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState('الكل')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    const res = await fetch('/api/events')
    const data = await res.json()
    setEvents(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const filtered = type === 'الكل' ? events : events.filter(e => e.type === type)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isUpcoming = (date: string) => new Date(date) > new Date()

  return (
    <div className="min-h-screen bg-[#050508] text-white" dir="rtl">

      {/* NAVBAR */}
      <nav className="border-b border-purple-900/40 bg-[#080810]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold">
              S
            </div>
            <div>
              <span className="font-bold text-white text-sm">SAAIT</span>
              <p className="text-purple-400 text-xs">Building Syria's Tech Future</p>
            </div>
          </Link>

          {/* Menu */}
          <div className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            {menuItems.map((item) => {
              const active = item.href === '/events'
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm transition relative
                    ${active
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white hover:bg-purple-900/20'
                    }`}
                >
                  <span className="ml-1">{item.icon}</span>
                  {item.label}

                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Create Event Button */}
          <Link
            href="/events/new"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white text-sm px-5 py-2 rounded-xl font-medium"
          >
            + إنشاء فعالية
          </Link>

        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">الفعاليات التقنية</h1>
          <p className="text-gray-400">هاكاثونات، ندوات، ورش عمل، ومؤتمرات تقنية</p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap mb-10">
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-2 rounded-full text-sm border transition
                ${type === t
                  ? 'bg-purple-600 text-white border-purple-500'
                  : 'bg-[#0d0d18] text-gray-400 border-gray-800 hover:border-purple-700'
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold mb-2">لا توجد فعاليات بعد</h3>
            <p className="text-gray-500">ابدأ بإضافة أول فعالية الآن</p>

            <Link
              href="/events/new"
              className="inline-block mt-6 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl"
            >
              إنشاء فعالية جديدة
            </Link>
          </div>
        ) : (
          /* GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filtered.map((event: any) => (
              <div
                key={event.id}
                className="relative bg-[#0d0d18] border border-gray-800 rounded-3xl overflow-hidden group hover:scale-[1.02] transition"
              >

                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition" />

                {/* Header */}
                <div className="p-6 border-b border-gray-800 relative z-10">
                  <div className="flex justify-between mb-3">
                    <span className="bg-purple-900/30 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-700/30">
                      {event.type}
                    </span>

                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isUpcoming(event.date)
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-gray-800 text-gray-500'
                    }`}>
                      {isUpcoming(event.date) ? 'قادم' : 'منتهي'}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg group-hover:text-purple-400">
                    {event.title}
                  </h3>
                </div>

                {/* Body */}
                <div className="p-6 relative z-10">

                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-400 mb-5">

                    <div>📅 {formatDate(event.date)}</div>
                    {event.speaker && <div>🎤 {event.speaker}</div>}
                    <div>{event.isOnline ? '🌐 أونلاين' : `📍 ${event.location}`}</div>
                    <div>👥 {event._count?.registrations} مسجل</div>

                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">

                    {isUpcoming(event.date) && (
                      <button className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded-xl">
                        سجّل الآن
                      </button>
                    )}

                    {event.streamUrl && (
                      <a
                        href={event.streamUrl}
                        target="_blank"
                        className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-xl text-center"
                      >
                        بث مباشر
                      </a>
                    )}

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  )
}