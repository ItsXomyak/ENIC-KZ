import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function BolognaReports() {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">National Reports</h3>
      <p className="mb-6">
        Countries participating in the Bologna Process regularly produce national reports on the implementation of
        Bologna reforms. These reports provide valuable information on the progress and challenges in implementing the
        Bologna Process at the national level.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Latest National Report (2023)</CardTitle>
            <CardDescription>Comprehensive overview of Bologna Process implementation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The latest national report provides a detailed analysis of the implementation of Bologna Process reforms
              in our country. Key highlights include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Full implementation of the three-cycle system</li>
              <li>Adoption of ECTS for all higher education programs</li>
              <li>Establishment of a national qualifications framework</li>
              <li>Implementation of the Diploma Supplement</li>
              <li>Development of quality assurance mechanisms in line with ESG</li>
            </ul>
            <div className="mt-4">
              <Link href="#" className="text-blue-600 hover:underline">
                Download Full Report (PDF)
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bologna Implementation Scorecard</CardTitle>
            <CardDescription>Visual representation of implementation progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-[250px] rounded-xl overflow-hidden mb-4">
              <Image
                src="/placeholder.svg?height=250&width=400"
                alt="Bologna Scorecard"
                fill
                className="object-contain"
              />
            </div>
            <p>
              The scorecard provides a visual representation of our country's progress in implementing key Bologna
              Process commitments. Green indicates full implementation, yellow indicates partial implementation, and red
              indicates little or no implementation.
            </p>
          </CardContent>
        </Card>
      </div>

      <h4 className="text-xl font-bold mb-4">Previous National Reports</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ReportCard
          year="2020"
          title="Bologna Process Implementation Report"
          description="Focused on the impact of COVID-19 on higher education and the implementation of digital learning."
        />
        <ReportCard
          year="2018"
          title="Bologna Process Implementation Report"
          description="Highlighted progress in quality assurance and the recognition of qualifications."
        />
        <ReportCard
          year="2015"
          title="Bologna Process Implementation Report"
          description="Focused on the social dimension of higher education and student mobility."
        />
      </div>

      <h4 className="text-xl font-bold mb-4">European Implementation Reports</h4>
      <p className="mb-4">
        In addition to national reports, the Bologna Follow-Up Group (BFUG) produces European implementation reports
        that provide a comprehensive overview of the implementation of Bologna Process reforms across all participating
        countries.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportCard
          year="2020"
          title="European Higher Education Area: Bologna Process Implementation Report"
          description="Comprehensive analysis of the implementation of Bologna Process reforms across all EHEA countries."
        />
        <ReportCard
          year="2018"
          title="European Higher Education Area: Bologna Process Implementation Report"
          description="Focused on the progress made in implementing key Bologna Process commitments."
        />
      </div>
    </div>
  )
}

function ReportCard({ year, title, description }: { year: string; title: string; description: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{year}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
        <div className="mt-4">
          <Link href="#" className="text-blue-600 hover:underline">
            Download Report
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
