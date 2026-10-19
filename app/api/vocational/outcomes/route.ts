import { NextRequest, NextResponse } from 'next/server'
import { VOCATIONAL_TRADES, COMMON_PARENTAL_OBJECTIONS } from '@/lib/data/vocational-outcomes'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sector = searchParams.get('sector')
    const state = searchParams.get('state')

    let trades = VOCATIONAL_TRADES

    if (sector) {
      trades = trades.filter((t) => t.sector.toLowerCase().includes(sector.toLowerCase()))
    }

    if (state) {
      trades = trades.filter((t) =>
        t.stateDemand.some((d) => d.state.toLowerCase() === state.toLowerCase())
      )
    }

    return NextResponse.json({
      success: true,
      totalTrades: trades.length,
      trades,
      commonObjections: COMMON_PARENTAL_OBJECTIONS,
      lastVerifiedDate: '2026-03-15',
      sources: [
        'Ministry of Skill Development and Entrepreneurship (MSDE)',
        'Directorate General of Training (DGT)',
        'National Apprenticeship Promotion Scheme (NAPS)',
        'National Council for Vocational Education and Training (NCVET)'
      ]
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch verified outcomes', details: error.message },
      { status: 500 }
    )
  }
}
