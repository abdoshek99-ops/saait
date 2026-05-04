'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<any>({ projects: [], users: [], articles: [], courses: [], jobs: [] })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) { setQuery(q); fetchResults(q) }
  }, [searchParams])

  const fetchResults = async (q: string) => {
    if (!q || q.length < 2) return
    setLoading(true)
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    setResults(data)
    setLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      fetchResults(query)
    }
  }

  const totalResults = (results.projects?.length || 0) + (results.users?.length || 0) +
    (results.articles?.length || 0) + (results.courses?.length || 0) + (results.jobs?.length || 0)

  const tabs = [
    { id: 'all', label: 'الكل', count: totalResults },
    { id: 'projects', label: 'المشاريع', count: results.projects?.length || 0 },
    { id: 'users', label: 'الأعضاء', count: results.users?.length || 0 },
    { id: 'articles', label: 'الأخبار', count: results.articles?.length || 0 },
    { id: 'courses', label: 'الكورسات', count: results.courses?.length || 0 },
    { id: 'jobs', label: 'الوظائف', count: results.jobs?.length || 0 },
  ]

  return (
    <div className="min-h-screen bg-[#050508] text-white" dir="rtl">

      <nav className="border-b border-purple-900/40 bg-[#080810] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center font-bold">S</div>
            <span className="font-bold text-white hidden sm:block">SAAIT</span>
          </Link>
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition text-sm">
            ← لوحة التحكم
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">🔍</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-[#0a0a12] text-white rounded-2xl pr-12 pl-4 py-4 border border-gray-700 focus:border-purple-500 focus:outline-none text-lg"
              placeholder="ابحث عن مشاريع، أعضاء، أخبار، كورسات..."
              autoFocus
            />
            <button type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition text-sm">
              بحث
            </button>
          </div>
        </form>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : query && totalResults === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">لا توجد نتائج</h3>
            <p className="text-gray-600">جرب كلمات بحث مختلفة</p>
          </div>
        ) : totalResults > 0 ? (
          <>
            {/* Tabs */}
            <div className="flex gap-2 flex-wrap mb-6">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-sm transition flex items-center gap-2 ${activeTab === tab.id ? 'bg-purple-600 text-white' : 'bg-[#0d0d18] text-gray-400 border border-gray-800'}`}>
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-purple-500' : 'bg-gray-700'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-6">

              {/* Projects */}
              {(activeTab === 'all' || activeTab === 'projects') && results.projects?.length > 0 && (
                <div>
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    🚀 المشاريع
                    <span className="text-gray-600 text-sm font-normal">({results.projects.length})</span>
                  </h3>
                  <div className="space-y-3">
                    {results.projects.map((p: any) => (
                      <Link key={p.id} href={`/projects/${p.id}`}
                        className="flex items-center gap-4 bg-[#0a0a12] border border-gray-800 hover:border-purple-700/50 rounded-2xl p-4 transition">
                        <div className="w-10 h-10 bg-purple-900/30 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🚀</div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-white font-medium truncate">{p.title}</p>
                          <p className="text-gray-500 text-sm truncate">{p.description}</p>
                        </div>
                        <span className="bg-purple-900/30 text-purple-300 text-xs px-2 py-1 rounded-full border border-purple-700/30 flex-shrink-0">
                          {p.field}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {(activeTab === 'all' || activeTab === 'users') && results.users?.length > 0 && (
                <div>
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    👥 الأعضاء
                    <span className="text-gray-600 text-sm font-normal">({results.users.length})</span>
                  </h3>
                  <div className="space-y-3">
                    {results.users.map((u: any) => (
                      <Link key={u.id} href={`/profile/${u.id}`}
                        className="flex items-center gap-4 bg-[#0a0a12] border border-gray-800 hover:border-purple-700/50 rounded-2xl p-4 transition">
                        <div className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                          {u.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{u.name}</p>
                          <p className="text-gray-500 text-sm">
                            {u.profile?.jobTitle || 'عضو'}
                            {u.profile?.country && ` • ${u.profile.country}`}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles */}
              {(activeTab === 'all' || activeTab === 'articles') && results.articles?.length > 0 && (
                <div>
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    📰 الأخبار
                    <span className="text-gray-600 text-sm font-normal">({results.articles.length})</span>
                  </h3>
                  <div className="space-y-3">
                    {results.articles.map((a: any) => (
                      <div key={a.id}
                        className="flex items-center gap-4 bg-[#0a0a12] border border-gray-800 rounded-2xl p-4">
                        <div className="w-10 h-10 bg-blue-900/30 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📰</div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-white font-medium truncate">{a.title}</p>
                          <p className="text-gray-500 text-sm truncate">{a.content}</p>
                        </div>
                        <span className="bg-blue-900/30 text-blue-300 text-xs px-2 py-1 rounded-full flex-shrink-0">
                          {a.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Courses */}
              {(activeTab === 'all' || activeTab === 'courses') && results.courses?.length > 0 && (
                <div>
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    🎓 الكورسات
                    <span className="text-gray-600 text-sm font-normal">({results.courses.length})</span>
                  </h3>
                  <div className="space-y-3">
                    {results.courses.map((c: any) => (
                      <a key={c.id} href={c.url} target="_blank"
                        className="flex items-center gap-4 bg-[#0a0a12] border border-gray-800 hover:border-purple-700/50 rounded-2xl p-4 transition">
                        <div className="w-10 h-10 bg-green-900/30 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🎓</div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-white font-medium truncate">{c.title}</p>
                          <p className="text-gray-500 text-sm truncate">{c.description}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${c.isFree ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                          {c.isFree ? 'مجاني' : 'مدفوع'}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Jobs */}
              {(activeTab === 'all' || activeTab === 'jobs') && results.jobs?.length > 0 && (
                <div>
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    💼 الوظائف
                    <span className="text-gray-600 text-sm font-normal">({results.jobs.length})</span>
                  </h3>
                  <div className="space-y-3">
                    {results.jobs.map((j: any) => (
                      <div key={j.id}
                        className="flex items-center gap-4 bg-[#0a0a12] border border-gray-800 rounded-2xl p-4">
                        <div className="w-10 h-10 bg-yellow-900/30 rounded-xl flex items-center justify-center text-xl flex-shrink-0">💼</div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-white font-medium truncate">{j.title}</p>
                          <p className="text-gray-500 text-sm truncate">{j.company} • {j.type}</p>
                        </div>
                        {j.isRemote && (
                          <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full flex-shrink-0">
                            عن بُعد
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">ابحث في المنصة</h3>
            <p className="text-gray-600">ابحث عن مشاريع، أعضاء، أخبار، كورسات ووظائف</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  )
}