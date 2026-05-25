"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, Reorder } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Eye,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface FormData {
  id?: string;
  name: string;
  description?: string;
  fields: FormField[];
}

const fieldTypes = [
  { type: "text", icon: Type, label: "Short Text", description: "Single line text input" },
  { type: "textarea", icon: AlignLeft, label: "Long Text", description: "Multi-line text area" },
  { type: "email", icon: Mail, label: "Email", description: "Email address field" },
  { type: "number", icon: Hash, label: "Number", description: "Numeric input field" },
  {
    type: "select",
    icon: ChevronDown,
    label: "Single Select",
    description: "Dropdown with one choice",
  },
  {
    type: "multiselect",
    icon: ListChecks,
    label: "Multi Select",
    description: "Select multiple options",
  },
];

const defaultFieldData: Record<string, Partial<FormField>> = {
  text: { label: "Short Text", placeholder: "Enter text..." },
  textarea: { label: "Long Text", placeholder: "Enter your message..." },
  email: { label: "Email Address", placeholder: "you@example.com" },
  number: { label: "Number", placeholder: "0" },
  select: { label: "Select Option", options: ["Option 1", "Option 2", "Option 3"] },
  multiselect: { label: "Select Options", options: ["Option 1", "Option 2", "Option 3"] },
};

interface FormBuilderProps {
  initialData?: FormData;
}

export function FormBuilder({ initialData }: FormBuilderProps) {
  const [formName, setFormName] = useState(initialData?.name || "");
  const [formDescription, setFormDescription] = useState(initialData?.description || "");
  const [fields, setFields] = useState<FormField[]>(initialData?.fields || []);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [isMobileAddFieldsOpen, setIsMobileAddFieldsOpen] = useState(false);
  const [isDesktopPopoverOpen, setIsDesktopPopoverOpen] = useState(false);

  // Load form data from sessionStorage on mount (for new forms)
  useEffect(() => {
    if (!initialData) {
      const storedData = sessionStorage.getItem("newFormData");
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          if (parsed.name) setFormName(parsed.name);
          if (parsed.description) setFormDescription(parsed.description);
          sessionStorage.removeItem("newFormData");
        } catch (e) {
          console.error("Failed to parse stored form data");
        }
      }
    }
  }, [initialData]);

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  const handleSelectField = (id: string) => {
    setSelectedFieldId(id);
    if (window.innerWidth < 1024) {
      setIsMobileSettingsOpen(true);
    }
  };

  const addField = useCallback((type: string) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: defaultFieldData[type]?.label || "New Field",
      placeholder: defaultFieldData[type]?.placeholder,
      required: false,
      options: defaultFieldData[type]?.options
        ? [...(defaultFieldData[type].options || [])]
        : undefined,
    };
    setFields((prev) => [...prev, newField]);
    setSelectedFieldId(newField.id);

    // Close responsive popups/drawers cleanly
    setIsMobileAddFieldsOpen(false);
    setIsDesktopPopoverOpen(false);

    setTimeout(() => {
      if (window.innerWidth < 1024) {
        setIsMobileSettingsOpen(true);
      }
    }, 300);
  }, []);

  const updateField = useCallback((id: string, updates: Partial<FormField>) => {
    setFields((prev) => prev.map((field) => (field.id === id ? { ...field, ...updates } : field)));
  }, []);

  const deleteField = useCallback(
    (id: string) => {
      setFields((prev) => prev.filter((field) => field.id !== id));
      if (selectedFieldId === id) {
        setSelectedFieldId(null);
        setIsMobileSettingsOpen(false);
      }
    },
    [selectedFieldId],
  );

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const getFieldIcon = (type: string) => {
    const fieldType = fieldTypes.find((f) => f.type === type);
    return fieldType?.icon || Type;
  };

  const renderFieldSettingsContent = (field: FormField) => {
    return (
      <div className="space-y-4 text-left">
        <div>
          <Label className="text-xs text-muted-foreground">Field Type</Label>
          <div className="mt-1.5 flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
            {(() => {
              const Icon = getFieldIcon(field.type);
              const fieldType = fieldTypes.find((f) => f.type === field.type);
              return (
                <>
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">{fieldType?.label}</span>
                </>
              );
            })()}
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Label</Label>
          <Input
            value={field.label}
            onChange={(e) => updateField(field.id, { label: e.target.value })}
            className="mt-1.5 bg-background"
          />
        </div>

        {(field.type === "text" ||
          field.type === "textarea" ||
          field.type === "email" ||
          field.type === "number") && (
          <div>
            <Label className="text-xs text-muted-foreground">Placeholder</Label>
            <Input
              value={field.placeholder || ""}
              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
              className="mt-1.5 bg-background"
            />
          </div>
        )}

        {(field.type === "select" || field.type === "multiselect") && (
          <div>
            <Label className="text-xs text-muted-foreground">Options (one per line)</Label>
            <Textarea
              value={field.options?.join("\n") || ""}
              onChange={(e) =>
                updateField(field.id, {
                  options: e.target.value.split("\n").filter(Boolean),
                })
              }
              className="mt-1.5 resize-none bg-background"
              rows={4}
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div>
            <p className="text-sm font-medium text-foreground">Required Field</p>
            <p className="text-xs text-muted-foreground">Respondents must complete this item</p>
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

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/forms">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="font-serif text-lg text-foreground truncate max-w-[120px] sm:max-w-xs">
            {formName || "New Form"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {selectedField && (
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden gap-1.5 text-xs"
              onClick={() => setIsMobileSettingsOpen(true)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
              <span>Edit Properties</span>
            </Button>
          )}
          <Link href={initialData?.id ? `/forms/${initialData.id}/preview` : "#"}>
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Preview</span>
            </Button>
          </Link>
          <Button
            size="sm"
            className="gap-2 bg-primary text-primary-foreground"
            onClick={handleSave}
            disabled={isSaving || !formName}
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save"}</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Field Types (visible on lg screens) */}
        <aside className="w-72 border-r border-border bg-card overflow-y-auto hidden lg:block shrink-0">
          <div className="p-5">
            <h3 className="font-semibold text-foreground text-sm mb-2">Add Fields</h3>
            <p className="text-xs text-muted-foreground mb-5">Click to add a field to your form</p>

            <div className="space-y-2">
              {fieldTypes.map((fieldType) => {
                const Icon = fieldType.icon;
                return (
                  <button
                    key={fieldType.type}
                    onClick={() => addField(fieldType.type)}
                    className="w-full flex items-start gap-3 p-3 rounded-xl border border-border/50 text-left hover:border-primary/50 hover:bg-secondary/50 transition-all group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground">{fieldType.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {fieldType.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Center - Form Canvas */}
        <main className="flex-1 overflow-y-auto bg-secondary/30 p-4 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Consolidated Main Canvas Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden"
            >
              {/* Form Static Header Banner */}
              <div className="p-6 border-b border-border/50 bg-secondary/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    <span>Live Preview Layout</span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-semibold tracking-tight">
                    {formName || "Untitled Form"}
                  </h1>
                  {formDescription ? (
                    <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                      {formDescription}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground/50 italic pt-1">
                      No form description configured. Update this layer in settings.
                    </p>
                  )}
                </div>
              </div>

              {/* Form Fields Content area */}
              <div className="p-6">
                {fields.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                      <Plus className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-foreground">No fields yet</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                      Add elements here or select fields from the sidebar to populate your form
                      layout
                    </p>

                    {/* Responsive Grid for element inputs */}
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-xl mx-auto">
                      {fieldTypes.map((fieldType) => {
                        const Icon = fieldType.icon;
                        return (
                          <Button
                            key={fieldType.type}
                            variant="outline"
                            size="sm"
                            onClick={() => addField(fieldType.type)}
                            className="gap-2 justify-start h-10 px-3"
                          >
                            <Icon className="h-4 w-4 text-primary shrink-0" />
                            <span className="truncate">{fieldType.label}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Reorder.Group
                      axis="y"
                      values={fields}
                      onReorder={setFields}
                      className="space-y-4"
                    >
                      {fields.map((field) => {
                        const Icon = getFieldIcon(field.type);
                        return (
                          <Reorder.Item key={field.id} value={field}>
                            <div
                              className={cn(
                                "group relative bg-secondary/30 rounded-xl p-4 border-2 transition-all cursor-pointer",
                                selectedFieldId === field.id
                                  ? "border-primary"
                                  : "border-transparent hover:border-border",
                              )}
                              onClick={() => handleSelectField(field.id)}
                            >
                              <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>

                              <div className="ml-6">
                                <Label className="text-foreground flex items-center gap-2">
                                  <Icon className="h-4 w-4 text-primary" />
                                  {field.label}
                                  {field.required && <span className="text-destructive">*</span>}
                                </Label>

                                <div className="mt-2">
                                  {field.type === "textarea" ? (
                                    <Textarea
                                      placeholder={field.placeholder}
                                      className="bg-card"
                                      disabled
                                    />
                                  ) : field.type === "select" ? (
                                    <Select disabled>
                                      <SelectTrigger className="bg-card">
                                        <SelectValue placeholder="Select an option" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {field.options?.map((option, i) => (
                                          <SelectItem key={i} value={option}>
                                            {option}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : field.type === "multiselect" ? (
                                    <div className="space-y-2">
                                      {field.options?.map((option, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                          <div className="h-4 w-4 rounded border border-border bg-card" />
                                          <span className="text-sm text-muted-foreground">
                                            {option}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <Input
                                      type={field.type}
                                      placeholder={field.placeholder}
                                      className="bg-card"
                                      disabled
                                    />
                                  )}
                                </div>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteField(field.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </Reorder.Item>
                        );
                      })}
                    </Reorder.Group>

                    {/* UNIFIED ADD FIELDS CONTROL (Responsive Layout Sync) */}
                    <div className="pt-2">
                      {/* Mobile Trigger (Drawer) */}
                      <div className="lg:hidden">
                        <Button
                          variant="outline"
                          onClick={() => setIsMobileAddFieldsOpen(true)}
                          className="w-full gap-2 border-dashed border-primary/40 hover:border-primary bg-background shadow-sm h-11 text-primary hover:bg-primary/5"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Another Field</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </main>

        {/* Right Sidebar - Field Properties (visible on lg screens) */}
        <aside className="w-72 border-l border-border bg-card overflow-y-auto hidden lg:block shrink-0">
          {selectedField ? (
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground text-sm">Field Settings</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFieldId(null)}
                  className="text-muted-foreground h-8 text-xs"
                >
                  Done
                </Button>
              </div>
              {renderFieldSettingsContent(selectedField)}
            </div>
          ) : (
            <div className="p-5 h-full flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-secondary/50 flex items-center justify-center mb-3">
                <Type className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No field selected</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                Click on a field in your form to edit its properties
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* Mobile Sheet - Add Fields */}
      <Sheet open={isMobileAddFieldsOpen} onOpenChange={setIsMobileAddFieldsOpen}>
        <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl">
          <SheetHeader>
            <SheetTitle className="text-left font-semibold">Choose Field Type</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-1 gap-2 mt-4 overflow-y-auto max-h-[55vh] pb-6">
            {fieldTypes.map((fieldType) => {
              const Icon = fieldType.icon;
              return (
                <button
                  key={fieldType.type}
                  onClick={() => addField(fieldType.type)}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-secondary/30 transition-all text-left"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{fieldType.label}</p>
                    <p className="text-xs text-muted-foreground">{fieldType.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Sheet - Field Settings / Properties */}
      <Sheet open={isMobileSettingsOpen} onOpenChange={setIsMobileSettingsOpen}>
        <SheetContent side="bottom" className="h-[82vh] rounded-t-2xl px-6">
          <SheetHeader className="text-left border-b border-border/40 pb-3 mb-4">
            <SheetTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <span>Modify Properties</span>
            </SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto h-[68vh] pb-8">
            {selectedField ? (
              renderFieldSettingsContent(selectedField)
            ) : (
              <p className="text-sm text-muted-foreground text-center pt-8">No element active</p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
