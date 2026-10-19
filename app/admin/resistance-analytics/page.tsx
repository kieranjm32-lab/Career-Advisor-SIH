'use client'

import React, { useEffect, useState } from 'react'
import {
  ShieldAlert,
  TrendingUp,
  Users,
  MapPin,
  PhoneCall,
  CheckCircle,
  Clock,
  Filter,
  BarChart3,
  PieChart as PieIcon,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react'

interface AdminStats {
  summary: {
    totalFamilyInteractions: number
    averageSentimentShift: string
    netParentAcceptanceRate: string
    activeEscalations: number
    resolvedEscalations: number
  }
  resistanceByRegion: {
    state: string
    totalCounsellingSessions: number
    highResistanceRate: number
    primaryObjection: string
    topDistricts: string[]
  }[]
  objectionBreakdown: {
    category: string
    label: string
    percentage: number
    count: number
    fill: string
  }[]
  sentimentShiftTrends: {
    month: string
    preChatNegativePercent: number
    postChatPositivePercent: number
    netConversionRate: number
  }[]
  recentTickets: any[]
}

export default function ResistanceAnalyticsDashboard() {
  const [data, setData] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedState, setSelectedState] = useState<string>('All')
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/vocational/admin-stats')
      const json = await res.json()
      if (json.success) {
        setData(json)
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleUpdateTicket = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/vocational/escalate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, notes: 'Contacted by MSDE field officer.' })
      })
      const result = await res.json()
      if (result.success) {
        setActionSuccess(`Ticket ${id} marked as ${status}`)
        fetchStats()
        setTimeout(() => setActionSuccess(null), 3000)
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="flex items-center space-x-3 text-orange-400">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="font-semibold text-sm">Loading MSDE Resistance Analytics...</span>
        </div>
      </div>
    )
  }

  const filteredRegions =
    selectedState === 'All'
      ? data.resistanceByRegion
      : data.resistanceByRegion.filter((r) => r.state === selectedState)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
                MSDE Scheme Intelligence
              </span>
              <span className="text-xs text-slate-400">SIH PS-26241 Implementation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Parental Resistance & Sentiment Shift Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Real-time monitoring of vocational education acceptance, objection hotspots, and live counsellor escalations.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchStats}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2.5 rounded-xl border border-slate-700 transition-colors"
              title="Refresh Analytics"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <a
              href="/counselor"
              target="_blank"
              rel="noreferrer"
              className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 shadow-lg shadow-orange-600/20"
            >
              <span>Launch Counselling Tool</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {actionSuccess && (
          <div className="p-3 bg-emerald-950/70 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* 1. Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>Total Family Consultations</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">{data.summary.totalFamilyInteractions.toLocaleString()}</div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+18% from last month</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>Avg. Sentiment Shift</span>
              <BarChart3 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">{data.summary.averageSentimentShift}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Skeptical (-0.4) ➔ Supportive (+0.22)
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>Parent Acceptance Rate</span>
              <CheckCircle className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl font-black text-orange-400">{data.summary.netParentAcceptanceRate}</div>
            <div className="text-[11px] text-slate-400 mt-1">Post verified outcome presentation</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>Active Human Escalations</span>
              <PhoneCall className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400">{data.summary.activeEscalations} Pending</div>
            <div className="text-[11px] text-slate-400 mt-1">
              {data.summary.resolvedEscalations} tickets resolved this week
            </div>
          </div>
        </div>

        {/* 2. Visual Analytics: Why & How Resistance Shifts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Why: Breakdown of Parental Objections */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <PieIcon className="w-4 h-4 text-orange-400" />
                    <span>Why Family Resistance Occurs (Objection Drivers)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Root causes analyzed from 6,900+ parent counselling dialogues
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {data.objectionBreakdown.map((item) => (
                  <div key={item.category} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-200">{item.label}</span>
                      <span className="text-slate-400">
                        {item.percentage}% ({item.count} sessions)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${item.percentage}%`, backgroundColor: item.fill }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 p-3 rounded-xl bg-orange-950/20 border border-orange-900/40 text-[11px] text-orange-300">
              💡 <strong>Key Finding:</strong> 42% of parental resistance stems from social stigma and relative perception ("Log Kya Kahenge"). Presenting NCrF lateral entry to engineering and starting stipends is the highest-converting counter-narrative.
            </div>
          </div>

          {/* How: Sentiment Shift Over Time */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Sentiment Shift (Pre-Chat vs. Post-Chat)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Demonstrating positive opinion shift after verified outcome exposure
                  </p>
                </div>
              </div>

              <div className="space-y-3.5">
                {data.sentimentShiftTrends.map((trend) => (
                  <div key={trend.month} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-bold text-white">{trend.month}</span>
                      <span className="text-emerald-400 font-semibold">
                        Net Conversion: {trend.netConversionRate}%
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Initial Skepticism</span>
                          <span className="text-rose-400">{trend.preChatNegativePercent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-500 rounded-full"
                            style={{ width: `${trend.preChatNegativePercent}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Post-Counselling Acceptance</span>
                          <span className="text-emerald-400">{trend.postChatPositivePercent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${trend.postChatPositivePercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-[11px] text-emerald-300">
              📈 <strong>Outcome:</strong> Verified placement and salary transparency decreased negative skepticism from 68% down to 51% over 6 months.
            </div>
          </div>
        </div>

        {/* 3. Where: Regional Resistance Heatmap Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>Where Resistance is Concentrated (State & District Hotspots)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Helps MSDE field officers deploy ground awareness workshops where resistance is heaviest.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="All">All States</option>
                {data.resistanceByRegion.map((r) => (
                  <option key={r.state} value={r.state}>
                    {r.state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Total Consultations</th>
                  <th className="py-3 px-4">Resistance Intensity</th>
                  <th className="py-3 px-4">Dominant Objection</th>
                  <th className="py-3 px-4">Top Resistance Districts</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filteredRegions.map((region) => (
                  <tr key={region.state} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-orange-400" />
                      <span>{region.state}</span>
                    </td>
                    <td className="py-3.5 px-4">{region.totalCounsellingSessions.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-semibold ${
                            region.highResistanceRate > 60
                              ? 'text-rose-400'
                              : region.highResistanceRate > 40
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {region.highResistanceRate}% High
                        </span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              region.highResistanceRate > 60
                                ? 'bg-rose-500'
                                : region.highResistanceRate > 40
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${region.highResistanceRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-[11px] text-slate-300">
                        {region.primaryObjection.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {region.topDistricts.join(', ')}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => alert(`Dispatching localized MSDE awareness bulletin to ${region.topDistricts[0]} district administration.`)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded text-[11px] font-medium border border-slate-700"
                      >
                        Deploy Campaign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Live Human Escalation Dispatch Desk */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-rose-400" />
                <span>Live Human Escalation Queue (Unresolved Family Inquiries)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Cases flagged by AI where parental anxiety or severe resistance requires direct counselor intervention.
              </p>
            </div>
            <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs px-2.5 py-1 rounded-full font-bold">
              {data.recentTickets.filter((t) => t.status === 'PENDING').length} Unassigned Cases
            </span>
          </div>

          <div className="space-y-3">
            {data.recentTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{ticket.name}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                      {ticket.id}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        ticket.priority === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {ticket.priority} Priority
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        ticket.status === 'RESOLVED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : ticket.status === 'IN_PROGRESS'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium">
                    📍 {ticket.district}, {ticket.state} • 📞 {ticket.phone}
                  </p>

                  <p className="text-xs text-orange-300 italic bg-orange-950/20 p-2 rounded-lg border border-orange-900/30">
                    "{ticket.chatSnippet}"
                  </p>

                  {ticket.counselorNotes && (
                    <p className="text-[11px] text-slate-400">
                      📝 <span className="font-semibold text-slate-300">Counsellor Log:</span>{' '}
                      {ticket.counselorNotes}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {ticket.status !== 'RESOLVED' ? (
                    <>
                      <button
                        onClick={() => handleUpdateTicket(ticket.id, 'IN_PROGRESS')}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition-all shadow"
                      >
                        Assign To Me
                      </button>
                      <button
                        onClick={() => handleUpdateTicket(ticket.id, 'RESOLVED')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition-all shadow"
                      >
                        Mark Resolved
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center space-x-1 text-emerald-400 text-xs font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      <span>Case Closed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
