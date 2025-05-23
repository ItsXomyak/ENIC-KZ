'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react"
import { useTranslation } from "@/components/translation-provider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  const t = useTranslation()
  
  const faqItems = [
    {
      question: "what_is_recognition",
      answer: "recognition_explanation"
    },
    {
      question: "how_to_apply",
      answer: "application_process"
    },
    {
      question: "required_documents",
      answer: "documents_list"
    },
    {
      question: "processing_time",
      answer: "processing_time_explanation"
    },
    {
      question: "recognition_fees",
      answer: "fees_explanation"
    },
    {
      question: "appeal_process",
      answer: "appeal_explanation"
    }
  ]
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <Home className="h-4 w-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/faq">{t("frequently_asked_questions")}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{t("frequently_asked_questions")}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          {t("faq_description") ||
            "Find answers to frequently asked questions about recognition, accreditation, and our services."}
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full mb-8">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {t(item.question)}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-600">{t(item.answer)}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">{t("still_have_questions") || "Still Have Questions?"}</h2>
        <p className="mb-4">
          {t("contact_us_for_more_info") ||
            "If you couldn't find the answer to your question, please don't hesitate to contact us. Our team is ready to assist you."}
        </p>
        <Button asChild>
          <Link href="/contact">{t("contact_us") || "Contact Us"}</Link>
        </Button>
      </div>
    </div>
  )
}

import { Button } from "@/components/ui/button"
import Link from "next/link"
