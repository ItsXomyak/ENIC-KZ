import { HeroSection } from "./components/HeroSection"
import { QuickLinksSection } from "./components/QuickLinksSection"
import { ServicesSection } from "./components/ServicesSection"
import { StatisticsSection } from "./components/StatisticsSection"
import { NewsSection } from "./components/NewsSection"
import { CTASection } from "./components/CTASection"

export default function Home() {
  return (
    <main>
      <HeroSection />
      <QuickLinksSection />
      <ServicesSection />
      <StatisticsSection />
      <NewsSection />
      <CTASection />
    </main>
  )
}
