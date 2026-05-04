'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SKILLS = ['Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'Cyber Security', 'Data Science', 'SQL', 'MongoDB', 'Docker', 'Linux', 'Blockchain', 'Flutter', 'C++']

const INTERESTS = ['الذكاء الاصطناعي', 'تعلم الآلة', 'الأمن السيبراني', 'البرمجة', 'تحليل البيانات', 'الروبوتيكس', 'الحوسبة السحابية', 'البلوكتشين', 'تطوير الويب']

const COUNTRIES = ['سوريا', 'مصر', 'السعودية', 'الإمارات', 'الأردن', 'لبنان', 'العراق', 'تونس', 'المغرب', 'الجزائر', 'ليبيا', 'اليمن', 'عُمان', 'الكويت', 'قطر', 'البحرين', 'فلسطين', 'السودان', 'تركيا', 'ألمانيا', 'فرنسا', 'المملكة المتحدة', 'الولايات المتحدة', 'كندا', 'أستراليا', 'هولندا', 'السويد', 'النرويج', 'الدنمارك', 'إيطاليا', 'إسبانيا', 'روسيا', 'الصين', 'اليابان', 'كوريا الجنوبية', 'الهند', 'باكستان', 'إيران', 'أفغانستان', 'أخرى']

const SYRIA_CITIES = ['دمشق', 'حلب', 'حمص', 'حماة', 'اللاذقية', 'طرطوس', 'دير الزور', 'الرقة', 'الحسكة', 'القامشلي', 'درعا', 'السويداء', 'القنيطرة', 'إدلب']

const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 60 }, (_, i) => currentYear - 10 - i)

const steps = ['المعلومات الأساسية', 'التعليم', 'الخبرة والمهارات', 'الروابط والاهتمامات']

const stepIcons = ['👤', '🎓', '💻', '🔗']

const inputClass = "w-full bg-[#0d0d1a] text-white rounded-xl px-4 py-3 border border-violet-900/40 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all duration-200 placeholder-gray-600"
const labelClass = "block text-gray-400 text-sm mb-1.5 font-medium"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    birthYear: '', birthMonth: '', gender: '', country: 'سوريا', city: '', bio: '',
    university: '', major: '', degree: '', gradYear: '', currentStatus: '',
    company: '', jobTitle: '', experience: '',
    skills: [] as string[],
    github: '', facebook: '', instagram: '',
    interests: [] as string[], lookingFor: '',
  })

  const update = (field: string, value: any) => setForm(p => ({ ...p, [field]: value }))

  const toggleSkill = (skill: string) => {
    setForm(p => ({
      ...p,
      skills: p.skills.includes(skill) ? p.skills.filter(s => s !== skill) : [...p.skills, skill]
    }))
  }

  const toggleInterest = (interest: string) => {
    setForm(p => ({
      ...p,
      interests: p.interests.includes(interest) ? p.interests.filter(i => i !== interest) : [...p.interests, interest]
    }))
  }

  const validateUrl = (url: string, platform: string) => {
    if (!url) return true
    if (platform === 'github') return url.startsWith('https://github.com/')
    if (platform === 'facebook') return url.startsWith('https://facebook.com/') || url.startsWith('https://www.facebook.com/')
    if (platform === 'instagram') return url.startsWith('https://instagram.com/') || url.startsWith('https://www.instagram.com/')
    return true
  }

  const nextStep = () => {
    if (step === 0) {
      if (!form.name || !form.email || !form.password) { setError('الاسم والبريد وكلمة المرور مطلوبة'); return }
      if (form.password.length < 10) { setError('كلمة المرور يجب أن تكون 10 أحرف على الأقل'); return }
      if (form.password !== form.confirmPassword) { setError('كلمة المرور غير متطابقة'); return }
      if (form.bio && form.bio.length < 20) { setError('النبذة التعريفية يجب أن تكون 20 حرفاً على الأقل'); return }
    }
    if (step === 3) {
      if (form.github && !validateUrl(form.github, 'github')) { setError('رابط GitHub غير صحيح، يجب أن يبدأ بـ https://github.com/'); return }
      if (form.facebook && !validateUrl(form.facebook, 'facebook')) { setError('رابط Facebook غير صحيح'); return }
      if (form.instagram && !validateUrl(form.instagram, 'instagram')) { setError('رابط Instagram غير صحيح'); return }
    }
    setError('')
    setStep(s => s + 1)
  }

  const handleSubmit = async () => {
    if (form.github && !validateUrl(form.github, 'github')) { setError('رابط GitHub غير صحيح'); return }
    if (form.facebook && !validateUrl(form.facebook, 'facebook')) { setError('رابط Facebook غير صحيح'); return }
    if (form.instagram && !validateUrl(form.instagram, 'instagram')) { setError('رابط Instagram غير صحيح'); return }

    setLoading(true)
    setError('')

    const age = form.birthYear ? currentYear - parseInt(form.birthYear) : null

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, age }),
    })
    const result = await res.json()
    if (!res.ok) { setError(result.error); setLoading(false); return }

    // ✅ التحويل لصفحة التحقق بدلاً من صفحة الدخول
    router.push(`/verify-email?email=${encodeURIComponent(form.email)}`)
  }

  const progressPercent = ((step) / steps.length) * 100

  return (
    <div
      className="min-h-screen bg-[#050508] flex items-center justify-center p-4"
      dir="rtl"
      style={{
        backgroundImage: `
          radial-gradient(ellipse at top right, rgba(124,58,237,0.08) 0%, transparent 55%),
          radial-gradient(ellipse at bottom left, rgba(79,70,229,0.06) 0%, transparent 55%)
        `
      }}
    >
      {/* خلفية ديكورية */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-violet-600/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-600/3 rounded-full blur-3xl"></div>
        {/* شبكة نقاط */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle, #7c3aed 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}>
        </div>
      </div>

      <div className="w-full max-w-2xl relative z-10">

        {/* ✦ Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex items-center gap-3 mb-4 group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700
                              flex items-center justify-center font-black text-xl text-white
                              shadow-[0_0_20px_rgba(124,58,237,0.4)]
                              group-hover:shadow-[0_0_30px_rgba(124,58,237,0.6)]
                              transition-all duration-300">
                ⚡
              </div>
              <div className="text-right">
                <h1 className="text-2xl font-black text-white tracking-widest">SAAIT</h1>
                <p className="text-violet-400/70 text-xs tracking-[3px] uppercase">AI Platform</p>
              </div>
            </div>
          </Link>
          <p className="text-gray-600 text-sm">انضم إلى مجتمع الذكاء الاصطناعي</p>
        </div>

        {/* ✦ شريط التقدم العلوي */}
        <div className="mb-6">
          <div className="h-1 bg-gray-800/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* ✦ Steps Indicator */}
        <div className="flex items-center justify-between mb-8 px-1">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`flex flex-col items-center transition-all duration-300 ${i <= step ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${i < step
                    ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]'
                    : i === step
                    ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.5)] ring-2 ring-violet-500/30 scale-110'
                    : 'bg-gray-800/80 text-gray-500 border border-gray-700'
                  }
                `}>
                  {i < step ? '✓' : stepIcons[i]}
                </div>
                <span className="text-xs text-gray-600 mt-1.5 hidden md:block">{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 rounded-full transition-all duration-500 ${i < step ? 'bg-gradient-to-r from-violet-600 to-indigo-600' : 'bg-gray-800'}`} />
              )}
            </div>
          ))}
        </div>

        {/* ✦ البطاقة الرئيسية */}
        <div className="bg-[#0a0a14]/90 backdrop-blur-xl rounded-3xl border border-violet-900/30
                        shadow-[0_0_60px_rgba(124,58,237,0.08)] overflow-hidden">

          {/* شريط علوي ملوّن */}
          <div className="h-0.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-600"></div>

          <div className="p-7">

            {/* Step 1 — المعلومات الأساسية */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-violet-600/20 border border-violet-500/30 rounded-xl flex items-center justify-center text-xl">👤</div>
                  <h2 className="text-xl font-black text-white">المعلومات الأساسية</h2>
                </div>

                <div>
                  <label className={labelClass}>الاسم الكامل *</label>
                  <input value={form.name} onChange={e => update('name', e.target.value)}
                    className={inputClass} placeholder="أدخل اسمك الكامل" />
                </div>

                <div>
                  <label className={labelClass}>البريد الإلكتروني *</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    className={inputClass} placeholder="example@email.com" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>كلمة المرور * (10 أحرف كحد أدنى)</label>
                    <input type="password" value={form.password} onChange={e => update('password', e.target.value)}
                      className={inputClass} placeholder="••••••••••" />
                    {form.password && (
                      <div className="mt-2 flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${form.password.length >= (i + 1) * 2 ? i < 2 ? 'bg-red-500' : i < 4 ? 'bg-yellow-500' : 'bg-green-500' : 'bg-gray-800'}`} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>تأكيد كلمة المرور *</label>
                    <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                      className={inputClass} placeholder="••••••••••" />
                    {form.confirmPassword && (
                      <p className={`text-xs mt-1 ${form.password === form.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                        {form.password === form.confirmPassword ? '✓ متطابقة' : '✗ غير متطابقة'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>تاريخ الميلاد</label>
                  <div className="grid grid-cols-2 gap-3">
                    <select value={form.birthYear} onChange={e => update('birthYear', e.target.value)} className={inputClass}>
                      <option value="">السنة</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select value={form.birthMonth} onChange={e => update('birthMonth', e.target.value)} className={inputClass}>
                      <option value="">الشهر</option>
                      {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>الجنس</label>
                  <select value={form.gender} onChange={e => update('gender', e.target.value)} className={inputClass}>
                    <option value="">اختر</option>
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>الدولة</label>
                  <select value={form.country} onChange={e => { update('country', e.target.value); update('city', '') }} className={inputClass}>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>المدينة / المحافظة</label>
                  {form.country === 'سوريا' ? (
                    <select value={form.city} onChange={e => update('city', e.target.value)} className={inputClass}>
                      <option value="">اختر المحافظة</option>
                      {SYRIA_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <input value={form.city} onChange={e => update('city', e.target.value)}
                      className={inputClass} placeholder="اكتب اسم مدينتك" />
                  )}
                </div>

                <div>
                  <label className={labelClass}>
                    نبذة تعريفية
                    <span className={`mr-2 text-xs ${form.bio.length > 0 && form.bio.length < 20 ? 'text-red-400' : 'text-gray-600'}`}>
                      ({form.bio.length}/20 حرف كحد أدنى)
                    </span>
                  </label>
                  <textarea value={form.bio} onChange={e => update('bio', e.target.value)} rows={3}
                    className={inputClass + ' resize-none'}
                    placeholder="اكتب نبذة مختصرة عن نفسك..." />
                </div>
              </div>
            )}

            {/* Step 2 — التعليم */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-violet-600/20 border border-violet-500/30 rounded-xl flex items-center justify-center text-xl">🎓</div>
                  <h2 className="text-xl font-black text-white">المعلومات الأكاديمية</h2>
                </div>

                <div>
                  <label className={labelClass}>الحالة الحالية</label>
                  <select value={form.currentStatus} onChange={e => update('currentStatus', e.target.value)} className={inputClass}>
                    <option value="">اختر حالتك</option>
                    <option value="student">طالب</option>
                    <option value="graduate">خريج</option>
                    <option value="employed">موظف</option>
                    <option value="freelancer">مستقل</option>
                    <option value="researcher">باحث</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>الجامعة</label>
                  <input value={form.university} onChange={e => update('university', e.target.value)}
                    className={inputClass} placeholder="جامعة دمشق" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>التخصص</label>
                    <input value={form.major} onChange={e => update('major', e.target.value)}
                      className={inputClass} placeholder="هندسة المعلوماتية" />
                  </div>
                  <div>
                    <label className={labelClass}>الدرجة العلمية</label>
                    <select value={form.degree} onChange={e => update('degree', e.target.value)} className={inputClass}>
                      <option value="">اختر</option>
                      <option value="bachelor">بكالوريوس</option>
                      <option value="master">ماجستير</option>
                      <option value="phd">دكتوراه</option>
                      <option value="diploma">دبلوم</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>سنة التخرج</label>
                  <select value={form.gradYear} onChange={e => update('gradYear', e.target.value)} className={inputClass}>
                    <option value="">اختر السنة</option>
                    {Array.from({ length: 30 }, (_, i) => currentYear + 5 - i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 3 — الخبرة والمهارات */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-violet-600/20 border border-violet-500/30 rounded-xl flex items-center justify-center text-xl">💻</div>
                  <h2 className="text-xl font-black text-white">الخبرة والمهارات</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>الشركة</label>
                    <input value={form.company} onChange={e => update('company', e.target.value)}
                      className={inputClass} placeholder="اسم الشركة" />
                  </div>
                  <div>
                    <label className={labelClass}>المسمى الوظيفي</label>
                    <input value={form.jobTitle} onChange={e => update('jobTitle', e.target.value)}
                      className={inputClass} placeholder="مطور برمجيات" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>سنوات الخبرة</label>
                  <input type="number" value={form.experience} onChange={e => update('experience', e.target.value)}
                    className={inputClass} placeholder="3" min="0" max="50" />
                </div>

                <div>
                  <label className={labelClass}>المهارات التقنية</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {SKILLS.map(skill => (
                      <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          form.skills.includes(skill)
                            ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_10px_rgba(124,58,237,0.3)]'
                            : 'bg-[#0d0d1a] text-gray-400 border border-violet-900/40 hover:border-violet-500/50 hover:text-white'
                        }`}>
                        {skill}
                      </button>
                    ))}
                  </div>
                  {form.skills.length > 0 && (
                    <p className="text-violet-400/70 text-xs mt-2">✓ تم اختيار {form.skills.length} مهارة</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 4 — الروابط والاهتمامات */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-violet-600/20 border border-violet-500/30 rounded-xl flex items-center justify-center text-xl">🔗</div>
                  <h2 className="text-xl font-black text-white">الروابط والاهتمامات</h2>
                </div>

                <div>
                  <label className={labelClass}>
                    حساب GitHub
                    <span className="text-gray-600 text-xs mr-2">(اختياري)</span>
                  </label>
                  <input value={form.github} onChange={e => update('github', e.target.value)}
                    className={`${inputClass} ${form.github && !validateUrl(form.github, 'github') ? 'border-red-500/60' : ''}`}
                    placeholder="https://github.com/username" />
                  {form.github && !validateUrl(form.github, 'github') && (
                    <p className="text-red-400 text-xs mt-1">يجب أن يبدأ الرابط بـ https://github.com/</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>
                    حساب Facebook
                    <span className="text-gray-600 text-xs mr-2">(اختياري)</span>
                  </label>
                  <input value={form.facebook} onChange={e => update('facebook', e.target.value)}
                    className={`${inputClass} ${form.facebook && !validateUrl(form.facebook, 'facebook') ? 'border-red-500/60' : ''}`}
                    placeholder="https://facebook.com/username" />
                  {form.facebook && !validateUrl(form.facebook, 'facebook') && (
                    <p className="text-red-400 text-xs mt-1">يجب أن يبدأ الرابط بـ https://facebook.com/</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>
                    حساب Instagram
                    <span className="text-gray-600 text-xs mr-2">(اختياري)</span>
                  </label>
                  <input value={form.instagram} onChange={e => update('instagram', e.target.value)}
                    className={`${inputClass} ${form.instagram && !validateUrl(form.instagram, 'instagram') ? 'border-red-500/60' : ''}`}
                    placeholder="https://instagram.com/username" />
                  {form.instagram && !validateUrl(form.instagram, 'instagram') && (
                    <p className="text-red-400 text-xs mt-1">يجب أن يبدأ الرابط بـ https://instagram.com/</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>مجالات الاهتمام</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {INTERESTS.map(interest => (
                      <button key={interest} type="button" onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          form.interests.includes(interest)
                            ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_10px_rgba(124,58,237,0.3)]'
                            : 'bg-[#0d0d1a] text-gray-400 border border-violet-900/40 hover:border-violet-500/50 hover:text-white'
                        }`}>
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>ماذا تبحث عن في المنصة؟</label>
                  <select value={form.lookingFor} onChange={e => update('lookingFor', e.target.value)} className={inputClass}>
                    <option value="">اختر</option>
                    <option value="team">إيجاد فريق لمشروع</option>
                    <option value="job">فرصة عمل</option>
                    <option value="learn">التعلم والتطور</option>
                    <option value="collaborate">التعاون في مشاريع</option>
                    <option value="network">بناء شبكة علاقات</option>
                  </select>
                </div>
              </div>
            )}

            {/* ✦ رسالة الخطأ */}
            {error && (
              <div className="mt-5 bg-red-500/8 border border-red-500/25 text-red-400
                              rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                <span className="text-red-400 text-base">❌</span>
                {error}
              </div>
            )}

            {/* ✦ أزرار التنقل */}
            <div className="flex justify-between mt-7 pt-5 border-t border-violet-900/20">
              {step > 0 ? (
                <button onClick={() => setStep(s => s - 1)}
                  className="px-6 py-3 rounded-xl border border-violet-900/40 text-gray-400
                             hover:text-white hover:border-violet-500/50 transition-all duration-200
                             flex items-center gap-2">
                  ← السابق
                </button>
              ) : (
                <Link href="/login"
                  className="px-6 py-3 rounded-xl border border-violet-900/40 text-gray-400
                             hover:text-white hover:border-violet-500/50 transition-all duration-200">
                  لدي حساب
                </Link>
              )}

              {step < steps.length - 1 ? (
                <button onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600
                             hover:from-violet-500 hover:to-indigo-500
                             text-white font-bold rounded-xl transition-all duration-300
                             hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]
                             hover:-translate-y-0.5 flex items-center gap-2">
                  التالي ←
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600
                             hover:from-violet-500 hover:to-indigo-500
                             disabled:opacity-50 disabled:cursor-not-allowed
                             text-white font-bold rounded-xl transition-all duration-300
                             hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]
                             flex items-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري التسجيل...
                    </>
                  ) : (
                    <> إنشاء الحساب</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ✦ Footer */}
        <p className="text-center text-gray-700 text-xs mt-5">
          SAAIT © 2025 — التحالف السوري للذكاء الاصطناعي 
        </p>
      </div>
    </div>
  )
}
