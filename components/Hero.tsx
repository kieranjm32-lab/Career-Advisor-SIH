'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useRouter } from 'next/navigation'

// Dynamically import 3D component with SSR disabled
const HeroLines3D = dynamic(() => import('./HeroLines3D').then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-space-dark via-space-darker to-space-dark opacity-50" />
  )
})

const Hero = () => {
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()
  const { translations } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToFeatures = () => {
    const element = document.querySelector('#features')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToQuiz = () => {
    // Quiz accessible by all without login
    router.push('/quiz')
  }

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950"
    >
      {/* Career Gradient Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,130,246,0.25),rgba(16,185,129,0.1),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(15,23,42,0.8)_100%)] pointer-events-none" />

      {/* 3D Background Lines */}
      {mounted && (
        <div className="absolute inset-0 opacity-40">
          <HeroLines3D />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="space-y-8"
        >
          {/* SIH PS 26241 KaushalMarg Callout Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 via-indigo-500/10 to-emerald-500/20 border border-blue-500/30 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-blue-200 shadow-lg shadow-blue-500/10 cursor-pointer hover:border-blue-400 transition-colors mx-auto"
            onClick={() => router.push('/counselor')}
          >
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full shadow-sm">MSDE PS-26241</span>
            <span>KaushalMarg: AI Vocational Career Counselling & Family Support</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-emerald-400">
              {translations?.hero?.title || 'Shape Your Tomorrow with Confidence'}
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg sm:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-normal"
          >
            {translations?.hero?.subtitle || 'Unlock your potential with free AI-powered career assessments, verified industry roadmaps, and dedicated family decision-support.'}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-4"
          >
            {/* Primary CTA - Start Free Quiz */}
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={scrollToQuiz}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-white font-bold text-lg transition-all duration-300 shadow-xl shadow-blue-600/30 flex items-center gap-3 min-w-[220px] justify-center"
            >
              <span>{translations?.hero?.ctaStart || 'Start Career Quiz (Free)'}</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </motion.button>

            {/* Secondary CTA - Talk to AI Counselor */}
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push('/counselor')}
              className="group relative px-8 py-4 border border-slate-700 bg-slate-900/80 hover:bg-slate-800 rounded-xl text-slate-200 hover:text-white font-semibold text-lg transition-all duration-300 hover:border-emerald-500/50 shadow-lg flex items-center gap-3 min-w-[220px] justify-center backdrop-blur-md"
            >
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Talk to AI Counselor</span>
            </motion.button>
          </motion.div>

          {/* Stats or Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto"
          >
            {[
              { number: '10K+', label: translations?.hero?.stats?.studentsGuided || 'Students Guided' },
              { number: '500+', label: translations?.hero?.stats?.careerPaths || 'Career Paths' },
              { number: '1000+', label: translations?.hero?.stats?.collegesListed || 'Colleges Listed' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className="text-center space-y-2"
              >
                <div className="text-2xl sm:text-3xl font-bold text-neon-cyan">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              className="w-1 h-3 bg-neon-cyan rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-transparent to-space-dark/50 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-space-dark/30 via-transparent to-space-dark/30 pointer-events-none"></div>
    </section>
  )
}

export default Hero