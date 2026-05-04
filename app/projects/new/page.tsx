'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const FIELDS = [
  'الذكاء الاصطناعي', 'تعلم الآلة', 'الأمن السيبراني',
  'البرمجة', 'تحليل البيانات', 'الروبوتيكس',
  'الحوسبة السحابية', 'البلوكتشين', 'تطوير الويب', 'إنترنت الأشياء'
]

export default function NewProjectPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [form, setForm] = useState({
    title: '', description: '', field: '', codeUrl: '', demoUrl: '',
  })

  const update = (key: string, value: string) =>
    setForm(p => ({ ...p, [key]: value }))

  const handleSubmit = async () => {
    setError('')

    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    if (!form.title.trim() || !form.description.trim() || !form.field) {
      setError('العنوان والوصف والمجال مطلوبة')
      return
    }

    if (form.title.trim().length < 5) {
      setError('عنوان المشروع يجب أن يكون 5 أحرف على الأقل')
      return
    }

    if (form.description.trim().length < 20) {
      setError('وصف المشروع يجب أن يكون 20 حرفاً على الأقل')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/projects', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'حدث خطأ أثناء النشر')
        return
      }

      router.push(`/projects/${data.id}`)
    } catch (err) {
      console.error(err)
      setError('حدث خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white" dir="rtl"
      style={{
        backgroundImage: `radial-gradient(ellipse at top right, rgba(124,58,237,0.06) 0%, transparent 60%)`
      }}>

      {/* Navbar */}
      <nav className="border-b border-violet-900/20 bg-[#08080f]/90 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700
                            flex items-center justify-center font-black text-sm
                            shadow-[0_0_15px_rgba(124,58,237,0.3)]">⚡</div>
            <span className="font-black text-white tracking-widest hidden sm:block">SAAIT</span>
          </Link>
          <Link href="/projects"
            className="text-gray-400 hover:text-white transition text-sm flex items-center gap-1">
            ← العودة للمشاريع
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600/20 to-indigo-600/20
                          border-2 border-violet-500/30 rounded-2xl
                          flex items-center justify-center text-3xl mx-auto mb-4
                          shadow-[0_0_30px_rgba(124,58,237,0.2)]">🚀</div>
          <h1 className="text-3xl font-black text-white mb-2">نشر مشروع جديد</h1>
          <p className="text-gray-500">شارك مشروعك مع مجتمع SAAIT التقني</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0a0a16] border border-violet-900/20 rounded-3xl p-7 space-y-5
                        shadow-[0_0_40px_rgba(124,58,237,0.06)]">

          {/* شريط علوي */}
          <div className="h-0.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-600
                          -mt-7 mb-7 -mx-7 rounded-t-3xl"></div>

          {/* اسم المشروع */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5 font-medium">
              اسم المشروع <span className="text-red-400">*</span>
            </label>
            <input
              value={form.title}
              onChange={e => update('title', e.target.value)}
              className="w-full bg-[#0d0d1a] text-white rounded-xl px-4 py-3
                         border border-violet-900/30 focus:border-violet-500
                         focus:outline-none focus:ring-1 focus:ring-violet-500/20
                         transition placeholder-gray-700"
              placeholder="مثال: نظام ذكاء اصطناعي لتشخيص الأمراض"
              maxLength={100}
            />
            <p className="text-gray-700 text-xs mt-1">{form.title.length}/100</p>
          </div>

          {/* وصف المشروع */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5 font-medium">
              وصف المشروع <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              rows={5}
              className="w-full bg-[#0d0d1a] text-white rounded-xl px-4 py-3
                         border border-violet-900/30 focus:border-violet-500
                         focus:outline-none focus:ring-1 focus:ring-violet-500/20
                         transition resize-none placeholder-gray-700"
              placeholder="اشرح فكرة مشروعك، أهدافه، والتقنيات المستخدمة..."
              maxLength={1000}
            />
            <p className={`text-xs mt-1 ${form.description.length < 20 && form.description.length > 0 ? 'text-red-400' : 'text-gray-700'}`}>
              {form.description.length}/1000 {form.description.length < 20 && form.description.length > 0 && '(20 حرف كحد أدنى)'}
            </p>
          </div>

          {/* المجال التقني */}
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">
              المجال التقني <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {FIELDS.map(f => (
                <button key={f} type="button" onClick={() => update('field', f)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    form.field === f
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]'
                      : 'bg-[#0d0d1a] text-gray-400 border border-violet-900/30 hover:border-violet-500/50 hover:text-white'
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* روابط */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5 font-medium">
                رابط GitHub
                <span className="text-gray-600 text-xs mr-1">(اختياري)</span>
              </label>
              <input
                value={form.codeUrl}
                onChange={e => update('codeUrl', e.target.value)}
                className="w-full bg-[#0d0d1a] text-white rounded-xl px-4 py-3
                           border border-violet-900/30 focus:border-violet-500
                           focus:outline-none transition placeholder-gray-700 text-sm"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5 font-medium">
                رابط Demo
                <span className="text-gray-600 text-xs mr-1">(اختياري)</span>
              </label>
              <input
                value={form.demoUrl}
                onChange={e => update('demoUrl', e.target.value)}
                className="w-full bg-[#0d0d1a] text-white rounded-xl px-4 py-3
                           border border-violet-900/30 focus:border-violet-500
                           focus:outline-none transition placeholder-gray-700 text-sm"
                placeholder="https://myproject.com"
              />
            </div>
          </div>

          {/* رسالة الخطأ */}
          {error && (
            <div className="bg-red-500/8 border border-red-500/25 text-red-400
                            rounded-xl px-4 py-3 text-sm flex items-center gap-2">
              <span>❌</span> {error}
            </div>
          )}

          {/* أزرار */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading || status === 'loading'}
              className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600
                         hover:from-violet-500 hover:to-indigo-500
                         disabled:opacity-50 disabled:cursor-not-allowed
                         text-white font-bold rounded-xl px-6 py-4 transition-all duration-300
                         hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]
                         flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري النشر...
                </>
              ) : (
                <>🚀 نشر المشروع</>
              )}
            </button>
            <Link href="/projects"
              className="px-6 py-4 border border-violet-900/30 text-gray-400
                         hover:text-white hover:border-violet-500/50
                         rounded-xl transition text-center text-sm font-medium">
              إلغاء
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}