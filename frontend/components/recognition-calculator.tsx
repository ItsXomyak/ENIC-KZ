"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Clock, DollarSign } from "lucide-react"

export default function RecognitionCalculator() {
  const [documentType, setDocumentType] = useState("")
  const [country, setCountry] = useState("")
  const [urgency, setUrgency] = useState("standard")
  const [cost, setCost] = useState(0)
  const [processingTime, setProcessingTime] = useState("")

  // Mock calculation logic
  useEffect(() => {
    if (!documentType || !country) {
      setCost(0)
      setProcessingTime("")
      return
    }

    let baseCost = 0
    let baseTime = 0

    // Base cost by document type
    switch (documentType) {
      case "diploma":
        baseCost = 150
        baseTime = 30
        break
      case "degree":
        baseCost = 200
        baseTime = 30
        break
      case "transcript":
        baseCost = 100
        baseTime = 20
        break
      default:
        baseCost = 150
        baseTime = 30
    }

    // Adjust by country
    switch (country) {
      case "eu":
        baseCost *= 1
        baseTime *= 1
        break
      case "us":
        baseCost *= 1.2
        baseTime *= 1.1
        break
      case "asia":
        baseCost *= 1.3
        baseTime *= 1.2
        break
      case "other":
        baseCost *= 1.5
        baseTime *= 1.3
        break
      default:
        baseCost *= 1
        baseTime *= 1
    }

    // Adjust by urgency
    if (urgency === "express") {
      baseCost *= 1.5
      baseTime *= 0.5
    } else if (urgency === "urgent") {
      baseCost *= 2
      baseTime *= 0.3
    }

    setCost(Math.round(baseCost))
    setProcessingTime(`${Math.round(baseTime)} days`)
  }, [documentType, country, urgency])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Cost Calculator</CardTitle>
          <CardDescription>Estimate the cost and processing time for your recognition application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="documentType">Document Type</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger id="documentType">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diploma">Diploma</SelectItem>
                <SelectItem value="degree">Degree Certificate</SelectItem>
                <SelectItem value="transcript">Transcript</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Issuing Country/Region</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country/region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eu">European Union</SelectItem>
                <SelectItem value="us">United States & Canada</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
                <SelectItem value="other">Other Countries</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Processing Speed</Label>
            <RadioGroup value={urgency} onValueChange={setUrgency}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard">Standard (4-6 weeks)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="express" id="express" />
                <Label htmlFor="express">Express (2-3 weeks)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urgent" id="urgent" />
                <Label htmlFor="urgent">Urgent (1-2 weeks)</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estimated Results</CardTitle>
          <CardDescription>Based on your selections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <div className="flex justify-center mb-2">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{cost > 0 ? `$${cost}` : "Please select options"}</h3>
            <p className="text-sm text-muted-foreground">Estimated Cost</p>
          </div>

          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <div className="flex justify-center mb-2">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{processingTime || "Please select options"}</h3>
            <p className="text-sm text-muted-foreground">Processing Time</p>
          </div>

          <Separator />

          <div className="text-sm text-muted-foreground">
            <p className="mb-2">This is an estimate only. Actual costs and processing times may vary based on:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Complexity of the document</li>
              <li>Need for additional verification</li>
              <li>Completeness of the application</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Start Application</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
