"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  Eye,
  Users,
  Trash2,
  ExternalLink,
  BarChart3,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { CreateFormDialog } from "@/components/form-builder/create-form-dialog";
import { useCreateForm, useDeleteForm, useGetAllForms } from "@/hooks/form/use-forms";
import { useRouter } from "next/navigation";

export default function FormsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  const { submitForm } = useCreateForm();
  const { data: forms } = useGetAllForms();
  const { deleteMutation } = useDeleteForm();

  const filteredForms =
    forms?.filter((form) => {
      const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || form.visibility === statusFilter;

      return matchesSearch && matchesStatus;
    }) ?? [];

  const handleDeleteForm = async (formId: string) => {
    try {
      await deleteMutation.mutateAsync({ formId });
      router.push("/dashboard/forms");
    } catch (error) {
      console.error("Failed to delete form", error);
    }
  };

  const handleCopyLink = async (slug: string) => {
    const url = `${process.env.FRONTEND_URL}/${slug}`;

    await navigator.clipboard.writeText(url);
  };

  const getVisibilityStyles = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
      case "unlisted":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
      case "private":
        return "bg-rose-500/10 text-rose-700 dark:text-rose-400";
      default:
        return "bg-slate-500/10 text-slate-700 dark:text-slate-400";
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Forms</h1>
          <p className="text-muted-foreground mt-1">Manage and organize all your forms.</p>
        </div>

        <CreateFormDialog onSubmit={submitForm} />
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
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="unlisted">Unlisted</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Forms Grid Layout */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredForms.map((form, index) => (
          <motion.div
            key={form.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group bg-card rounded-xl border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
          >
            <div className="p-5">
              {/* Top Header Row */}
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/15">
                  <FileText className="h-5 w-5 text-primary" />
                </div>

                {/* Options Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 cursor-pointer w-8 hover:bg-muted"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/forms/${form.id}/builder`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <FileText className="h-4 w-4 opacity-70" />
                        Edit Form
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/forms/${form.id}/preview`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Eye className="h-4 w-4 opacity-70" />
                        Preview
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/forms/${form.id}/responses`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <BarChart3 className="h-4 w-4 opacity-70" />
                        Responses
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleCopyLink(form.slug)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <ExternalLink className="h-4 w-4 opacity-70" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/forms/${form.id}/edit`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Settings className="h-4 w-4 opacity-70" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteForm(form.id)}
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Title */}
              <Link
                href={`/dashboard/forms/${form.id}/builder`}
                className="inline-block max-w-full"
              >
                <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 text-base tracking-tight">
                  {form.title}
                </h3>
              </Link>
              <div className="flex items-center gap-2.5 mt-1.5">
                <span
                  className={`text-xs px-2.5 py-0.5 font-medium rounded-full ${getVisibilityStyles(
                    form.visibility,
                  )}`}
                >
                  {form.visibility}
                </span>
                <span className="text-xs text-muted-foreground/80">
                  Created{" "}
                  {new Date(form.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/60">
                <div className="flex items-baseline gap-1 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground self-center mr-1" />
                  <span className="text-foreground font-semibold">{form.responseCount}</span>
                  <span className="text-muted-foreground text-xs">responses</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: filteredForms.length * 0.05 }}
          className="relative rounded-xl overflow-hidden h-full min-h-[200px]"
        ></motion.div>
      </div>
    </div>
  );
}
