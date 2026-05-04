'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'  // ✅【أضف هذا السطر】

const CATEGORIES = ['الكل', 'الذكاء الاصطناعي', 'تعلم الآلة', 'الأمن السيبراني', 'البرمجة', 'التكنولوجيا', 'ريادة الأعمال']

const menuItems = [
  { href: '/dashboard', icon: '', label: 'الرئيسية' },
  { href: '/projects', icon: '', label: 'المشاريع' },
  { href: '/events', icon: '', label: 'الفعاليات' },
  { href: '/community', icon: '', label: 'المجتمع' },
  { href: '/news', icon: '', label: 'الأخبار' },
]
export default function NewsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('الكل')
  const [selectedArticle, setSelectedArticle] = useState<any>(null) // للنافذة

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/news')
      const result = await res.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching news:', error)
      setData({ all: [], categories: {} })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchArticles()

    // تحديث تلقائي كل 3 ساعات
    const interval = setInterval(() => {
      fetchArticles()
    }, 10800000) // 3 ساعات بالمللي ثانية

    return () => clearInterval(interval)
  }, [])

  const displayArticles = category === 'الكل' 
    ? (data?.all || []) 
    : (data?.categories?.[category] || [])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white" dir="rtl">
      {/* Navbar - نفس التصميم الاحترافي من Dashboard */}
<nav className="border-b border-purple-900/40 bg-[#080810]/80 backdrop-blur sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

    {/* Logo + Name (يمين) */}
    <div className="flex items-center gap-3">
      {/* Logo SVG */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="white" strokeWidth="1.5"/>
          <path d="M3 17L12 22L21 17" stroke="white" strokeWidth="1.5"/>
          <path d="M3 12L12 17L21 12" stroke="white" strokeWidth="1.5"/>
        </svg>
      </div>

      <div>
        <span className="font-bold text-white text-sm">SAAIT</span>
        <p className="text-purple-400 text-xs">Building Syria's Tech Future</p>
      </div>
    </div>

    {/* Center Menu مع الخط التحتي النشط */}
    <div className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
      {menuItems.map((item) => {
        const active = item.href === '/news'  // لأننا في صفحة الأخبار
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={`relative px-6 py-2 rounded-lg text-sm transition
              ${active ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-purple-900/20'}`
            }
          >
            {item.label}
            {active && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></span>
            )}
          </Link>
        )
      })}
    </div>

    {/* Right Side */}
    <div className="flex items-center gap-3">
      <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition px-4 py-2 rounded-xl hover:bg-purple-900/20">
        لوحة التحكم
      </Link>
    </div>

  </div>
</nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">أخبار التقنية</h1>
            <p className="text-gray-400">آخر أخبار الذكاء الاصطناعي والتكنولوجيا</p>
          </div>
          <button
            onClick={fetchArticles}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-2xl text-sm flex items-center gap-2 transition"
          >
            🔄 تحديث الآن
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap mb-8">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-sm transition ${category === c ? 'bg-purple-600 text-white' : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-purple-700/50'}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : displayArticles.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-bold text-white mb-2">لا توجد أخبار بعد</h3>
            <p className="text-gray-500">جاري تحديث الأخبار...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayArticles.map((article: any, index: number) => (
              <div 
                key={index} 
                onClick={() => setSelectedArticle(article)}
                className="bg-gray-900 border border-gray-800 hover:border-purple-700/50 rounded-2xl overflow-hidden transition group cursor-pointer"
              >
                {article.image_url && (
                  <img src={article.image_url} alt={article.title} className="w-full h-48 object-cover" />
                )}
                {!article.image_url && (
                  <div className="w-full h-48 bg-gradient-to-br from-purple-900/40 to-gray-900 flex items-center justify-center text-5xl">📰</div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-purple-900/30 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-700/30">
                      {article.category || 'التكنولوجيا'}
                    </span>
                    <span className="text-gray-500 text-xs">{formatDate(article.publishedAt || article.pubDate)}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-purple-400 transition line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                    {article.description || 'لا يوجد وصف متاح'}
                  </p>
                  <div className="text-purple-400 text-sm flex items-center justify-end">
                    اقرأ المزيد ←
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal - الخبر الكامل داخل المنصة */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
          <div className="bg-[#0f0f17] max-w-2xl w-full rounded-3xl overflow-hidden">
            {/* Header of modal */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <span className="bg-purple-900/30 text-purple-300 text-xs px-4 py-1 rounded-full">
                {selectedArticle.category}
              </span>
              <button onClick={() => setSelectedArticle(null)} className="text-3xl text-gray-400 hover:text-white">×</button>
            </div>

            {selectedArticle.image_url && (
              <img src={selectedArticle.image_url} alt={selectedArticle.title} className="w-full h-64 object-cover" />
            )}

            <div className="p-8">
              <h1 className="text-2xl font-bold leading-tight mb-4">{selectedArticle.title}</h1>
              <p className="text-gray-400 text-sm mb-6">
                {formatDate(selectedArticle.publishedAt || selectedArticle.pubDate)} • {selectedArticle.source_name || selectedArticle.source}
              </p>
              <div className="prose prose-invert text-gray-300 leading-relaxed">
                {selectedArticle.description || selectedArticle.content || 'الوصف غير متاح حالياً'}
              </div>

              <div className="mt-10 flex gap-3">
                <a
                  href={selectedArticle.link}
                  target="_blank"
                  className="flex-1 text-center py-4 bg-gray-800 hover:bg-gray-700 rounded-2xl text-sm transition"
                >
                  زيارة المصدر الأصلي
                </a>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 rounded-2xl text-sm transition"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}