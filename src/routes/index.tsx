import config from '@/appConfig'
import Footer from '@/components/_common/Footer'
import Header from '@/components/_common/Header'
import { DentaFlowCTA } from '@/components/Landing/DentaFlowCTA'
import { DentaFlowFeatures } from '@/components/Landing/DentaFlowFeatures'
import { DentaFlowHero } from '@/components/Landing/DentaFlowHero'
import { DentaFlowHowItWorks } from '@/components/Landing/DentaFlowHowItWorks'
import { FAQSection } from '@/components/Landing/LandingFAQ'
import { PricingSection } from '@/components/Landing/LandingPricing'
import { generateCompleteSEO } from '@/lib/seo'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: generateCompleteSEO({
      title: `${config.appName} - AI-Powered Dental Practice Management`,
      description:
        'Streamline patient follow-ups, treatment explanations, post-care instructions, and SEO blog content for your dental clinic. All powered by AI.',
    }),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="min-h-screen contain-paint">
        <DentaFlowHero />
        <DentaFlowFeatures />
        <DentaFlowHowItWorks />
        <PricingSection />
        <FAQSection />
        <DentaFlowCTA />
      </main>
      <Footer />
    </div>
  )
}
