import { NextResponse } from 'next/server'
import { escalationStore } from '@/lib/escalation-store'

export async function GET() {
  try {
    // 1. District and State Resistance Heatmap Data
    const resistanceByRegion = [
      { state: 'Uttar Pradesh', totalCounsellingSessions: 1420, highResistanceRate: 64, primaryObjection: 'STATUS_STIGMA', topDistricts: ['Varanasi', 'Prayagraj', 'Gorakhpur'] },
      { state: 'Bihar', totalCounsellingSessions: 1180, highResistanceRate: 71, primaryObjection: 'DEGREE_OBSESSION', topDistricts: ['Patna', 'Muzaffarpur', 'Gaya'] },
      { state: 'Rajasthan', totalCounsellingSessions: 890, highResistanceRate: 52, primaryObjection: 'SALARY_SKEPTICISM', topDistricts: ['Jodhpur', 'Bikaner', 'Sikar'] },
      { state: 'Madhya Pradesh', totalCounsellingSessions: 760, highResistanceRate: 58, primaryObjection: 'STATUS_STIGMA', topDistricts: ['Rewa', 'Sagar', 'Gwalior'] },
      { state: 'Maharashtra', totalCounsellingSessions: 1100, highResistanceRate: 34, primaryObjection: 'SALARY_SKEPTICISM', topDistricts: ['Aurangabad', 'Solapur', 'Dhule'] },
      { state: 'Tamil Nadu', totalCounsellingSessions: 940, highResistanceRate: 28, primaryObjection: 'SAFETY_GENDER', topDistricts: ['Madurai', 'Salem', 'Dindigul'] },
      { state: 'Haryana', totalCounsellingSessions: 610, highResistanceRate: 46, primaryObjection: 'STATUS_STIGMA', topDistricts: ['Jhajjar', 'Rohtak', 'Bhiwani'] }
    ]

    // 2. Breakdown of Parental Objections (Why resistance is concentrated)
    const objectionBreakdown = [
      { category: 'STATUS_STIGMA', label: 'Social Stigma ("Log Kya Kahenge")', percentage: 42, count: 2898, fill: '#ef4444' },
      { category: 'DEGREE_OBSESSION', label: 'Fixation on BA/BSc Degree', percentage: 26, count: 1794, fill: '#f97316' },
      { category: 'SALARY_SKEPTICISM', label: 'Doubts on Wage Viability', percentage: 20, count: 1380, fill: '#eab308' },
      { category: 'SAFETY_GENDER', label: 'Daughter Safety & Shift Work', percentage: 12, count: 828, fill: '#ec4899' }
    ]

    // 3. Sentiment Shift Metrics (Pre-Counselling vs Post-Counselling)
    const sentimentShiftTrends = [
      { month: 'Oct 2025', preChatNegativePercent: 68, postChatPositivePercent: 72, netConversionRate: 64 },
      { month: 'Nov 2025', preChatNegativePercent: 65, postChatPositivePercent: 76, netConversionRate: 67 },
      { month: 'Dec 2025', preChatNegativePercent: 62, postChatPositivePercent: 79, netConversionRate: 71 },
      { month: 'Jan 2026', preChatNegativePercent: 59, postChatPositivePercent: 81, netConversionRate: 74 },
      { month: 'Feb 2026', preChatNegativePercent: 55, postChatPositivePercent: 84, netConversionRate: 78 },
      { month: 'Mar 2026', preChatNegativePercent: 51, postChatPositivePercent: 86, netConversionRate: 81 }
    ]

    // 4. Escalation metrics
    const tickets = escalationStore.getTickets()
    const pendingTickets = tickets.filter((t) => t.status === 'PENDING').length
    const resolvedTickets = tickets.filter((t) => t.status === 'RESOLVED').length

    return NextResponse.json({
      success: true,
      summary: {
        totalFamilyInteractions: 6900,
        averageSentimentShift: '+0.62 pts',
        netParentAcceptanceRate: '76.4%',
        activeEscalations: pendingTickets,
        resolvedEscalations: resolvedTickets
      },
      resistanceByRegion,
      objectionBreakdown,
      sentimentShiftTrends,
      recentTickets: tickets
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to generate admin statistics', details: error.message },
      { status: 500 }
    )
  }
}
