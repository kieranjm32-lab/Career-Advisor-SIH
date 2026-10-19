'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Users,
  GraduationCap,
  PhoneCall,
  ShieldCheck,
  TrendingUp,
  Building2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  ExternalLink,
  ChevronDown
} from 'lucide-react'
import { VocationalTrade } from '@/lib/data/vocational-outcomes'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  audioText?: string
  trades?: VocationalTrade[]
  sentimentScore?: number
  resistanceLevel?: string
  needsEscalation?: boolean
  timestamp: string
}

export default function VocationalCounselorPage() {
  const [persona, setPersona] = useState<'parent' | 'learner'>('parent')
  const [language, setLanguage] = useState<'hi' | 'en'>('en')
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null)
  const [showEscalationModal, setShowEscalationModal] = useState(false)
  const [escalationForm, setEscalationForm] = useState({
    name: '',
    phone: '',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    concern: ''
  })
  const [escalationSubmitted, setEscalationSubmitted] = useState(false)
  const [escalationTicketId, setEscalationTicketId] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  // Initial welcome message tailored to selected persona and language
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        'Hello! Welcome to the **KaushalMarg** Vocational Career & Family Decision-Support Center (MSDE).\n\nHere you can ask any questions regarding vocational courses, ITI trades, placement security, government stipends (NAPS), and future salary growth.\n\nYou can also click the microphone to speak directly in English or Hindi!',
      audioText:
        'Hello! Welcome to the KaushalMarg Vocational Career and Family Support Center. Here you can ask any questions regarding vocational courses, ITI trades, placement security, and stipends.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])

  // Setup Web Speech API for voice-first input
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN'

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInputMessage(transcript)
          setIsListening(false)
        }

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
      }
    }
  }, [language])

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Toggle voice listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN'
        recognitionRef.current.start()
        setIsListening(true)
      } catch (err) {
        console.error('Failed to start speech recognition:', err)
      }
    }
  }

  // Text to Speech playback
  const speakText = (text: string, msgId: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    if (isSpeakingId === msgId) {
      window.speechSynthesis.cancel()
      setIsSpeakingId(null)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN'
    utterance.rate = 0.95

    utterance.onend = () => setIsSpeakingId(null)
    utterance.onerror = () => setIsSpeakingId(null)

    setIsSpeakingId(msgId)
    window.speechSynthesis.speak(utterance)
  }

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage
    if (!text.trim() || isLoading) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages((prev) => [...prev, userMsg])
    setInputMessage('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/vocational/counsel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          persona,
          language,
          conversationHistory: messages.slice(-4).map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      const data = await res.json()

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        audioText: data.audioText,
        trades: data.matchedTrades,
        sentimentScore: data.sentiment?.score,
        resistanceLevel: data.sentiment?.resistanceLevel,
        needsEscalation: data.escalationRecommended,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages((prev) => [...prev, assistantMsg])

      // Auto-read response for low-literacy users if language is Hindi
      if (data.audioText) {
        speakText(data.audioText, assistantMsg.id)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          language === 'hi'
            ? 'क्षमा करें, सर्वर से संपर्क नहीं हो पाया। कृपया पुनः प्रयास करें या काउंसलर से संपर्क करें।'
            : 'Sorry, could not connect to server. Please try again or connect with a counselor.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Escalation Submission
  const handleEscalationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const lastUserMsg = messages.filter((m) => m.role === 'user').slice(-1)[0]?.content || 'General advice'
      const res = await fetch('/api/vocational/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: escalationForm.name,
          phone: escalationForm.phone,
          state: escalationForm.state,
          district: escalationForm.district,
          persona,
          language,
          primaryConcern: escalationForm.concern || 'High resistance or unresolved vocational inquiry',
          chatSnippet: lastUserMsg,
          priority: 'HIGH'
        })
      })

      const result = await res.json()
      if (result.success) {
        setEscalationSubmitted(true)
        setEscalationTicketId(result.ticket?.id || 'MSDE-ESC-NEW')
      }
    } catch (err) {
      console.error('Escalation request failed:', err)
    }
  }

  // Pre-configured questions for low-digital familiarity
  const quickQuestions =
    language === 'hi'
      ? persona === 'parent'
        ? [
            'क्या आईटीआई के बाद सरकारी नौकरी मिल सकती है?',
            'लोग क्या कहेंगे? क्या इसमें समाज में सम्मान है?',
            'बेटियों के लिए कौन सा ट्रेड सबसे सुरक्षित और बेहतर है?',
            'वेतन कितना मिलता है और क्या कैंपस प्लेसमेंट होता है?'
          ]
        : [
            'सोलर और इलेक्ट्रिक वाहन (EV) में क्या भविष्य है?',
            'आईटीआई के बाद बी.टेक या इंजीनियरिंग डिप्लोमा कैसे करें?',
            'अप्रेंटिसशिप के दौरान मिलने वाला वजीफा (Stipend) कितना है?',
            'सबसे ज्यादा मांग वाले 3 ट्रेड्स कौन से हैं?'
          ]
      : persona === 'parent'
      ? [
          'Can my child get a government or railway job after ITI?',
          'What about social dignity and respect in vocational jobs?',
          'Which technical trades are safest for daughters?',
          'What are verified starting salaries and placement rates?'
        ]
      : [
          'What is the future scope in Solar PV and EV technology?',
          'How does lateral entry to B.Tech/Diploma work?',
          'How much monthly stipend is paid under NAPS?',
          'What are the top 3 highest-paying vocational trades?'
        ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top MSDE Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30 px-4 py-3 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20">
              कM
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-white">KaushalMarg (कौशलमार्ग)</h1>
                <span className="text-[10px] uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full font-semibold">
                  MSDE Certified
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'hi'
                  ? 'व्यावसायिक शिक्षा एवं परिवार निर्णय-समर्थन केंद्र'
                  : 'AI Vocational Counselling & Family Decision-Support Platform'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Persona Switcher */}
            <div className="bg-slate-800 p-1 rounded-xl flex items-center border border-slate-700">
              <button
                onClick={() => setPersona('parent')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  persona === 'parent'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'माता-पिता (Parent)' : 'Parent Mode'}</span>
              </button>
              <button
                onClick={() => setPersona('learner')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  persona === 'learner'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'छात्र (Student)' : 'Learner Mode'}</span>
              </button>
            </div>

            {/* Language Toggle */}
            <div className="bg-slate-800 p-1 rounded-xl flex items-center border border-slate-700">
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'hi' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'en' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Live Escalation Button */}
            <button
              onClick={() => {
                setEscalationSubmitted(false)
                setShowEscalationModal(true)
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'काउंसलर से बात करें' : 'Talk to Counselor'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Chat & Guidance Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 flex flex-col">
        {/* Value Prop Banner */}
        <div className="bg-gradient-to-r from-orange-950/40 via-slate-900 to-blue-950/40 border border-slate-800 rounded-2xl p-4 mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
                {language === 'hi' ? 'सत्यापित आंकड़े (Verified MSDE Data)' : 'Verified Outcome Statistics'}
              </p>
              <p className="text-sm text-slate-300">
                {language === 'hi'
                  ? 'यह प्लेटफॉर्म केवल सरकारी अप्रूव्ड प्लेसमेंट दरों (85-95%) व वास्तविक वेतन पर आधारित सलाह देता है।'
                  : 'All guidance is backed by NCVET & DGT certified records with 85-95% verified trade placement.'}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>{language === 'hi' ? 'औसत प्रारंभिक वजीफा: ₹10,500/माह' : 'Avg. Stipend: ₹10,500/mo'}</span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none shadow-xl'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-white/10 text-xs">
                  <div className="flex items-center space-x-1.5 font-medium text-slate-300">
                    {msg.role === 'user' ? (
                      <span>{persona === 'parent' ? '👨‍👩‍👦 माता-पिता' : '🎓 छात्र'}</span>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-amber-400 font-semibold">कौशलमार्ग सलाहकार (MSDE)</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    {msg.role === 'assistant' && msg.audioText && (
                      <button
                        onClick={() => speakText(msg.audioText!, msg.id)}
                        title={language === 'hi' ? 'आवाज में सुनें' : 'Listen via audio'}
                        className={`p-1 rounded-full transition-colors ${
                          isSpeakingId === msg.id
                            ? 'bg-amber-500 text-white animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isSpeakingId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Message Content */}
                <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                  {msg.content}
                </div>

                {/* Verified Trade Outcome Cards (RAG Embeddings) */}
                {msg.trades && msg.trades.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
                    <p className="text-xs font-semibold text-slate-400 flex items-center space-x-1">
                      <Award className="w-3.5 h-3.5 text-orange-400" />
                      <span>
                        {language === 'hi'
                          ? 'संबंधित सत्यापित ट्रेड विवरण (NCVT/MSDE):'
                          : 'Relevant Verified Trade Records:'}
                      </span>
                    </p>
                    <div className="grid grid-cols-1 gap-2.5">
                      {msg.trades.map((trade) => (
                        <div
                          key={trade.id}
                          className="bg-slate-950/70 border border-slate-700/60 rounded-xl p-3 hover:border-orange-500/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-sm font-bold text-white">
                                {language === 'hi' ? trade.nameHi : trade.name}
                              </h4>
                              <p className="text-xs text-orange-400 font-medium">
                                {language === 'hi' ? trade.sectorHi : trade.sector} • {trade.duration}
                              </p>
                            </div>
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2 py-0.5 rounded-full font-bold">
                              {trade.placementRate}% {language === 'hi' ? 'प्लेसमेंट' : 'Placement'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-slate-800/80 text-xs">
                            <div>
                              <span className="text-slate-400 block text-[11px]">
                                {language === 'hi' ? 'शुरुआती वेतन' : 'Starting Salary'}
                              </span>
                              <span className="font-semibold text-emerald-400">
                                {trade.avgStartingSalary}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[11px]">
                                {language === 'hi' ? 'अप्रेंटिसशिप वजीफा' : 'NAPS Stipend'}
                              </span>
                              <span className="font-semibold text-cyan-400">
                                {trade.apprenticeshipStipend}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2 text-xs text-slate-300">
                            <span className="text-slate-400 text-[11px] block">
                              {language === 'hi' ? 'भर्ती करने वाली कंपनियाँ:' : 'Top Recruiters:'}
                            </span>
                            <span className="text-slate-200 font-medium">
                              {trade.topRecruiters.join(', ')}
                            </span>
                          </div>

                          <div className="mt-2 p-2 rounded-lg bg-orange-950/30 border border-orange-900/40 text-[11px] text-orange-200">
                            <strong>{language === 'hi' ? 'लेटरल एंट्री:' : 'Lateral Entry:'}</strong>{' '}
                            {trade.growthPath.degreeEquivalence}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Escalation Recommendation Prompt */}
                {msg.needsEscalation && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-2 text-xs text-rose-200">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>
                        {language === 'hi'
                          ? 'आपकी चिंता गंभीर है। क्या आप किसी सरकारी वरिष्ठ काउंसलर से फोन पर बात करना चाहेंगे?'
                          : 'Your doubt requires detailed personal guidance. Would you like a call with a certified MSDE counsellor?'}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowEscalationModal(true)}
                      className="bg-rose-600 hover:bg-rose-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold shrink-0 shadow transition-all"
                    >
                      {language === 'hi' ? 'कॉल बुक करें' : 'Book Call'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs py-2 px-4 bg-slate-900 rounded-xl w-fit border border-slate-800">
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              <span>
                {language === 'hi'
                  ? 'कौशलमार्ग सत्यापित डेटाबेस से सटीक जानकारी तैयार कर रहा है...'
                  : 'Retrieving verified MSDE outcome records...'}
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips (Ideal for Low-Digital Familiarity) */}
        <div className="mb-3">
          <p className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center space-x-1">
            <span>{language === 'hi' ? '⚡ अक्सर पूछे जाने वाले सवाल (क्लिक करें):' : '⚡ Quick Doubts:'}</span>
          </p>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="text-xs bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center space-x-1"
              >
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Voice-First Input Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex items-center space-x-2 shadow-2xl">
          {/* Microphone button (Speech-to-Text) */}
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? 'Listening... click to stop' : 'Click to speak in Hindi/English'}
            className={`p-3 rounded-xl transition-all ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/50'
                : 'bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              isListening
                ? language === 'hi'
                  ? 'सुन रहा हूँ... बोलिए...'
                  : 'Listening... speak now...'
                : language === 'hi'
                ? 'माइक दबाकर बोलें या यहाँ लिखें (जैसे: क्या आईटीआई के बाद सरकारी नौकरी मिलेगी?)...'
                : 'Speak or type your question (e.g. Can my child get a government job after ITI?)...'
            }
            className="flex-1 bg-transparent px-3 py-2 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-40 text-white p-3 rounded-xl shadow-lg shadow-orange-500/20 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Human Escalation Modal */}
      {showEscalationModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowEscalationModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            {!escalationSubmitted ? (
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {language === 'hi' ? 'वरिष्ठ काउंसलर से बात करें' : 'Request Counselor Callback'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {language === 'hi'
                        ? 'मंत्रालय के प्रमाणित काउंसलर आपको फोन पर पूरी जानकारी देंगे।'
                        : 'Certified MSDE human counsellors will call you directly.'}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleEscalationSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {language === 'hi' ? 'आपका नाम' : 'Your Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={language === 'hi' ? 'जैसे: रामेश्वर शर्मा' : 'e.g. Rameshwar Sharma'}
                      value={escalationForm.name}
                      onChange={(e) => setEscalationForm({ ...escalationForm, name: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {language === 'hi' ? 'मोबाइल नंबर (जिस पर कॉल आए)' : 'Mobile Number'}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={escalationForm.phone}
                      onChange={(e) => setEscalationForm({ ...escalationForm, phone: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        {language === 'hi' ? 'राज्य' : 'State'}
                      </label>
                      <input
                        type="text"
                        value={escalationForm.state}
                        onChange={(e) => setEscalationForm({ ...escalationForm, state: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        {language === 'hi' ? 'जिला' : 'District'}
                      </label>
                      <input
                        type="text"
                        value={escalationForm.district}
                        onChange={(e) => setEscalationForm({ ...escalationForm, district: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {language === 'hi' ? 'मुख्य शंका या सवाल' : 'Key Concern / Doubt'}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={
                        language === 'hi'
                          ? 'जैसे: क्या इस ट्रेड में सच में सरकारी नौकरी और सुरक्षा मिलेगी?'
                          : 'e.g. Doubts regarding degree equivalence or placement security'
                      }
                      value={escalationForm.concern}
                      onChange={(e) => setEscalationForm({ ...escalationForm, concern: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/30"
                  >
                    {language === 'hi' ? 'कॉल अनुरोध दर्ज करें (Submit Request)' : 'Request Free Callback'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {language === 'hi' ? 'अनुरोध सफलतापूर्वक दर्ज हुआ!' : 'Callback Scheduled!'}
                </h3>
                <p className="text-xs text-slate-300 mb-3">
                  {language === 'hi'
                    ? `आपका टिकट नंबर है: ${escalationTicketId}। हमारे वरिष्ठ काउंसलर 24 घंटे के अंदर संपर्क करेंगे।`
                    : `Ticket ID: ${escalationTicketId}. A certified counsellor will reach out shortly.`}
                </p>
                <button
                  onClick={() => setShowEscalationModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-xl text-xs font-semibold"
                >
                  {language === 'hi' ? 'चैट पर वापस जाएं' : 'Return to Chat'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
