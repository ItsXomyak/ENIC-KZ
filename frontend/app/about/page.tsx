// app/about/page.tsx
"use client"

import { useLanguage } from "@/components/language-provider"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Image from "next/image"


export default function AboutPage() {
  const { language, t, leaders } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Хлебные крошки */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${language}`}>
              <Home className="h-4 w-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${language}/about`}>
              {t("about_center")}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* История */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("about_history")}</h2>
        {[1, 2, 3, 4, 5].map((i) => (
          <p key={i}>{t(`about_history_p${i}`)}</p>
        ))}
      </section>

      {/* Миссия */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("about_mission")}</h2>
        <p>{t("about_mission_text")}</p>
      </section>

      {/* Руководящий состав */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("about_leadership")}</h2>
        <Accordion type="single" collapsible className="w-full">
          {leaders.map((l, idx) => (
            <AccordionItem value={`leader-${idx}`} key={idx}>
              <AccordionTrigger className="font-medium">
                {l.name} — {l.position}
              </AccordionTrigger>
              {l.photo && (
                <div className="w-32 h-32 relative">
                  <Image
                    src={l.photo}
                    alt={l.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full border"
                  />
                </div>
              )}
              <AccordionContent className="space-y-3">
                <p>
                  <strong>{t("about_contact")}:</strong> {l.contact}
                </p>
                <p>
                  <strong>{t("about_education")}:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  {l.education.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
                <p>
                  <strong>{t("about_experience")}:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  {l.experience.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  )
}
