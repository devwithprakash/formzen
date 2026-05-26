import { FormPreview } from "@/components/forms/form-preview"

export const metadata = {
  title: "Form Preview — FormZen",
}

// Mock form data - in real app this would come from database
const getFormData = (id: string) => ({
  id,
  name: "Customer Feedback Survey",
  description: "We value your feedback. Please take a moment to share your thoughts.",
  fields: [
    { id: "1", type: "text", label: "Full Name", placeholder: "Enter your name", required: true },
    { id: "2", type: "email", label: "Email Address", placeholder: "you@example.com", required: true },
    { id: "3", type: "rating", label: "How satisfied are you with our service?", required: true },
    { id: "4", type: "radio", label: "How did you hear about us?", required: true, options: ["Google Search", "Social Media", "Friend/Colleague", "Advertisement", "Other"] },
    { id: "5", type: "textarea", label: "Additional Comments", placeholder: "Share your thoughts with us...", required: false },
  ],
})

export default async function FormPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const formData = getFormData(id)
  
  return <FormPreview form={formData} isPreview={true} />
}
