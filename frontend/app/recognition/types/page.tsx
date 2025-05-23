import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { useTranslation } from "@/components/translation-provider"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react"

export default function RecognitionTypesPage() {
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
            <BreadcrumbLink href="/recognition">{useTranslation("recognition")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/recognition/types">{useTranslation("types_of_recognition")}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold mb-6">{useTranslation("types_of_recognition")}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {useTranslation("types_description_full") ||
            "Our center provides different types of recognition services depending on your needs. Below are the main types of recognition we offer."}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecognitionTypeCard
            title={useTranslation("academic_recognition") || "Academic Recognition"}
            description={
              useTranslation("academic_recognition_description") ||
              "Recognition for continuing education at universities and other educational institutions."
            }
            icon="/placeholder.svg?height=80&width=80"
          />
          <RecognitionTypeCard
            title={useTranslation("professional_recognition") || "Professional Recognition"}
            description={
              useTranslation("professional_recognition_description") ||
              "Recognition for employment purposes and professional licensing."
            }
            icon="/placeholder.svg?height=80&width=80"
          />
          <RecognitionTypeCard
            title={useTranslation("qualification_recognition") || "Qualification Recognition"}
            description={
              useTranslation("qualification_recognition_description") ||
              "Recognition of specific qualifications, degrees, and diplomas."
            }
            icon="/placeholder.svg?height=80&width=80"
          />
          <RecognitionTypeCard
            title={useTranslation("partial_studies_recognition") || "Partial Studies Recognition"}
            description={
              useTranslation("partial_studies_recognition_description") ||
              "Recognition of credits and periods of study completed abroad."
            }
            icon="/placeholder.svg?height=80&width=80"
          />
        </div>
      </div>
    </div>
  )
}

function RecognitionTypeCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <Card className="flex items-start gap-4 p-4">
      <div className="flex-shrink-0">
        <Image src={icon || "/placeholder.svg"} alt={title} width={80} height={80} />
      </div>
      <div>
        <CardTitle className="text-xl mb-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
    </Card>
  )
}
