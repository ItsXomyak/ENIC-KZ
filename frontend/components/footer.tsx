import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image src="/placeholder.svg?height=40&width=40" alt="Logo" width={40} height={40} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Education Center</h3>
                <p className="text-xs text-gray-500">National Center for Recognition and Accreditation</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Official center for recognition and accreditation of foreign education documents.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/recognition" className="text-sm hover:underline">
                  Recognition
                </Link>
              </li>
              <li>
                <Link href="/accreditation" className="text-sm hover:underline">
                  Accreditation
                </Link>
              </li>
              <li>
                <Link href="/bologna" className="text-sm hover:underline">
                  Bologna Process
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-sm hover:underline">
                  News
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:underline">
                  About the Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm hover:underline">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/legislation" className="text-sm hover:underline">
                  Legislation
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <address className="not-italic text-sm text-gray-600 space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                <p>
                  123 Education Street
                  <br />
                  Astana, Kazakhstan
                  <br />
                  010000
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600" />
                <a href="tel:+77123456789" className="hover:underline">
                  +7 (712) 345-6789
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <a href="mailto:info@education-center.kz" className="hover:underline">
                  info@education-center.kz
                </a>
              </div>
            </address>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} National Center for Recognition and Accreditation. All rights reserved.
          </p>
          <div className="flex items-center mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <Image
                src="/placeholder.svg?height=30&width=30"
                alt="Bologna Process"
                width={30}
                height={30}
                className="object-contain"
              />
              <span className="text-sm text-gray-500">Member of the Bologna Process</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
