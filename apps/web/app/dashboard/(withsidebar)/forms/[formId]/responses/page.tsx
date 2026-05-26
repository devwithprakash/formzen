"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, Download, Inbox, Loader2, AlertCircle, Calendar, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetFormResponse } from "@/hooks/response/use-response";
import { useGetForm } from "@/hooks/form/use-forms";

export default function FormResponsesPage() {
  const params = useParams();
  const formId = params.formId as string;

  const { data, error, isLoading } = useGetFormResponse(formId);
  const { form } = useGetForm(formId);

  if (isLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-3 text-muted-foreground animate-in fade-in">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
        <p className="text-sm font-medium">Retrieving form submission records...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 border border-destructive/20 bg-destructive/5 rounded-xl text-destructive text-sm flex items-center gap-3 max-w-xl mx-auto mt-12 animate-in slide-in-from-top-4">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <div>
          <h5 className="font-semibold">Failed to load responses</h5>
          <p className="text-xs opacity-90 mt-0.5">
            The requested form layout might not exist or you lack sufficient access permissions.
          </p>
        </div>
      </div>
    );
  }

  const { fields, responses } = data;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 max-w-full min-w-0 overflow-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link
            href="/dashboard/forms"
            className="group flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Forms
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground tracking-tight">
            {form?.title}{" "}
            <span className="text-muted-foreground font-sans text-lg font-normal">
              ({responses.length})
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Review live raw submissions collected from your published schema.
          </p>
        </div>

        {responses.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="bg-card border-border/50 self-start sm:self-auto"
          >
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        )}
      </div>

      {responses.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border/60 rounded-2xl bg-card/30 min-h-[400px]">
          <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground mb-4">
            <Inbox className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">No submissions yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Once users start filling out this form layout interface shell, their answers will map
            safely right here.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm w-full max-w-full min-w-0">
          <div className="overflow-x-auto w-full block whitespace-nowrap ">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="p-4 w-[240px] min-w-[200px]">Submission Date</th>
                  {fields.map((field: any) => (
                    <th key={field.id} className="p-4 min-w-[220px] max-w-[350px]">
                      {field.label}
                    </th>
                  ))}
                  <th className="p-4 w-[60px] text-right bg-secondary/30" />
                </tr>
              </thead>
              <tbody className="divide-y divide-dash divide-border/40 text-sm">
                {responses.map((resp) => (
                  <tr key={resp.id} className="hover:bg-secondary/10 transition-colors group">
                    <td className="p-4 align-top">
                      {/* <div className="font-mono text-xs text-foreground font-medium truncate max-w-[180px]">
                        {resp.id}
                      </div> */}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(resp.submittedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>

                    {fields.map((field: any) => {
                      const matchingAnswer = resp.answers.find((ans) => ans.fieldId === field.id);
                      return (
                        <td
                          key={field.id}
                          className="p-4 align-top text-muted-foreground min-w-[220px] max-w-[350px] whitespace-normal break-words"
                        >
                          {matchingAnswer?.value || (
                            <span className="text-muted-foreground/30 italic text-xs">Empty</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
