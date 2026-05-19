// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// ─── GET /api/orders ───────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const supabase = createServerClient()
  const { searchParams } = new URL(request.url)
  const userId     = searchParams.get('user_id')
  const merchantId = searchParams.get('merchant_id')
  const status     = searchParams.get('status')
  const page       = parseInt(searchParams.get('page') || '1')
  const limit      = parseInt(searchParams.get('limit') || '20')

  let query = supabase
    .from('orders')
    .select('*, profiles(full_name, email, phone)')
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (userId)     query = query.eq('user_id', userId)
  if (merchantId) query = query.eq('merchant_id', merchantId)
  if (status)     query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ orders: data })
}

// ─── POST /api/orders ──────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const body = await request.json()
  const { user_id, merchant_id, items, subtotal, shipping, discount, total, payment_method, shipping_address, notes } = body

  if (!user_id || !merchant_id || !items?.length) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id, merchant_id, items,
      subtotal: parseFloat(subtotal),
      shipping: parseFloat(shipping || 0),
      discount: parseFloat(discount || 0),
      total: parseFloat(total),
      status: 'pending',
      payment_method: payment_method || 'cash_on_delivery',
      shipping_address,
      notes: notes || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Decrement stock for each product
  for (const item of items) {
    await supabase.rpc('decrement_stock', {
      product_id: item.product_id,
      qty: item.quantity,
    })
  }

  return NextResponse.json({ order }, { status: 201 })
}
