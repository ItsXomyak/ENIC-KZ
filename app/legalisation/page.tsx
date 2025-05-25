import type { Metadata } from "next"
import { useTranslation } from "@/components/translation-provider"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Legalisation | Education Center",
  description: "Information about document legalisation process, requirements, and services.",
}

export default function LegalisationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Legalisation", href: "/legalisation", active: true },
        ]}
      />

      <LegalisationContent />
    </div>
  )
}

function LegalisationContent() {
  const { t } = useTranslation()

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">{t("legalisation.title")}</h1>
      <p className="text-lg mb-8">{t("legalisation.introduction")}</p>

      <Tabs defaultValue="process">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="process">{t("legalisation.tabs.process")}</TabsTrigger>
          <TabsTrigger value="requirements">{t("legalisation.tabs.requirements")}</TabsTrigger>
          <TabsTrigger value="services">{t("legalisation.tabs.services")}</TabsTrigger>
        </TabsList>

        <TabsContent value="process" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("legalisation.process.title")}</CardTitle>
              <CardDescription>{t("legalisation.process.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mr-4">
                      {step}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{t(`legalisation.process.steps.${step}.title`)}</h3>
                      <p className="mt-1">{t(`legalisation.process.steps.${step}.description`)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">{t("legalisation.process.timeframe.title")}</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>{t("legalisation.process.timeframe.standard")}</li>
                  <li>{t("legalisation.process.timeframe.express")}</li>
                  <li>{t("legalisation.process.timeframe.urgent")}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("legalisation.requirements.title")}</CardTitle>
              <CardDescription>{t("legalisation.requirements.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">{t("legalisation.requirements.documents.title")}</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t("legalisation.requirements.documents.original")}</li>
                    <li>{t("legalisation.requirements.documents.copies")}</li>
                    <li>{t("legalisation.requirements.documents.translation")}</li>
                    <li>{t("legalisation.requirements.documents.application")}</li>
                    <li>{t("legalisation.requirements.documents.id")}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">{t("legalisation.requirements.fees.title")}</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t("legalisation.requirements.fees.standard")}</li>
                    <li>{t("legalisation.requirements.fees.express")}</li>
                    <li>{t("legalisation.requirements.fees.urgent")}</li>
                    <li>{t("legalisation.requirements.fees.additional")}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">{t("legalisation.requirements.restrictions.title")}</h3>
                  <p>{t("legalisation.requirements.restrictions.description")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("legalisation.services.title")}</CardTitle>
              <CardDescription>{t("legalisation.services.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((service) => (
                  <div key={service} className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">{t(`legalisation.services.types.${service}.title`)}</h3>
                    <p className="mb-4">{t(`legalisation.services.types.${service}.description`)}</p>
                    <div className="text-sm text-muted-foreground mb-4">
                      <div className="flex justify-between mb-1">
                        <span>{t("legalisation.services.timeframe")}:</span>
                        <span>{t(`legalisation.services.types.${service}.timeframe`)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("legalisation.services.fee")}:</span>
                        <span>{t(`legalisation.services.types.${service}.fee`)}</span>
                      </div>
                    </div>
                    <Button asChild className="w-full">
                      <Link href="/contact">{t("legalisation.services.requestButton")}</Link>
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">{t("legalisation.services.additionalServices.title")}</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>{t("legalisation.services.additionalServices.translation")}</li>
                  <li>{t("legalisation.services.additionalServices.notarization")}</li>
                  <li>{t("legalisation.services.additionalServices.courier")}</li>
                  <li>{t("legalisation.services.additionalServices.consultation")}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-12 bg-muted p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">{t("legalisation.contact.title")}</h2>
        <p className="mb-6">{t("legalisation.contact.description")}</p>
        <Button asChild size="lg">
          <Link href="/contact">{t("legalisation.contact.button")}</Link>
        </Button>
      </div>
    </div>
  )
}
