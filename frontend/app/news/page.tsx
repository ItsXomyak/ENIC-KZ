import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home, Search, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import NewsCard from "@/components/news/news-card"
import FeaturedNewsCard from "@/components/news/featured-news-card"

export default function NewsPage() {
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
            <BreadcrumbLink href="/news">News and Announcements</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">News and Announcements</h1>
        <p className="text-lg text-gray-600">
          Stay updated with the latest news, events, and announcements from our center.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-3/4">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search news..." className="pl-8" />
              </div>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="announcements">Announcements</SelectItem>
                  <SelectItem value="agreements">Agreements</SelectItem>
                  <SelectItem value="reports">Reports</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="2025">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-8">
            <FeaturedNewsCard
              id="1"
              title="New Recognition Agreement with EU Countries"
              date="May 15, 2025"
              excerpt="The Center has signed a new agreement with EU countries to streamline the recognition process for educational documents. This agreement will facilitate the mobility of students and professionals between our country and EU member states."
              category="Agreements"
              image="/placeholder.svg?height=300&width=600"
            />
            <NewsCard
              id="2"
              title="Upcoming Webinar on Accreditation Standards"
              date="May 10, 2025"
              excerpt="Join our experts for a comprehensive overview of the latest accreditation standards and procedures. The webinar will cover key aspects of institutional and program accreditation, quality assurance mechanisms, and best practices."
              category="Events"
            />
            <NewsCard
              id="3"
              title="Annual Report on Educational Quality"
              date="May 5, 2025"
              excerpt="The Center has published its annual report on educational quality and accreditation outcomes. The report provides a detailed analysis of the quality of higher education in our country, highlighting achievements and areas for improvement."
              category="Reports"
            />
            <NewsCard
              id="4"
              title="New Online Application System Launched"
              date="April 28, 2025"
              excerpt="We are pleased to announce the launch of our new online application system for recognition of foreign education documents. The system features a user-friendly interface, streamlined application process, and faster processing times."
              category="Announcements"
            />
            <NewsCard
              id="5"
              title="International Conference on Quality Assurance"
              date="April 20, 2025"
              excerpt="The Center will host an international conference on quality assurance in higher education on June 15-16, 2025. The conference will bring together experts from around the world to discuss current trends and challenges in quality assurance."
              category="Events"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">Showing 5 of 24 news items</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>

        <div className="md:w-1/4">
          <div className="border rounded-md p-4 mb-6">
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Link href="#" className="hover:underline">
                  Events
                </Link>
                <Badge variant="outline">8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <Link href="#" className="hover:underline">
                  Announcements
                </Link>
                <Badge variant="outline">6</Badge>
              </div>
              <div className="flex justify-between items-center">
                <Link href="#" className="hover:underline">
                  Agreements
                </Link>
                <Badge variant="outline">5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <Link href="#" className="hover:underline">
                  Reports
                </Link>
                <Badge variant="outline">3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <Link href="#" className="hover:underline">
                  Publications
                </Link>
                <Badge variant="outline">2</Badge>
              </div>
            </div>
          </div>

          <div className="border rounded-md p-4 mb-6">
            <h3 className="text-lg font-bold mb-4">Archive</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Link href="#" className="hover:underline flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> 2025
                </Link>
                <Badge variant="outline">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <Link href="#" className="hover:underline flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> 2024
                </Link>
                <Badge variant="outline">24</Badge>
              </div>
              <div className="flex justify-between items-center">
                <Link href="#" className="hover:underline flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> 2023
                </Link>
                <Badge variant="outline">18</Badge>
              </div>
              <div className="flex justify-between items-center">
                <Link href="#" className="hover:underline flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> 2022
                </Link>
                <Badge variant="outline">15</Badge>
              </div>
            </div>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="text-lg font-bold mb-4">Subscribe to Updates</h3>
            <p className="text-sm text-gray-600 mb-4">
              Stay updated with our latest news and announcements by subscribing to our newsletter.
            </p>
            <div className="space-y-2">
              <Input placeholder="Your email address" />
              <Button className="w-full">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
