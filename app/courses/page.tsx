'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const CATEGORIES = ['الكل', 'الذكاء الاصطناعي', 'تعلم الآلة', 'الأمن السيبراني', 'البرمجة', 'تحليل البيانات']

const menuItems = [
  { href: '/dashboard', label: 'الرئيسية' },
  { href: '/projects', label: 'المشاريع' },
  { href: '/events', label: 'الفعاليات' },
  { href: '/community', label: 'المجتمع' },
  { href: '/news', label: 'الأخبار' },
]

// ✅ مكون رفع الصورة
function ImageUploader({ value, onChange }: { value: string; onChange: (base64: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { alert('حجم الصورة يجب أن يكون أقل من 2MB'); return }
    const reader = new FileReader()
    reader.onloadend = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <label className="block text-gray-400 text-sm mb-1">صورة الكورس (اختياري)</label>
      <div onClick={() => fileRef.current?.click()}
        className="cursor-pointer border-2 border-dashed border-purple-900/40 hover:border-purple-500/60
                   rounded-xl p-3 flex flex-col items-center justify-center gap-1 transition
                   bg-[#13131f] min-h-[90px]">
        {value ? (
          <img src={value} alt="preview" className="w-full max-h-32 object-cover rounded-lg" />
        ) : (
          <>
            <span className="text-2xl">🖼️</span>
            <p className="text-gray-500 text-xs text-center">اضغط لرفع صورة (حد أقصى 2MB)</p>
          </>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      {value && (
        <button onClick={() => onChange('')} className="text-red-400 text-xs mt-1 hover:text-red-300 transition">
          ✕ إزالة الصورة
        </button>
      )}
    </div>
  )
}

export default function CoursesPage() {
  const { data: session } = useSession()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('الكل')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', category: 'الذكاء الاصطناعي',
    url: '', imageUrl: '', instructor: '',
    duration: '', level: 'مبتدئ', isFree: true
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { fetchCourses() }, [category])

  const fetchCourses = async () => {
    setLoading(true)
    const query = category !== 'الكل' ? `?category=${encodeURIComponent(category)}` : ''
    const res = await fetch(`/api/courses${query}`)
    const data = await res.json()
    setCourses(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const handleSubmit = async () => {
    setError('')
    if (!session) { window.location.href = '/login'; return }
    if (!form.title || !form.description || !form.url) {
      setError('العنوان والوصف والرابط مطلوبة'); return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'حدث خطأ'); return }
      setForm({ title: '', description: '', category: 'الذكاء الاصطناعي', url: '', imageUrl: '', instructor: '', duration: '', level: 'مبتدئ', isFree: true })
      setShowForm(false)
      setSuccess('تمت مشاركة الكورس بنجاح! ✅')
      setTimeout(() => setSuccess(''), 3000)
      fetchCourses()
    } catch { setError('خطأ في الاتصال بالخادم') }
    finally { setSubmitting(false) }
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white" dir="rtl">

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-0 right-0 h-full w-72 bg-[#0a0a12] border-l border-purple-900/30 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center font-bold">S</div>
              <span className="font-bold text-white">SAAIT</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white text-2xl">✕</button>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item, i) => (
              <Link key={i} href={item.href} onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-purple-900/20 transition">
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Navbar */}
      <nav className="border-b border-purple-900/40 bg-[#080810] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="w-10 h-10 bg-[#13131f] hover:bg-[#1a1a2e] rounded-xl flex flex-col items-center justify-center gap-1.5 transition lg:hidden">
              <span className="w-5 h-0.5 bg-gray-400" />
              <span className="w-5 h-0.5 bg-gray-400" />
              <span className="w-5 h-0.5 bg-gray-400" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center font-bold">S</div>
              <span className="font-bold text-white hidden sm:block">SAAIT</span>
            </Link>
          </div>
          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item, i) => (
              <Link key={i} href={item.href}
                className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-purple-900/20 transition text-sm">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {/* ✅ الزر متاح لكل المستخدمين المسجلين */}
            {session && (
              <button onClick={() => setShowForm(!showForm)}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition font-medium">
                📚 شارك كورساً
              </button>
            )}
            {!session && (
              <Link href="/login"
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition">
                شارك كورساً
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-1">🎓 التعليم والكورسات</h1>
          <p className="text-gray-500">أفضل الكورسات التقنية المختارة من مجتمع SAAIT</p>
        </div>

        {/* رسالة نجاح */}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400
                          rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
            <span>✅</span> {success}
          </div>
        )}

        {/* ✅ فورم مشاركة كورس لكل المستخدمين */}
        {showForm && (
          <div className="bg-[#0a0a16] border border-purple-700/50 rounded-2xl p-6 mb-6
                          shadow-[0_0_30px_rgba(124,58,237,0.06)]">
            <div className="h-0.5 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600
                            -mt-6 mb-6 -mx-6 rounded-t-2xl"></div>
            <h3 className="text-white font-bold text-lg mb-5">📚 مشاركة كورس جديد</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">اسم الكورس *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-[#13131f] text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                  placeholder="مثال: مقدمة في الذكاء الاصطناعي" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">المدرب</label>
                <input value={form.instructor} onChange={e => setForm(p => ({ ...p, instructor: e.target.value }))}
                  className="w-full bg-[#13131f] text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                  placeholder="اسم المدرب أو المنصة" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">رابط الكورس *</label>
                <input value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
                  className="w-full bg-[#13131f] text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                  placeholder="https://..." />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">التصنيف</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full bg-[#13131f] text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none">
                  {CATEGORIES.filter(c => c !== 'الكل').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">المستوى</label>
                <select value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}
                  className="w-full bg-[#13131f] text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none">
                  <option>مبتدئ</option>
                  <option>متوسط</option>
                  <option>متقدم</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">المدة</label>
                <input value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                  className="w-full bg-[#13131f] text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                  placeholder="مثال: 10 ساعات" />
              </div>

              {/* ✅ رفع صورة من الجهاز */}
              <div className="md:col-span-2">
                <ImageUploader
                  value={form.imageUrl}
                  onChange={(base64) => setForm(p => ({ ...p, imageUrl: base64 }))}
                />
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="isFree" checked={form.isFree}
                  onChange={e => setForm(p => ({ ...p, isFree: e.target.checked }))}
                  className="w-4 h-4 accent-purple-600" />
                <label htmlFor="isFree" className="text-gray-400 text-sm cursor-pointer">🆓 كورس مجاني</label>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-400 text-sm mb-1">وصف الكورس *</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                rows={3} className="w-full bg-[#13131f] text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
                placeholder="اكتب وصفاً مختصراً للكورس وما ستتعلمه..." />
            </div>

            {error && (
              <div className="mt-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                <span>❌</span> {error}
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button onClick={handleSubmit} disabled={submitting}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-lg transition flex items-center gap-2">
                {submitting ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> جاري المشاركة...</>
                ) : <>📚 مشاركة الكورس</>}
              </button>
              <button onClick={() => { setShowForm(false); setError('') }}
                className="border border-gray-700 text-gray-400 hover:text-white px-6 py-2.5 rounded-lg transition">
                إلغاء
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-sm transition ${category === c ? 'bg-purple-600 text-white' : 'bg-[#0d0d18] text-gray-400 border border-gray-800 hover:border-purple-700/50'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-xl font-bold text-white mb-2">لا توجد كورسات بعد</h3>
            <p className="text-gray-600 mb-4">كن أول من يشارك كورساً مفيداً!</p>
            {session && (
              <button onClick={() => setShowForm(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition font-medium">
                📚 شارك كورساً الآن
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course: any) => (
              <div key={course.id}
                className="bg-[#0d0d18] border border-gray-800/80 hover:border-purple-700/50 rounded-2xl overflow-hidden transition group">
                {course.imageUrl ? (
                  <img src={course.imageUrl} alt={course.title} className="w-full h-44 object-cover" />
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-purple-900/40 to-[#0d0d18] flex items-center justify-center text-5xl">🎓</div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-purple-900/30 text-purple-300 text-xs px-2 py-1 rounded-full border border-purple-700/30">
                      {course.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${course.isFree ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                        {course.isFree ? '🆓 مجاني' : '💰 مدفوع'}
                      </span>
                      <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">{course.level}</span>
                    </div>
                  </div>
                  <h3 className="text-white font-bold mb-1 group-hover:text-purple-400 transition line-clamp-2">{course.title}</h3>
                  {course.instructor && (
                    <p className="text-purple-400 text-sm mb-2">👨‍🏫 {course.instructor}</p>
                  )}
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">{course.description}</p>
                  {course.duration && (
                    <p className="text-gray-600 text-xs mb-3">⏱ {course.duration}</p>
                  )}
                  {course.addedBy && (
                    <p className="text-gray-700 text-xs mb-3">شارك بواسطة: {course.addedBy.name}</p>
                  )}
                  <a href={course.url?.startsWith('http') ? course.url : `https://${course.url}`}
                    target="_blank" rel="noopener noreferrer"
                    className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2.5 rounded-xl transition text-center">
                    ابدأ الكورس ←
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