'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SKILLS = ['Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'Cyber Security', 'Data Science', 'SQL', 'MongoDB', 'Docker', 'Linux', 'Blockchain', 'Flutter', 'Swift', 'C++']
const INTERESTS = ['الذكاء الاصطناعي', 'تعلم الآلة', 'الأمن السيبراني', 'البرمجة', 'تحليل البيانات', 'الروبوتيكس', 'الحوسبة السحابية', 'البلوكتشين', 'تطوير الويب']

export default function EditProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    name: '',
    bio: '', age: '', gender: '', country: '', city: '',
    university: '', major: '', degree: '', gradYear: '', currentStatus: '',
    company: '', jobTitle: '', experience: '',
    github: '', linkedin: '', website: '',
    skills: [] as string[],
    interests: [] as string[],
    lookingFor: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') fetchProfile()
  }, [status])

  const fetchProfile = async () => {
    const res = await fetch('/api/profile')
    const data = await res.json()
    if (data) {
      setForm({
        name: data.name || '',
        bio: data.profile?.bio || '',
        age: data.profile?.age?.toString() || '',
        gender: data.profile?.gender || '',
        country: data.profile?.country || '',
        city: data.profile?.city || '',
        university: data.profile?.university || '',
        major: data.profile?.major || '',
        degree: data.profile?.degree || '',
        gradYear: data.profile?.gradYear?.toString() || '',
        currentStatus: data.profile?.currentStatus || '',
        company: data.profile?.company || '',
        jobTitle: data.profile?.jobTitle || '',
        experience: data.profile?.experience?.toString() || '',
        github: data.profile?.github || '',
        linkedin: data.profile?.linkedin || '',
        website: data.profile?.website || '',
        skills: data.skills?.map((s: any) => s.skill.name) || [],
        interests: data.profile?.interests || [],
        lookingFor: data.profile?.lookingFor || '',
      })
    }
    setLoading(false)
  }

  const update = (field: string, value: any) => setForm(p => ({ ...p, [field]: value }))

  const toggleSkill = (skill: string) => {
    setForm(p => ({
      ...p,
      skills: p.skills.includes(skill)
        ? p.skills.filter(s => s !== skill)
        : [...p.skills, skill]
    }))
  }

  const toggleInterest = (interest: string) => {
    setForm(p => ({
      ...p,
      interests: p.interests.includes(interest)
        ? p.interests.filter(i => i !== interest)
        : [...p.interests, interest]
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white" dir="rtl">

      <nav className="border-b border-purple-900/30 bg-[#0d0d14] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center font-bold">S</div>
            <span className="font-bold text-white">SAAIT</span>
          </Link>
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition text-sm">
            ← لوحة التحكم
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">تعديل الملف الشخصي</h1>
          <p className="text-gray-400">أكمل ملفك الشخصي للحصول على فرص أفضل</p>
        </div>

        {success && (
          <div className="mb-6 bg-green-900/50 border border-green-500 text-green-400 rounded-xl px-4 py-3 text-sm text-center">
            تم حفظ التغييرات بنجاح ✅
          </div>
        )}

        <div className="space-y-6">

          {/* Personal Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">المعلومات الشخصية</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">الاسم الكامل</label>
                <input value={form.name} onChange={e => update('name', e.target.value)} className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">نبذة تعريفية</label>
                <textarea value={form.bio} onChange={e => update('bio', e.target.value)} rows={3} className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none resize-none" placeholder="اكتب نبذة عن نفسك..." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">العمر</label>
                  <input type="number" value={form.age} onChange={e => update('age', e.target.value)} className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">الجنس</label>
                  <select value={form.gender} onChange={e => update('gender', e.target.value)} className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none">
                    <option value="">اختر</option>
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">الدولة</label>
                  <input value={form.country} onChange={e => update('country', e.target.value)} className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none" placeholder="سوريا" />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">المدينة</label>
                <input value={form.city} onChange={e => update('city', e.target.value)} className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none" placeholder="دمشق" />
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">التعليم</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">الحالة</label>
                <select value={form.currentStatus} onChange={e => update('currentStatus', e.target.value)} className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none">
                  <option value="">اختر</option>
                  <option value="student">طالب</option>
                  <option value="graduate">خريج</option>
                  <option value="employed">موظف</option>
                  <option value="freelancer">مستقل</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">الجامعة</label>
                  <input value={form.university} onChange={e => update('university', e.target.value)} className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none" placeholder="جامعة دمشق" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">التخصص</label>
                  <input value={form.major} onChange={e => update('major', e.target.value)} className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none" placeholder="هندسة المعلوماتية" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">الدرجة العلمية</label>
                  <select value={form.degree} onChange={e => update('degree', e.target.value)} className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none">
                    <option value="">اختر</option>
                    <option value="bachelor">بكالوريوس</option>
                    <option value="master">ماجستير</option>
                    <option value="phd">دكتوراه</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">سنة التخرج</label>
                  <input type="number" value={form.gradYear} onChange={e => update('gradYear', e.target.value)} className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none" placeholder="2024" />
                </div>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">الخبرة المهنية</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">الشركة</label>
                  <input value={form.company} onChange={e => update('company', e.target.value)} className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">المسمى الوظيفي</label>
                  <input value={form.jobTitle} onChange={e => update('jobTitle', e.target.value)} className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">سنوات الخبرة</label>
                <input type="number" value={form.experience} onChange={e => update('experience', e.target.value)} className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">المهارات التقنية</h2>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map(skill => (
                <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition ${form.skills.includes(skill) ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-purple-500'}`}>
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">الروابط</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">GitHub</label>
                <input value={form.github} onChange={e => update('github', e.target.value)} className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none" placeholder="https://github.com/username" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">LinkedIn</label>
                <input value={form.linkedin} onChange={e => update('linkedin', e.target.value)} className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none" placeholder="https://linkedin.com/in/username" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">موقع شخصي</label>
                <input value={form.website} onChange={e => update('website', e.target.value)} className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none" placeholder="https://mywebsite.com" />
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">الاهتمامات</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {INTERESTS.map(interest => (
                <button key={interest} type="button" onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition ${form.interests.includes(interest) ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-purple-500'}`}>
                  {interest}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">ماذا تبحث عن؟</label>
              <select value={form.lookingFor} onChange={e => update('lookingFor', e.target.value)} className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none">
                <option value="">اختر</option>
                <option value="team">فريق عمل</option>
                <option value="job">فرصة عمل</option>
                <option value="learn">التعلم</option>
                <option value="collaborate">التعاون</option>
                <option value="network">شبكة علاقات</option>
              </select>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl px-6 py-4 transition text-lg">
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>
    </div>
  )
}