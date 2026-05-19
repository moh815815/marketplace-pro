// components/store/CartDrawer.tsx
'use client'
import { useCartStore, useUIStore } from '@/lib/store'
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'

export function CartDrawer() {
  const { cartOpen, closeCart } = useUIStore()
  const { items, removeItem, updateQty, subtotal, shipping, total, coupon, applyCoupon, clearCart } = useCartStore()
  const [couponInput, setCouponInput] = useState('')

  const COUPONS: Record<string, { type: 'fixed' | 'pct', val: number }> = {
    FREE2025:  { type: 'fixed', val: 9.99 },
    SAVE20:    { type: 'pct',   val: 20   },
    WELCOME10: { type: 'pct',   val: 10   },
  }

  function handleCoupon() {
    const c = COUPONS[couponInput.toUpperCase()]
    if (!c) { toast.error('❌ كود خصم غير صحيح'); return }
    const sub = subtotal()
    const discount = c.type === 'fixed' ? c.val : (sub * c.val) / 100
    applyCoupon(couponInput.toUpperCase(), discount)
    toast.success(`🎉 تم تطبيق خصم $${discount.toFixed(2)}`)
  }

  function handleWhatsAppCheckout() {
    const msg = items.map(i => `${i.name} ×${i.quantity} = $${(i.price * i.quantity).toFixed(2)}`).join('\n')
    const phone = items[0]?.merchant_whatsapp?.replace('+', '') || '966501234567'
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`مرحباً، أريد طلب:\n${msg}\n\nالإجمالي: $${total().toFixed(2)}`)}`, '_blank')
  }

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black/55 z-[200] animate-fade-in"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-[360px] max-w-[95vw] bg-navy-2 z-[201] border-l border-gold/20 flex flex-col transition-transform duration-300 ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <ShoppingBag size={18} className="text-gold" />
            سلة المشتريات
            {items.length > 0 && (
              <span className="bg-brand-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </h2>
          <button onClick={closeCart} className="btn-ghost p-1.5">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <ShoppingBag size={52} className="opacity-30" />
              <p className="font-semibold">السلة فارغة</p>
              <button onClick={closeCart} className="btn-outline text-sm py-2 px-4">
                تسوق الآن ←
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 py-3 border-b border-white/[0.05]">
                  {/* Image */}
                  <div className="w-14 h-14 bg-navy-3 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border border-white/[0.07]">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                    ) : '📦'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{item.name}</p>
                    {(item.color || item.size) && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.color && <span className="ml-2">{item.color}</span>}
                        {item.size && <span>{item.size}</span>}
                      </p>
                    )}
                    <p className="text-gold font-bold text-sm mt-1">${(item.price * item.quantity).toFixed(2)}</p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-6 h-6 bg-navy-3 border border-white/10 rounded-md flex items-center justify-center hover:border-gold transition"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-sm font-bold min-w-[20px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-6 h-6 bg-navy-3 border border-white/10 rounded-md flex items-center justify-center hover:border-gold transition"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-500 hover:text-red-400 transition p-1 self-start"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-white/[0.07] space-y-3">
            {/* Coupon */}
            {!coupon && (
              <div className="flex gap-2">
                <input
                  className="input flex-1 py-2 text-sm"
                  placeholder="كود الخصم"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCoupon()}
                />
                <button onClick={handleCoupon} className="btn-outline py-2 px-3 text-sm">
                  تطبيق
                </button>
              </div>
            )}
            {coupon && (
              <div className="flex justify-between items-center bg-gold/10 rounded-lg px-3 py-2">
                <span className="text-xs text-gold font-bold">✅ كود: {coupon}</span>
                <button onClick={() => applyCoupon('', 0)} className="text-xs text-gray-400 hover:text-red-400">إزالة</button>
              </div>
            )}

            {/* Totals */}
            <div className="bg-navy-3 rounded-xl p-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">المجموع</span><span>${subtotal().toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">الشحن</span>
                <span className={shipping() === 0 ? 'text-emerald-400' : ''}>
                  {shipping() === 0 ? 'مجاني 🎁' : `$${shipping().toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-white/10 pt-2 mt-1">
                <span>الإجمالي</span>
                <span className="text-gold">${total().toFixed(2)}</span>
              </div>
            </div>

            {/* CTA buttons */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full text-center block py-3"
            >
              إتمام الطلب ←
            </Link>
            <button
              onClick={handleWhatsAppCheckout}
              className="w-full bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] font-bold py-2.5 rounded-xl text-sm hover:bg-[#25D366]/25 transition flex items-center justify-center gap-2"
            >
              💬 اطلب عبر واتساب
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
