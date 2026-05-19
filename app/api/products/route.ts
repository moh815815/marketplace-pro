// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import type { ProductCategory } from '@/types/database'

// ─── GET /api/products ─────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category  = searchParams.get('category') as ProductCategory | null
  const search    = searchParams.get('search')
  const sort      = searchParams.get('sort') || 'created_at'
  const order     = searchParams.get('order') || 'desc'
  const page      = parseInt(searchParams.get('page') || '1')
  const limit     = parseInt(searchParams.get('limit') || '20')
  const featured  = searchParams.get('featured') === 'true'
  const minPrice  = searchParams.get('min_price')
  const maxPrice  = searchParams.get('max_price')
  const merchantId = searchParams.get('merchant_id')

  const supabase = createServerClient()
  let query = supabase
    .from('products')
    .select(`
      *,
      merchants (
        id,
        store_name,
        store_logo,
        whatsapp,
        is_verified,
        rating
      )
    `)
    .eq('is_active', true)

  if (category)   query = query.eq('category', category)
  if (featured)   query = query.eq('is_featured', true)
  if (merchantId) query = query.eq('merchant_id', merchantId)
  if (search)     query = query.ilike('name', `%${search}%`)
  if (minPrice)   query = query.gte('price', parseFloat(minPrice))
  if (maxPrice)   query = query.lte('price', parseFloat(maxPrice))

  // Sorting
  const sortMap: Record<string, string> = {
    price: 'price',
    rating: 'rating',
    sales: 'review_count',
    created_at: 'created_at',
  }
  query = query.order(sortMap[sort] || 'created_at', { ascending: order === 'asc' })

  // Pagination
  const from = (page - 1) * limit
  query = query.range(from, from + limit - 1)

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    products: data,
    pagination: { page, limit, total: count ?? 0, pages: Math.ceil((count ?? 0) / limit) },
  })
}

// ─── POST /api/products ────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const supabase = createServerClient()

  // Auth check
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const {
    name, description, price, old_price, category,
    stock, images, video_url, colors, sizes,
    is_featured, merchant_id,
  } = body

  // Validation
  if (!name || !price || !category || !merchant_id) {
    return NextResponse.json({ error: 'Missing required fields: name, price, category, merchant_id' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      name,
      description: description || null,
      price: parseFloat(price),
      old_price: old_price ? parseFloat(old_price) : null,
      category,
      stock: parseInt(stock) || 0,
      images: images || [],
      video_url: video_url || null,
      colors: colors || [],
      sizes: sizes || [],
      is_featured: is_featured || false,
      is_active: true,
      merchant_id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ product: data }, { status: 201 })
}
