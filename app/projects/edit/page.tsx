'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const FIELDS = ['الذكاء الاصطناعي', 'تعلم الآلة', 'الأمن السيبراني', 'البرمجة', 'تحليل البيانات', 'الروبوتيكس', 'الحوسبة السحابية', 'البلوكتشين', 'تطوير الويب']

export default function EditProjectPage() {
  const { id } = useParams()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    field: '',
    codeUrl: '',
    demoUrl: '',
    imageUrl: '',
    progress: 0,
    status: 'active',
  })

  const menuItems = [
    { href: '/dashboard', icon: '🏠', label: 'الرئيسية' },
    { href: '/projects', icon: '🚀', label: 'المشاريع' },
    { href: '/events', icon: '📅', label: 'الفعاليات' },
    { href: '/community', icon: '💬', label: 'المجتمع' },
    { href: '/news', icon: '📰', label: 'الأخبار' },
    { href: '/courses', icon: '🎓', label: 'التعليم' },
    { href: '/ai-tools', icon: '🤖', label: 'أدوات AI' },
    { href: '/jobs', icon: '💼', label: 'فرص العمل' },
    { href: '/ai-chat', icon: '✨', label: 'دردشة AI' },
  ]

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') fetchProject()
  }, [status])

  const fetchProject = async () => {
    const res = await fetch(`/api/projects/${id}`)
    const data = await res.json()

    if (!data || data.error) {
      router.push('/projects')
      return
    }

    if (data.ownerId !== session?.user?.id) {
      router.push(`/projects/${id}`)
      return
    }

    setForm({
      title: data.title || '',
      description: data.description || '',
      field: data.field || '',
      codeUrl: data.codeUrl || '',
      demoUrl: data.demoUrl || '',
      imageUrl: data.imageUrl || '',
      progress: data.progress || 0,
      status: data.status || 'active',
    })
    setLoading(false)
  }

  const update = (field: string, value: any) => setForm(p => ({ ...p, [field]: value }))

  const handleSave = async () => {
    if (!form.title || !form.description || !form.field) {
      setError('العنوان والوصف والمجال مطلوبة')
      return
    }
    setSaving(true)
    setError('')

    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setSuccess(true)
      setTimeout(() => {
        router.push(`/projects/${id}`)
      }, 1500)
    } else {
      setError('حدث خطأ أثناء الحفظ')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white" dir="rtl">

      <nav className="border-b border-purple-900/40 bg-[#080810] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center font-bold">S</div>
            <span className="font-bold text-white hidden sm:block">SAAIT</span>
          </Link>
          <Link href={`/projects/${id}`} className="text-gray-400 hover:text-white transition text-sm">
            ← العودة للمشروع
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-1">✏️ تعديل المشروع</h1>
          <p className="text-gray-500">عدّل تفاصيل مشروعك</p>
        </div>

        {success && (
          <div className="mb-6 bg-green-900/30 border border-green-700/50 text-green-400 rounded-xl px-4 py-3 text-sm text-center">
            ✅ تم الحفظ بنجاح، جاري التحويل...
          </div>
        )}

        <div className="space-y-5">

          {/* Image Preview */}
          {form.imageUrl && (
            <div className="rounded-2xl overflow-hidden border border-gray-800">
              <img src={form.imageUrl} alt="صورة المشروع" className="w-full h-48 object-cover" />
            </div>
          )}

          {/* Image URL */}
          <div className="bg-[#0a0a12] border border-gray-800/80 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4">صورة المشروع</h3>
            <div>
              <label className="block text-gray-400 text-sm mb-1">رابط الصورة</label>
              <input
                value={form.imageUrl}
                onChange={e => update('imageUrl', e.target.value)}
                className="w-full bg-[#13131f] text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-gray-600 text-xs mt-1">ضع رابط صورة من الإنترنت أو من خدمة مثل Imgur</p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-[#0a0a12] border border-gray-800/80 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4">المعلومات الأساسية</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">اسم المشروع *</label>
                <input
                  value={form.title}
                  onChange={e => update('title', e.target.value)}
                  className="w-full bg-[#13131f] text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                  placeholder="اسم المشروع"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">وصف المشروع *</label>
                <textarea
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  rows={4}
                  className="w-full bg-[#13131f] text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
                  placeholder="وصف تفصيلي للمشروع..."
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">المجال التقني *</label>
                <div className="flex flex-wrap gap-2">
                  {FIELDS.map(f => (
                    <button key={f} type="button" onClick={() => update('field', f)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition ${form.field === f ? 'bg-purple-600 text-white' : 'bg-[#13131f] text-gray-400 border border-gray-700 hover:border-purple-500'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Progress & Status */}
          <div className="bg-[#0a0a12] border border-gray-800/80 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4">الحالة والتقدم</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  نسبة التقدم: <span className="text-purple-400 font-bold">{form.progress}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={form.progress}
                  onChange={e => update('progress', parseInt(e.target.value))}
                  className="w-full accent-purple-600"
                />
                <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all"
                    style={{ width: `${form.progress}%` }} />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">حالة المشروع</label>
                <select
                  value={form.status}
                  onChange={e => update('status', e.target.value)}
                  className="w-full bg-[#13131f] text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none">
                  <option value="active">نشط</option>
                  <option value="completed">مكتمل</option>
                  <option value="paused">متوقف مؤقتاً</option>
                </select>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="bg-[#0a0a12] border border-gray-800/80 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4">الروابط</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">رابط GitHub</label>
                <input
                  value={form.codeUrl}
                  onChange={e => update('codeUrl', e.target.value)}
                  className="w-full bg-[#13131f] text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                  placeholder="https://github.com/username/project"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">رابط العرض التجريبي</label>
                <input
                  value={form.demoUrl}
                  onChange={e => update('demoUrl', e.target.value)}
                  className="w-full bg-[#13131f] text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                  placeholder="https://myproject.com"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-400 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl px-6 py-4 transition">
              {saving ? 'جاري الحفظ...' : '💾 حفظ التعديلات'}
            </button>
            <Link href={`/projects/${id}`}
              className="px-6 py-4 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-xl transition text-center">
              إلغاء
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}