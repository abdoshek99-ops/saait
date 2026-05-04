'use client'
import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SUGGESTIONS = [
  'اشرح لي الفرق بين Machine Learning و Deep Learning',
  'كيف أبدأ تعلم البرمجة من الصفر؟',
  'ما هي أفضل أدوات الذكاء الاصطناعي للمطورين؟',
  'اكتب لي كود Python لتحليل بيانات بسيط',
  'ماهي منصة SAIIT Platform',
  'كيف أحمي موقعي من الهجمات السيبرانية؟',
]

export default function AIChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [typedMessages, setTypedMessages] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const typeText = (text: string, index: number) => {
    let i = 0
    const interval = setInterval(() => {
      setTypedMessages(prev => {
        const updated = [...prev]
        updated[index] = text.slice(0, i + 1)
        return updated
      })
      i++
      if (i >= text.length) clearInterval(interval)
    }, 12)
  }

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || loading) return

    const userMessage = { role: 'user', content: messageText }
    setMessages(prev => [...prev, userMessage])
    setTypedMessages(prev => [...prev, messageText])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      const data = await res.json()

      if (data.content) {
        const newIndex = messages.length + 1

        setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
        setTypedMessages(prev => [...prev, ""])

        typeText(data.content, newIndex)
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'عذراً، حدث خطأ. حاول مرة أخرى.'
      }])
    }

    setLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const menuItems = [
    { href: '/dashboard', icon: '', label: 'الرئيسية' },
    { href: '/projects', icon: '', label: 'المشاريع' },
    { href: '/events', icon: '', label: 'الفعاليات' },
    { href: '/community', icon: '', label: 'المجتمع' },
    { href: '/news', icon: '', label: 'الأخبار' },
  ]

  return (
    <div className="min-h-screen bg-[#05050a] text-white flex flex-col" dir="rtl">

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed top-0 right-0 h-full w-72 bg-[#0a0a14] border-l border-purple-900/30 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="white" strokeWidth="1.5"/>
                  <path d="M3 17L12 22L21 17" stroke="white" strokeWidth="1.5"/>
                </svg>
              </div>
              <span className="font-bold">SAAIT AI</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white text-2xl">✕</button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item, i) => (
              <Link key={i} href={item.href} onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-purple-900/20 transition">
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* NAVBAR */}
      <nav className="border-b border-purple-900/40 bg-[#070711]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 bg-[#131322] rounded-xl flex flex-col items-center justify-center gap-1.5">
              <span className="w-5 h-0.5 bg-gray-400" />
              <span className="w-5 h-0.5 bg-gray-400" />
              <span className="w-5 h-0.5 bg-gray-400" />
            </button>

            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="white" strokeWidth="1.5"/>
                  <path d="M3 17L12 22L21 17" stroke="white" strokeWidth="1.5"/>
                </svg>
              </div>
              <span className="font-bold">SAAIT AI</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item, i) => (
              <Link key={i} href={item.href}
                className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-purple-900/20 text-sm flex items-center gap-2">
                <span>{item.icon}</span>{item.label}
              </Link>
            ))}
          </div>

          <button 
            onClick={() => setMessages([])}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-lg shadow-blue-600/20"
          >
             دردشة جديدة
          </button>
        </div>
      </nav>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-4">

        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mb-4">
              🤖
            </div>
            <h1 className="text-2xl font-bold mb-2">SAAIT AI Assistant</h1>
            <p className="text-gray-500 mb-6">مساعد ذكي بتقنيات حديثة للإجابة على أسئلتك</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)}
                  className="bg-[#0d0d18] border border-gray-800 hover:border-purple-600 rounded-xl p-4 text-sm text-gray-400 hover:text-white">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 pb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xl px-4 py-3 rounded-2xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                    : 'bg-[#0d0d18] border border-gray-800'
                }`}>
                  {msg.role === 'assistant'
                    ? typedMessages[i] || ''
                    : msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-gray-400 text-sm">جاري التفكير...</div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* INPUT */}
        <div className="mt-4 flex gap-3">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={1}
            className="flex-1 bg-[#0d0d18] border border-gray-800 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-purple-500"
            placeholder="اكتب سؤالك..."
          />
          <button onClick={() => sendMessage()}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}