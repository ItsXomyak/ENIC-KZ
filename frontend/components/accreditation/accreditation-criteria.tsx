import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AccreditationCriteria() {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Accreditation Criteria</h3>
      <p className="mb-6">
        Our accreditation process evaluates educational institutions based on the following criteria:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CriteriaCard
          title="Educational Mission and Goals"
          description="The institution has clearly defined mission and goals that guide its operations and decision-making."
          weight="15%"
        />
        <CriteriaCard
          title="Curriculum and Instruction"
          description="The institution offers high-quality educational programs that meet recognized academic standards."
          weight="25%"
        />
        <CriteriaCard
          title="Faculty Qualifications"
          description="The institution employs qualified faculty members who are committed to teaching and scholarship."
          weight="20%"
        />
        <CriteriaCard
          title="Student Support Services"
          description="The institution provides adequate support services to help students achieve their educational goals."
          weight="15%"
        />
        <CriteriaCard
          title="Facilities and Resources"
          description="The institution has adequate facilities, equipment, and resources to support its educational programs."
          weight="15%"
        />
        <CriteriaCard
          title="Governance and Administration"
          description="The institution has effective governance and administrative structures to fulfill its mission."
          weight="10%"
        />
      </div>
    </div>
  )
}

function CriteriaCard({ title, description, weight }: { title: string; description: string; weight: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge>{weight}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}
