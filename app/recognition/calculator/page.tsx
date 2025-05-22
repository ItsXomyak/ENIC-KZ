import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react"
import { useTranslation } from "@/components/translation-provider"
import RecognitionCalculator from "@/components/recognition/recognition-calculator"

export default function CalculatorPage() {
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
            <BreadcrumbLink href="/recognition/calculator">{useTranslation("cost_calculator")}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{useTranslation("cost_calculator")}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          {useTranslation("calculator_page_description") ||
            "Use our calculator to estimate the cost and processing time for your recognition application based on the type of document, country of origin, and urgency of your request."}
        </p>
      </div>

      <RecognitionCalculator />
    </div>
  )
}
