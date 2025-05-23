import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function RecognitionTypes() {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Types of Recognition</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecognitionTypeCard
          title="Academic Recognition"
          description="Recognition for continuing education at universities and other educational institutions."
          icon="/placeholder.svg?height=80&width=80"
        />
        <RecognitionTypeCard
          title="Professional Recognition"
          description="Recognition for employment purposes and professional licensing."
          icon="/placeholder.svg?height=80&width=80"
        />
        <RecognitionTypeCard
          title="Qualification Recognition"
          description="Recognition of specific qualifications, degrees, and diplomas."
          icon="/placeholder.svg?height=80&width=80"
        />
        <RecognitionTypeCard
          title="Partial Studies Recognition"
          description="Recognition of credits and periods of study completed abroad."
          icon="/placeholder.svg?height=80&width=80"
        />
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
