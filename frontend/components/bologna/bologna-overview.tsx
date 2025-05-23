import Image from "next/image"

export default function BolognaOverview() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">What is the Bologna Process?</h3>
          <p className="mb-4">
            The Bologna Process, initiated in 1999, aims to create a European Higher Education Area (EHEA) by making
            academic degree standards and quality assurance standards more comparable and compatible throughout Europe.
          </p>
          <p>
            Named after the University of Bologna, where the initiative was launched, the process has transformed
            European higher education, introducing a three-cycle system (bachelor's, master's, doctorate), quality
            assurance standards, and tools for recognition such as the European Credit Transfer and Accumulation System
            (ECTS).
          </p>
        </div>
        <div className="relative h-[300px] rounded-xl overflow-hidden">
          <Image src="/placeholder.svg?height=300&width=500" alt="Bologna Process" fill className="object-cover" />
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-4">Key Objectives</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ObjectiveCard
          title="Comparable Degrees"
          description="Adoption of a system of easily readable and comparable degrees"
          icon="/placeholder.svg?height=60&width=60"
        />
        <ObjectiveCard
          title="Three-Cycle System"
          description="Implementation of a three-cycle system (Bachelor, Master, Doctorate)"
          icon="/placeholder.svg?height=60&width=60"
        />
        <ObjectiveCard
          title="Credit System"
          description="Establishment of a credit system (ECTS) for promoting student mobility"
          icon="/placeholder.svg?height=60&width=60"
        />
        <ObjectiveCard
          title="Quality Assurance"
          description="Promotion of European cooperation in quality assurance"
          icon="/placeholder.svg?height=60&width=60"
        />
        <ObjectiveCard
          title="Mobility"
          description="Promotion of mobility for students, teachers, researchers, and administrative staff"
          icon="/placeholder.svg?height=60&width=60"
        />
        <ObjectiveCard
          title="Lifelong Learning"
          description="Promotion of lifelong learning as an essential element of the EHEA"
          icon="/placeholder.svg?height=60&width=60"
        />
      </div>

      <h3 className="text-2xl font-bold mb-4">Timeline of the Bologna Process</h3>
      <div className="relative border-l-2 border-blue-600 pl-6 space-y-6 mb-8">
        <TimelineItem
          year="1999"
          title="Bologna Declaration"
          description="29 European countries signed the Bologna Declaration, launching the Bologna Process."
        />
        <TimelineItem
          year="2001"
          title="Prague Communiqué"
          description="Ministers added three more action lines: lifelong learning, involvement of students, and enhancing the attractiveness of the EHEA."
        />
        <TimelineItem
          year="2003"
          title="Berlin Communiqué"
          description="Doctoral studies were included as the third cycle, and the importance of quality assurance was emphasized."
        />
        <TimelineItem
          year="2005"
          title="Bergen Communiqué"
          description="Ministers adopted the Standards and Guidelines for Quality Assurance and the Framework of Qualifications for the EHEA."
        />
        <TimelineItem
          year="2007-2009"
          title="London and Leuven Communiqués"
          description="Focus on employability, student-centered learning, and the social dimension of higher education."
        />
        <TimelineItem
          year="2010"
          title="Budapest-Vienna Declaration"
          description="Official launch of the European Higher Education Area (EHEA)."
        />
        <TimelineItem
          year="2015-2020"
          title="Yerevan and Paris Communiqués"
          description="Emphasis on implementation of key commitments: three-cycle system, recognition, and quality assurance."
        />
        <TimelineItem
          year="2020-Present"
          title="Rome Communiqué"
          description="Focus on digitalization, inclusion, innovation, and interconnection in higher education."
        />
      </div>
    </div>
  )
}

function ObjectiveCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="flex flex-col items-center text-center p-4 border rounded-md">
      <div className="mb-4">
        <Image src={icon || "/placeholder.svg"} alt={title} width={60} height={60} />
      </div>
      <h4 className="font-bold mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

function TimelineItem({ year, title, description }: { year: string; title: string; description: string }) {
  return (
    <div className="relative">
      <div className="absolute -left-10 w-4 h-4 rounded-full bg-blue-600"></div>
      <div>
        <span className="text-sm font-bold text-blue-600">{year}</span>
        <h4 className="font-bold mb-1">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}
