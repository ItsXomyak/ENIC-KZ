// components/footer.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Логотип и описание */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image
                  src="/logo.svg?height=40&width=40"
                  alt="Logo"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <h3 className="text-lg font-bold">{t("education_center")}</h3>
                <p className="text-xs text-gray-500">
                  {t("center_subtitle")}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">{t("footer_description")}</p>
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

          {/* Быстрые ссылки */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t("quick_links")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:underline">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link href="/recognition" className="text-sm hover:underline">
                  {t("recognition")}
                </Link>
              </li>
              <li>
                <Link href="/accreditation" className="text-sm hover:underline">
                  {t("accreditation")}
                </Link>
              </li>
              <li>
                <Link href="/bologna" className="text-sm hover:underline">
                  {t("bologna_process")}
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-sm hover:underline">
                  {t("news")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:underline">
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Информация */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t("information")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:underline">
                  {t("about_center")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm hover:underline">
                  {t("faq")}
                </Link>
              </li>
              <li>
                <Link href="/legislation" className="text-sm hover:underline">
                  {t("legislation")}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm hover:underline">
                  {t("privacy_policy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t("contact_us")}</h3>
            <address className="not-italic text-sm text-gray-600 space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                <p>
                  {t("footer_address_line1")}
                  <br />
                  {t("footer_address_line2")}
                  <br />
                  {t("footer_address_line3")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600" />
                <a href="tel:+77123456789" className="hover:underline">
                  {t("footer_phone")}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <a href="mailto:info@education-center.kz" className="hover:underline">
                  {t("footer_email")}
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} {t("education_center")}. {t("all_rights_reserved")}
          </p>
          <div className="flex items-center mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <Image
                src="/bologna.svg?height=30&width=30"
                alt="Bologna Process"
                width={30}
                height={30}
                className="object-contain"
              />
              <span className="text-sm text-gray-500">{t("member_bologna")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
