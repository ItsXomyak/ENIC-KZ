'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/components/translation-provider"

export function CTASection() {
  const t = useTranslation()
  
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">{t("ready_to_start")}</h2>
        <p className="text-blue-100 max-w-2xl mx-auto mb-8">{t("cta_description")}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">{t("contact_us")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600">
            <Link href="/faq">{t("learn_more")}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
} 