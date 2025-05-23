import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function FeaturedNewsCard({
  id,
  title,
  date,
  excerpt,
  category,
  image,
}: {
  id: string
  title: string
  date: string
  excerpt: string
  category: string
  image: string
}) {
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative h-[200px] md:h-auto">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">{date}</span>
            <Badge>{category}</Badge>
          </div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{excerpt}</p>
          <Button variant="ghost" className="p-0 h-auto" asChild>
            <Link href={`/news/${id}`} className="flex items-center gap-2">
              Read More <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
