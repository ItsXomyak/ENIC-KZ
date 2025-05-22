'use client'

import { Users, Award, Building2, Globe } from "lucide-react"
import { useTranslation } from "@/components/translation-provider"

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <div className="text-4xl font-bold text-blue-600 mb-2">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  )
}

export function StatisticsSection() {
  const t = useTranslation()
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard
            icon={<Users className="h-8 w-8 text-blue-600" />}
            value="10,000+"
            label={t("students_served")}
          />
          <StatCard
            icon={<Award className="h-8 w-8 text-blue-600" />}
            value="500+"
            label={t("accredited_institutions")}
          />
          <StatCard
            icon={<Building2 className="h-8 w-8 text-blue-600" />}
            value="50+"
            label={t("partner_countries")}
          />
          <StatCard
            icon={<Globe className="h-8 w-8 text-blue-600" />}
            value="100%"
            label={t("satisfaction_rate")}
          />
        </div>
      </div>
    </section>
  )
} 