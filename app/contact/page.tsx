import type React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home, Mail, Phone, MapPin, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ContactForm from "@/components/contact/contact-form"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ContactCardProps {
  icon: React.ReactNode
  title: string
  description: string
  contact: string
  link?: string
}

const ContactCard: React.FC<ContactCardProps> = ({ icon, title, description, contact, link }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{description}</p>
        {link ? (
          <a href={link} className="text-blue-500 hover:underline">
            {contact}
          </a>
        ) : (
          <p>{contact}</p>
        )}
      </CardContent>
    </Card>
  )
}

export default function ContactPage() {
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
            <BreadcrumbLink href="/contact">Contact and Support</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact and Support</h1>
        <p className="text-lg text-gray-600">
          Get in touch with our team for inquiries, support, or feedback. We're here to help you with all your questions
          related to recognition, accreditation, and other services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <ContactCard
          icon={<Mail className="h-8 w-8 text-blue-600" />}
          title="Email Us"
          description="Send us an email and we'll get back to you within 24 hours."
          contact="info@education-center.org"
          link="mailto:info@education-center.org"
        />
        <ContactCard
          icon={<Phone className="h-8 w-8 text-blue-600" />}
          title="Call Us"
          description="Our support team is available Monday to Friday, 9am to 5pm."
          contact="+1 (123) 456-7890"
          link="tel:+11234567890"
        />
        <ContactCard
          icon={<Clock className="h-8 w-8 text-blue-600" />}
          title="Working Hours"
          description="Our office is open Monday to Friday, 9am to 5pm. Closed on public holidays."
          contact="9:00 AM - 5:00 PM"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
          <ContactForm />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">Visit Our Office</h2>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" /> Our Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                123 Education Street
                <br />
                Central District
                <br />
                City, Country 12345
              </p>
              <div className="aspect-video relative rounded-md overflow-hidden border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.292292615509614!3d48.85837007928757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sEiffel%20Tower!5e0!3m2!1sen!2sus!4v1621543331117!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How long does the recognition process take?</AccordionTrigger>
            <AccordionContent>
              The recognition process typically takes 4-6 weeks from the date of submission of a complete application.
              However, processing times may vary depending on the complexity of the case, the country of origin of the
              document, and the completeness of the application.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What documents are required for recognition?</AccordionTrigger>
            <AccordionContent>
              Required documents typically include the original education document, a certified translation (if not in
              the official language), a copy of your passport or ID, and a complete application form.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
