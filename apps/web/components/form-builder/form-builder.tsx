"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, Reorder } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Type,
  Mail,
  Hash,
  AlignLeft,
  ChevronDown,
  ListChecks,
  FileText,
  SlidersHorizontal,
  Phone,
  Radio,
  Calendar,
  FileUp,
  Globe,
  GlobeLock,
  EyeOff,
  Link2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useGetForm, useUpdateForm } from "@/hooks/form/use-forms";
import { useSyncFormFields } from "@/hooks/form/use-form-field";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";

interface FormFieldOption {
  label: string;
  value: string;
  order: number;
}

type BackendFieldType =
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

interface FormField {
  id: string;
  formId: string;
  label: string;
  type: BackendFieldType;
  order: number;
  required: boolean;
  placeholder?: string;
  helperText?: string;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  options?: FormFieldOption[];
}

const fieldTypes = [
  { type: "text", icon: Type, label: "Short Text", description: "Single line text input" },
  { type: "textarea", icon: AlignLeft, label: "Long Text", description: "Multi-line text area" },
  { type: "email", icon: Mail, label: "Email", description: "Email address field" },
  { type: "number", icon: Hash, label: "Number", description: "Numeric input field" },
  { type: "phone", icon: Phone, label: "Phone", description: "Contact number layout" },
  {
    type: "select",
    icon: ChevronDown,
    label: "Dropdown Select",
    description: "Dropdown choices selection menu",
  },
  {
    type: "radio",
    icon: Radio,
    label: "Single Choice Radio",
    description: "Select one option out of multiple choices",
  },
  {
    type: "checkbox",
    icon: ListChecks,
    label: "Checkbox Collection",
    description: "Multi-select option parameters",
  },
  {
    type: "date",
    icon: Calendar,
    label: "Date Selection",
    description: "Calendar appointment picking tool",
  },
  {
    type: "file",
    icon: FileUp,
    label: "File Upload",
    description: "Binary attachment uploader field",
  },
] as const;

const defaultFieldData: Record<BackendFieldType, Partial<FormField>> = {
  text: { label: "Short Text Field", placeholder: "Enter response text..." },
  textarea: { label: "Long Text Context", placeholder: "Provide comprehensive answers here..." },
  email: { label: "Email Address Input", placeholder: "username@example.com" },
  number: { label: "Numeric Parameter", placeholder: "0" },
  phone: { label: "Contact Number", placeholder: "+1 (555) 000-0000" },
  select: {
    label: "Dropdown Options Selector",
    options: [
      { label: "Choice A", value: "choice_a", order: 0 },
      { label: "Choice B", value: "choice_b", order: 1 },
    ],
  },
  radio: {
    label: "Radio Choice Selector",
    options: [
      { label: "Option 1", value: "option_1", order: 0 },
      { label: "Option 2", value: "option_2", order: 1 },
    ],
  },
  checkbox: {
    label: "Multiselect Parameters Box",
    options: [
      { label: "Accept Item 1", value: "accept_item_1", order: 0 },
      { label: "Accept Item 2", value: "accept_item_2", order: 1 },
    ],
  },
  date: { label: "Target Date Selection" },
  file: { label: "Document Workspace Upload" },
};

export function FormBuilder() {
  const params = useParams();
  const formId = params.formId as string;

  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "minimal" | "gradient">("light");
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [isMobileAddFieldsOpen, setIsMobileAddFieldsOpen] = useState(false);
  const [visibility, setVisibility] = useState<"public" | "unlisted" | "private">("private");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { form, isLoading } = useGetForm(formId);
  const { syncFieldsMutation } = useSyncFormFields();
  const { updateFormMutation } = useUpdateForm();

  useEffect(() => {
    if (form) {
      setFormName(form.title);
      setFormDescription(form.description || "");
      setIsPublished(form.isPublished);
      setTheme(form.theme as "light" | "dark" | "minimal" | "gradient");
      if (form.formFields) {
        setFields(form.formFields as FormField[]);
      }
      setVisibility(form.visibility);
    }
  }, [form]);

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  const handleSelectField = (id: string) => {
    setSelectedFieldId(id);
    if (window.innerWidth < 1024) {
      setIsMobileSettingsOpen(true);
    }
  };

  const addField = useCallback(
    (type: BackendFieldType) => {
      const newField: FormField = {
        id: `field-${Date.now()}`,
        formId,
        type,
        label: defaultFieldData[type]?.label || "Custom Data Input Field",
        placeholder: defaultFieldData[type]?.placeholder,
        required: false,
        order: fields.length,
        options: defaultFieldData[type]?.options
          ? JSON.parse(JSON.stringify(defaultFieldData[type].options))
          : undefined,
      };

      setFields((prev) => [...prev, newField]);
      setSelectedFieldId(newField.id);
      setIsMobileAddFieldsOpen(false);

      setTimeout(() => {
        if (window.innerWidth < 1024) {
          setIsMobileSettingsOpen(true);
        }
      }, 300);
    },
    [fields.length, formId],
  );

  const updateField = useCallback((id: string, updates: Partial<FormField>) => {
    setFields((prev) => prev.map((field) => (field.id === id ? { ...field, ...updates } : field)));
  }, []);

  const deleteField = useCallback(
    (id: string) => {
      setFields((prev) => {
        const remaining = prev.filter((field) => field.id !== id);
        return remaining.map((field, index) => ({ ...field, order: index }));
      });
      if (selectedFieldId === id) {
        setSelectedFieldId(null);
        setIsMobileSettingsOpen(false);
      }
    },
    [selectedFieldId],
  );

  const handleReorder = (reorderedFields: FormField[]) => {
    setFields(reorderedFields.map((field, index) => ({ ...field, order: index })));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = fields.map((field) => ({
        id: field.id,
        formId: field.formId,
        label: field.label,
        type: field.type,
        order: field.order,
        required: field.required,
        placeholder: field.placeholder || undefined,
        helperText: field.helperText || undefined,
        minLength: field.minLength != null ? Number(field.minLength) : undefined,
        maxLength: field.maxLength != null ? Number(field.maxLength) : undefined,
        minValue: field.minValue != null ? Number(field.minValue) : undefined,
        maxValue: field.maxValue != null ? Number(field.maxValue) : undefined,
        options:
          field.options && ["select", "radio", "checkbox"].includes(field.type)
            ? field.options.map((opt, idx) => ({
                label: opt.label,
                value: opt.value,
                order: opt.order ?? idx,
              }))
            : undefined,
      }));

      console.log("Saving configurations...", payload);

      await syncFieldsMutation.mutateAsync(payload);

      await Promise.all([
        updateFormMutation.mutateAsync({
          formId,
          title: formName,
          theme,
          description: formDescription,
          isPublished,
          visibility,
        }),

        syncFieldsMutation.mutateAsync(payload),
      ]);
    } catch (err) {
      console.error("Failed to compile layout parameters configurations payload structure:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const getFieldIcon = (type: BackendFieldType) => {
    return fieldTypes.find((f) => f.type === type)?.icon || Type;
  };

  const renderFieldSettingsContent = (field: FormField) => {
    return (
      <div className="space-y-4 text-left">
        <div>
          <Label className="text-xs text-muted-foreground">Field Type Parameter</Label>
          <div className="mt-1.5 flex items-center gap-2 p-2 rounded-lg bg-secondary/50 capitalize font-mono text-xs">
            {field.type}
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Label</Label>
          <Input
            value={field.label}
            onChange={(e) => updateField(field.id, { label: e.target.value })}
            className="mt-1.5 bg-background"
            maxLength={100}
          />
        </div>

        {!["select", "radio", "checkbox", "date", "file"].includes(field.type) && (
          <div>
            <Label className="text-xs text-muted-foreground">Placeholder Text</Label>
            <Input
              value={field.placeholder || ""}
              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
              className="mt-1.5 bg-background"
              maxLength={100}
            />
          </div>
        )}

        <div>
          <Label className="text-xs text-muted-foreground">Helper Descriptive Subtext</Label>
          <Input
            value={field.helperText || ""}
            onChange={(e) => updateField(field.id, { helperText: e.target.value })}
            className="mt-1.5 bg-background"
            maxLength={200}
          />
        </div>

        {field.type === "number" && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Min Value</Label>
              <Input
                type="number"
                value={field.minValue ?? ""}
                onChange={(e) =>
                  updateField(field.id, {
                    minValue: e.target.value !== "" ? Number(e.target.value) : undefined,
                  })
                }
                className="mt-1.5 bg-background"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Max Value</Label>
              <Input
                type="number"
                value={field.maxValue ?? ""}
                onChange={(e) =>
                  updateField(field.id, {
                    maxValue: e.target.value !== "" ? Number(e.target.value) : undefined,
                  })
                }
                className="mt-1.5 bg-background"
              />
            </div>
          </div>
        )}

        {["text", "textarea", "email", "phone"].includes(field.type) && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Min String Length</Label>
              <Input
                type="number"
                value={field.minLength ?? ""}
                onChange={(e) =>
                  updateField(field.id, {
                    minLength: e.target.value !== "" ? parseInt(e.target.value, 10) : undefined,
                  })
                }
                className="mt-1.5 bg-background"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Max String Length</Label>
              <Input
                type="number"
                value={field.maxLength ?? ""}
                onChange={(e) =>
                  updateField(field.id, {
                    maxLength: e.target.value !== "" ? parseInt(e.target.value, 10) : undefined,
                  })
                }
                className="mt-1.5 bg-background"
              />
            </div>
          </div>
        )}

        {["select", "radio", "checkbox"].includes(field.type) &&
          (() => {
            const fieldOptions = field.options || (field as any).fieldOptions || [];

            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground font-medium">
                    Configure Options
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[11px] text-primary hover:bg-primary/10 px-2 gap-1"
                    onClick={() => {
                      const nextIndex = fieldOptions.length;
                      const newOption = {
                        label: `Option ${nextIndex + 1}`,
                        value: `option_${nextIndex + 1}`,
                        order: nextIndex,
                      };
                      updateField(field.id, { options: [...fieldOptions, newOption] });
                    }}
                  >
                    <Plus className="h-3 w-3" />
                    Add Option
                  </Button>
                </div>

                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1 pb-1">
                  {fieldOptions.length > 0 ? (
                    fieldOptions.map((option: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-1.5 group/option">
                        <div className="text-[10px] text-muted-foreground font-mono w-4 text-right select-none">
                          {idx + 1}.
                        </div>
                        <Input
                          value={option.label}
                          placeholder={`Option ${idx + 1}`}
                          className="h-8 text-xs bg-background flex-1"
                          onChange={(e) => {
                            const updatedOptions = [...fieldOptions];
                            const cleanValue = e.target.value
                              .trim()
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "_");

                            updatedOptions[idx] = {
                              ...option,
                              label: e.target.value,
                              value: cleanValue || `option_${idx + 1}`,
                              order: idx,
                            };
                            updateField(field.id, { options: updatedOptions });
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0 opacity-60 group-hover/option:opacity-100 transition-opacity"
                          disabled={fieldOptions.length <= 1}
                          onClick={() => {
                            const updatedOptions = fieldOptions.filter(
                              (_: any, i: number) => i !== idx,
                            );
                            updateField(field.id, {
                              options: updatedOptions.map((opt: any, i: number) => ({
                                ...opt,
                                order: i,
                              })),
                            });
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 border border-dashed rounded-lg bg-muted/20">
                      <p className="text-[11px] text-muted-foreground">
                        No options configured yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div>
            <p className="text-sm font-medium text-foreground">Required Constraint</p>
            <p className="text-xs text-muted-foreground">
              Force form tracking validators onto submission inputs
            </p>
          </div>
          <Switch
            checked={field.required}
            onCheckedChange={(checked) => updateField(field.id, { required: checked })}
          />
        </div>

        <Button
          variant="outline"
          className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 mt-4"
          onClick={() => deleteField(field.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Field
        </Button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <p className="animate-pulse text-sm text-zinc-500 font-mono">
          Syncing system interfaces...
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/forms">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="font-serif text-lg text-foreground truncate max-w-[120px] sm:max-w-xs">
            {formName || "Workspace Form Builder"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {selectedField && (
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden h-8 w-8 p-0"
              onClick={() => setIsMobileSettingsOpen(true)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="sr-only">Properties</span>
            </Button>
          )}

          <div className="flex items-center gap-0.5 p-0.5 bg-muted/50 rounded-md border border-border/40 h-8">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 px-3 h-7 text-xs font-medium rounded transition-all duration-150 native-focus-accent",
                    visibility !== "private"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-background text-foreground shadow-sm",
                  )}
                >
                  {/* ... icons logic ... */}
                  {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
                  <ChevronDown className="h-3 w-3 opacity-70 ml-1" />
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-40 p-1" align="end">
                {[
                  { id: "public", label: "Public", icon: Globe },
                  { id: "unlisted", label: "Unlisted", icon: Link2 },
                  { id: "private", label: "Private", icon: Lock },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setVisibility(item.id as any);
                      setIsPopoverOpen(false); // This forces the popup to close
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-sm hover:bg-muted transition-colors",
                      visibility === item.id && "bg-muted font-medium",
                    )}
                  >
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    {item.label}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>

          <Button
            size="sm"
            className="h-8 gap-1.5 px-3 text-xs font-medium"
            onClick={handleSave}
            disabled={isSaving || !formName}
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-72 border-r border-border bg-card overflow-y-auto hidden lg:block shrink-0">
          <div className="p-5">
            <h3 className="font-semibold text-foreground text-sm mb-1">Add Dynamic Elements</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Inject fields into your custom layouts context arrays
            </p>

            <div className="space-y-1.5">
              {fieldTypes.map((fieldType) => {
                const Icon = fieldType.icon;
                return (
                  <button
                    key={fieldType.type}
                    onClick={() => addField(fieldType.type as BackendFieldType)}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl border border-border/50 text-left hover:border-primary/50 hover:bg-secondary/50 transition-all group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-xs text-foreground mt-0.5">
                        {fieldType.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {fieldType.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-secondary/30 p-4 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 bg-secondary/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    <span>Canvas Workspace</span>
                  </div>
                  <h1 className="font-serif text-2xl text-foreground font-semibold tracking-tight">
                    {formName || "Untitled Core Survey Template"}
                  </h1>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {formDescription || "No custom target description configured yet."}
                  </p>
                </div>
              </div>

              <div className="p-6">
                {fields.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                    <h3 className="font-medium text-sm text-foreground">
                      Workspace canvas is completely empty
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                      Select inputs options directly inside side control panels to initialize form
                      objects.
                    </p>
                  </div>
                ) : (
                  <Reorder.Group
                    axis="y"
                    values={fields}
                    onReorder={handleReorder}
                    className="space-y-3"
                  >
                    {fields.map((field) => {
                      const Icon = getFieldIcon(field.type);
                      return (
                        <Reorder.Item key={field.id} value={field}>
                          <div
                            className={cn(
                              "group relative bg-secondary/20 rounded-xl p-4 border-2 transition-all cursor-pointer pl-10",
                              selectedFieldId === field.id
                                ? "border-primary"
                                : "border-transparent hover:border-border",
                            )}
                            onClick={() => handleSelectField(field.id)}
                          >
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 group-hover:opacity-100 cursor-grab">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs text-foreground font-semibold flex items-center gap-1.5">
                                <Icon className="h-3.5 w-3.5 text-primary" />
                                <span>{field.label}</span>
                                {field.required && <span className="text-destructive">*</span>}
                              </Label>

                              {field.helperText && (
                                <p className="text-[11px] text-muted-foreground italic">
                                  {field.helperText}
                                </p>
                              )}

                              <div className="pt-1.5">
                                {field.type === "textarea" ? (
                                  <Textarea
                                    placeholder={field.placeholder}
                                    className="bg-card text-xs h-16"
                                    disabled
                                  />
                                ) : ["select", "radio", "checkbox"].includes(field.type) ? (
                                  <div className="flex flex-wrap gap-2 p-2 rounded-lg bg-background/50 border border-border/40">
                                    {field.options?.length ? (
                                      field.options.map((opt, i) => (
                                        <span
                                          key={i}
                                          className="text-[11px] font-mono bg-secondary px-2 py-0.5 rounded border"
                                        >
                                          {opt.label}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-[10px] text-muted-foreground italic">
                                        No options loaded.
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <Input
                                    type={field.type === "phone" ? "text" : field.type}
                                    placeholder={field.placeholder}
                                    className="bg-card text-xs h-8"
                                    disabled
                                  />
                                )}
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteField(field.id);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </Reorder.Item>
                      );
                    })}
                  </Reorder.Group>
                )}
              </div>
            </motion.div>
          </div>
        </main>

        <aside className="w-72 border-l border-border bg-card overflow-y-auto hidden lg:block shrink-0">
          {selectedField ? (
            <div className="p-5">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider">
                  Field Options Properties
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFieldId(null)}
                  className="h-7 text-[11px]"
                >
                  Dismiss
                </Button>
              </div>
              {renderFieldSettingsContent(selectedField)}
            </div>
          ) : (
            <div className="p-5 h-full flex flex-col items-center justify-center text-center text-muted-foreground">
              <Type className="h-5 w-5 mb-1.5 opacity-40" />
              <p className="text-xs font-medium">No active selection context</p>
              <p className="text-[11px] max-w-[180px] mt-0.5">
                Click canvas input elements to configure parameters.
              </p>
            </div>
          )}
        </aside>
      </div>

      <Sheet open={isMobileAddFieldsOpen} onOpenChange={setIsMobileAddFieldsOpen}>
        <SheetContent side="bottom" className="h-[75vh] rounded-t-2xl">
          <SheetHeader>
            <SheetTitle className="text-left font-semibold text-sm">Add Elements</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-1 gap-1.5 mt-3 overflow-y-auto max-h-[60vh] pb-6">
            {fieldTypes.map((fieldType) => {
              const Icon = fieldType.icon;
              return (
                <button
                  key={fieldType.type}
                  onClick={() => addField(fieldType.type as BackendFieldType)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-secondary/30 text-left"
                >
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-xs text-foreground">{fieldType.label}</p>
                    <p className="text-[10px] text-muted-foreground">{fieldType.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={isMobileSettingsOpen} onOpenChange={setIsMobileSettingsOpen}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
          <SheetHeader className="text-left border-b pb-2 mb-3">
            <SheetTitle className="text-xs font-semibold flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-primary" /> Properties Panel
            </SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto h-[72vh] pb-8">
            {selectedField ? (
              renderFieldSettingsContent(selectedField)
            ) : (
              <p className="text-xs text-center pt-4 text-muted-foreground">Empty entry context.</p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
