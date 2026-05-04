'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'بيانات خاطئة'); return }
      router.push('/admin')
      router.refresh()
    } catch {
      setError('خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4" dir="rtl"
      style={{ backgroundImage: `radial-gradient(ellipse at top, rgba(239,68,68,0.08) 0%, transparent 60%)` }}>

      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-800
                          px-6 py-3 rounded-2xl mb-3 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
            <span className="text-2xl">🛡️</span>
            <span className="text-white font-black text-xl tracking-widest">ADMIN</span>
          </div>
          <p className="text-red-400/60 text-xs tracking-[4px] uppercase">SAAIT Control Panel</p>
        </div>

        {/* Card */}
        <div className="bg-[#0a0a16] border border-red-900/30 rounded-3xl p-7
                        shadow-[0_0_60px_rgba(239,68,68,0.08)]">

          <div className="h-0.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600
                          -mt-7 mb-7 -mx-7 rounded-t-3xl"></div>

          <h2 className="text-white font-black text-xl mb-1 text-center">دخول الإدارة</h2>
          <p className="text-gray-600 text-xs text-center mb-6">هذه المنطقة محمية — للمدير فقط</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5 font-medium">اسم المستخدم</label>
              <input
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                className="w-full bg-[#0d0d1a] text-white rounded-xl px-4 py-3
                           border border-red-900/30 focus:border-red-500
                           focus:outline-none transition placeholder-gray-700"
                placeholder="admin username"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5 font-medium">كلمة المرور</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="w-full bg-[#0d0d1a] text-white rounded-xl px-4 py-3
                           border border-red-900/30 focus:border-red-500
                           focus:outline-none transition placeholder-gray-700"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400
                              rounded-xl px-4 py-3 text-sm text-center">
                ❌ {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700
                         hover:from-red-500 hover:to-red-600
                         disabled:opacity-50 text-white font-black rounded-xl
                         transition hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]
                         flex items-center justify-center gap-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> جاري التحقق...</>
              ) : <>🛡️ دخول لوحة الإدارة</>}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-800 text-xs mt-4">
          SAAIT Admin Panel — محمي ومشفر
        </p>
      </div>
    </div>
  )
}