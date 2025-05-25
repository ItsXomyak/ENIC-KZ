import type { Metadata } from "next"
import { useTranslation } from "@/components/translation-provider"
import { Breadcrumb } from "@/components/ui/breadcrumb"

export const metadata: Metadata = {
  title: "Privacy Policy | Education Center",
  description: "Our privacy policy explains how we collect, use, and protect your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy", href: "/privacy-policy", active: true },
        ]}
      />

      <PrivacyPolicyContent />
    </div>
  )
}

function PrivacyPolicyContent() {
  const { t } = useTranslation()

  return (
    <div className="max-w-4xl mx-auto mt-8 prose dark:prose-invert">
      <h1 className="text-3xl font-bold mb-6">{t("privacy.title")}</h1>

      <p className="text-lg mb-6">{t("privacy.lastUpdated", { date: "May 15, 2023" })}</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("privacy.introduction.title")}</h2>
        <p>{t("privacy.introduction.description")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("privacy.dataCollection.title")}</h2>
        <p>{t("privacy.dataCollection.description")}</p>
        <ul className="list-disc pl-6 mt-4">
          <li className="mb-2">{t("privacy.dataCollection.items.personal")}</li>
          <li className="mb-2">{t("privacy.dataCollection.items.usage")}</li>
          <li className="mb-2">{t("privacy.dataCollection.items.technical")}</li>
          <li className="mb-2">{t("privacy.dataCollection.items.cookies")}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("privacy.dataUse.title")}</h2>
        <p>{t("privacy.dataUse.description")}</p>
        <ul className="list-disc pl-6 mt-4">
          <li className="mb-2">{t("privacy.dataUse.items.services")}</li>
          <li className="mb-2">{t("privacy.dataUse.items.communication")}</li>
          <li className="mb-2">{t("privacy.dataUse.items.improvement")}</li>
          <li className="mb-2">{t("privacy.dataUse.items.legal")}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("privacy.dataSharing.title")}</h2>
        <p>{t("privacy.dataSharing.description")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("privacy.dataSecurity.title")}</h2>
        <p>{t("privacy.dataSecurity.description")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("privacy.userRights.title")}</h2>
        <p>{t("privacy.userRights.description")}</p>
        <ul className="list-disc pl-6 mt-4">
          <li className="mb-2">{t("privacy.userRights.items.access")}</li>
          <li className="mb-2">{t("privacy.userRights.items.rectification")}</li>
          <li className="mb-2">{t("privacy.userRights.items.erasure")}</li>
          <li className="mb-2">{t("privacy.userRights.items.restriction")}</li>
          <li className="mb-2">{t("privacy.userRights.items.objection")}</li>
          <li className="mb-2">{t("privacy.userRights.items.portability")}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("privacy.contact.title")}</h2>
        <p>{t("privacy.contact.description")}</p>
        <p className="mt-4">
          <strong>Email:</strong> privacy@educationcenter.org
          <br />
          <strong>{t("privacy.contact.address")}:</strong> 123 Education Street, Astana, Kazakhstan
        </p>
      </section>
    </div>
  )
}
