"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateFormDialogProps {
  onSubmit: (title: string, description: string, theme: string) => unknown | Promise<unknown>;
}

export function CreateFormDialog({ onSubmit }: CreateFormDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [theme, setTheme] = useState("light");

  const handleCreate = async () => {
    await onSubmit(formTitle, formDescription, theme);
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setTheme("light");
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-lg cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus className="h-4 w-4" />
          Create Form
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Create New Form</DialogTitle>
          <DialogDescription>
            Select a style and give your form a title to get started.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="form-title" className="text-sm font-medium">
              Form Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="form-title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g., Customer Feedback Survey"
              className="mt-1.5"
            />
          </div>

          {/* Theme Dropdown */}
          <div>
            <Label htmlFor="form-theme" className="text-sm font-medium">
              Theme
            </Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">FormZen Light</SelectItem>
                <SelectItem value="dark">Forest Slate</SelectItem>
                <SelectItem value="minimal">Sakura</SelectItem>
                <SelectItem value="gradient">Cyber Sunset</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="form-description" className="text-sm font-medium">
              Description <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="form-description"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="What is this form about?"
              className="mt-1.5 resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!formTitle.trim()}
              className="bg-primary text-primary-foreground"
            >
              Create Form
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
