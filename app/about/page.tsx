import type { Metadata } from "next"
import { useTranslation } from "@/components/translation-provider"
import { Breadcrumb } from "@/components/ui/breadcrumb"

export const metadata: Metadata = {
  title: "About Us | Education Center",
  description: "Learn about the Education Center, our mission, vision, and team.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about", active: true },
        ]}
      />

      <AboutContent />
    </div>
  )
}

function AboutContent() {
  const { t, language } = useTranslation()

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">{t("about.title")}</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t("about.mission.title")}</h2>
        <p className="text-lg mb-4">{t("about.mission.description")}</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t("about.vision.title")}</h2>
        <p className="text-lg mb-4">{t("about.vision.description")}</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t("about.team.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="bg-card rounded-lg p-6 shadow-md">
              <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4"></div>
              <h3 className="text-xl font-medium text-center">{t(`about.team.member${index}.name`)}</h3>
              <p className="text-center text-muted-foreground">{t(`about.team.member${index}.position`)}</p>
              <p className="mt-4 text-center">{t(`about.team.member${index}.bio`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t("about.history.title")}</h2>
        <p className="text-lg mb-4">{t("about.history.description")}</p>

        <div className="mt-6 space-y-6">
          {[2018, 2019, 2020, 2021, 2022, 2023].map((year) => (
            <div key={year} className="flex">
              <div className="flex-shrink-0 w-16 font-bold">{year}</div>
              <div className="flex-grow">
                <p>{t(`about.history.timeline.${year}`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
