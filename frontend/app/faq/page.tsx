'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Home } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useLanguage } from '@/components/language-provider'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function FAQPage() {
  const { t, language } = useLanguage()

  const faqItems = [
    { question: t("faq_q_recognition"), answer: t("faq_a_recognition") },
    { question: t("faq_q_application"), answer: t("faq_a_application") },
    { question: t("faq_q_documents"), answer: t("faq_a_documents") },
    { question: t("faq_q_duration"), answer: t("faq_a_duration") },
    { question: t("faq_q_cost"), answer: t("faq_a_cost") },
    { question: t("faq_q_appeal"), answer: t("faq_a_appeal") },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${language}`}>
              <Home className="h-4 w-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${language}/faq`}>
              {t("frequently_asked_questions")}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{t("frequently_asked_questions")}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          {t("faq_description")}
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full mb-8">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-600">{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">{t("still_have_questions")}</h2>
        <p className="mb-4">{t("contact_us_for_more_info")}</p>
        <Button asChild>
          <Link href={`/contact`}>{t("contact_us")}</Link>
        </Button>
      </div>
    </div>
  )
}
