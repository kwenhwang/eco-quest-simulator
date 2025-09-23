import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// 서버사이드에서만 실행되는 Supabase 프록시
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: NextRequest) {
  try {
    const { method, table, data, filters } = await request.json()
    
    let query = supabase.from(table)
    
    switch (method) {
      case 'select':
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            query = query.eq(key, value)
          })
        }
        const { data: selectData, error: selectError } = await query.select()
        return NextResponse.json({ data: selectData, error: selectError })
        
      case 'insert':
        const { data: insertData, error: insertError } = await query.insert(data)
        return NextResponse.json({ data: insertData, error: insertError })
        
      case 'update':
        const { data: updateData, error: updateError } = await query
          .update(data)
          .eq('id', filters?.id)
        return NextResponse.json({ data: updateData, error: updateError })
        
      case 'delete':
        const { data: deleteData, error: deleteError } = await query
          .delete()
          .eq('id', filters?.id)
        return NextResponse.json({ data: deleteData, error: deleteError })
        
      default:
        return NextResponse.json({ error: 'Invalid method' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Supabase proxy active' })
}
