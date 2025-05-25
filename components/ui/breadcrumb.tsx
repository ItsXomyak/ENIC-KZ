'use client'

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { useTranslation } from "@/components/translation-provider"

interface BreadcrumbProps {
  items?: {
    label: string
    href: string
  }[]
}

export function Breadcrumb({ items = [] }: BreadcrumbProps) {
  const t = useTranslation()
  
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500">
      <Link
        href="/"
        className="flex items-center hover:text-gray-700 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link
            href={item.href}
            className={`hover:text-gray-700 transition-colors ${
              index === items.length - 1 ? "text-gray-900 font-medium" : ""
            }`}
          >
            {t(item.label)}
          </Link>
        </div>
      ))}
    </nav>
  )
}
