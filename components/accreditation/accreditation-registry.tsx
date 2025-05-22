import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export default function AccreditationRegistry() {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Registry of Accredited Organizations</h3>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search organizations..." className="pl-8" />
          </div>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="university">University</SelectItem>
              <SelectItem value="college">College</SelectItem>
              <SelectItem value="school">School</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Accreditation Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">National University</TableCell>
              <TableCell>University</TableCell>
              <TableCell>Jan 15, 2023</TableCell>
              <TableCell>Jan 15, 2028</TableCell>
              <TableCell>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Technical College</TableCell>
              <TableCell>College</TableCell>
              <TableCell>Mar 10, 2022</TableCell>
              <TableCell>Mar 10, 2027</TableCell>
              <TableCell>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">International School</TableCell>
              <TableCell>School</TableCell>
              <TableCell>Sep 5, 2024</TableCell>
              <TableCell>Sep 5, 2029</TableCell>
              <TableCell>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Medical University</TableCell>
              <TableCell>University</TableCell>
              <TableCell>Jun 20, 2021</TableCell>
              <TableCell>Jun 20, 2026</TableCell>
              <TableCell>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Arts Academy</TableCell>
              <TableCell>College</TableCell>
              <TableCell>Nov 12, 2024</TableCell>
              <TableCell>Pending</TableCell>
              <TableCell>
                <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">Showing 5 of 120 organizations</div>
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
  )
}
