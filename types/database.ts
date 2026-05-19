// types/database.ts
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          role: 'buyer' | 'merchant' | 'admin'
          whatsapp: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      merchants: {
        Row: {
          id: string
          user_id: string
          store_name: string
          store_description: string | null
          store_logo: string | null
          whatsapp: string
          is_verified: boolean
          rating: number
          total_sales: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['merchants']['Row'], 'id' | 'created_at' | 'rating' | 'total_sales'>
        Update: Partial<Database['public']['Tables']['merchants']['Insert']>
      }
      products: {
        Row: {
          id: string
          merchant_id: string
          name: string
          description: string | null
          price: number
          old_price: number | null
          category: ProductCategory
          stock: number
          images: string[]
          video_url: string | null
          colors: string[]
          sizes: string[]
          rating: number
          review_count: number
          is_active: boolean
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at' | 'rating' | 'review_count'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      orders: {
        Row: {
          id: string
          user_id: string
          merchant_id: string
          items: OrderItem[]
          subtotal: number
          shipping: number
          discount: number
          total: number
          status: OrderStatus
          payment_method: PaymentMethod
          shipping_address: ShippingAddress
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      coupons: {
        Row: {
          id: string
          code: string
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          min_order: number
          max_uses: number
          used_count: number
          expires_at: string | null
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['coupons']['Row'], 'id' | 'created_at' | 'used_count'>
        Update: Partial<Database['public']['Tables']['coupons']['Insert']>
      }
      wishlist: {
        Row: { id: string; user_id: string; product_id: string; created_at: string }
        Insert: Omit<Database['public']['Tables']['wishlist']['Row'], 'id' | 'created_at'>
        Update: never
      }
    }
  }
}

export type ProductCategory = 'electronics' | 'fashion' | 'home' | 'food' | 'beauty' | 'sports' | 'other'
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
export type PaymentMethod = 'card' | 'whatsapp' | 'bank_transfer' | 'cash_on_delivery'

export interface OrderItem {
  product_id: string
  name: string
  price: number
  quantity: number
  image: string
  color?: string
  size?: string
}

export interface ShippingAddress {
  full_name: string
  phone: string
  email: string
  address: string
  city: string
  zip: string
  country: string
}

// ─── Derived convenience types ───────────────────────────────────────────────
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Merchant = Database['public']['Tables']['merchants']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Coupon = Database['public']['Tables']['coupons']['Row']
