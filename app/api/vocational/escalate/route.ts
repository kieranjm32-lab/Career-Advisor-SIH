import { NextRequest, NextResponse } from 'next/server'
import { escalationStore } from '@/lib/escalation-store'

export async function GET() {
  try {
    const tickets = escalationStore.getTickets()
    return NextResponse.json({ success: true, count: tickets.length, tickets })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch escalation tickets', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      phone,
      state = 'Not specified',
      district = 'Not specified',
      persona = 'parent',
      language = 'hi',
      primaryConcern = 'General doubt about vocational course viability',
      resistanceCategory = 'STATUS_STIGMA',
      sentimentScore = -0.5,
      chatSnippet = '',
      priority = 'HIGH'
    } = body

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone number are required for counselor callback' },
        { status: 400 }
      )
    }

    const ticket = escalationStore.addTicket({
      name,
      phone,
      state,
      district,
      persona,
      language,
      primaryConcern,
      resistanceCategory,
      sentimentScore,
      chatSnippet,
      priority
    })

    return NextResponse.json({
      success: true,
      message: 'Escalation ticket created successfully. A certified MSDE counselor will call back shortly.',
      ticket
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create escalation ticket', details: error.message },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, notes } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'Ticket ID and status are required' }, { status: 400 })
    }

    const updated = escalationStore.updateStatus(id, status, notes)
    if (!updated) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, ticket: updated })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update ticket', details: error.message },
      { status: 500 }
    )
  }
}
