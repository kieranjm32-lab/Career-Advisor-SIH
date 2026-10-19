export interface EscalationTicket {
  id: string
  createdAt: string
  name: string
  phone: string
  state: string
  district: string
  persona: 'parent' | 'learner'
  language: 'hi' | 'en'
  primaryConcern: string
  resistanceCategory: string
  sentimentScore: number
  chatSnippet: string
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED'
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM'
  counselorNotes?: string
}

// In-memory store with realistic pre-populated data for SIH evaluation demonstration
class EscalationStore {
  private static instance: EscalationStore
  private tickets: EscalationTicket[] = [
    {
      id: 'MSDE-ESC-101',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      name: 'Rameshwar Sharma (Father)',
      phone: '+91 98765 43210',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      persona: 'parent',
      language: 'hi',
      primaryConcern: 'Refusing ITI Electrician; insists on BA degree due to relative stigma.',
      resistanceCategory: 'STATUS_STIGMA',
      sentimentScore: -0.75,
      chatSnippet: 'हमारे पूरे खानदान में किसी ने आईटीआई नहीं की। सब बीए या बीएड करते हैं। समाज में क्या इज्जत रह जाएगी?',
      status: 'PENDING',
      priority: 'CRITICAL'
    },
    {
      id: 'MSDE-ESC-102',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      name: 'Sunita Devi (Mother)',
      phone: '+91 94512 87654',
      state: 'Bihar',
      district: 'Patna',
      persona: 'parent',
      language: 'hi',
      primaryConcern: 'Safety concern for daughter in Healthcare GDA / Hospital night duties.',
      resistanceCategory: 'SAFETY_GENDER',
      sentimentScore: -0.5,
      chatSnippet: 'अस्पताल में रात को काम करना बेटियों के लिए सुरक्षित नहीं लगता।',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      counselorNotes: 'Assigned to Senior Counsellor Priya Verma. Reassuring regarding day-shift policies and NSTI-W hostel.'
    },
    {
      id: 'MSDE-ESC-103',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      name: 'Mohd. Salim (Father)',
      phone: '+91 98234 11223',
      state: 'Maharashtra',
      district: 'Aurangabad',
      persona: 'parent',
      language: 'hi',
      primaryConcern: 'Skeptical of CNC Machining starting wage vs private coaching expenses.',
      resistanceCategory: 'SALARY_SKEPTICISM',
      sentimentScore: -0.4,
      chatSnippet: 'सुना है प्राइवेट कंपनियां 8000 रुपये ही देती हैं और 12 घंटे खटाती हैं।',
      status: 'RESOLVED',
      priority: 'MEDIUM',
      counselorNotes: 'Explained NAPS minimum wage mandate (₹11,000) and Bajaj Auto campus placement. Parent agreed to visit ITI.'
    }
  ]

  static getInstance(): EscalationStore {
    if (!EscalationStore.instance) {
      EscalationStore.instance = new EscalationStore()
    }
    return EscalationStore.instance
  }

  getTickets(): EscalationTicket[] {
    return this.tickets
  }

  addTicket(ticket: Omit<EscalationTicket, 'id' | 'createdAt' | 'status'>): EscalationTicket {
    const newTicket: EscalationTicket = {
      ...ticket,
      id: `MSDE-ESC-${100 + this.tickets.length + 1}`,
      createdAt: new Date().toISOString(),
      status: 'PENDING'
    }
    this.tickets.unshift(newTicket)
    return newTicket
  }

  updateStatus(id: string, status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED', notes?: string) {
    const ticket = this.tickets.find((t) => t.id === id)
    if (ticket) {
      ticket.status = status
      if (notes) ticket.counselorNotes = notes
    }
    return ticket
  }
}

export const escalationStore = EscalationStore.getInstance()
