import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    status: 'Supabase proxy active',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    await request.json()
    
    return NextResponse.json({ 
      data: { message: 'Development mode - mock response' },
      error: null 
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Server error' }, 
      { status: 500 }
    )
  }
}
