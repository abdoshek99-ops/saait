'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [countdown])

  // إرسال OTP تلقائياً عند فتح الصفحة
  useEffect(() => {
    if (email) handleSendOTP()
  }, [])

  const handleSendOTP = async () => {
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      if (res.ok) {
        setCountdown(60)
      } else {
        setError('فشل إرسال الرمز، تحقق من البريد الإلكتروني')
      }
    } catch {
      setError('خطأ في الاتصال بالخادم')
    } finally {
      setSending(false)
    }
  }

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')
    // انتقل للخانة التالية تلقائياً
    if (value && index < 5) {
      inputs.current[index + 1]?.focus()
    }
    // تحقق تلقائي عند اكتمال الرمز
    if (newOtp.every(d => d !== '')) {
      handleVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      const newOtp = pasted.split('')
      setOtp(newOtp)
      inputs.current[5]?.focus()
      handleVerify(pasted)
    }
  }

  const handleVerify = async (code?: string) => {
    const finalOtp = code || otp.join('')
    if (finalOtp.length !== 6) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: finalOtp })
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => router.push('/dashboard'), 2500)
      } else {
        setError(data.error || 'الرمز غير صحيح')
        setOtp(['', '', '', '', '', ''])
        setTimeout(() => inputs.current[0]?.focus(), 100)
      }
    } catch {
      setError('خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  // ✅ شاشة النجاح
  if (success) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center"
           style={{
             backgroundImage: `radial-gradient(ellipse at top, rgba(124,58,237,0.15) 0%, transparent 60%)`
           }}>
        <div className="text-center">
          <div className="relative mx-auto mb-6 w-28 h-28">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 
                            rounded-full animate-ping opacity-20"></div>
            <div className="relative w-28 h-28 bg-gradient-to-br from-violet-600 to-indigo-600 
                            rounded-full flex items-center justify-center
                            shadow-[0_0_40px_rgba(124,58,237,0.5)]">
              <span className="text-5xl">✅</span>
            </div>
          </div>
          <h2 className="text-3xl font-black text-white mb-3">تم التحقق! </h2>
          <p className="text-gray-400 mb-2">مرحباً بك في SAAIT Platform</p>
          <p className="text-violet-400 text-sm">جاري تحويلك للوحة التحكم...</p>
          <div className="mt-6 flex justify-center gap-1">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"
                   style={{ animationDelay: `${i * 0.15}s` }}></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4"
         style={{
           backgroundImage: `
             radial-gradient(ellipse at top left, rgba(124,58,237,0.12) 0%, transparent 50%),
             radial-gradient(ellipse at bottom right, rgba(79,70,229,0.1) 0%, transparent 50%)
           `
         }}>

      {/* خلفية نقاط ديكورية */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div key={i}
               className="absolute rounded-full bg-violet-600/5 animate-pulse"
               style={{
                 width: `${80 + i * 40}px`,
                 height: `${80 + i * 40}px`,
                 top: `${10 + i * 15}%`,
                 left: `${5 + i * 16}%`,
                 animationDelay: `${i * 0.5}s`
               }}></div>
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* ✦ Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex items-center gap-2
                            bg-gradient-to-r from-violet-600 to-indigo-600
                            px-6 py-3 rounded-2xl mb-3 cursor-pointer
                            hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]
                            transition-all duration-300">
              <span className="text-2xl"></span>
              <span className="text-white font-black text-2xl tracking-widest">SAAIT</span>
            </div>
          </Link>
          <p className="text-violet-400/70 text-xs tracking-[5px] uppercase">
            AI Platform
          </p>
        </div>

        {/* ✦ البطاقة الرئيسية */}
        <div className="bg-[#1a1a2e]/90 backdrop-blur-xl
                        border border-violet-500/20 rounded-3xl p-8
                        shadow-[0_0_80px_rgba(124,58,237,0.1)]">

          {/* أيقونة الروبوت */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-violet-600/20 rounded-full 
                              animate-pulse scale-125"></div>
              <div className="relative w-20 h-20
                              bg-gradient-to-br from-violet-600/20 to-indigo-600/20
                              border-2 border-violet-500/40 rounded-full
                              flex items-center justify-center mx-auto
                              shadow-[0_0_30px_rgba(124,58,237,0.3)]">
                <span className="text-4xl">🤖</span>
              </div>
            </div>

            <h1 className="text-white text-2xl font-black mt-5 mb-2">
              تحقق من بريدك
            </h1>

            {sending ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent 
                                rounded-full animate-spin"></div>
                <p className="text-violet-400 text-sm">جاري إرسال الرمز...</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 text-sm mb-1">
                  أرسلنا رمزاً مكوناً من 6 أرقام إلى
                </p>
                <p className="text-violet-400 font-semibold text-sm
                              bg-violet-500/10 border border-violet-500/20
                              rounded-lg px-3 py-1 inline-block">
                  📧 {email}
                </p>
              </div>
            )}
          </div>

          {/* ✦ خانات OTP */}
          <div className="flex gap-2 sm:gap-3 justify-center mb-6" dir="ltr">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleInput(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                onPaste={handlePaste}
                disabled={loading}
                className={`
                  w-11 h-14 sm:w-13 sm:h-16 text-center text-xl font-black 
                  rounded-xl border-2 bg-[#0f0f1a] text-white
                  transition-all duration-200 focus:outline-none
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${loading ? 'cursor-not-allowed' : 'focus:scale-110'}
                  ${digit
                    ? 'border-violet-500 shadow-[0_0_20px_rgba(124,58,237,0.4)] text-violet-300'
                    : error
                    ? 'border-red-500/50'
                    : 'border-gray-700 focus:border-violet-500'
                  }
                `}
              />
            ))}
          </div>

          {/* ✦ رسالة الخطأ */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30
                            rounded-xl p-3 mb-4 flex items-center gap-2">
              <span className="text-red-400 text-lg">❌</span>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* ✦ زر التحقق */}
          <button
            onClick={() => handleVerify()}
            disabled={loading || otp.some(d => !d) || sending}
            className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600
                       text-white font-bold rounded-xl transition-all duration-300
                       hover:from-violet-500 hover:to-indigo-500
                       hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]
                       hover:-translate-y-0.5
                       disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:hover:translate-y-0
                       flex items-center justify-center gap-2 text-base"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent 
                                rounded-full animate-spin"></div>
                جاري التحقق...
              </>
            ) : (
              <>
                <span></span>
                تأكيد الرمز
              </>
            )}
          </button>

          {/* ✦ إعادة الإرسال */}
          <div className="text-center mt-5">
            {countdown > 0 ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-violet-500/30
                                flex items-center justify-center">
                  <span className="text-violet-400 text-xs font-bold">{countdown}</span>
                </div>
                <p className="text-gray-500 text-sm">
                  يمكنك إعادة الإرسال بعد
                  <span className="text-violet-400 font-bold mx-1">{countdown}</span>
                  ثانية
                </p>
              </div>
            ) : (
              <button
                onClick={handleSendOTP}
                disabled={sending}
                className="text-violet-400 text-sm hover:text-violet-300
                           transition-colors disabled:opacity-50
                           flex items-center gap-1 mx-auto"
              >
                <span>🔄</span>
                {sending ? 'جاري الإرسال...' : 'إعادة إرسال الرمز'}
              </button>
            )}
          </div>

        </div>

        {/* ✦ تنبيه الأمان */}
        <div className="mt-4 bg-amber-500/5 border border-amber-500/15
                        rounded-2xl p-4 flex items-center gap-3">
          <span className="text-amber-400 text-xl"></span>
          <p className="text-amber-400/70 text-xs leading-relaxed">
            لا تشارك هذا الرمز مع أي شخص.
            فريق SAAIT لن يطلبه منك أبداً.
          </p>
        </div>

        {/* ✦ رابط العودة */}
        <div className="text-center mt-4">
          <Link href="/login"
                className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
            ← العودة لتسجيل الدخول
          </Link>
        </div>

      </div>
    </div>
  )
}