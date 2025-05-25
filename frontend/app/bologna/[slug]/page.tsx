import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { getBolognaArticle, getBolognaArticles } from "@/lib/bologna"

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getBolognaArticle(params.slug)

  if (!article) {
    return {
      title: "Article Not Found | Education Center",
    }
  }

  return {
    title: `${article.title.en} | Bologna Process | Education Center`,
    description: article.content.en.substring(0, 160).replace(/<[^>]*>/g, ""),
  }
}

export async function generateStaticParams() {
  const articles = await getBolognaArticles()

  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export default async function BolognaArticlePage({ params }: Props) {
  const { slug } = params
  const article = await getBolognaArticle(slug)

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Article not found</h1>
        <Button asChild>
          <Link href="/bologna">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bologna Process
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
            <BreadcrumbLink href="/bologna">Bologna Process</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/bologna/${slug}`}>{article.title.en}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Button asChild variant="outline" className="mb-6">
        <Link href="/bologna">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bologna Process
        </Link>
      </Button>

      <article className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title.en}</h1>
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
