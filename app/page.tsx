import Hero from '@/components/Hero'
import FeatureCards from '@/components/FeatureCards'

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Hero />
      <FeatureCards />
    </main>
  )
}