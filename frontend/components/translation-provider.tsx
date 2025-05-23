"use client"

import { useLanguage } from "@/components/language-provider"

export function useTranslation() {
  const { t } = useLanguage()
  return t
}
