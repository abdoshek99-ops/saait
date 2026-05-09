'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const JOB_TYPES = ['الكل', 'دوام كامل', 'دوام جزئي', 'عن بُعد', 'تدريب', 'مستقل']
const SERVICE_CATEGORIES = ['الكل', 'برمجة وتطوير', 'ذكاء اصطناعي', 'تصميم', 'أمن سيبراني', 'تحليل بيانات', 'تدريس وشرح', 'ترجمة', 'كتابة محتوى', 'استشارات تقنية']

const inputClass = "w-full bg-[#0d0d1a] text-white rounded-xl px-4 py-3 border border-violet-900/30 focus:border-violet-500 focus:outline-none transition placeholder-gray-700 text-sm"

// ✅ دالة تصحيح الروابط
function fixUrl(url: string): string {
  if (!url) return ''
  const trimmed = url.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  if (trimmed.includes('@')) return `mailto:${trimmed}`
  return `https://${trimmed}`
}

// ==================== JOB CARD ====================
function JobCard({ job, currentUserId, isAdmin, onDelete }: any) {
  const [deleting, setDeleting] = useState(false)
  const canDelete = job.postedById === currentUserId || isAdmin

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذه الوظيفة؟')) return
    setDeleting(true)
    await fetch(`/api/jobs/${job.id}`, { method: 'DELETE' })
    onDelete(job.id)
    setDeleting(false)
  }

  const jobUrl = fixUrl(job.url)

  return (
    <div className="bg-[#0a0a16] border border-violet-900/15 hover:border-violet-500/30
                    rounded-2xl p-6 transition-all duration-300
                    hover:shadow-[0_0_20px_rgba(124,58,237,0.08)] group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-black text-lg mb-1 truncate">{job.title}</h3>
          <p className="text-violet-400 font-medium text-sm">{job.company}</p>
          {job.postedBy && (
            <p className="text-gray-600 text-xs mt-0.5">نشر بواسطة: {job.postedBy.name}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 mr-3">
          <span className={`text-xs px-3 py-1.5 rounded-full border ${
            job.isRemote
              ? 'bg-emerald-900/20 text-emerald-400 border-emerald-700/30'
              : 'bg-gray-800/60 text-gray-400 border-gray-700/30'
          }`}>
            {job.isRemote ? '🌐 عن بُعد' : '📍 حضوري'}
          </span>
          {canDelete && (
            <button onClick={handleDelete} disabled={deleting}
              className="w-7 h-7 flex items-center justify-center
                         bg-red-900/20 hover:bg-red-900/40 border border-red-700/30
                         rounded-lg text-xs transition opacity-0 group-hover:opacity-100">
              {deleting ? '⏳' : '🗑️'}
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-500 text-sm line-clamp-3 mb-4 leading-relaxed">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="bg-violet-900/20 text-violet-300 text-xs px-3 py-1
                         rounded-full border border-violet-700/20">{job.type}</span>
        {job.location && (
          <span className="bg-gray-800/60 text-gray-400 text-xs px-3 py-1 rounded-full">
            📍 {job.location}
          </span>
        )}
        {job.salary && (
          <span className="bg-amber-900/20 text-amber-400 text-xs px-3 py-1
                           rounded-full border border-amber-800/20">
            💰 {job.salary}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-violet-900/10">
        <span className="text-gray-700 text-xs">
          {new Date(job.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        {/* ✅ زر التقديم مع تصحيح الرابط */}
        {jobUrl ? (
          <a href={jobUrl} target="_blank" rel="noopener noreferrer"
            className="bg-gradient-to-r from-violet-600 to-indigo-600
                       hover:from-violet-500 hover:to-indigo-500
                       text-white text-sm font-bold px-5 py-2 rounded-xl
                       transition hover:shadow-[0_0_12px_rgba(124,58,237,0.3)]">
            قدّم الآن ←
          </a>
        ) : (
          <span className="text-gray-700 text-xs">لا يوجد رابط تقديم</span>
        )}
      </div>
    </div>
  )
}

// ==================== SERVICE CARD ====================
function ServiceCard({ service, currentUserId, isAdmin, onDelete }: any) {
  const [deleting, setDeleting] = useState(false)
  const canDelete = service.providerId === currentUserId || isAdmin

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return
    setDeleting(true)
    await fetch(`/api/services/${service.id}`, { method: 'DELETE' })
    onDelete(service.id)
    setDeleting(false)
  }

  // ✅ تصحيح رابط التواصل
  const contactUrl = service.contactInfo
    ? fixUrl(service.contactInfo)
    : ''

  return (
    <div className="bg-[#0a0a16] border border-cyan-900/15 hover:border-cyan-500/30
                    rounded-2xl p-6 transition-all duration-300
                    hover:shadow-[0_0_20px_rgba(6,182,212,0.08)] group">

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700
                          flex items-center justify-center font-black text-white text-sm
                          shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            {service.provider?.name?.charAt(0)}
          </div>
          <div>
            <p className="text-white font-bold text-sm">{service.provider?.name}</p>
            <p className="text-gray-500 text-xs">
              {service.provider?.profile?.jobTitle || 'مزود خدمة'}
            </p>
          </div>
        </div>
        {canDelete && (
          <button onClick={handleDelete} disabled={deleting}
            className="w-7 h-7 flex items-center justify-center
                       bg-red-900/20 hover:bg-red-900/40 border border-red-700/30
                       rounded-lg text-xs transition opacity-0 group-hover:opacity-100">
            {deleting ? '⏳' : '🗑️'}
          </button>
        )}
      </div>

      <h3 className="text-white font-black text-base mb-2">{service.title}</h3>
      <p className="text-gray-500 text-sm line-clamp-3 mb-4 leading-relaxed">
        {service.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="bg-cyan-900/20 text-cyan-300 text-xs px-3 py-1
                         rounded-full border border-cyan-700/20">{service.category}</span>
        {service.price && (
          <span className="bg-emerald-900/20 text-emerald-400 text-xs px-3 py-1
                           rounded-full border border-emerald-800/20">
            💰 {service.price}
          </span>
        )}
        {service.deliveryTime && (
          <span className="bg-amber-900/20 text-amber-400 text-xs px-3 py-1
                           rounded-full border border-amber-800/20">
            ⏱️ {service.deliveryTime}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-cyan-900/10">
        <span className="text-gray-700 text-xs">
          {new Date(service.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        {/* ✅ زر التواصل مع تصحيح الرابط */}
        {contactUrl ? (
          <a href={contactUrl} target="_blank" rel="noopener noreferrer"
            className="bg-gradient-to-r from-cyan-600 to-blue-600
                       hover:from-cyan-500 hover:to-blue-500
                       text-white text-sm font-bold px-5 py-2 rounded-xl
                       transition hover:shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            تواصل الآن ←
          </a>
        ) : (
          <span className="text-gray-700 text-xs">لا توجد معلومات تواصل</span>
        )}
      </div>
    </div>
  )
}

// ==================== MAIN PAGE ====================
export default function JobsPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'jobs' | 'services'>('jobs')

  const [jobs, setJobs] = useState<any[]>([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [jobType, setJobType] = useState('الكل')
  const [showJobForm, setShowJobForm] = useState(false)
  const [jobSubmitting, setJobSubmitting] = useState(false)
  const [jobError, setJobError] = useState('')
  const [jobForm, setForm] = useState({
    title: '', company: '', description: '',
    location: '', type: 'دوام كامل',
    salary: '', url: '', isRemote: false
  })

  const [services, setServices] = useState<any[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [serviceCategory, setServiceCategory] = useState('الكل')
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [serviceSubmitting, setServiceSubmitting] = useState(false)
  const [serviceError, setServiceError] = useState('')
  const [serviceForm, setServiceForm] = useState({
    title: '', description: '', category: '',
    price: '', deliveryTime: '', contactInfo: ''
  })

  const currentUserId = (session?.user as any)?.id
  const isAdmin = (session?.user as any)?.role === 'admin'

  useEffect(() => { fetchJobs() }, [jobType])
  useEffect(() => { fetchServices() }, [serviceCategory])

  const fetchJobs = async () => {
    setJobsLoading(true)
    const q = jobType !== 'الكل' ? `?type=${encodeURIComponent(jobType)}` : ''
    const res = await fetch(`/api/jobs${q}`)
    const data = await res.json()
    setJobs(Array.isArray(data) ? data : [])
    setJobsLoading(false)
  }

  const fetchServices = async () => {
    setServicesLoading(true)
    const q = serviceCategory !== 'الكل' ? `?category=${encodeURIComponent(serviceCategory)}` : ''
    const res = await fetch(`/api/services${q}`)
    const data = await res.json()
    setServices(Array.isArray(data) ? data : [])
    setServicesLoading(false)
  }

  const handleJobSubmit = async () => {
    setJobError('')
    if (!session) { window.location.href = '/login'; return }
    if (!jobForm.title || !jobForm.company || !jobForm.description) {
      setJobError('العنوان والشركة والوصف مطلوبة'); return
    }
    setJobSubmitting(true)
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobForm),
      })
      const data = await res.json()
      if (!res.ok) { setJobError(data.error || 'حدث خطأ'); return }
      setJobs(p => [data, ...p])
      setForm({ title: '', company: '', description: '', location: '', type: 'دوام كامل', salary: '', url: '', isRemote: false })
      setShowJobForm(false)
    } catch { setJobError('خطأ في الاتصال') }
    finally { setJobSubmitting(false) }
  }

  const handleServiceSubmit = async () => {
    setServiceError('')
    if (!session) { window.location.href = '/login'; return }
    if (!serviceForm.title || !serviceForm.description || !serviceForm.category) {
      setServiceError('العنوان والوصف والتصنيف مطلوبة'); return
    }
    setServiceSubmitting(true)
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceForm),
      })
      const data = await res.json()
      if (!res.ok) { setServiceError(data.error || 'حدث خطأ'); return }
      setServices(p => [data, ...p])
      setServiceForm({ title: '', description: '', category: '', price: '', deliveryTime: '', contactInfo: '' })
      setShowServiceForm(false)
    } catch { setServiceError('خطأ في الاتصال') }
    finally { setServiceSubmitting(false) }
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white" dir="rtl"
      style={{ backgroundImage: `radial-gradient(ellipse at top right, rgba(124,58,237,0.06) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(6,182,212,0.04) 0%, transparent 60%)` }}>

      <nav className="border-b border-violet-900/20 bg-[#08080f]/90 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700
                            flex items-center justify-center font-black text-sm
                            shadow-[0_0_15px_rgba(124,58,237,0.3)]">⚡</div>
            <span className="font-black text-white tracking-widest hidden sm:block">SAAIT</span>
          </Link>
          <div className="flex items-center gap-2">
            {session && activeTab === 'jobs' && (
              <button onClick={() => setShowJobForm(!showJobForm)}
                className="bg-gradient-to-r from-violet-600 to-indigo-600
                           hover:from-violet-500 hover:to-indigo-500
                           text-white text-sm font-bold px-4 py-2 rounded-xl transition
                           hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                + نشر وظيفة
              </button>
            )}
            {session && activeTab === 'services' && (
              <button onClick={() => setShowServiceForm(!showServiceForm)}
                className="bg-gradient-to-r from-cyan-600 to-blue-600
                           hover:from-cyan-500 hover:to-blue-500
                           text-white text-sm font-bold px-4 py-2 rounded-xl transition
                           hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                + عرض خدمة
              </button>
            )}
            <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm transition">
              ← لوحة التحكم
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-white mb-2">سوق العمل والخدمات</h1>
          <p className="text-gray-500">ابحث عن فرصة عمل أو اعرض خدماتك التقنية لمجتمع SAAIT</p>
        </div>

        <div className="flex gap-3 mb-8 justify-center">
          {[
            { id: 'jobs',     label: '💼 فرص العمل',    count: jobs.length,     active: 'from-violet-600 to-indigo-600', shadow: 'rgba(124,58,237,0.3)' },
            { id: 'services', label: '🛠️ سوق الخدمات', count: services.length, active: 'from-cyan-600 to-blue-600',     shadow: 'rgba(6,182,212,0.3)'  },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.active} text-white shadow-[0_0_20px_${tab.shadow}]`
                  : 'bg-[#0a0a16] text-gray-400 border border-violet-900/20 hover:border-violet-500/40'
              }`}>
              {tab.label}
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-800'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div>
            {showJobForm && (
              <div className="bg-[#0a0a16] border border-violet-900/20 rounded-3xl p-6 mb-6
                              shadow-[0_0_30px_rgba(124,58,237,0.06)]">
                <div className="h-0.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-600
                                -mt-6 mb-6 -mx-6 rounded-t-3xl"></div>
                <h3 className="text-white font-black text-lg mb-5">💼 نشر فرصة عمل جديدة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5 font-medium">المسمى الوظيفي *</label>
                    <input value={jobForm.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                      className={inputClass} placeholder="مطور ذكاء اصطناعي" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5 font-medium">اسم الشركة *</label>
                    <input value={jobForm.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                      className={inputClass} placeholder="اسم شركتك أو مشروعك" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5 font-medium">نوع الوظيفة</label>
                    <select value={jobForm.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                      className={inputClass}>
                      {JOB_TYPES.filter(t => t !== 'الكل').map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5 font-medium">الموقع</label>
                    <input value={jobForm.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                      className={inputClass} placeholder="دمشق أو عن بُعد" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5 font-medium">الراتب</label>
                    <input value={jobForm.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))}
                      className={inputClass} placeholder="الرجاء وضع الراتب المناسب للعمل $" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5 font-medium">رابط التقديم</label>
                    <input value={jobForm.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
                      className={inputClass} placeholder="https://..." />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-1.5 font-medium">وصف الوظيفة *</label>
                  <textarea value={jobForm.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    rows={4} className={inputClass + ' resize-none'}
                    placeholder="اشرح متطلبات الوظيفة والمهارات المطلوبة..." />
                </div>
                <div className="flex items-center gap-3 mb-5">
                  <input type="checkbox" id="isRemote" checked={jobForm.isRemote}
                    onChange={e => setForm(p => ({ ...p, isRemote: e.target.checked }))}
                    className="w-4 h-4 accent-violet-600" />
                  <label htmlFor="isRemote" className="text-gray-400 text-sm cursor-pointer">🌐 عمل عن بُعد</label>
                </div>
                {jobError && (
                  <div className="bg-red-500/8 border border-red-500/25 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm flex items-center gap-2">
                    <span>❌</span> {jobError}
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={handleJobSubmit} disabled={jobSubmitting}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500
                               disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition
                               flex items-center gap-2">
                    {jobSubmitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> جاري النشر...</> : <>💼 نشر الوظيفة</>}
                  </button>
                  <button onClick={() => { setShowJobForm(false); setJobError('') }}
                    className="border border-violet-900/30 text-gray-400 hover:text-white px-6 py-3 rounded-xl transition">
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-2 flex-wrap mb-6">
              {JOB_TYPES.map(t => (
                <button key={t} onClick={() => setJobType(t)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    jobType === t
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.3)]'
                      : 'bg-[#0a0a16] text-gray-400 border border-violet-900/20 hover:border-violet-500/40 hover:text-white'
                  }`}>{t}</button>
              ))}
            </div>

            {jobsLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">💼</div>
                <h3 className="text-xl font-bold text-white mb-2">لا توجد وظائف بعد</h3>
                <p className="text-gray-600 mb-4">كن أول من ينشر فرصة عمل!</p>
                {session && (
                  <button onClick={() => setShowJobForm(true)}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold px-6 py-3 rounded-xl">
                    + نشر وظيفة الآن
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {jobs.map(job => (
                  <JobCard key={job.id} job={job}
                    currentUserId={currentUserId} isAdmin={isAdmin}
                    onDelete={(id: string) => setJobs(p => p.filter(j => j.id !== id))} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div>
            {showServiceForm && (
              <div className="bg-[#0a0a16] border border-cyan-900/20 rounded-3xl p-6 mb-6
                              shadow-[0_0_30px_rgba(6,182,212,0.06)]">
                <div className="h-0.5 bg-gradient-to-r from-cyan-600 via-blue-500 to-cyan-600
                                -mt-6 mb-6 -mx-6 rounded-t-3xl"></div>
                <h3 className="text-white font-black text-lg mb-5">🛠️ عرض خدمة جديدة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5 font-medium">عنوان الخدمة *</label>
                    <input value={serviceForm.title} onChange={e => setServiceForm(p => ({ ...p, title: e.target.value }))}
                      className={inputClass} placeholder="تطوير موقع ويب احترافي" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5 font-medium">التصنيف *</label>
                    <select value={serviceForm.category} onChange={e => setServiceForm(p => ({ ...p, category: e.target.value }))}
                      className={inputClass}>
                      <option value="">اختر التصنيف</option>
                      {SERVICE_CATEGORIES.filter(c => c !== 'الكل').map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5 font-medium">السعر</label>
                    <input value={serviceForm.price} onChange={e => setServiceForm(p => ({ ...p, price: e.target.value }))}
                      className={inputClass} placeholder="الرجاء وضع السعر المناسب للمهمة $" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5 font-medium">مدة التسليم</label>
                    <input value={serviceForm.deliveryTime} onChange={e => setServiceForm(p => ({ ...p, deliveryTime: e.target.value }))}
                      className={inputClass} placeholder="3 أيام / أسبوع" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-1.5 font-medium">وصف الخدمة *</label>
                  <textarea value={serviceForm.description} onChange={e => setServiceForm(p => ({ ...p, description: e.target.value }))}
                    rows={4} className={inputClass + ' resize-none'}
                    placeholder="اشرح خدمتك بالتفصيل، ما الذي ستقدمه بالضبط..." />
                </div>
                <div className="mb-5">
                  <label className="block text-gray-400 text-sm mb-1.5 font-medium">
                    معلومات التواصل
                    <span className="text-gray-600 text-xs mr-1">(بريد أو رابط تيليغرام أو واتساب)</span>
                  </label>
                  <input value={serviceForm.contactInfo} onChange={e => setServiceForm(p => ({ ...p, contactInfo: e.target.value }))}
                    className={inputClass} placeholder="your@email.com أو https://t.me/username" />
                </div>
                {serviceError && (
                  <div className="bg-red-500/8 border border-red-500/25 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm flex items-center gap-2">
                    <span>❌</span> {serviceError}
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={handleServiceSubmit} disabled={serviceSubmitting}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500
                               disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition
                               flex items-center gap-2">
                    {serviceSubmitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> جاري النشر...</> : <>🛠️ نشر الخدمة</>}
                  </button>
                  <button onClick={() => { setShowServiceForm(false); setServiceError('') }}
                    className="border border-cyan-900/30 text-gray-400 hover:text-white px-6 py-3 rounded-xl transition">
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-2 flex-wrap mb-6">
              {SERVICE_CATEGORIES.map(c => (
                <button key={c} onClick={() => setServiceCategory(c)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    serviceCategory === c
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'bg-[#0a0a16] text-gray-400 border border-cyan-900/20 hover:border-cyan-500/40 hover:text-white'
                  }`}>{c}</button>
              ))}
            </div>

            {servicesLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🛠️</div>
                <h3 className="text-xl font-bold text-white mb-2">لا توجد خدمات بعد</h3>
                <p className="text-gray-600 mb-4">اعرض مهاراتك وابدأ في كسب المال!</p>
                {session && (
                  <button onClick={() => setShowServiceForm(true)}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold px-6 py-3 rounded-xl">
                    + عرض خدمة الآن
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map(service => (
                  <ServiceCard key={service.id} service={service}
                    currentUserId={currentUserId} isAdmin={isAdmin}
                    onDelete={(id: string) => setServices(p => p.filter(s => s.id !== id))} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
