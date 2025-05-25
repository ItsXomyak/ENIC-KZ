'use client'

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useTranslation } from "@/components/translation-provider"

interface BreadcrumbProps {
  items?: {
    label: string
    href: string
    active?: boolean
  }[]
}

export function BreadcrumbList({ children }: { children: React.ReactNode }) {
  return (
    <nav>
      <ol className="flex items-center space-x-2">{children}</ol>
    </nav>
  )
}

export function BreadcrumbItem({ children }: { children: React.ReactNode }) {
  return <li className="flex items-center">{children}</li>
}

export function BreadcrumbLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-medium text-muted-foreground hover:text-foreground">
      {children}
    </Link>
  )
}

export function BreadcrumbSeparator() {
  return <ChevronRight className="h-4 w-4" />
}

export function Breadcrumb({ items = [] }: BreadcrumbProps) {
  const { language } = useTranslation()
  
  return (
    <BreadcrumbList>
      {items.map((item, index) => (
        <BreadcrumbItem key={item.href}>
          <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
          {index < items.length - 1 && <BreadcrumbSeparator />}
        </BreadcrumbItem>
      ))}
    </BreadcrumbList>
  )
}
