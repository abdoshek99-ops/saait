'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const TYPES = ['هاكاثون', 'ندوة', 'ورشة عمل', 'مؤتمر', 'بث مباشر']

export default function NewEventPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: '',
    date: '',
    time:'',
    speaker: '',
    location: '',
    isOnline: true,
    streamUrl: '',
    registerUrl: '',
    maxAttendees: '',
  })

  const update = (key: string, value: any) =>
    setForm(p => ({ ...p, [key]: value }))

  const handleSubmit = async () => {
    setError('')

    if (!session) { router.push('/login'); return }
    if ((session.user as any)?.role !== 'admin') {
      setError('فقط المدير يمكنه إنشاء فعاليات'); return
    }
    if (!form.title.trim() || !form.description.trim() || !form.type || !form.date) {
      setError('العنوان والوصف والنوع والتاريخ مطلوبة'); return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'حدث خطأ'); return }
      router.push('/events')
    } catch {
      setError('خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050508] text-white" dir="rtl"
      style={{ backgroundImage: `radial-gradient(ellipse at top, rgba(124,58,237,0.06) 0%, transparent 60%)` }}>

      {/* Navbar */}
      <nav className="border-b border-violet-900/20 bg-[#08080f]/90 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700
                            flex items-center justify-center font-black text-sm
                            shadow-[0_0_15px_rgba(124,58,237,0.3)]">⚡</div>
            <span className="font-black text-white tracking-widest hidden sm:block">SAAIT</span>
          </Link>
          <Link href="/events" className="text-gray-400 hover:text-white transition text-sm">
            ← العودة للفعاليات
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600/20 to-teal-600/20
                          border-2 border-emerald-500/30 rounded-2xl
                          flex items-center justify-center text-3xl mx-auto mb-4
                          shadow-[0_0_30px_rgba(16,185,129,0.15)]">📅</div>
          <h1 className="text-3xl font-black text-white mb-2">إنشاء فعالية جديدة</h1>
          <p className="text-gray-500">أضف هاكاثون، ندوة، أو ورشة عمل للمجتمع</p>
        </div>

        <div className="bg-[#0a0a16] border border-violet-900/20 rounded-3xl p-7 space-y-5
                        shadow-[0_0_40px_rgba(124,58,237,0.05)]">

          <div className="h-0.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600
                          -mt-7 mb-7 -mx-7 rounded-t-3xl"></div>

          {/* العنوان */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5 font-medium">
              عنوان الفعالية <span className="text-red-400">*</span>
            </label>
            <input value={form.title} onChange={e => update('title', e.target.value)}
              className="w-full bg-[#0d0d1a] text-white rounded-xl px-4 py-3
                         border border-violet-900/30 focus:border-violet-500
                         focus:outline-none transition placeholder-gray-700"
              placeholder="مثال: هاكاثون الذكاء الاصطناعي 2025" />
          </div>

          {/* الوصف */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5 font-medium">
              وصف الفعالية <span className="text-red-400">*</span>
            </label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)}
              rows={4}
              className="w-full bg-[#0d0d1a] text-white rounded-xl px-4 py-3
                         border border-violet-900/30 focus:border-violet-500
                         focus:outline-none transition resize-none placeholder-gray-700"
              placeholder="اشرح تفاصيل الفعالية، أهدافها، والجمهور المستهدف..." />
          </div>

          {/* نوع الفعالية */}
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">
              نوع الفعالية <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(t => (
                <button key={t} type="button" onClick={() => update('type', t)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    form.type === t
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : 'bg-[#0d0d1a] text-gray-400 border border-violet-900/30 hover:border-violet-500/50 hover:text-white'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* التاريخ */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5 font-medium">
              تاريخ ووقت الفعالية <span className="text-red-400">*</span>
            </label>
            {/* التاريخ والوقت */}
<div>
  <label className="block text-gray-400 text-sm mb-1.5 font-medium">
    <span className="text-red-400"></span>
  </label>

  <div className="grid grid-cols-2 gap-3">
    
    {/* التاريخ */}
    <input
      type="date"
      value={form.date}
      onChange={(e) => update('date', e.target.value)}
      className="w-full bg-[#0d0d1a] text-white rounded-xl px-4 py-3
      border border-violet-900/30 focus:border-violet-500
      focus:outline-none transition"
    />

    {/* الوقت */}
    <input
      type="time"
      value={form.time || ''}
      onChange={(e) => update('time', e.target.value)}
      className="w-full bg-[#0d0d1a] text-white rounded-xl px-4 py-3
      border border-violet-900/30 focus:border-violet-500
      focus:outline-none transition"
    />
 </div>
</div>
              className="w-full bg-[#0d0d1a] text-white rounded-xl px-4 py-3
                         border border-violet-900/30 focus:border-violet-500
                         focus:outline-none transition" /
          </div>

          {/* المتحدث */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5 font-medium">
              المتحدث / المحاضر
              <span className="text-gray-600 text-xs mr-1">(اختياري)</span>
            </label>
            <input value={form.speaker} onChange={e => update('speaker', e.target.value)}
              className="w-full bg-[#0d0d1a] text-white rounded-xl px-4 py-3
                         border border-violet-900/30 focus:border-violet-500
                         focus:outline-none transition placeholder-gray-700"
              placeholder="اسم المتحدث أو المحاضر" />
          </div>

          {/* أونلاين أم حضوري */}
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">نوع الحضور</label>
            <div className="flex gap-3">
              {[
                { label: '🌐 أونلاين', value: true },
                { label: '📍 حضوري', value: false },
              ].map(opt => (
                <button key={String(opt.value)} type="button"
                  onClick={() => update('isOnline', opt.value)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    form.isOnline === opt.value
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
                      : 'bg-[#0d0d1a] text-gray-400 border border-violet-900/30 hover:border-violet-500/50'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* الموقع أو رابط البث */}
          {form.isOnline ? (
            <div>
              <label className="block text-gray-400 text-sm mb-1.5 font-medium">
                رابط البث المباشر
                <span className="text-gray-600 text-xs mr-1">(اختياري)</span>
              </label>
              <input value={form.streamUrl} onChange={e => update('streamUrl', e.target.value)}
                className="w-full bg-[#0d0d1a] text-white rounded-xl px-4 py-3
                           border border-violet-900/30 focus:border-violet-500
                           focus:outline-none transition placeholder-gray-700"
                placeholder="https://youtube.com/live/..." />
            </div>
          ) : (
            <div>
              <label className="block text-gray-400 text-sm mb-1.5 font-medium">
                مكان الفعالية
                <span className="text-gray-600 text-xs mr-1">(اختياري)</span>
              </label>
              <input value={form.location} onChange={e => update('location', e.target.value)}
                className="w-full bg-[#0d0d1a] text-white rounded-xl px-4 py-3
                           border border-violet-900/30 focus:border-violet-500
                           focus:outline-none transition placeholder-gray-700"
                placeholder="دمشق — قاعة المؤتمرات" />
            </div>
          )}

          {/* رابط التسجيل + الحد الأقصى */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5 font-medium">
                رابط التسجيل
                <span className="text-gray-600 text-xs mr-1">(اختياري)</span>
              </label>
              <input value={form.registerUrl} onChange={e => update('registerUrl', e.target.value)}
                className="w-full bg-[#0d0d1a] text-white rounded-xl px-4 py-3
                           border border-violet-900/30 focus:border-violet-500
                           focus:outline-none transition placeholder-gray-700 text-sm"
                placeholder="https://..." />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5 font-medium">
                الحد الأقصى للمشاركين
                <span className="text-gray-600 text-xs mr-1">(اختياري)</span>
              </label>
              <input type="number" value={form.maxAttendees}
                onChange={e => update('maxAttendees', e.target.value)}
                className="w-full bg-[#0d0d1a] text-white rounded-xl px-4 py-3
                           border border-violet-900/30 focus:border-violet-500
                           focus:outline-none transition placeholder-gray-700 text-sm"
                placeholder="100" min="1" />
            </div>
          </div>

          {/* خطأ */}
          {error && (
            <div className="bg-red-500/8 border border-red-500/25 text-red-400
                            rounded-xl px-4 py-3 text-sm flex items-center gap-2">
              <span>❌</span> {error}
            </div>
          )}

          {/* أزرار */}
          <div className="flex gap-3 pt-2">
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600
                         hover:from-emerald-500 hover:to-teal-500
                         disabled:opacity-50 text-white font-bold rounded-xl px-6 py-4
                         transition-all duration-300
                         hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]
                         flex items-center justify-center gap-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> جاري الإنشاء...</>
              ) : <>📅 إنشاء الفعالية</>}
            </button>
            <Link href="/events"
              className="px-6 py-4 border border-violet-900/30 text-gray-400
                         hover:text-white hover:border-violet-500/50
                         rounded-xl transition text-sm font-medium text-center">
              إلغاء
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}