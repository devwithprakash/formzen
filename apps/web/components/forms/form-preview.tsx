"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  Upload,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FormField {
  id: string
  type: string
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
}

interface FormData {
  id: string
  name: string
  description?: string
  fields: FormField[]
}

interface FormPreviewProps {
  form: FormData
  isPreview?: boolean
}

export function FormPreview({ form, isPreview = false }: FormPreviewProps) {
  const [submitted, setSubmitted] = useState(false)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateValue = (fieldId: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }))
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    const newErrors: Record<string, string> = {}
    form.fields.forEach((field) => {
      if (field.required && !formValues[field.id]) {
        newErrors[field.id] = "This field is required"
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit form
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-serif text-2xl text-foreground mb-2">Thank you!</h1>
          <p className="text-muted-foreground mb-6">
            Your response has been submitted successfully. We appreciate your feedback.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(false)
              setFormValues({})
            }}
          >
            Submit another response
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Preview Banner */}
      {isPreview && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground py-2 px-4 text-center text-sm">
          <span>Preview Mode — </span>
          <Link href={`/dashboard/forms/${form.id}`} className="underline">
            Return to editor
          </Link>
        </div>
      )}

      <div className={`mx-auto max-w-2xl px-4 py-8 ${isPreview ? "pt-16" : ""}`}>
        {/* Back Link */}
        {isPreview && (
          <Link
            href={`/dashboard/forms/${form.id}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to editor
          </Link>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border/50 shadow-lg shadow-primary/5 overflow-hidden"
        >
          {/* Form Header */}
          <div className="p-6 sm:p-8 border-b border-border/50 bg-gradient-to-b from-secondary/30 to-transparent">
            <h1 className="font-serif text-2xl sm:text-3xl text-foreground">{form.name}</h1>
            {form.description && (
              <p className="text-muted-foreground mt-2">{form.description}</p>
            )}
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {form.fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Label className="text-foreground mb-2 block">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>

                {field.type === "text" && (
                  <Input
                    placeholder={field.placeholder}
                    value={formValues[field.id] || ""}
                    onChange={(e) => updateValue(field.id, e.target.value)}
                    className={errors[field.id] ? "border-destructive" : ""}
                  />
                )}

                {field.type === "email" && (
                  <Input
                    type="email"
                    placeholder={field.placeholder}
                    value={formValues[field.id] || ""}
                    onChange={(e) => updateValue(field.id, e.target.value)}
                    className={errors[field.id] ? "border-destructive" : ""}
                  />
                )}

                {field.type === "phone" && (
                  <Input
                    type="tel"
                    placeholder={field.placeholder}
                    value={formValues[field.id] || ""}
                    onChange={(e) => updateValue(field.id, e.target.value)}
                    className={errors[field.id] ? "border-destructive" : ""}
                  />
                )}

                {field.type === "number" && (
                  <Input
                    type="number"
                    placeholder={field.placeholder}
                    value={formValues[field.id] || ""}
                    onChange={(e) => updateValue(field.id, e.target.value)}
                    className={errors[field.id] ? "border-destructive" : ""}
                  />
                )}

                {field.type === "textarea" && (
                  <Textarea
                    placeholder={field.placeholder}
                    value={formValues[field.id] || ""}
                    onChange={(e) => updateValue(field.id, e.target.value)}
                    rows={4}
                    className={errors[field.id] ? "border-destructive" : ""}
                  />
                )}

                {field.type === "rating" && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => updateValue(field.id, star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            star <= (formValues[field.id] || 0)
                              ? "fill-primary text-primary"
                              : "text-border hover:text-primary/50"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {field.type === "select" && (
                  <Select
                    value={formValues[field.id] || ""}
                    onValueChange={(value) => updateValue(field.id, value)}
                  >
                    <SelectTrigger className={errors[field.id] ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {field.type === "radio" && (
                  <div className="space-y-2">
                    {field.options?.map((option) => (
                      <label
                        key={option}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          formValues[field.id] === option
                            ? "border-primary bg-primary/5"
                            : "border-border/50 hover:border-border"
                        }`}
                      >
                        <input
                          type="radio"
                          name={field.id}
                          value={option}
                          checked={formValues[field.id] === option}
                          onChange={(e) => updateValue(field.id, e.target.value)}
                          className="sr-only"
                        />
                        <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                          formValues[field.id] === option
                            ? "border-primary"
                            : "border-border"
                        }`}>
                          {formValues[field.id] === option && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <span className="text-sm text-foreground">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {field.type === "checkbox" && (
                  <div className="space-y-2">
                    {field.options?.map((option) => (
                      <label
                        key={option}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          (formValues[field.id] || []).includes(option)
                            ? "border-primary bg-primary/5"
                            : "border-border/50 hover:border-border"
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={option}
                          checked={(formValues[field.id] || []).includes(option)}
                          onChange={(e) => {
                            const current = formValues[field.id] || []
                            if (e.target.checked) {
                              updateValue(field.id, [...current, option])
                            } else {
                              updateValue(field.id, current.filter((v: string) => v !== option))
                            }
                          }}
                          className="sr-only"
                        />
                        <div className={`h-4 w-4 rounded border-2 flex items-center justify-center ${
                          (formValues[field.id] || []).includes(option)
                            ? "border-primary bg-primary"
                            : "border-border"
                        }`}>
                          {(formValues[field.id] || []).includes(option) && (
                            <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <span className="text-sm text-foreground">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {field.type === "date" && (
                  <Input
                    type="date"
                    value={formValues[field.id] || ""}
                    onChange={(e) => updateValue(field.id, e.target.value)}
                    className={errors[field.id] ? "border-destructive" : ""}
                  />
                )}

                {field.type === "toggle" && (
                  <Switch
                    checked={formValues[field.id] || false}
                    onCheckedChange={(checked) => updateValue(field.id, checked)}
                  />
                )}

                {field.type === "file" && (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop or click to upload
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          updateValue(field.id, file.name)
                        }
                      }}
                    />
                  </div>
                )}

                {field.type === "url" && (
                  <Input
                    type="url"
                    placeholder={field.placeholder || "https://example.com"}
                    value={formValues[field.id] || ""}
                    onChange={(e) => updateValue(field.id, e.target.value)}
                    className={errors[field.id] ? "border-destructive" : ""}
                  />
                )}

                {errors[field.id] && (
                  <p className="text-sm text-destructive mt-1">{errors[field.id]}</p>
                )}
              </motion.div>
            ))}

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-base"
              >
                Submit
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="p-4 border-t border-border/50 text-center">
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Powered by FormZen
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
