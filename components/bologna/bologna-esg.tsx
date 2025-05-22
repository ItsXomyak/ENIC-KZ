import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"

export default function BolognaESG() {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">European Standards and Guidelines (ESG)</h3>
      <p className="mb-6">
        The Standards and Guidelines for Quality Assurance in the European Higher Education Area (ESG) provide a
        framework for quality assurance in European higher education. They were first adopted in 2005 and revised in
        2015.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
        <div>
          <h4 className="text-xl font-bold mb-4">Purpose of the ESG</h4>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Set a common framework for quality assurance systems for learning and teaching at European, national, and
              institutional levels
            </li>
            <li>Enable the assurance and improvement of quality of higher education in the EHEA</li>
            <li>Support mutual trust, facilitating recognition and mobility within and across national borders</li>
            <li>Provide information on quality assurance in the EHEA</li>
          </ul>
        </div>
        <div className="relative h-[250px] rounded-xl overflow-hidden">
          <Image src="/placeholder.svg?height=250&width=400" alt="ESG Framework" fill className="object-cover" />
        </div>
      </div>

      <h4 className="text-xl font-bold mb-4">ESG Structure</h4>
      <Accordion type="single" collapsible className="mb-8">
        <AccordionItem value="part1">
          <AccordionTrigger>Part 1: Internal Quality Assurance</AccordionTrigger>
          <AccordionContent>
            <p className="mb-4">Standards for internal quality assurance within higher education institutions:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Policy for quality assurance</li>
              <li>Design and approval of programs</li>
              <li>Student-centered learning, teaching, and assessment</li>
              <li>Student admission, progression, recognition, and certification</li>
              <li>Teaching staff</li>
              <li>Learning resources and student support</li>
              <li>Information management</li>
              <li>Public information</li>
              <li>Ongoing monitoring and periodic review of programs</li>
              <li>Cyclical external quality assurance</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="part2">
          <AccordionTrigger>Part 2: External Quality Assurance</AccordionTrigger>
          <AccordionContent>
            <p className="mb-4">Standards for external quality assurance:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Consideration of internal quality assurance</li>
              <li>Designing methodologies fit for purpose</li>
              <li>Implementing processes</li>
              <li>Peer-review experts</li>
              <li>Criteria for outcomes</li>
              <li>Reporting</li>
              <li>Complaints and appeals</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="part3">
          <AccordionTrigger>Part 3: Quality Assurance Agencies</AccordionTrigger>
          <AccordionContent>
            <p className="mb-4">Standards for quality assurance agencies:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Activities, policy, and processes for quality assurance</li>
              <li>Official status</li>
              <li>Independence</li>
              <li>Thematic analysis</li>
              <li>Resources</li>
              <li>Internal quality assurance and professional conduct</li>
              <li>Cyclical external review of agencies</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="bg-gray-50 p-6 rounded-xl">
        <h4 className="text-xl font-bold mb-4">Implementation of ESG</h4>
        <p className="mb-4">
          The implementation of the ESG varies across countries and institutions, but all EHEA members are committed to
          applying these standards and guidelines. Quality assurance agencies in the EHEA are expected to comply with
          the ESG and can apply for inclusion in the European Quality Assurance Register (EQAR).
        </p>
        <p>
          Our center actively promotes the implementation of the ESG in higher education institutions and provides
          guidance and support for quality assurance activities.
        </p>
      </div>
    </div>
  )
}
