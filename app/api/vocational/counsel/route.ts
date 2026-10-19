import { NextRequest, NextResponse } from 'next/server'
import { VocationalCounselorService, PersonaType, SupportedLanguage } from '@/lib/vocational-counselor'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      message,
      persona = 'parent',
      language = 'hi',
      conversationHistory = []
    } = body

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    const service = VocationalCounselorService.getInstance()
    const response = await service.counsel({
      message: message.trim(),
      persona: persona as PersonaType,
      language: language as SupportedLanguage,
      conversationHistory
    })

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Vocational counsel API error:', error)
    return NextResponse.json(
      { error: 'Failed to process counselling request', details: error.message },
      { status: 500 }
    )
  }
}
