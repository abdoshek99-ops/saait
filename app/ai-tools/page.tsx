'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const CATEGORIES = ['الكل', 'توليد نصوص', 'توليد صور', 'تحليل بيانات', 'برمجة', 'صوت وفيديو', 'أخرى']

const inputClass = "w-full bg-[#0d0d1a] text-white rounded-xl px-4 py-3 border border-violet-900/30 focus:border-violet-500 focus:outline-none transition placeholder-gray-700 text-sm"

const CATEGORY_ICONS: any = {
  'توليد نصوص': '✍️',
  'توليد صور': '🎨',
  'تحليل بيانات': '📊',
  'برمجة': '💻',
  'صوت وفيديو': '🎬',
  'أخرى': '🔧',
}

export default function AIToolsPage() {
  const { data: session } = useSession()
  const [tools, setTools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('الكل')
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    name: '', description: '', category: 'توليد نصوص',
    url: '', imageUrl: '', isFree: true, pricing: ''
  })

  const currentUserId = (session?.user as any)?.id
  const isAdmin = (session?.user as any)?.role === 'admin'

  useEffect(() => { fetchTools() }, [category])

  const fetchTools = async () => {
    setLoading(true)
    const q = category !== 'الكل' ? `?category=${encodeURIComponent(category)}` : ''
    const res = await fetch(`/api/ai-tools${q}`)
    const data = await res.json()
    setTools(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const update = (key: string, value: any) => setForm(p => ({ ...p, [key]: value }))

  const handleSubmit = async () => {
    setError('')
    if (!session) { window.location.href = '/login'; return }
    if (!form.name || !form.description || !form.url) {
      setError('الاسم والوصف والرابط مطلوبة'); return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/ai-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'حدث خطأ'); return }
      setTools(p => [data, ...p])
      setForm({ name: '', description: '', category: 'توليد نصوص', url: '', imageUrl: '', isFree: true, pricing: '' })
      setShowForm(false)
      setSuccess('تمت إضافة الأداة بنجاح! ✅')
      setTimeout(() => setSuccess(''), 3000)
    } catch { setError('خطأ في الاتصال بالخادم') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الأداة؟')) return
    await fetch(`/api/ai-tools/${id}`, { method: 'DELETE' })
    setTools(p => p.filter(t => t.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white" dir="rtl"
      style={{ backgroundImage: `radial-gradient(ellipse at top right, rgba(124,58,237,0.07) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(6,182,212,0.04) 0%, transparent 60%)` }}>

      {/* Navbar */}
      <nav className="border-b border-violet-900/20 bg-[#08080f]/90 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700
                            flex items-center justify-center font-black text-sm
                            shadow-[0_0_15px_rgba(124,58,237,0.3)]">⚡</div>
            <span className="font-black text-white tracking-widest hidden sm:block">SAAIT</span>
          </Link>
          <div className="flex items-center gap-2">
            {session && (
              <button onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-violet-600 to-indigo-600
                           hover:from-violet-500 hover:to-indigo-500
                           text-white text-sm font-bold px-4 py-2 rounded-xl transition
                           hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                + إضافة أداة
              </button>
            )}
            <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm transition">
              ← لوحة التحكم
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-600/20 to-indigo-600/20
                            border-2 border-violet-500/30 rounded-2xl
                            flex items-center justify-center text-2xl
                            shadow-[0_0_20px_rgba(124,58,237,0.15)]">🤖</div>
            <div>
              <h1 className="text-3xl font-black text-white">أدوات الذكاء الاصطناعي</h1>
              <p className="text-gray-500 text-sm">أفضل أدوات AI مختارة من مجتمع SAAIT</p>
            </div>
          </div>
        </div>

        {/* Success */}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400
                          rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
            <span>✅</span> {success}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-[#0a0a16] border border-violet-900/20 rounded-3xl p-6 mb-8
                          shadow-[0_0_30px_rgba(124,58,237,0.06)]">
            <div className="h-0.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-600
                            -mt-6 mb-6 -mx-6 rounded-t-3xl"></div>
            <h3 className="text-white font-black text-lg mb-5 flex items-center gap-2">
              🤖 إضافة أداة ذكاء اصطناعي
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1.5 font-medium">
                  اسم الأداة <span className="text-red-400">*</span>
                </label>
                <input value={form.name} onChange={e => update('name', e.target.value)}
                  className={inputClass} placeholder="مثال: ChatGPT" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1.5 font-medium">
                  رابط الأداة <span className="text-red-400">*</span>
                </label>
                <input value={form.url} onChange={e => update('url', e.target.value)}
                  className={inputClass} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1.5 font-medium">التصنيف</label>
                <select value={form.category} onChange={e => update('category', e.target.value)}
                  className={inputClass}>
                  {CATEGORIES.filter(c => c !== 'الكل').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1.5 font-medium">رابط الصورة</label>
                <input value={form.imageUrl} onChange={e => update('imageUrl', e.target.value)}
                  className={inputClass} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1.5 font-medium">
                  السعر / خطة الاشتراك
                </label>
                <input value={form.pricing} onChange={e => update('pricing', e.target.value)}
                  className={inputClass} placeholder="مجاني / 20$ شهرياً" />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" id="isFree" checked={form.isFree}
                  onChange={e => update('isFree', e.target.checked)}
                  className="w-4 h-4 accent-violet-600" />
                <label htmlFor="isFree" className="text-gray-400 text-sm cursor-pointer">
                  🆓 أداة مجانية
                </label>
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-gray-400 text-sm mb-1.5 font-medium">
                وصف الأداة <span className="text-red-400">*</span>
              </label>
              <textarea value={form.description} onChange={e => update('description', e.target.value)}
                rows={3} className={inputClass + ' resize-none'}
                placeholder="اشرح ما تفعله هذه الأداة وما استخداماتها..." />
            </div>
            {error && (
              <div className="bg-red-500/8 border border-red-500/25 text-red-400
                              rounded-xl px-4 py-3 mb-4 text-sm flex items-center gap-2">
                <span>❌</span> {error}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={handleSubmit} disabled={submitting}
                className="bg-gradient-to-r from-violet-600 to-indigo-600
                           hover:from-violet-500 hover:to-indigo-500
                           disabled:opacity-50 text-white font-bold px-6 py-3
                           rounded-xl transition hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]
                           flex items-center gap-2">
                {submitting ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> جاري الإضافة...</>
                ) : <>🤖 إضافة الأداة</>}
              </button>
              <button onClick={() => { setShowForm(false); setError('') }}
                className="border border-violet-900/30 text-gray-400 hover:text-white
                           px-6 py-3 rounded-xl transition">
                إلغاء
              </button>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                category === c
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.3)]'
                  : 'bg-[#0a0a16] text-gray-400 border border-violet-900/20 hover:border-violet-500/40 hover:text-white'
              }`}>
              {c !== 'الكل' && CATEGORY_ICONS[c]} {c}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tools.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-white mb-2">لا توجد أدوات بعد</h3>
            <p className="text-gray-600 mb-4">كن أول من يضيف أداة AI!</p>
            {session && (
              <button onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-violet-600 to-indigo-600
                           text-white font-bold px-6 py-3 rounded-xl">
                + إضافة أداة الآن
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool: any) => (
              <div key={tool.id}
                className="bg-[#0a0a16] border border-violet-900/15
                           hover:border-violet-500/30 rounded-2xl overflow-hidden
                           transition-all duration-300
                           hover:shadow-[0_0_20px_rgba(124,58,237,0.08)] group">

                {/* Image */}
                {tool.imageUrl ? (
                  <div className="relative">
                    <img src={tool.imageUrl} alt={tool.name}
                      className="w-full h-40 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a16] to-transparent"></div>
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-violet-900/20 to-indigo-900/10
                                  flex items-center justify-center text-5xl border-b border-violet-900/10">
                    {CATEGORY_ICONS[tool.category] || '🤖'}
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-violet-900/20 text-violet-300 text-xs px-2.5 py-1
                                     rounded-full border border-violet-700/20">
                      {CATEGORY_ICONS[tool.category]} {tool.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${
                        tool.isFree
                          ? 'bg-emerald-900/20 text-emerald-400 border-emerald-700/20'
                          : 'bg-amber-900/20 text-amber-400 border-amber-700/20'
                      }`}>
                        {tool.isFree ? '🆓 مجاني' : '💰 مدفوع'}
                      </span>
                      {(tool.addedById === currentUserId || isAdmin) && (
                        <button onClick={() => handleDelete(tool.id)}
                          className="w-6 h-6 flex items-center justify-center
                                     bg-red-900/20 hover:bg-red-900/40 border border-red-700/30
                                     rounded-lg text-xs transition opacity-0 group-hover:opacity-100">
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-white font-black text-lg mb-1
                                  group-hover:text-violet-400 transition">
                    {tool.name}
                  </h3>

                  {tool.pricing && (
                    <p className="text-emerald-400 text-xs mb-2">💰 {tool.pricing}</p>
                  )}

                  <p className="text-gray-500 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {tool.description}
                  </p>

                  {tool.addedBy && (
                    <p className="text-gray-700 text-xs mb-3">
                      أضافها: {tool.addedBy.name}
                    </p>
                  )}

                  <a href={tool.url} target="_blank" rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-violet-600 to-indigo-600
                               hover:from-violet-500 hover:to-indigo-500
                               text-white text-sm font-bold py-3 rounded-xl
                               transition text-center
                               hover:shadow-[0_0_12px_rgba(124,58,237,0.3)]">
                    استخدم الأداة ←
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}