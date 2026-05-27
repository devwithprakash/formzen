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
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";

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


const themeStyles: Record<
  FormTheme,
  {
    page: string;
    headerCard: string;
    bodyCard: string;
    input: string;
    label: string;
    helperText: string;
    divider: string;
    btn: string;
    errorBox: string;
    badge: string;
    fieldNumber: string;
    successIcon: string;
    successTitle: string;
    successSubtitle: string;
  }
> = {

  light: {
    page: "min-h-screen w-full flex justify-center items-start py-10 px-4 sm:py-20 bg-[#fafafa]",
    headerCard:
      "bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden",
    bodyCard:
      "bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden",
    input:
      "w-full text-sm h-10 bg-slate-50 border border-slate-200 rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 placeholder:text-slate-400",
    label: "text-xs font-semibold text-slate-500 uppercase tracking-wide",
    helperText: "text-xs text-slate-400 mt-1",
    divider: "border-slate-100",
    btn: "w-full text-sm font-semibold h-11 bg-slate-900 hover:bg-slate-700 text-white rounded-xl transition-colors",
    errorBox:
      "flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-100 p-3 rounded-xl",
    badge: "bg-slate-100 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded-full",
    fieldNumber:
      "flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold flex items-center justify-center",
    successIcon: "text-emerald-500",
    successTitle: "text-slate-800",
    successSubtitle: "text-slate-500",
  },


  minimal: {
    page: "min-h-screen w-full flex justify-center items-start py-10 px-4 sm:py-20 bg-[#fffafd]",
    headerCard:
      "bg-white border border-rose-100 shadow-sm rounded-3xl overflow-hidden",
    bodyCard:
      "bg-white border border-rose-100 shadow-sm rounded-3xl overflow-hidden",
    input:
      "w-full text-sm h-10 bg-rose-50 border border-rose-200 rounded-xl focus-visible:ring-2 focus-visible:ring-rose-200 placeholder:text-rose-300",
    label: "text-xs font-semibold text-slate-600 uppercase tracking-wide",
    helperText: "text-xs text-rose-400 mt-1",
    divider: "border-rose-50",
    btn: "w-full text-sm font-semibold h-11 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white rounded-xl transition-all shadow-md shadow-rose-100",
    errorBox:
      "flex items-start gap-2 text-rose-600 text-sm bg-rose-50 border border-rose-200 p-3 rounded-xl",
    badge:
      "bg-rose-50 text-rose-400 text-[10px] font-semibold px-2 py-0.5 rounded-full",
    fieldNumber:
      "flex-shrink-0 w-5 h-5 rounded-full bg-rose-100 text-rose-400 text-[10px] font-bold flex items-center justify-center",
    successIcon: "text-pink-400",
    successTitle: "text-slate-700",
    successSubtitle: "text-slate-500",
  },


  dark: {
    page: "min-h-screen w-full flex justify-center items-start py-10 px-4 sm:py-20 bg-[#040807]",
    headerCard:
      "bg-[#0a110f] border border-emerald-900/60 rounded-2xl overflow-hidden",
    bodyCard:
      "bg-[#0a110f] border border-emerald-900/60 rounded-2xl overflow-hidden",
    input:
      "w-full text-sm h-10 bg-[#111d1a] border border-emerald-900/60 text-white rounded-xl focus-visible:ring-2 focus-visible:ring-emerald-500/30 placeholder:text-zinc-600",
    label: "text-xs font-semibold text-zinc-400 uppercase tracking-wide",
    helperText: "text-xs text-zinc-600 mt-1",
    divider: "border-emerald-900/30",
    btn: "w-full text-sm font-semibold h-11 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl transition-colors",
    errorBox:
      "flex items-start gap-2 text-red-400 text-sm bg-red-950/40 border border-red-900/40 p-3 rounded-xl",
    badge:
      "bg-emerald-950 text-emerald-500 text-[10px] font-semibold px-2 py-0.5 rounded-full",
    fieldNumber:
      "flex-shrink-0 w-5 h-5 rounded-full bg-emerald-950 text-emerald-500 text-[10px] font-bold flex items-center justify-center",
    successIcon: "text-emerald-400",
    successTitle: "text-white",
    successSubtitle: "text-zinc-400",
  },


  gradient: {
    page: "min-h-screen w-full flex justify-center items-start py-10 px-4 sm:py-20 bg-gradient-to-br from-orange-50 via-white to-purple-50",
    headerCard:
      "bg-white/80 backdrop-blur-md border border-orange-100 shadow-sm rounded-3xl overflow-hidden",
    bodyCard:
      "bg-white/80 backdrop-blur-md border border-orange-100 shadow-sm rounded-3xl overflow-hidden",
    input:
      "w-full text-sm h-10 bg-white border border-slate-200 rounded-xl focus-visible:ring-2 focus-visible:ring-orange-200 placeholder:text-slate-400",
    label: "text-xs font-bold text-slate-500 uppercase tracking-widest",
    helperText: "text-xs text-slate-400 mt-1",
    divider: "border-orange-50",
    btn: "w-full text-sm font-bold h-11 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white rounded-xl transition-all shadow-md shadow-orange-100",
    errorBox:
      "flex items-start gap-2 text-orange-700 text-sm bg-orange-50 border border-orange-200 p-3 rounded-xl",
    badge:
      "bg-orange-50 text-orange-400 text-[10px] font-semibold px-2 py-0.5 rounded-full",
    fieldNumber:
      "flex-shrink-0 w-5 h-5 rounded-full bg-orange-50 text-orange-400 text-[10px] font-bold flex items-center justify-center",
    successIcon: "text-orange-400",
    successTitle: "text-slate-800",
    successSubtitle: "text-slate-500",
  },
};

export default function PublicFormPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { data: form, isLoading, error } = useGetFormBySlug(slug);
  const { submitResponsesMutation, isSubmitting, error: formResponseError } =
    useSubmitFormResponses();

  const themeKey = (
    form?.theme && form.theme in themeStyles ? form.theme : "light"
  ) as FormTheme;
  const t = themeStyles[themeKey];

  const handleInputChange = (fieldId: string, value: FieldValue) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (validationError) setValidationError(null);
  };

  const handleCheckboxChange = (
    fieldId: string,
    optionValue: string,
    checked: boolean
  ) => {
    const currentValues = (formData[fieldId] as string[] | undefined) ?? [];
    const updatedValues = checked
      ? [...currentValues, optionValue]
      : currentValues.filter((v) => v !== optionValue);
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
        const isEmpty =
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0);
        if (isEmpty) {
          setValidationError(`Please complete the required field: "${field.label}"`);
          return;
        }
      }
    }
    try {
      const formattedAnswers = Object.entries(formData).map(([fieldId, value]) => ({
        fieldId,
        value: Array.isArray(value) ? JSON.stringify(value) : String(value),
      }));
      await submitResponsesMutation.mutateAsync({
        formId: form.id,
        answer: formattedAnswers,
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setValidationError(formResponseError?.message || "Failed to submit form. Please try again.");
    }
  };


  if (isLoading) {
    return (
      <div className={`${t.page} items-center`}>
        <Loader2 className="animate-spin opacity-40 w-6 h-6" />
      </div>
    );
  }

  if (error || !form || form.visibility === "private") {
    return (
      <div className={t.page}>
        <div className="w-full max-w-lg">
          <div className={`${t.bodyCard} p-10 text-center`}>
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-5 h-5 text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700 mb-1">Form unavailable</p>
            <p className="text-sm text-slate-400">
              This form is either private or no longer accepting responses.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className={t.page}>
        <div className="w-full max-w-lg">
          <div className={`${t.bodyCard} p-12 text-center`}>
            <div className="w-16 h-16 rounded-full bg-current/5 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className={`w-8 h-8 ${t.successIcon}`} />
            </div>
            <p className={`text-xl font-bold mb-2 ${t.successTitle}`}>
              Response recorded!
            </p>
            <p className={`text-sm ${t.successSubtitle}`}>
              Thank you for completing <span className="font-medium">{form.title}</span>.
              Your answers have been saved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const fields = (form.formFields ?? []) as FormField[];
  const requiredCount = fields.filter((f) => f.required).length;

  return (
    <div className={t.page}>
      <div className="w-full max-w-xl space-y-4">


        <div className={t.headerCard}>

          <div className="h-1 w-full bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 opacity-40" />
          <div className="px-8 py-7">
            <h1 className="text-2xl font-bold tracking-tight leading-tight mb-2">
              {form.title}
            </h1>
            {form.description && (
              <p className="text-sm leading-relaxed opacity-60">{form.description}</p>
            )}
            {requiredCount > 0 && (
              <p className="mt-4 text-xs opacity-40">
                Fields marked <span className="text-red-400 font-bold">*</span> are required
              </p>
            )}
          </div>
        </div>


        <form onSubmit={handleSubmit}>
          <div className={`${t.bodyCard} px-8 py-7`}>
            <div className="space-y-7">
              {fields.map((field, idx) => (
                <div key={field.id}>
       
                  {idx > 0 && <hr className={`${t.divider} border-t mb-7`} />}

                  <div className="flex items-start gap-3">
             
                    <span className={`${t.fieldNumber} mt-0.5`}>{idx + 1}</span>

                    <div className="flex-1 space-y-2 min-w-0">
               
                      <div className="flex items-center gap-2">
                        <Label className={t.label}>{field.label}</Label>
                        {field.required && (
                          <span className="text-red-400 text-xs font-bold leading-none">*</span>
                        )}
                        {!field.required && (
                          <span className={t.badge}>optional</span>
                        )}
                      </div>

        
                      {field.helperText && (
                        <p className={t.helperText}>{field.helperText}</p>
                      )}

               
                      {field.type === "text" && (
                        <Input
                          className={t.input}
                          placeholder={field.placeholder ?? ""}
                          value={(formData[field.id] as string) ?? ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                        />
                      )}

                      {field.type === "email" && (
                        <Input
                          type="email"
                          className={t.input}
                          placeholder={field.placeholder ?? "you@example.com"}
                          value={(formData[field.id] as string) ?? ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                        />
                      )}

                      {field.type === "number" && (
                        <Input
                          type="number"
                          className={t.input}
                          placeholder={field.placeholder ?? ""}
                          value={(formData[field.id] as string) ?? ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                        />
                      )}

                      {field.type === "phone" && (
                        <Input
                          type="tel"
                          className={t.input}
                          placeholder={field.placeholder ?? "+1 (555) 000-0000"}
                          value={(formData[field.id] as string) ?? ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                        />
                      )}

                      {field.type === "date" && (
                        <Input
                          type="date"
                          className={t.input}
                          value={(formData[field.id] as string) ?? ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                        />
                      )}

                      {field.type === "textarea" && (
                        <Textarea
                          className={`${t.input} h-auto min-h-[100px] py-2.5 resize-none`}
                          placeholder={field.placeholder ?? ""}
                          value={(formData[field.id] as string) ?? ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                        />
                      )}

                      {field.type === "select" && (
                        <Select
                          value={(formData[field.id] as string) ?? ""}
                          onValueChange={(val) => handleInputChange(field.id, val)}
                        >
                          <SelectTrigger className={t.input}>
                            <SelectValue placeholder="Choose an option…" />
                          </SelectTrigger>
                          <SelectContent>
                            {field.fieldOptions.map((opt) => (
                              <SelectItem key={opt.id} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {field.type === "radio" && (
                        <div className="space-y-2 pt-1">
                          {field.fieldOptions.map((opt) => (
                            <label
                              key={opt.id}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <span
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                                  ${(formData[field.id] as string) === opt.value
                                    ? "border-current"
                                    : "border-current/20 group-hover:border-current/50"
                                  }`}
                              >
                                {(formData[field.id] as string) === opt.value && (
                                  <span className="w-2 h-2 rounded-full bg-current" />
                                )}
                              </span>
                              <input
                                type="radio"
                                className="sr-only"
                                checked={(formData[field.id] as string) === opt.value}
                                onChange={() => handleInputChange(field.id, opt.value)}
                              />
                              <span className="text-sm">{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {field.type === "checkbox" && (
                        <div className="space-y-2 pt-1">
                          {field.fieldOptions.map((opt) => (
                            <label
                              key={opt.id}
                              className="flex items-center gap-3 cursor-pointer"
                            >
                              <Checkbox
                                checked={(
                                  (formData[field.id] as string[]) ?? []
                                ).includes(opt.value)}
                                onCheckedChange={(val) =>
                                  handleCheckboxChange(field.id, opt.value, !!val)
                                }
                              />
                              <span className="text-sm">{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {validationError && (
              <div className={`${t.errorBox} mt-6`}>
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

  
            <div className="mt-8 pt-6 border-t border-current/5">
              <Button
                type="submit"
                className={`${t.btn} flex items-center justify-center gap-2`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>


        <p className="text-center text-[11px] opacity-30 pb-4">
          Powered by FormZen
        </p>
      </div>  
    </div>
  );
}