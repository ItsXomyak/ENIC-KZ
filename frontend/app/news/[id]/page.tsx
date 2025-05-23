import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home, Calendar, Tag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { getNewsArticle, getNewsArticles } from "@/lib/news"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getNewsArticle(params.id)

  if (!article) {
    return {
      title: "Article Not Found | Education Center",
    }
  }

  return {
    title: `${article.title.en} | Education Center News`,
    description: article.content.en.substring(0, 160),
  }
}

export async function generateStaticParams() {
  const articles = await getNewsArticles()

  return articles.map((article) => ({
    id: article.id,
  }))
}

export default async function NewsArticlePage({ params }: Props) {
  const { id } = params
  const article = await getNewsArticle(id)

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Article not found</h1>
        <Button asChild>
          <Link href="/news">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
          </Link>
        </Button>
      </div>
    )
  }

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
            <BreadcrumbLink href="/news">News</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/news/${id}`}>Article</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Button asChild variant="outline" className="mb-6">
        <Link href="/news">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
        </Link>
      </Button>

      <article className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title.en}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {new Date(article.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center">
              <Tag className="mr-2 h-4 w-4" />
              {article.category.en}
            </div>
          </div>
        </div>

        <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
          <Image
            src={article.image || "/placeholder.svg?height=400&width=800"}
            alt={article.title.en}
            fill
            className="object-cover"
          />
        </div>

        <div
          className="prose prose-blue max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: article.content.en }}
        />
      </article>
    </div>
  )
}
