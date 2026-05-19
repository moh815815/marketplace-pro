// lib/store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, Profile, OrderItem } from '@/types/database'

// ─── Cart ─────────────────────────────────────────────────────────────────
export interface CartItem extends Pick<Product, 'id' | 'name' | 'price' | 'images'> {
  quantity: number
  color?: string
  size?: string
  merchant_whatsapp?: string
}

interface CartStore {
  items: CartItem[]
  coupon: string | null
  discount: number
  addItem: (product: Product, qty?: number, color?: string, size?: string) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  applyCoupon: (code: string, discount: number) => void
  clearCart: () => void
  subtotal: () => number
  shipping: () => number
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      discount: 0,

      addItem: (product, qty = 1, color, size) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + qty } : i
              ),
            }
          }
          return {
            items: [...state.items, {
              id: product.id,
              name: product.name,
              price: product.price,
              images: product.images,
              quantity: qty,
              color,
              size,
            }],
          }
        })
      },

      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQty: (id, qty) => {
        if (qty <= 0) { get().removeItem(id); return }
        set((state) => ({
          items: state.items.map((i) => i.id === id ? { ...i, quantity: qty } : i),
        }))
      },

      applyCoupon: (code, discount) => set({ coupon: code, discount }),
      clearCart: () => set({ items: [], coupon: null, discount: 0 }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      shipping: () => {
        const sub = get().subtotal()
        return sub >= 100 ? 0 : 9.99
      },
      total: () => {
        const sub = get().subtotal()
        const ship = get().shipping()
        const disc = get().discount
        return Math.max(0, sub + ship - disc)
      },
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'marketplace-cart' }
  )
)

// ─── Wishlist ─────────────────────────────────────────────────────────────
interface WishlistStore {
  ids: string[]
  toggle: (id: string) => void
  has: (id: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => set((s) => ({
        ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id],
      })),
      has: (id) => get().ids.includes(id),
    }),
    { name: 'marketplace-wishlist' }
  )
)

// ─── Auth ─────────────────────────────────────────────────────────────────
interface AuthStore {
  user: Profile | null
  isLoading: boolean
  setUser: (user: Profile | null) => void
  setLoading: (v: boolean) => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
}))

// ─── UI State ──────────────────────────────────────────────────────────────
interface UIStore {
  cartOpen: boolean
  authOpen: boolean
  searchOpen: boolean
  toggleCart: () => void
  toggleAuth: () => void
  toggleSearch: () => void
  openCart: () => void
  closeCart: () => void
}

export const useUIStore = create<UIStore>()((set) => ({
  cartOpen: false,
  authOpen: false,
  searchOpen: false,
  toggleCart: () => set((s) => ({ cartOpen: !s.cartOpen })),
  toggleAuth: () => set((s) => ({ authOpen: !s.authOpen })),
  toggleSearch: () => set((s) => ({ searchOpen: !s.searchOpen })),
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
}))
