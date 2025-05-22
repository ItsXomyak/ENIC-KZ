"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Upload } from "lucide-react"

export default function RecognitionForm() {
  const [step, setStep] = useState(1)
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("submitting")

    // Simulate form submission
    setTimeout(() => {
      setFormStatus("success")
    }, 1500)
  }

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  if (formStatus === "success") {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Your application has been submitted successfully. Your reference number is REF-2025-12345. You will receive a
          confirmation email shortly.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold">Recognition Application</h3>
            <div className="text-sm text-muted-foreground">Step {step} of 3</div>
          </div>
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-medium mb-4">Personal Information</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter your first name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter your last name" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter your phone number" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Select>
                  <SelectTrigger id="nationality">
                    <SelectValue placeholder="Select your nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Enter your address" rows={3} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-medium mb-4">Document Information</h4>

              <div className="space-y-2">
                <Label htmlFor="documentType">Document Type</Label>
                <Select>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issuingCountry">Issuing Country</Label>
                  <Select>
                    <SelectTrigger id="issuingCountry">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issuingInstitution">Issuing Institution</Label>
                  <Input id="issuingInstitution" placeholder="Enter institution name" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yearOfIssue">Year of Issue</Label>
                  <Input id="yearOfIssue" type="number" placeholder="YYYY" min="1900" max="2025" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fieldOfStudy">Field of Study</Label>
                  <Input id="fieldOfStudy" placeholder="Enter field of study" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Recognition Purpose</Label>
                <RadioGroup defaultValue="academic">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="academic" id="academic" />
                    <Label htmlFor="academic">Academic (for further studies)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="professional" id="professional" />
                    <Label htmlFor="professional">Professional (for employment)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other-purpose" />
                    <Label htmlFor="other-purpose">Other</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-medium mb-4">Document Upload</h4>

              <div className="space-y-2">
                <Label>Required Documents</Label>
                <ul className="list-disc pl-5 text-sm text-muted-foreground mb-4">
                  <li>Original education document (PDF or JPG)</li>
                  <li>Certified translation (if not in official language)</li>
                  <li>Passport or ID copy</li>
                  <li>Additional supporting documents (if applicable)</li>
                </ul>

                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Supported formats: PDF, JPG, PNG (max 10MB per file)
                  </p>
                  <Input
                    type="file"
                    id="fileUpload"
                    className="hidden"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("fileUpload")?.click()}
                  >
                    Browse Files
                  </Button>
                </div>

                {files.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium mb-2">Uploaded Files:</h5>
                    <ul className="space-y-2">
                      {files.map((file, index) => (
                        <li key={index} className="flex items-center justify-between text-sm p-2 bg-muted rounded-md">
                          <span>
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I confirm that all information provided is accurate
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      By submitting this application, I agree to the terms and conditions and privacy policy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={formStatus === "submitting"}>
                {formStatus === "submitting" ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
