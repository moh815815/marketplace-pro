// components/layout/AuthModal.tsx
'use client'
import { useState } from 'react'
import { X, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useUIStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

type Tab = 'login' | 'signup'

export function AuthModal() {
  const { authOpen, toggleAuth } = useUIStore()
  const [tab, setTab]           = useState<Tab>('login')
  const [loading, setLoading]   = useState(false)
  const [showPw, setShowPw]     = useState(false)

  // Form state
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone]       = useState('')
  const [role, setRole]         = useState<'buyer' | 'merchant'>('buyer')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { toast.error('أدخل البريد وكلمة المرور'); return }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { toast.error('❌ ' + (error.message.includes('Invalid') ? 'بيانات غير صحيحة' : error.message)); return }
    toast.success('✅ تم تسجيل الدخول بنجاح!')
    toggleAuth()
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password || !fullName) { toast.error('أكمل جميع الحقول المطلوبة'); return }
    if (password.length < 6) { toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, phone, role } },
    })
    setLoading(false)
    if (error) { toast.error('❌ ' + error.message); return }
    toast.success('✅ تم إنشاء الحساب! تحقق من بريدك الإلكتروني')
    toggleAuth()
  }

  async function handleOAuth(provider: 'google' | 'apple') {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  if (!authOpen) return null

  return (
    <div className="fixed inset-0 bg-black/65 z-[300] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-navy-2 border border-gold/20 rounded-2xl p-7 w-[420px] max-w-full relative animate-slide-up">
        <button
          onClick={toggleAuth}
          className="absolute top-4 right-4 btn-ghost p-1.5 text-gray-400"
        >
          <X size={16} />
        </button>

        <h2 className="text-xl font-black mb-1">{tab === 'login' ? 'أهلاً بعودتك 👋' : 'إنشاء حساب جديد'}</h2>
        <p className="text-gray-400 text-sm mb-5">{tab === 'login' ? 'سجل دخولك للوصول لكامل المنصة' : 'انضم لآلاف التجار والمتسوقين'}</p>

        {/* Tabs */}
        <div className="flex bg-navy-3 rounded-xl p-1 mb-5">
          {(['login', 'signup'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${tab === t ? 'bg-navy-2 text-gold shadow' : 'text-gray-400 hover:text-gray-200'}`}
            >
              {t === 'login' ? 'تسجيل الدخول' : 'حساب جديد'}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="label">البريد الإلكتروني</label>
              <input className="input" type="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="label">كلمة المرور</label>
              <div className="relative">
                <input className="input pl-10" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? 'جارٍ الدخول...' : 'دخول ←'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="label">الاسم الكامل *</label>
                <input className="input" placeholder="أحمد محمد" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div>
                <label className="label">البريد الإلكتروني *</label>
                <input className="input" type="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="label">رقم الجوال</label>
                <input className="input" placeholder="+966..." value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="label">كلمة المرور *</label>
                <div className="relative">
                  <input className="input pl-10" type={showPw ? 'text' : 'password'} placeholder="6 أحرف على الأقل" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="col-span-2">
                <label className="label">نوع الحساب</label>
                <select className="input" value={role} onChange={(e) => setRole(e.target.value as any)}>
                  <option value="buyer">مشتري (B2C)</option>
                  <option value="merchant">تاجر (B2B)</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? 'جارٍ الإنشاء...' : 'إنشاء الحساب ←'}
            </button>
          </form>
        )}

        {/* Social login */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => handleOAuth('google')}
            className="flex items-center justify-center gap-2 bg-navy-3 border border-white/[0.08] text-gray-300 text-sm font-semibold py-2.5 rounded-xl hover:border-gold/30 hover:text-white transition"
          >
            🔵 Google
          </button>
          <button
            onClick={() => handleOAuth('apple')}
            className="flex items-center justify-center gap-2 bg-navy-3 border border-white/[0.08] text-gray-300 text-sm font-semibold py-2.5 rounded-xl hover:border-gold/30 hover:text-white transition"
          >
            ⚫ Apple
          </button>
        </div>

        <p className="text-center text-[11px] text-gray-500 mt-4">
          مدعوم بـ <strong className="text-gold">Supabase Auth</strong> — JWT + Row Level Security
        </p>
      </div>
    </div>
  )
}
