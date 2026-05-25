import { FormBuilder } from "@/components/form-builder/form-builder"

export const metadata = {
  title: "Edit Form — FormZen",
}

// Mock form data - in real app this would come from database
const getFormData = (id: string) => ({
  id,
  name: "Customer Feedback Survey",
  fields: [
    { id: "1", type: "text", label: "Full Name", placeholder: "Enter your name", required: true },
    { id: "2", type: "email", label: "Email Address", placeholder: "you@example.com", required: true },
    { id: "3", type: "rating", label: "How satisfied are you with our service?", required: true },
    { id: "4", type: "textarea", label: "Additional Comments", placeholder: "Share your thoughts...", required: false },
  ],
})

export default async function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const formData = getFormData(id)
  
  return <FormBuilder initialData={formData} />
}
