"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  Eye,
  Users,
  Copy,
  Trash2,
  ExternalLink,
  BarChart3,
  X,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const forms = [
  {
    id: "1",
    name: "Customer Feedback Survey",
    responses: 234,
    views: 1205,
    status: "active",
    createdAt: "Jan 15, 2024",
    lastUpdated: "2 hours ago",
    completionRate: 87,
  },
  {
    id: "2",
    name: "Job Application Form",
    responses: 89,
    views: 456,
    status: "active",
    createdAt: "Jan 10, 2024",
    lastUpdated: "1 day ago",
    completionRate: 72,
  },
  {
    id: "3",
    name: "Event Registration",
    responses: 156,
    views: 892,
    status: "draft",
    createdAt: "Jan 5, 2024",
    lastUpdated: "3 days ago",
    completionRate: 0,
  },
  {
    id: "4",
    name: "Newsletter Signup",
    responses: 1203,
    views: 3421,
    status: "active",
    createdAt: "Dec 20, 2023",
    lastUpdated: "1 week ago",
    completionRate: 94,
  },
  {
    id: "5",
    name: "Product Feedback",
    responses: 45,
    views: 234,
    status: "paused",
    createdAt: "Dec 15, 2023",
    lastUpdated: "2 weeks ago",
    completionRate: 65,
  },
  {
    id: "6",
    name: "Contact Us Form",
    responses: 567,
    views: 2341,
    status: "active",
    createdAt: "Dec 1, 2023",
    lastUpdated: "3 days ago",
    completionRate: 91,
  },
];

export default function FormsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const filteredForms = forms.filter((form) => {
    const matchesSearch = form.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateForm = () => {
    if (!formTitle.trim()) return;

    // Store form data in sessionStorage to pass to the form builder
    const formData = {
      name: formTitle,
      description: formDescription,
    };
    sessionStorage.setItem("newFormData", JSON.stringify(formData));

    // Navigate to form builder
    router.push("/dashboard/forms/new");
    setIsDialogOpen(false);
    setFormTitle("");
    setFormDescription("");
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Forms</h1>
          <p className="text-muted-foreground mt-1">Manage and organize all your forms.</p>
        </div>

        {/* Create Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" />
              Create Form
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">Create New Form</DialogTitle>
              <DialogDescription>
                Give your form a title and description to get started.
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
                  autoFocus
                />
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
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setFormTitle("");
                    setFormDescription("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateForm}
                  disabled={!formTitle.trim()}
                  className="bg-primary text-primary-foreground"
                >
                  Create Form
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border/50"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] bg-card border-border/50">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Forms Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredForms.map((form, index) => (
          <motion.div
            key={form.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-card rounded-xl border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/forms/${form.id}/edit`}
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Edit Form
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/forms/${form.id}/preview`} className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Preview
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/forms/${form.id}/analytics`}
                        className="flex items-center gap-2"
                      >
                        <BarChart3 className="h-4 w-4" />
                        Analytics
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Copy className="h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/forms/${form.id}/settings`}
                        className="flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Link href={`/forms/${form.id}/edit`}>
                <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
                  {form.name}
                </h3>
              </Link>

              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    form.status === "active"
                      ? "bg-primary/10 text-primary"
                      : form.status === "draft"
                        ? "bg-muted text-muted-foreground"
                        : "bg-chart-4/50 text-foreground"
                  }`}
                >
                  {form.status}
                </span>
                <span className="text-xs text-muted-foreground">Created {form.createdAt}</span>
              </div>

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-1.5 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">{form.responses}</span>
                  <span className="text-muted-foreground text-xs">responses</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">{form.views}</span>
                  <span className="text-muted-foreground text-xs">views</span>
                </div>
              </div>

              {form.status !== "draft" && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Completion rate</span>
                    <span className="text-foreground font-medium">{form.completionRate}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${form.completionRate}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Create New Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: filteredForms.length * 0.05 }}
          onClick={() => setIsDialogOpen(true)}
          className="bg-card rounded-xl border border-dashed border-border/50 h-full min-h-[200px] flex flex-col items-center justify-center hover:border-primary/50 hover:bg-secondary/30 transition-all duration-300 cursor-pointer"
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <p className="font-medium text-foreground">Create New Form</p>
          <p className="text-sm text-muted-foreground mt-1">Start from scratch</p>
        </motion.div>
      </div>
    </div>
  );
}
