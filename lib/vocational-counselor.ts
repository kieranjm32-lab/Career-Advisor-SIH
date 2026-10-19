import { VOCATIONAL_TRADES, COMMON_PARENTAL_OBJECTIONS, VocationalTrade } from './data/vocational-outcomes'
import { FreeAIService } from './free-ai-services'

export type PersonaType = 'parent' | 'learner'
export type SupportedLanguage = 'hi' | 'en'

export interface SentimentAnalysisResult {
  score: number // -1.0 (very resistant/skeptical) to +1.0 (enthusiastic/supportive)
  resistanceCategory?: string // 'STATUS_STIGMA' | 'SALARY_SKEPTICISM' | 'SAFETY_GENDER' | 'DEGREE_OBSESSION'
  resistanceLevel: 'Low' | 'Medium' | 'High' | 'Severe'
  needsEscalation: boolean
  escalationReason?: string
  detectedConcerns: string[]
}

export interface VocationalCounselResponse {
  reply: string
  audioText: string // Clean, spoken-friendly text for Text-to-Speech (TTS)
  persona: PersonaType
  language: SupportedLanguage
  matchedTrades: VocationalTrade[]
  sentiment: SentimentAnalysisResult
  escalationRecommended: boolean
  suggestedQuestions: string[]
}

export class VocationalCounselorService {
  private static instance: VocationalCounselorService

  static getInstance(): VocationalCounselorService {
    if (!VocationalCounselorService.instance) {
      VocationalCounselorService.instance = new VocationalCounselorService()
    }
    return VocationalCounselorService.instance
  }

  /**
   * Evaluates text for parental resistance, anxiety, and specific objection types
   */
  analyzeSentiment(text: string, persona: PersonaType): SentimentAnalysisResult {
    const lower = text.toLowerCase()

    // Detect objection types
    let category: string | undefined
    const detectedConcerns: string[] = []
    let score = 0.1 // neutral default

    // Status / Stigma detection
    if (
      lower.includes('log kya kahenge') ||
      lower.includes('samaj') ||
      lower.includes('society') ||
      lower.includes('status') ||
      lower.includes('chota kaam') ||
      lower.includes('sharm') ||
      lower.includes('respect') ||
      lower.includes('izzat') ||
      lower.includes('प्रतिष्ठा') ||
      lower.includes('सम्मान') ||
      lower.includes('मजदूरी')
    ) {
      category = 'STATUS_STIGMA'
      detectedConcerns.push('Social stigma & fear of community judgment')
      score -= 0.5
    }

    // Salary / Security skepticism
    if (
      lower.includes('paisa') ||
      lower.includes('salary') ||
      lower.includes('kamai') ||
      lower.includes('kam salary') ||
      lower.includes('income') ||
      lower.includes('future') ||
      lower.includes('ghar kaise chalega') ||
      lower.includes('पैसा') ||
      lower.includes('सैलरी') ||
      lower.includes('भविष्य')
    ) {
      category = category || 'SALARY_SKEPTICISM'
      detectedConcerns.push('Doubts regarding salary viability and financial stability')
      score -= 0.4
    }

    // Female safety / Gender concerns
    if (
      lower.includes('ladki') ||
      lower.includes('beti') ||
      lower.includes('daughter') ||
      lower.includes('female') ||
      lower.includes('girl') ||
      lower.includes('safe') ||
      lower.includes('suraksha') ||
      lower.includes('सुरक्षा') ||
      lower.includes('लड़की') ||
      lower.includes('बेटी')
    ) {
      category = category || 'SAFETY_GENDER'
      detectedConcerns.push('Concerns regarding workplace safety and gender environment for daughters')
      score -= 0.3
    }

    // Degree obsession
    if (
      lower.includes('ba ') ||
      lower.includes('b.a') ||
      lower.includes('btech') ||
      lower.includes('degree') ||
      lower.includes('college') ||
      lower.includes('graduation') ||
      lower.includes('डिग्री') ||
      lower.includes('ग्रेजुएशन')
    ) {
      category = category || 'DEGREE_OBSESSION'
      detectedConcerns.push('Fixed preference for conventional academic degree over skill training')
      score -= 0.3
    }

    // Positive indicators
    if (
      lower.includes('interested') ||
      lower.includes('good') ||
      lower.includes('sahamat') ||
      lower.includes('badiya') ||
      lower.includes('placement') ||
      lower.includes('apply') ||
      lower.includes('पसंद') ||
      lower.includes('अच्छा')
    ) {
      score += 0.5
    }

    // Clamp score
    score = Math.max(-1.0, Math.min(1.0, score))

    // Determine resistance level
    let resistanceLevel: 'Low' | 'Medium' | 'High' | 'Severe' = 'Low'
    if (score < -0.6) resistanceLevel = 'Severe'
    else if (score < -0.3) resistanceLevel = 'High'
    else if (score < 0.1) resistanceLevel = 'Medium'

    // Escalation flag
    const explicitEscalate =
      lower.includes('counselor') ||
      lower.includes('call') ||
      lower.includes('baat karni') ||
      lower.includes('insan') ||
      lower.includes('human') ||
      lower.includes('काउंसलर') ||
      lower.includes('बात करनी')

    const needsEscalation = explicitEscalate || resistanceLevel === 'Severe'

    return {
      score: Number(score.toFixed(2)),
      resistanceCategory: category,
      resistanceLevel,
      needsEscalation,
      escalationReason: needsEscalation
        ? explicitEscalate
          ? 'User requested direct human counselor contact'
          : 'High parental resistance and anxiety detected'
        : undefined,
      detectedConcerns
    }
  }

  /**
   * Finds matching vocational trades from verified database based on keywords and user context
   */
  retrieveRelevantTrades(query: string): VocationalTrade[] {
    const lower = query.toLowerCase()
    const matches = VOCATIONAL_TRADES.filter((trade) => {
      const haystack = `${trade.name} ${trade.nameHi} ${trade.sector} ${trade.sectorHi} ${trade.topRecruiters.join(' ')} ${trade.parentalAssurance.reality}`.toLowerCase()
      return (
        haystack.includes(lower) ||
        (lower.includes('solar') && trade.id === 'solar-technician') ||
        (lower.includes('ev') && trade.id === 'ev-technician') ||
        (lower.includes('car') && trade.id === 'ev-technician') ||
        (lower.includes('machine') && trade.id === 'cnc-machinist') ||
        (lower.includes('hospital') && trade.id === 'healthcare-gda') ||
        (lower.includes('health') && trade.id === 'healthcare-gda') ||
        (lower.includes('nurse') && trade.id === 'healthcare-gda') ||
        (lower.includes('drone') && trade.id === 'drone-technician') ||
        (lower.includes('electric') && trade.id === 'electrician-industrial') ||
        (lower.includes('railway') && trade.id === 'electrician-industrial') ||
        (lower.includes('bijli') && trade.id === 'electrician-industrial') ||
        (lower.includes('beti') && (trade.id === 'healthcare-gda' || trade.id === 'drone-technician')) ||
        (lower.includes('ladki') && (trade.id === 'healthcare-gda' || trade.id === 'drone-technician'))
      )
    })

    // If no direct keyword match, return top 2 high-placement trades as baseline
    return matches.length > 0 ? matches.slice(0, 2) : [VOCATIONAL_TRADES[0], VOCATIONAL_TRADES[1]]
  }

  /**
   * Core counselling handler: Combines verified data RAG + empathetic persona AI
   */
  async counsel(params: {
    message: string
    persona: PersonaType
    language: SupportedLanguage
    conversationHistory?: { role: 'user' | 'assistant'; content: string }[]
  }): Promise<VocationalCounselResponse> {
    const { message, persona, language, conversationHistory = [] } = params

    // 1. Analyze Sentiment & Resistance
    const sentiment = this.analyzeSentiment(message, persona)

    // 2. Retrieve verified trade outcome data
    const matchedTrades = this.retrieveRelevantTrades(message)

    // 3. Build verified facts payload for RAG injection
    const verifiedFacts = matchedTrades
      .map(
        (t) => `
Trade: ${t.name} (${t.nameHi})
- Certified By: ${t.certifyingBody}
- Verified Placement Rate: ${t.placementRate}%
- Starting Salary: ${t.avgStartingSalary} (3-Year Trajectory: ${t.threeYearSalary})
- Monthly Apprenticeship Stipend (NAPS): ${t.apprenticeshipStipend}
- Top Recruiters: ${t.topRecruiters.join(', ')}
- Degree & Lateral Progression: ${t.growthPath.degreeEquivalence}
- Parental Reality Check: ${language === 'hi' ? t.parentalAssurance.realityHi : t.parentalAssurance.reality}
- ROI Comparison: ${language === 'hi' ? t.parentalAssurance.roiComparisonHi : t.parentalAssurance.roiComparison}
`
      )
      .join('\n---\n')

    // 4. Construct Culturally-Attuned System Prompt
    const systemPrompt =
      persona === 'parent'
        ? `You are an empathetic, culturally-respectful Senior Vocational Counsellor for the Ministry of Skill Development and Entrepreneurship (MSDE), India.
You are talking to an Indian PARENT who is anxious, hesitant, or skeptical about enrolling their child in vocational education/ITI/PMKVY.
Target Language: ${language === 'hi' ? 'Hindi (हिन्दी)' : 'English'}.
CRITICAL INSTRUCTIONS:
1. Always validate their parental love and concern first. Never dismiss their feelings or act condescending.
2. Address the elephant in the room: Social stigma ("Log kya kahenge"), income stability, and safety.
3. GROUND ALL CLAIMS in the verified outcome data provided below. Quote exact placement rates, salaries, and company names.
4. Highlight the National Credit Framework (NCrF) and lateral entry: ITI + apprenticeship allows direct 2nd-year entry to engineering polytechnic diploma. They are NOT closing doors to higher education.
5. Mention government financial benefits: NAPS monthly stipends (₹8,000-12,500/mo) and free PM Vishwakarma toolkits.
6. Keep answers structured, warm, reassuring, and concise (under 180 words).

VERIFIED OUTCOME DATA:
${verifiedFacts}`
        : `You are an inspiring, knowledgeable Vocational Career Mentor for the Ministry of Skill Development and Entrepreneurship (MSDE), India.
You are guiding an ambitious Indian YOUTH / LEARNER considering vocational skills.
Target Language: ${language === 'hi' ? 'Hindi (हिन्दी)' : 'English'}.
CRITICAL INSTRUCTIONS:
1. Speak energetically about practical, hands-on masteries, cutting-edge industries (EV, Drones, Clean Energy, Robotics).
2. Contrast 1-2 years of targeted skill training + early financial independence with 4 years of generic degree stagnation.
3. Cite verified outcome stats: Placement %, starting stipend, and corporate career ladders.
4. Keep answers motivating, practical, and clear (under 180 words).

VERIFIED OUTCOME DATA:
${verifiedFacts}`

    // 5. Query AI or execute high-fidelity verified fallback
    let reply = ''
    try {
      const aiService = FreeAIService.getInstance()
      const aiResponse = await aiService.generateChatResponse([
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-4),
        { role: 'user', content: message }
      ])
      reply = aiResponse.content
    } catch (e) {
      console.warn('AI provider call failed or not configured, using verified domain generator:', e)
    }

    // Fallback generator ensuring zero disruption and accurate verified figures
    if (!reply || reply.trim().length === 0) {
      reply = this.generateVerifiedFallbackReply(message, persona, language, matchedTrades, sentiment)
    }

    // Generate clean text for Text-to-Speech (removing markdown characters like **, ##)
    const audioText = reply
      .replace(/[*#_`]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\n+/g, '. ')
      .trim()

    // Contextual suggested follow-up questions
    const suggestedQuestions =
      language === 'hi'
        ? persona === 'parent'
          ? [
              'क्या आईटीआई के बाद सरकारी नौकरी (जैसे रेलवे) मिल सकती है?',
              'कोर्स के दौरान मिलने वाले वजीफे (Stipend) की जानकारी दें।',
              'लड़कियों के लिए सबसे सुरक्षित और बेहतरीन ट्रेड कौन सा है?'
            ]
          : [
              'ईवी (EV) और ड्रोन तकनीशियन में दाखिला कैसे लें?',
              'अप्रेंटिसशिप के साथ बी.टेक या डिप्लोमा कैसे कर सकते हैं?',
              'कोर्स पूरा करने के बाद शुरुआती वेतन कितना मिलता है?'
            ]
        : persona === 'parent'
        ? [
            'Can my child get a government job (e.g. Railways) after ITI?',
            'What is the monthly stipend under National Apprenticeship Scheme?',
            'What are the safest and highest-paying trades for daughters?'
          ]
        : [
            'How can I get admission into EV or Drone technician trades?',
            'How does lateral entry to engineering polytechnic work?',
            'What is the average starting salary and placement rate?'
          ]

    return {
      reply,
      audioText,
      persona,
      language,
      matchedTrades,
      sentiment,
      escalationRecommended: sentiment.needsEscalation,
      suggestedQuestions
    }
  }

  private generateVerifiedFallbackReply(
    query: string,
    persona: PersonaType,
    language: SupportedLanguage,
    trades: VocationalTrade[],
    sentiment: SentimentAnalysisResult
  ): string {
    const primary = trades[0]

    if (language === 'hi') {
      if (persona === 'parent') {
        if (sentiment.resistanceCategory === 'STATUS_STIGMA') {
          return `नमस्ते! आपकी यह चिंता बिल्कुल स्वाभाविक है। हर माता-पिता चाहते हैं कि उनके बच्चे को समाज में पूरा सम्मान मिले।

सच्चाई यह है कि आज आधुनिक वोकेशनल ट्रेड्स (जैसे **${primary.nameHi}**) में पुरानी ढर्रे की मजदूरी नहीं, बल्कि आधुनिक कंप्यूटर और अत्याधुनिक उपकरणों का काम होता है।
• **सत्यापित प्लेसमेंट दर:** सरकारी आंकड़ों के अनुसार इस ट्रेड में **${primary.placementRate}% प्लेसमेंट** सुनिश्चित है।
• **वेतन और सुरक्षा:** शुरुआत में ही **${primary.avgStartingSalary}** मिलता है, और 3 साल में यह **${primary.threeYearSalary}** तक पहुंच जाता है।
• **उच्च शिक्षा का रास्ता खुला है:** राष्ट्रीय शिक्षा नीति (NEP) और क्रेडिट फ्रेमवर्क के तहत छात्र सीधे पॉलिटेक्निक डिप्लोमा के द्वितीय वर्ष में लेटरल एंट्री लेकर बी.टेक तक जा सकते हैं।

आपका बच्चा किसी साधारण कॉलेज की बेरोजगार डिग्री के मुकाबले 3 साल पहले आत्मनिर्भर बनेगा।`
        }

        if (sentiment.resistanceCategory === 'SAFETY_GENDER') {
          return `नमस्ते! एक माता-पिता के तौर पर अपनी बेटी के सुरक्षित भविष्य की चिंता करना पूरी तरह सही है।

कौशल विकास मंत्रालय (MSDE) ने बेटियों के लिए विशेष व्यवस्था की है:
• **राष्ट्रीय महिला कौशल संस्थान (NSTI-W):** देशभर में 19 विशेष महिला संस्थान हैं जहाँ पूर्णतः सुरक्षित हॉस्टल और महिला प्रशिक्षक हैं।
• **समान अवसर और सुरक्षा:** **${primary.nameHi}** और हेल्थकेयर जैसे ट्रेड्स में टाटा, श्नाइडर और अपोलो जैसी कंपनियाँ विशेष महिला विंग में सम्मानजनक और सुरक्षित रोजगार देती हैं।
• **वजीफा:** अप्रेंटिसशिप के दौरान **${primary.apprenticeshipStipend}** सीधे बैंक खाते में मिलता है।`
        }

        return `नमस्ते! आपका प्रश्न अत्यंत महत्वपूर्ण है। 

**${primary.nameHi}** कौशल विकास मंत्रालय (MSDE) द्वारा प्रमाणित प्रमुख ट्रेड है:
• **प्लेसमेंट दर:** **${primary.placementRate}%** (प्रमुख कंपनियाँ: ${primary.topRecruiters.slice(0, 3).join(', ')})
• **शुरुआती वेतन:** **${primary.avgStartingSalary}** (3 वर्ष बाद: ${primary.threeYearSalary})
• **सरकारी सहयोग:** अप्रेंटिसशिप में **${primary.apprenticeshipStipend}** वजीफा और निशुल्क टूलकिट।

यदि आप किसी अनुभवी सरकारी काउंसलर से फोन पर सीधी बात करना चाहते हैं, तो नीचे दिए गए 'काउंसलर से बात करें' बटन पर क्लिक कर सकते हैं।`
      } else {
        // Learner Persona Hindi
        return `शानदार विचार! वोकेशनल और स्किल ट्रेनिंग आज के समय में करियर बनाने का सबसे तेज़ और व्यावहारिक रास्ता है।

**${primary.nameHi}**:
• **कैंपस प्लेसमेंट:** **${primary.placementRate}%**
• **कमाई का रास्ता:** पढ़ाई के साथ ही अप्रेंटिसशिप में **${primary.apprenticeshipStipend}** का वजीफा।
• **शुरुआती पैकेज:** **${primary.avgStartingSalary}** और 3 साल के अनुभव के बाद **${primary.threeYearSalary}**।
• **शीर्ष रिक्रूटर्स:** ${primary.topRecruiters.join(', ')}।

इसके बाद आप सीधे 2nd year लेटरल एंट्री के ज़रिए इंजीनियरिंग डिप्लोमा भी कर सकते हैं!`
      }
    } else {
      // English
      if (persona === 'parent') {
        return `Hello! Your concern is completely natural and understandable. Every parent wants a secure, respected future for their child.

The verified reality of modern vocational trades like **${primary.name}** is transformative:
• **Verified Placement Record:** **${primary.placementRate}%** verified hiring rate across industry partners like ${primary.topRecruiters.slice(0, 3).join(', ')}.
• **Strong Financial Trajectory:** Starting earnings of **${primary.avgStartingSalary}**, growing to **${primary.threeYearSalary}** within 3 years.
• **Higher Education Gateway:** Under the National Credit Framework (NCrF), students can take lateral entry directly into the 2nd year of Engineering Polytechnic Diplomas.
• **Government Stipends:** **${primary.apprenticeshipStipend}** under the National Apprenticeship Promotion Scheme (NAPS).

Your child achieves financial independence years ahead of peers with zero educational debt.`
      } else {
        return `Great focus! Vocational education is the fastest route to high-growth, practical technical careers.

Here are the verified outcomes for **${primary.name}**:
• **Placement Rate:** **${primary.placementRate}%**
• **Starting Salary:** **${primary.avgStartingSalary}** (scaling to **${primary.threeYearSalary}** in 3 years).
• **Earn While You Learn:** **${primary.apprenticeshipStipend}** during NAPS on-the-job training.
• **Top Employers:** ${primary.topRecruiters.join(', ')}.
• **Progression:** Direct 2nd-year lateral entry to Polytechnic Diploma & B.Voc degree pathways.`
      }
    }
  }
}
