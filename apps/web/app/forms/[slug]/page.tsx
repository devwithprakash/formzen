"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useSubmitFormResponses } from "@/hooks/response/use-response";
import { useGetFormBySlug } from "@/hooks/form/use-forms";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

type FormTheme = "light" | "minimal" | "dark" | "gradient";
type FieldValue = string | number | boolean | string[] | null;

interface FieldOption {
  id: string;
  fieldId: string;
  value: string;
  label: string;
  order: number;
}

interface FormField {
  id: string;
  formId: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "email"
    | "number"
    | "phone"
    | "select"
    | "radio"
    | "checkbox"
    | "date"
    | "file";
  order: number;
  required: boolean;
  placeholder?: string | null;
  helperText?: string | null;
  fieldOptions: FieldOption[];
}

type FormData = Record<string, FieldValue>;

export default function PublicFormPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { data: form, isLoading, error } = useGetFormBySlug(slug);

  const {
    submitResponsesMutation,
    isSubmitting,
    error: formResponseError,
  } = useSubmitFormResponses();

  const themeStyles: Record<
    FormTheme,
    {
      wrapper: string;
      card: string;
      inputs: string;
      labels: string;
      button: string;
    }
  > = {
    light: {
      wrapper: "min-h-screen w-full flex justify-center items-start py-8 px-4 sm:py-16 bg-[#fafafa]",
      card: "bg-card border border-border shadow-sm rounded-xl",
      inputs: "w-full text-sm h-10 bg-background border-border rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20",
      labels: "text-xs font-medium text-foreground/70",
      button: "w-full text-sm font-medium h-10 bg-primary text-white rounded-lg",
    },
    minimal: {
      wrapper: "min-h-screen w-full flex justify-center items-start py-8 px-4 sm:py-16 bg-[#fffafd]",
      card: "bg-white/80 backdrop-blur-sm border border-rose-100 rounded-2xl",
      inputs: "w-full text-sm h-10 bg-rose-50 border-rose-200 rounded-xl focus-visible:ring-2 focus-visible:ring-rose-200",
      labels: "text-xs font-semibold text-slate-700",
      button: "w-full text-sm font-semibold h-10 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-xl",
    },
    dark: {
      wrapper: "min-h-screen w-full flex justify-center items-start py-8 px-4 sm:py-16 bg-[#040807]",
      card: "bg-[#0a110f] border border-emerald-900 rounded-2xl",
      inputs: "w-full text-sm h-10 bg-[#111d1a] border-emerald-900 text-white rounded-xl",
      labels: "text-xs font-semibold text-zinc-400",
      button: "w-full text-sm font-semibold h-10 bg-emerald-500 text-white rounded-xl",
    },
    gradient: {
      wrapper: "min-h-screen w-full flex justify-center items-start py-8 px-4 sm:py-16 bg-gradient-to-br from-orange-50 via-white to-purple-50",
      card: "bg-white/80 backdrop-blur-md border border-orange-100 rounded-2xl",
      inputs: "w-full text-sm h-10 bg-white border-slate-200 rounded-xl focus-visible:ring-2 focus-visible:ring-orange-200",
      labels: "text-xs font-bold text-slate-600 uppercase",
      button: "w-full text-sm font-bold h-10 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-xl",
    },
  };

  const themeKey = (form?.theme && form.theme in themeStyles ? form.theme : "light") as FormTheme;
  const activeTheme = themeStyles[themeKey];

  const handleInputChange = (fieldId: string, value: FieldValue) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (validationError) setValidationError(null);
  };

  const handleCheckboxChange = (fieldId: string, optionValue: string, checked: boolean) => {
    const currentValues = (formData[fieldId] as string[] | undefined) ?? [];
    const updatedValues = checked ? [...currentValues, optionValue] : currentValues.filter((v) => v !== optionValue);
    setFormData((prev) => ({ ...prev, [fieldId]: updatedValues }));
    if (validationError) setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (!form?.formFields) return;
    for (const field of form.formFields as FormField[]) {
      if (field.required) {
        const value = formData[field.id];
        const isEmpty = value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
        if (isEmpty) {
          setValidationError(`Please complete: "${field.label}"`);
          return;
        }
      }
    }
    try {
      const formattedAnswers = Object.entries(formData).map(([fieldId, value]) => ({
        fieldId,
        value: Array.isArray(value) ? JSON.stringify(value) : String(value),
      }));
      await submitResponsesMutation.mutateAsync({ formId: form.id, answer: formattedAnswers });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setValidationError(formResponseError?.message || "Failed to submit form.");
    }
  };

  if (isLoading) return <div className={`${activeTheme.wrapper} items-center`}><Loader2 className="animate-spin opacity-60" /></div>;

  if (error || !form || form.visibility === "private") {
    return (
      <div className={activeTheme.wrapper}>
        <Card className={`${activeTheme.card} p-8 text-center`}><AlertCircle className="mx-auto mb-2" />Form unavailable</Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className={activeTheme.wrapper}>
        <Card className={`${activeTheme.card} p-8 text-center`}><CheckCircle2 className="mx-auto mb-2" />Submitted successfully</Card>
      </div>
    );
  }

  return (
    <div className={activeTheme.wrapper}>
      <div className="w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className={`${activeTheme.card} p-6`}>
            <CardHeader className="p-0">
              <CardTitle className="text-2xl font-bold">{form.title}</CardTitle>
              <CardDescription>{form.description}</CardDescription>
            </CardHeader>
          </Card>

          <Card className={`${activeTheme.card} p-6 space-y-6`}>
            {form.formFields?.map((field: FormField) => (
              <div key={field.id} className="space-y-2">
                <Label className={activeTheme.labels}>
                  {field.label} {field.required && <span className="text-destructive">*</span>}
                </Label>
                {field.type === "text" && <Input className={activeTheme.inputs} value={(formData[field.id] as string) ?? ""} onChange={(e) => handleInputChange(field.id, e.target.value)} />}
                {field.type === "textarea" && <Textarea className={activeTheme.inputs} value={(formData[field.id] as string) ?? ""} onChange={(e) => handleInputChange(field.id, e.target.value)} />}
                {field.type === "select" && (
                  <Select value={(formData[field.id] as string) ?? ""} onValueChange={(val) => handleInputChange(field.id, val)}>
                    <SelectTrigger className={activeTheme.inputs}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {field.fieldOptions.map((opt) => <SelectItem key={opt.id} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
                {field.type === "checkbox" && (
                  <div className="space-y-2">
                    {field.fieldOptions.map((opt) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <Checkbox checked={((formData[field.id] as string[]) ?? []).includes(opt.value)} onCheckedChange={(val) => handleCheckboxChange(field.id, opt.value, !!val)} />
                        <label className="text-sm">{opt.label}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {validationError && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{validationError}</p>}
            <Button type="submit" className={activeTheme.button} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Card>
        </form>
      </div>
    </div>
  );
}