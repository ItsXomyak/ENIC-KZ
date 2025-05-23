export default function AccreditationProcess() {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Accreditation Process</h3>
      <p className="mb-6">The accreditation process consists of the following steps:</p>
      <div className="space-y-6">
        <ProcessStepCard
          number={1}
          title="Application Submission"
          description="The institution submits an application for accreditation along with required documentation."
        />
        <ProcessStepCard
          number={2}
          title="Self-Evaluation"
          description="The institution conducts a comprehensive self-evaluation based on the accreditation criteria."
        />
        <ProcessStepCard
          number={3}
          title="Document Review"
          description="Our experts review the self-evaluation report and supporting documentation."
        />
        <ProcessStepCard
          number={4}
          title="On-Site Visit"
          description="A team of evaluators visits the institution to verify the information provided and assess compliance with standards."
        />
        <ProcessStepCard
          number={5}
          title="Evaluation Report"
          description="The evaluation team prepares a detailed report with findings and recommendations."
        />
        <ProcessStepCard
          number={6}
          title="Accreditation Decision"
          description="The accreditation commission reviews the evaluation report and makes a decision on accreditation status."
        />
      </div>
    </div>
  )
}

function ProcessStepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
        {number}
      </div>
      <div className="border p-4 rounded-md flex-1">
        <h4 className="font-bold mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}
