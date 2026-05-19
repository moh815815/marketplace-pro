// components/store/ProductCard.tsx
'use client'
import { useState } from 'react'
import { Heart, ShoppingCart, MessageCircle, Play } from 'lucide-react'
import { useCartStore, useWishlistStore, useUIStore } from '@/lib/store'
import type { Product } from '@/types/database'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface ProductCardProps {
  product: Product
}

const CAT_LABELS: Record<string, string> = {
  electronics: 'إلكترونيات', fashion: 'أزياء', home: 'المنزل',
  food: 'غذاء', beauty: 'جمال', sports: 'رياضة', other: 'أخرى',
}

export function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered]     = useState(false)
  const [imgError, setImgError]   = useState(false)
  const { addItem }               = useCartStore()
  const { toggle, has }           = useWishlistStore()
  const { openCart }              = useUIStore()

  const inWishlist = has(product.id)
  const discount   = product.old_price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : 0

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    addItem(product)
    openCart()
    toast.success(`✅ تمت الإضافة: ${product.name.substring(0, 22)}`)
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    toggle(product.id)
    toast.success(has(product.id) ? '💔 تمت الإزالة من المفضلة' : '❤️ تمت الإضافة للمفضلة')
  }

  function handleWhatsApp(e: React.MouseEvent) {
    e.preventDefault()
    const phone = '966501234567'
    const msg = `مرحباً، أستفسر عن: ${product.name}\nالسعر: $${product.price}`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating))

  return (
    <Link href={`/product/${product.id}`} className="block group">
      <div
        className="card-hover cursor-pointer overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image / Video area */}
        <div className="relative h-44 bg-gradient-to-br from-navy-3 to-navy-4 overflow-hidden">

          {/* Product image */}
          {product.images?.[0] && !imgError ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 ${hovered && product.video_url ? 'opacity-0' : 'opacity-100'}`}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
          )}

          {/* Video on hover */}
          {product.video_url && hovered && (
            <video
              src={product.video_url}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Badges */}
          {product.video_url && (
            <span className="absolute top-2 right-2 bg-black/70 text-gold text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
              <Play size={8} /> فيديو
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              -{discount}%
            </span>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center transition-all hover:scale-110"
          >
            <Heart size={13} fill={inWishlist ? '#F87171' : 'none'} className={inWishlist ? 'text-red-400' : 'text-gray-300'} />
          </button>

          {/* WhatsApp button */}
          <button
            onClick={handleWhatsApp}
            className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-[#25D366]/80 flex items-center justify-center transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
          >
            <MessageCircle size={13} className="text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="p-3.5">
          <p className="text-gold text-[11px] font-bold mb-1">
            {CAT_LABELS[product.category] || product.category}
          </p>
          <p className="font-bold text-sm leading-snug mb-1.5 line-clamp-2">{product.name}</p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-gold text-xs">{stars}</span>
            <span className="text-gray-400 text-[11px]">({product.review_count})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            {product.old_price && (
              <span className="text-gray-400 text-xs line-through">${product.old_price}</span>
            )}
            <span className="text-gold font-black text-lg">${product.price}</span>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-gold to-brand-orange text-white font-bold text-xs py-2 rounded-lg transition hover:opacity-90 flex items-center justify-center gap-1.5"
          >
            <ShoppingCart size={13} />
            أضف للسلة
          </button>
        </div>
      </div>
    </Link>
  )
}
