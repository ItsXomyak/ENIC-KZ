'use client'

import Link from "next/link"
import { GraduationCap, Award, BookOpen, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/components/translation-provider"

function ServiceCard({
  icon,
  title,
  description,
  link,
}: {
  icon: React.ReactNode
  title: string
  description: string
  link: string
}) {
  const t = useTranslation()
  
  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto pt-0">
        <Button asChild variant="ghost" className="gap-2 p-0 h-auto">
          <Link href={link}>
            {t("learn_more")} <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function ServicesSection() {
  const t = useTranslation()
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t("our_key_services")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t("services_description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard
            icon={<GraduationCap className="h-10 w-10 text-blue-600" />}
            title={t("recognition_of_foreign_education")}
            description={t("recognition_description")}
            link="/recognition"
          />
          <ServiceCard
            icon={<Award className="h-10 w-10 text-blue-600" />}
            title={t("accreditation_services")}
            description={t("accreditation_description")}
            link="/accreditation"
          />
          <ServiceCard
            icon={<BookOpen className="h-10 w-10 text-blue-600" />}
            title={t("bologna_process_service")}
            description={t("bologna_description")}
            link="/bologna"
          />
        </div>
      </div>
    </section>
  )
} 