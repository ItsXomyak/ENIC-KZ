import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home } from "lucide-react"
import RecognitionForm from "@/components/recognition/recognition-form"
import RecognitionCalculator from "@/components/recognition/recognition-calculator"
import RecognitionTypes from "@/components/recognition/recognition-types"
import RecognitionLegal from "@/components/recognition/recognition-legal"

export default function RecognitionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[
        { label: "Главная", href: "/" },
        { label: "Recognition", href: "/recognition" }
      ]} />

      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Recognition of Foreign Education Documents</h1>
        <p className="text-lg text-gray-600">
          Our center provides official recognition of foreign education documents for academic and professional
          purposes. This process ensures that qualifications obtained abroad are properly evaluated and recognized
          within our country.
        </p>
      </div>

      <Tabs defaultValue="types" className="mb-12">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="types">Types of Recognition</TabsTrigger>
          <TabsTrigger value="application">Application Process</TabsTrigger>
          <TabsTrigger value="calculator">Cost Calculator</TabsTrigger>
          <TabsTrigger value="legal">Legal Framework</TabsTrigger>
        </TabsList>
        <TabsContent value="types" className="p-4 border rounded-md mt-2">
          <RecognitionTypes />
        </TabsContent>
        <TabsContent value="application" className="p-4 border rounded-md mt-2">
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Application Process</h3>
            <p className="mb-6">
              To apply for recognition of your foreign education documents, please complete the online application form
              below. Make sure to provide all required information and upload the necessary documents.
            </p>
            <RecognitionForm />
          </div>
        </TabsContent>
        <TabsContent value="calculator" className="p-4 border rounded-md mt-2">
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Recognition Cost Calculator</h3>
            <p className="mb-6">
              Use our calculator to estimate the cost and processing time for your recognition application based on the
              type of document, country of origin, and urgency of your request.
            </p>
            <RecognitionCalculator />
          </div>
        </TabsContent>
        <TabsContent value="legal" className="p-4 border rounded-md mt-2">
          <RecognitionLegal />
        </TabsContent>
      </Tabs>
    </div>
  )
}
