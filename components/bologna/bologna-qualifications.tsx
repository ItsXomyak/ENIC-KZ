import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function BolognaQualifications() {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">Qualifications Framework</h3>
      <p className="mb-6">
        The Qualifications Framework of the European Higher Education Area (QF-EHEA) provides a mechanism to relate
        national qualifications frameworks to a common European framework. This helps to improve the transparency,
        comparability, and recognition of qualifications across different countries.
      </p>

      <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
        <Image
          src="/placeholder.svg?height=400&width=800"
          alt="Qualifications Framework"
          fill
          className="object-contain"
        />
      </div>

      <h4 className="text-xl font-bold mb-4">Cycle Descriptors</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <QualificationCard
          cycle="First Cycle (Bachelor's)"
          ects="180-240 ECTS"
          description="Typically includes 180-240 ECTS credits and leads to a Bachelor's degree. Provides a solid foundation in a field of study and prepares students for the labor market or further studies."
        />
        <QualificationCard
          cycle="Second Cycle (Master's)"
          ects="90-120 ECTS"
          description="Typically includes 90-120 ECTS credits and leads to a Master's degree. Provides advanced knowledge and skills in a specialized field and may include research components."
        />
        <QualificationCard
          cycle="Third Cycle (Doctorate)"
          ects="Not specified"
          description="Leads to a doctoral degree (PhD). Focuses on original research and contribution to knowledge in a specific field. Duration varies but is typically 3-4 years of full-time study."
        />
      </div>

      <h4 className="text-xl font-bold mb-4">Learning Outcomes</h4>
      <p className="mb-4">
        Each cycle is described in terms of learning outcomes, which are statements of what a student is expected to
        know, understand, and be able to do after completing a period of learning. Learning outcomes are described in
        terms of:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <OutcomeCard
          title="Knowledge and Understanding"
          description="The ability to demonstrate knowledge and understanding in a field of study"
        />
        <OutcomeCard
          title="Application of Knowledge"
          description="The ability to apply knowledge and understanding in professional contexts"
        />
        <OutcomeCard
          title="Making Judgments"
          description="The ability to gather and interpret relevant data to inform judgments"
        />
        <OutcomeCard
          title="Communication"
          description="The ability to communicate information, ideas, problems, and solutions"
        />
        <OutcomeCard
          title="Learning Skills"
          description="The learning skills necessary to continue further study with autonomy"
        />
      </div>

      <h4 className="text-xl font-bold mb-4">National Qualifications Frameworks</h4>
      <p className="mb-4">
        Each country in the EHEA has developed or is developing a National Qualifications Framework (NQF) that is
        compatible with the QF-EHEA. These frameworks help to:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-8">
        <li>Improve the transparency of qualifications</li>
        <li>Support lifelong learning</li>
        <li>Facilitate the recognition of qualifications</li>
        <li>Promote mobility of students and workers</li>
      </ul>

      <div className="bg-gray-50 p-6 rounded-xl">
        <h4 className="text-xl font-bold mb-4">European Qualifications Framework (EQF)</h4>
        <p>
          The European Qualifications Framework for Lifelong Learning (EQF) is a related framework that covers all
          levels of education, not just higher education. The QF-EHEA is compatible with the EQF, with the first,
          second, and third cycles corresponding to EQF levels 6, 7, and 8 respectively.
        </p>
      </div>
    </div>
  )
}

function QualificationCard({ cycle, ects, description }: { cycle: string; ects: string; description: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{cycle}</CardTitle>
        <CardDescription>{ects}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}

function OutcomeCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="flex flex-col items-center text-center p-4">
      <h4 className="font-bold mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </Card>
  )
}
