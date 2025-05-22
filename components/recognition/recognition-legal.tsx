import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RecognitionLegal() {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Legal Framework for Recognition</h3>
      <p className="mb-6">
        The recognition process is based on the following legal documents and international agreements:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LegalDocumentCard
          title="National Law on Education"
          description="Establishes the legal framework for recognition of foreign education documents."
          date="Last updated: January 2023"
        />
        <LegalDocumentCard
          title="Lisbon Recognition Convention"
          description="International agreement on the recognition of qualifications in the European region."
          date="Ratified: 1999"
        />
        <LegalDocumentCard
          title="Bilateral Agreements"
          description="Specific agreements with individual countries on mutual recognition of qualifications."
          date="Various dates"
        />
        <LegalDocumentCard
          title="Recognition Procedures"
          description="Detailed procedures for the evaluation and recognition of foreign qualifications."
          date="Last updated: March 2024"
        />
      </div>
    </div>
  )
}

function LegalDocumentCard({ title, description, date }: { title: string; description: string; date: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{date}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}
