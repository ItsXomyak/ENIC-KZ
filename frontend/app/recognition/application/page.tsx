import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react"
import { useTranslation } from "@/components/translation-provider"
import RecognitionForm from "@/components/recognition/recognition-form"

export default function ApplicationPage() {
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
            <BreadcrumbLink href="/recognition/application">{useTranslation("application_process")}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{useTranslation("application_process")}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          {useTranslation("application_process_description") ||
            "To apply for recognition of your foreign education documents, please complete the online application form below. Make sure to provide all required information and upload the necessary documents."}
        </p>
      </div>

      <RecognitionForm />
    </div>
  )
}
