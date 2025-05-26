"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home, Mail, Phone, MapPin, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ContactForm from "@/components/contact/contact-form"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

import { useLanguage } from "@/components/language-provider"
import { contactTranslations, Locale } from "@/lib/contact"

const ContactCard = ({
  icon,
  title,
  description,
  contact,
  link,
}: {
  icon: React.ReactNode
  title: string
  description: string
  contact: string
  link?: string
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {icon} {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="mb-4">{description}</p>
      {link ? (
        <a href={link} className="text-blue-500 hover:underline">
          {contact}
        </a>
      ) : (
        <p>{contact}</p>
      )}
    </CardContent>
  </Card>
)

export default function ContactPage() {
  // Берём язык из глобального провайдера
  const { language } = useLanguage()
  const t = contactTranslations[language as Locale]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Хлебные крошки */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <Home className="h-4 w-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/contact">
              {t.breadcrumb}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Заголовок и описание */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{t.pageTitle}</h1>
        <p className="text-lg text-gray-600">{t.pageDescription}</p>
      </div>

      {/* Контактные карточки */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {t.cards.map((c, idx) => (
          <ContactCard key={idx} {...c} />
        ))}
      </div>

      {/* Форма и карта */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">{t.sendMessageTitle}</h2>
          <ContactForm />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">{t.visitOfficeTitle}</h2>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" /> {t.visitOfficeTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                {t.addressLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
              <div className="aspect-video relative rounded-md overflow-hidden border">
                <iframe
                  src={t.mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">{t.faqTitle}</h2>
        <Accordion type="single" collapsible className="w-full">
          {t.faq.map((item, i) => (
            <AccordionItem value={`item-${i}`} key={i}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
