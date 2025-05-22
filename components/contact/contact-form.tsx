"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    terms: false,
  })

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    terms: "",
  })

  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; checked: boolean } },
  ) => {
    const { name, value, checked } = e.target as HTMLInputElement
    setFormData({
      ...formData,
      [name]: name === "terms" ? checked : value,
    })
  }

  const validateForm = () => {
    let valid = true
    const newErrors = {
      name: "",
      email: "",
      subject: "",
      message: "",
      terms: "",
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      valid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      valid = false
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
      valid = false
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
      valid = false
    }

    if (!formData.terms) {
      newErrors.terms = "You must agree to the terms"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setFormStatus("submitting")

    // Simulate form submission
    setTimeout(() => {
      setFormStatus("success")
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        terms: false,
      })
    }, 1500)
  }

  if (formStatus === "success") {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Your message has been sent successfully. We'll get back to you as soon as possible.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input id="name" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Your Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          placeholder="Enter subject"
          value={formData.subject}
          onChange={handleChange}
        />
        {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Enter your message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
        />
        {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
      </div>
      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          name="terms"
          checked={formData.terms}
          onCheckedChange={(checked) => handleChange({ target: { name: "terms", checked: checked as boolean } })}
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the terms and conditions
          </Label>
          <p className="text-sm text-gray-500">By submitting this form, you agree to our privacy policy.</p>
        </div>
      </div>
      {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}
      <div className="flex items-center gap-2">
        <div className="border rounded p-2 bg-gray-50">
          <span className="text-sm">reCAPTCHA verification</span>
        </div>
      </div>
      <Button type="submit" disabled={formStatus === "submitting"}>
        {formStatus === "submitting" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  )
}
