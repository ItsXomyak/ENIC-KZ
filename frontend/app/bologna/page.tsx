import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home } from "lucide-react"
import BolognaOverview from "@/components/bologna/bologna-overview"
import BolognaESG from "@/components/bologna/bologna-esg"
import BolognaQualifications from "@/components/bologna/bologna-qualifications"
import BolognaReports from "@/components/bologna/bologna-reports"

export default function BolognaPage() {
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
            <BreadcrumbLink href="/bologna">Bologna Process</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Bologna Process</h1>
        <p className="text-lg text-gray-600">
          The Bologna Process is an intergovernmental higher education reform process that includes 49 European
          countries and a number of European organizations. Its main goal is to enhance the quality and recognition of
          European higher education systems and to facilitate student and staff mobility.
        </p>
      </div>

      <Tabs defaultValue="overview" className="mb-12">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="esg">ESG</TabsTrigger>
          <TabsTrigger value="qualifications">Qualifications Framework</TabsTrigger>
          <TabsTrigger value="reports">National Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="p-4 border rounded-md mt-2">
          <BolognaOverview />
        </TabsContent>
        <TabsContent value="esg" className="p-4 border rounded-md mt-2">
          <BolognaESG />
        </TabsContent>
        <TabsContent value="qualifications" className="p-4 border rounded-md mt-2">
          <BolognaQualifications />
        </TabsContent>
        <TabsContent value="reports" className="p-4 border rounded-md mt-2">
          <BolognaReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}
