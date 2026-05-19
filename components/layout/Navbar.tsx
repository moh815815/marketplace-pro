// components/layout/Navbar.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Heart, Search, Menu, X, User } from 'lucide-react'
import { useCartStore, useUIStore, useWishlistStore } from '@/lib/store'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const itemCount  = useCartStore((s) => s.itemCount())
  const wishIds    = useWishlistStore((s) => s.ids)
  const { openCart, toggleAuth } = useUIStore()

  const navLinks = [
    { href: '/',          label: 'المتجر' },
    { href: '/dashboard', label: 'لوحة التحكم' },
    { href: '/profile',   label: 'حسابي' },
    { href: '/wishlist',  label: 'المفضلة' },
  ]

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-gold to-brand-orange text-white text-center text-xs font-bold py-1.5 tracking-wide">
        🎉 شحن مجاني على الطلبات فوق $100 — كود: <strong>FREE2025</strong>
      </div>

      <nav className="sticky top-0 z-50 bg-navy-2/95 backdrop-blur-md border-b border-gold/20">
        <div className="container-custom flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-gold to-brand-orange rounded-xl flex items-center justify-center font-black text-white text-base">م</div>
            <span className="text-xl font-black text-gold-gradient hidden sm:block">ماركت برو</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="btn-ghost text-sm">{l.label}</Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="btn-ghost p-2 hidden sm:flex" aria-label="بحث">
              <Search size={18} />
            </button>

            <button
              onClick={() => {/* open wishlist */}}
              className="relative btn-ghost p-2 hidden sm:flex"
              aria-label="المفضلة"
            >
              <Heart size={18} />
              {wishIds.length > 0 && (
                <span className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                  {wishIds.length}
                </span>
              )}
            </button>

            <button
              onClick={openCart}
              className="relative flex items-center gap-1.5 bg-gold/10 border border-gold/25 text-gold font-bold text-sm px-3 py-2 rounded-xl transition hover:bg-gold/20"
              aria-label="السلة"
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:block">السلة</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -left-2 w-5 h-5 bg-brand-orange rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={toggleAuth}
              className="btn-primary text-sm py-2 px-4 hidden sm:block"
            >
              دخول
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden btn-ghost p-2"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-navy-3 border-t border-white/[0.07] px-4 py-3 space-y-1 animate-slide-up">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block py-2.5 px-3 text-gray-300 font-semibold text-sm rounded-lg hover:bg-gold/10 hover:text-gold transition"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={() => { toggleAuth(); setMobileOpen(false) }}
              className="w-full btn-primary text-sm mt-2"
            >
              دخول / تسجيل
            </button>
          </div>
        )}
      </nav>
    </>
  )
}
