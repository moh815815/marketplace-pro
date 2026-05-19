// components/ui/WhatsAppFloat.tsx
'use client'
import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

interface WhatsAppFloatProps {
  phone: string
  message?: string
}

export function WhatsAppFloat({ phone, message = 'مرحباً، أريد الاستفسار عن منتجاتكم' }: WhatsAppFloatProps) {
  const [showPopup, setShowPopup] = useState(false)
  const [customMsg, setCustomMsg] = useState('')

  function openChat() {
    const msg = customMsg || message
    window.open(`https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(msg)}`, '_blank')
    setShowPopup(false)
  }

  return (
    <div className="fixed bottom-6 left-6 z-[150] flex flex-col items-start gap-2">
      {/* Chat popup */}
      {showPopup && (
        <div className="bg-navy-2 border border-[#25D366]/30 rounded-2xl p-4 w-64 shadow-2xl animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center text-white font-bold text-xs">م</div>
              <div>
                <p className="text-xs font-bold">ماركت برو</p>
                <p className="text-[10px] text-[#25D366]">● متصل الآن</p>
              </div>
            </div>
            <button onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-white">
              <X size={14} />
            </button>
          </div>
          <p className="text-xs text-gray-300 bg-navy-3 rounded-xl px-3 py-2 mb-3">
            مرحباً! كيف يمكنني مساعدتك؟ أرسل لنا رسالة على واتساب 👋
          </p>
          <textarea
            className="input text-xs py-2 mb-2 resize-none"
            rows={2}
            placeholder="اكتب رسالتك..."
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
          />
          <button
            onClick={openChat}
            className="w-full bg-[#25D366] hover:bg-[#1ebe58] text-white font-bold text-sm py-2 rounded-xl transition flex items-center justify-center gap-2"
          >
            <MessageCircle size={14} />
            ابدأ المحادثة
          </button>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setShowPopup(!showPopup)}
        className="w-14 h-14 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 group relative"
        aria-label="تواصل عبر واتساب"
      >
        {showPopup
          ? <X size={22} className="text-white" />
          : <MessageCircle size={22} className="text-white" />
        }
        {!showPopup && (
          <span className="absolute right-full mr-2 bg-navy-2 border border-white/10 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow">
            تواصل معنا
          </span>
        )}
      </button>
    </div>
  )
}
