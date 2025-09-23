import { NextRequest, NextResponse } from 'next/server'

// 간단한 상태 확인 API
export async function GET() {
  return NextResponse.json({ 
    status: 'Supabase proxy active',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 개발 환경에서는 목업 데이터 반환
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
