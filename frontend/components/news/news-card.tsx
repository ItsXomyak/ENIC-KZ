import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function NewsCard({
  id,
  title,
  date,
  excerpt,
  category,
}: {
  id: string
  title: string
  date: string
  excerpt: string
  category: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">{date}</span>
          <Badge>{category}</Badge>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{excerpt}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" className="p-0 h-auto" asChild>
          <Link href={`/news/${id}`} className="flex items-center gap-2">
            Read More <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
