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
import { useLanguage } from "@/components/language-provider"

export default function RecognitionForm() {
  const { t } = useLanguage()
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
      <Alert className="bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertDescription className="text-green-800 dark:text-green-300">
          {t("application_success_message") ||
            "Your application has been submitted successfully. Your reference number is REF-2025-12345. You will receive a confirmation email shortly."}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold">{t("recognition_application")}</h3>
            <div className="text-sm text-muted-foreground">
              {t("step")} {step} {t("of")} 3
            </div>
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
              <h4 className="font-medium mb-4">{t("personal_information")}</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("first_name")}</Label>
                  <Input id="firstName" placeholder={t("enter_first_name") || "Enter your first name"} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("last_name")}</Label>
                  <Input id="lastName" placeholder={t("enter_last_name") || "Enter your last name"} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input id="email" type="email" placeholder={t("enter_email") || "Enter your email"} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("phone_number")}</Label>
                  <Input id="phone" placeholder={t("enter_phone") || "Enter your phone number"} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">{t("nationality")}</Label>
                <Select>
                  <SelectTrigger id="nationality">
                    <SelectValue placeholder={t("select_nationality") || "Select your nationality"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kz">{t("kazakhstan") || "Kazakhstan"}</SelectItem>
                    <SelectItem value="us">{t("united_states") || "United States"}</SelectItem>
                    <SelectItem value="uk">{t("united_kingdom") || "United Kingdom"}</SelectItem>
                    <SelectItem value="ca">{t("canada") || "Canada"}</SelectItem>
                    <SelectItem value="au">{t("australia") || "Australia"}</SelectItem>
                    <SelectItem value="fr">{t("france") || "France"}</SelectItem>
                    <SelectItem value="de">{t("germany") || "Germany"}</SelectItem>
                    <SelectItem value="other">{t("other") || "Other"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{t("address")}</Label>
                <Textarea id="address" placeholder={t("enter_address") || "Enter your address"} rows={3} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-medium mb-4">{t("document_information") || "Document Information"}</h4>

              <div className="space-y-2">
                <Label htmlFor="documentType">{t("document_type")}</Label>
                <Select>
                  <SelectTrigger id="documentType">
                    <SelectValue placeholder={t("select_document_type") || "Select document type"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diploma">{t("diploma") || "Diploma"}</SelectItem>
                    <SelectItem value="degree">{t("degree_certificate") || "Degree Certificate"}</SelectItem>
                    <SelectItem value="transcript">{t("transcript") || "Transcript"}</SelectItem>
                    <SelectItem value="other">{t("other") || "Other"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issuingCountry">{t("issuing_country")}</Label>
                  <Select>
                    <SelectTrigger id="issuingCountry">
                      <SelectValue placeholder={t("select_country") || "Select country"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kz">{t("kazakhstan") || "Kazakhstan"}</SelectItem>
                      <SelectItem value="us">{t("united_states") || "United States"}</SelectItem>
                      <SelectItem value="uk">{t("united_kingdom") || "United Kingdom"}</SelectItem>
                      <SelectItem value="ca">{t("canada") || "Canada"}</SelectItem>
                      <SelectItem value="au">{t("australia") || "Australia"}</SelectItem>
                      <SelectItem value="fr">{t("france") || "France"}</SelectItem>
                      <SelectItem value="de">{t("germany") || "Germany"}</SelectItem>
                      <SelectItem value="other">{t("other") || "Other"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issuingInstitution">{t("issuing_institution") || "Issuing Institution"}</Label>
                  <Input
                    id="issuingInstitution"
                    placeholder={t("enter_institution") || "Enter institution name"}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yearOfIssue">{t("year_of_issue") || "Year of Issue"}</Label>
                  <Input id="yearOfIssue" type="number" placeholder="YYYY" min="1900" max="2025" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fieldOfStudy">{t("field_of_study") || "Field of Study"}</Label>
                  <Input id="fieldOfStudy" placeholder={t("enter_field") || "Enter field of study"} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("recognition_purpose") || "Recognition Purpose"}</Label>
                <RadioGroup defaultValue="academic">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="academic" id="academic" />
                    <Label htmlFor="academic">{t("academic_purpose") || "Academic (for further studies)"}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="professional" id="professional" />
                    <Label htmlFor="professional">{t("professional_purpose") || "Professional (for employment)"}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other-purpose" />
                    <Label htmlFor="other-purpose">{t("other") || "Other"}</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-medium mb-4">{t("document_upload") || "Document Upload"}</h4>

              <div className="space-y-2">
                <Label>{t("required_documents") || "Required Documents"}</Label>
                <ul className="list-disc pl-5 text-sm text-muted-foreground mb-4">
                  <li>{t("original_document") || "Original education document (PDF or JPG)"}</li>
                  <li>{t("certified_translation") || "Certified translation (if not in official language)"}</li>
                  <li>{t("id_copy") || "Passport or ID copy"}</li>
                  <li>{t("supporting_documents") || "Additional supporting documents (if applicable)"}</li>
                </ul>

                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {t("drag_drop_files") || "Drag and drop files here, or click to browse"}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {t("supported_formats") || "Supported formats: PDF, JPG, PNG (max 10MB per file)"}
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
                    {t("browse_files") || "Browse Files"}
                  </Button>
                </div>

                {files.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium mb-2">{t("uploaded_files") || "Uploaded Files"}:</h5>
                    <ul className="space-y-2">
                      {files.map((file, index) => (
                        <li key={index} className="flex items-center justify-between text-sm p-2 bg-muted rounded-md">
                          <span>
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                            {t("remove") || "Remove"}
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
                      {t("confirm_accuracy") || "I confirm that all information provided is accurate"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("terms_agreement") ||
                        "By submitting this application, I agree to the terms and conditions and privacy policy."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                {t("previous") || "Previous"}
              </Button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <Button type="button" onClick={nextStep}>
                {t("next") || "Next"}
              </Button>
            ) : (
              <Button type="submit" disabled={formStatus === "submitting"}>
                {formStatus === "submitting"
                  ? t("submitting") || "Submitting..."
                  : t("submit_application") || "Submit Application"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
