'use client'

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useTranslation } from "@/components/translation-provider"

function NewsCard({
  image,
  title,
  description,
  date,
  link,
}: {
  image: string
  title: string
  description: string
  date: string
  link: string
}) {
  const t = useTranslation()
  
  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md">
      <div className="relative h-48">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-t-lg"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{date}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
      <CardFooter className="mt-auto pt-0">
        <Button asChild variant="ghost" className="gap-2 p-0 h-auto">
          <Link href={link}>
            {t("read_more")} <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function NewsSection() {
  const t = useTranslation()
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t("latest_news")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t("news_description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <NewsCard
            image="/images/news-1.jpg"
            title={t("new_recognition_agreements")}
            description={t("recognition_agreements_description")}
            date="2024-03-15"
            link="/news/1"
          />
          <NewsCard
            image="/images/news-2.jpg"
            title={t("accreditation_updates")}
            description={t("accreditation_updates_description")}
            date="2024-03-10"
            link="/news/2"
          />
          <NewsCard
            image="/images/news-3.jpg"
            title={t("bologna_process_developments")}
            description={t("bologna_process_developments_description")}
            date="2024-03-05"
            link="/news/3"
          />
        </div>
      </div>
    </section>
  )
} 