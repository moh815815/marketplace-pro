// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      merchants ( id, store_name, store_logo, whatsapp, is_verified, rating ),
      reviews ( id, rating, comment, created_at, profiles(full_name, avatar_url) )
    `)
    .eq('id', params.id)
    .single()

  if (error) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  return NextResponse.json({ product: data })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const body = await request.json()
  const { data, error } = await supabase
    .from('products')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ product: data })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { error } = await supabase.from('products').update({ is_active: false }).eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
