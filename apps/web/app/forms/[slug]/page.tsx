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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2, FileText, Flower, Moon, Sun } from "lucide-react";

type FormTheme = "light" | "minimal" | "dark" | "gradient";

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

export default function PublicFormPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [formData, setFormData] = useState<Record<string, any>>({});
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
      headerLine: string;
      inputs: string;
      labels: string;
      button: string;
    }
  > = {
    light: {
      wrapper:
        "min-h-screen bg-[#fafafa] text-foreground antialiased font-sans py-16 px-4 selection:bg-primary/10 relative",
      card: "bg-card border border-border shadow-sm rounded-xl overflow-hidden",
      headerLine: "absolute top-0 left-0 w-full h-[4px] bg-primary",
      inputs:
        "text-sm h-10 bg-background border-border rounded-lg placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all",
      labels: "text-xs font-medium text-foreground/70 tracking-tight",
      button:
        "w-full text-sm font-medium h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors shadow-sm",
    },
    minimal: {
      wrapper:
        "min-h-screen bg-[#fffafd] text-slate-900 antialiased font-sans py-16 px-4 selection:bg-rose-100 relative overflow-x-hidden",
      card: "bg-white/80 backdrop-blur-sm border border-rose-100/70 shadow-[0_8px_30px_rgb(253,244,245,0.4)] rounded-2xl overflow-hidden z-10",
      headerLine:
        "absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-rose-200 via-pink-400 to-rose-200",
      inputs:
        "text-sm h-10 bg-rose-50/40 border-rose-200/60 rounded-xl placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-rose-200 focus-visible:border-rose-400 transition-all text-slate-900 focus-visible:bg-white",
      labels: "text-xs font-semibold text-slate-700 tracking-tight",
      button:
        "w-full text-sm font-semibold h-10 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white rounded-xl transition-all shadow-sm shadow-rose-200 active:scale-[0.98]",
    },
    dark: {
      wrapper:
        "min-h-screen bg-[#040807] text-white [&&_h1]:text-white [&&_h2]:text-white [&&_h3]:text-white antialiased font-sans py-16 px-4 selection:bg-emerald-500/30 relative overflow-x-hidden",
      card: "bg-[#0a110f]/90 backdrop-blur-md border border-emerald-950/50 shadow-[0_0_50px_-12px_rgba(16,185,129,0.12)] rounded-2xl overflow-hidden z-10",
      headerLine:
        "absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400",
      inputs:
        "text-sm h-10 bg-[#111d1a]/60 border-emerald-950/60 rounded-xl text-white placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-400 transition-all focus-visible:bg-[#111d1a]",
      labels: "text-xs font-semibold text-zinc-400 tracking-tight",
      button:
        "w-full text-sm font-semibold h-10 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]",
    },
    gradient: {
      wrapper:
        "min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 text-slate-900 antialiased font-sans py-16 px-4 selection:bg-orange-100",
      card: "bg-white/80 backdrop-blur-md border border-orange-100 shadow-md rounded-2xl overflow-hidden",
      headerLine:
        "absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-orange-300 via-pink-300 to-purple-300",
      inputs:
        "text-sm h-10 bg-white border-slate-200 rounded-xl placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-orange-200 focus-visible:border-orange-300 transition-all",
      labels: "text-xs font-bold text-slate-600 tracking-wider uppercase",
      button:
        "w-full text-sm font-bold h-10 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white rounded-xl transition-all",
    },
  };

  const themeKey = (form?.theme && form.theme in themeStyles ? form.theme : "light") as FormTheme;
  const activeTheme = themeStyles[themeKey];

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (validationError) setValidationError(null);
  };

  const handleCheckboxChange = (fieldId: string, optionValue: string, checked: boolean) => {
    const currentValues = formData[fieldId] || [];
    const updatedValues = checked
      ? [...currentValues, optionValue]
      : currentValues.filter((v: string) => v !== optionValue);

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
        if (!value || (Array.isArray(value) && value.length === 0)) {
          setValidationError(`Please complete the required field: "${field.label}"`);
          return;
        }
      }
    }

    try {
      const formattedAnswers = Object.entries(formData).map(([fieldId, value]) => ({
        fieldId,
        value: String(value),
      }));

      await submitResponsesMutation.mutateAsync({
        formId: form.id,
        answer: formattedAnswers,
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error("Submission failed:", err);
      setValidationError(
        formResponseError?.message ||
          "Failed to complete submission. Please check your connection.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className={activeTheme.wrapper + " flex items-center justify-center"}>
        <div className="text-center space-y-3">
          <Loader2 className="h-5 w-5 animate-spin mx-auto opacity-50" />
          <p className="text-xs font-medium tracking-wide opacity-70">Loading Form...</p>
        </div>
      </div>
    );
  }

  if (error || !form || form.visibility === "private") {
    return (
      <div className={activeTheme.wrapper + " flex items-center justify-center"}>
        <Card
          className={`${activeTheme.card} max-w-md w-full text-center p-8 border-dashed flex flex-col items-center`}
        >
          <AlertCircle className="h-7 w-7 mb-3 opacity-50" />
          <CardTitle className="text-base font-medium">Form Unavailable</CardTitle>
          <CardDescription className="text-xs mt-2 opacity-80">
            {error?.message || "This form is not currently accepting responses."}
          </CardDescription>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className={activeTheme.wrapper + " flex items-center justify-center"}>
        <Card className={`${activeTheme.card} max-w-md w-full p-8 text-center space-y-4 relative`}>
          <div className={activeTheme.headerLine} />
          <div className="h-12 w-12 rounded-full flex items-center justify-center mx-auto bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="space-y-1.5">
            <CardTitle className="text-xl font-bold tracking-tight">Submission Received</CardTitle>
            <CardDescription className="text-sm opacity-80">
              Thank you! Your response has been successfully captured.
            </CardDescription>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={activeTheme.wrapper}>
      {themeKey === "minimal" && (
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden text-base opacity-40">
          <div className="absolute top-[5%] left-[10%]">🌸</div>
          <div className="absolute top-[25%] left-[20%]">🌸</div>
          <div className="absolute top-[20%] right-[15%]">🌸</div>
          <div className="absolute top-[40%] right-[25%]">🌸</div>
          <div className="absolute bottom-[25%] left-[5%]">🌸</div>
          <div className="absolute bottom-[10%] right-[10%]">🌸</div>
        </div>
      )}

      <div className="max-w-xl mx-auto space-y-5 relative z-10">
        <Card className={`${activeTheme.card} relative`}>
          <div className={activeTheme.headerLine} />
          <CardHeader className="pt-8 pb-6 px-6 sm:px-8">
            <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase opacity-50 mb-3">
              {themeKey === "minimal" ? (
                <Flower className="h-3.5 w-3.5 text-rose-400" />
              ) : themeKey === "gradient" ? (
                <Sun className="h-3.5 w-3.5 text-orange-400" />
              ) : themeKey === "dark" ? (
                <Moon className="h-3.5 w-3.5 text-zinc-500" />
              ) : (
                <FileText className="h-3.5 w-3.5 text-slate-400" />
              )}
              <span>{form.title}</span>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
              {form.title}
            </CardTitle>
            {form.description && (
              <CardDescription className="text-sm mt-3 leading-relaxed opacity-80">
                {form.description}
              </CardDescription>
            )}
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Card className={`${activeTheme.card} p-6 sm:p-8 space-y-6 relative`}>
            {((form.formFields as FormField[]) || []).map((field) => (
              <div key={field.id} className="space-y-2">
                <Label className={activeTheme.labels}>
                  <span>{field.label}</span>
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>

                {field.helperText && (
                  <p className="text-[11px] opacity-50 italic">{field.helperText}</p>
                )}

                <div className="mt-1">
                  {field.type === "text" && (
                    <Input
                      type="text"
                      placeholder={field.placeholder || ""}
                      value={formData[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className={activeTheme.inputs}
                    />
                  )}

                  {field.type === "textarea" && (
                    <Textarea
                      placeholder={field.placeholder || ""}
                      value={formData[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className={`${activeTheme.inputs} min-h-[120px] py-3 resize-none`}
                    />
                  )}

                  {field.type === "email" && (
                    <Input
                      type="email"
                      placeholder={field.placeholder || "example@email.com"}
                      value={formData[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className={activeTheme.inputs}
                    />
                  )}

                  {field.type === "number" && (
                    <Input
                      type="number"
                      placeholder={field.placeholder || "0"}
                      value={formData[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className={activeTheme.inputs}
                    />
                  )}

                  {field.type === "select" && (
                    <Select
                      onValueChange={(val) => handleInputChange(field.id, val)}
                      value={formData[field.id] || ""}
                    >
                      <SelectTrigger className={`${activeTheme.inputs} w-full text-left`}>
                        <SelectValue placeholder={field.placeholder || "Select an option"} />
                      </SelectTrigger>
                      <SelectContent
                        className={
                          themeKey === "dark"
                            ? "bg-[#1c1c1c] border-zinc-800 text-zinc-100"
                            : "bg-white"
                        }
                      >
                        {field.fieldOptions?.map((opt) => (
                          <SelectItem key={opt.id} value={opt.value} className="text-sm">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {field.type === "radio" && (
                    <RadioGroup
                      value={formData[field.id] || ""}
                      onValueChange={(val) => handleInputChange(field.id, val)}
                      className="flex flex-col space-y-2.5 pt-1"
                    >
                      {field.fieldOptions?.map((opt) => (
                        <div key={opt.id} className="flex items-center space-x-3">
                          <RadioGroupItem
                            value={opt.value}
                            id={opt.id}
                            className={
                              themeKey === "dark"
                                ? "border-zinc-700 text-zinc-100"
                                : "border-slate-300"
                            }
                          />
                          <label htmlFor={opt.id} className="text-sm cursor-pointer opacity-90">
                            {opt.label}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {field.type === "checkbox" && (
                    <div className="flex flex-col space-y-2.5 pt-1">
                      {field.fieldOptions?.map((opt) => {
                        const isChecked = (formData[field.id] || []).includes(opt.value);
                        return (
                          <div key={opt.id} className="flex items-center space-x-3">
                            <Checkbox
                              id={opt.id}
                              checked={isChecked}
                              className={themeKey === "dark" ? "border-zinc-700" : ""}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(field.id, opt.value, !!checked)
                              }
                            />
                            <label htmlFor={opt.id} className="text-sm cursor-pointer opacity-90">
                              {opt.label}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {field.type === "date" && (
                    <Input
                      type="date"
                      value={formData[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className={activeTheme.inputs}
                    />
                  )}
                </div>
              </div>
            ))}

            {validationError && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-xl flex items-center gap-3 text-xs font-medium border border-destructive/20">
                <AlertCircle className="h-4 w-4" />
                <span>{validationError}</span>
              </div>
            )}

            <Button type="submit" className={activeTheme.button} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                "Submit Response"
              )}
            </Button>
          </Card>
        </form>
      </div>
    </div>
  );
}
