import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Download, Loader2, Mail, Phone, PencilLine } from "lucide-react";

import { useEeoSummary, useJobApplications, jobApplicationsQueryKey } from "@/hooks/useContent";
import { downloadApplicationResume } from "@/lib/storage";
import { updateJobApplication, type CMSJobApplication, type JobEeoSummary } from "@/lib/content";
import {
  eeoDisabilityStatusOptions,
  eeoGenderOptions,
  eeoRaceEthnicityOptions,
  eeoVeteranStatusOptions,
  jobApplicationNotificationStatusLabels,
  jobApplicationStatusOptions,
} from "@/lib/jobApplications";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const statusVariantMap = {
  new: "default",
  in_review: "secondary",
  shortlisted: "default",
  rejected: "destructive",
  hired: "default",
} as const;

const notificationVariantMap = {
  pending: "secondary",
  sent: "default",
  partial: "secondary",
  failed: "destructive",
} as const;

const emptySelection = { reviewStatus: "new" as const, adminNotes: "" };

// Label look-up maps built from the shared option arrays so we display human-readable values.
const raceLabels = Object.fromEntries(eeoRaceEthnicityOptions.map((o) => [o.value, o.label]));
const genderLabels = Object.fromEntries(eeoGenderOptions.map((o) => [o.value, o.label]));
const veteranLabels = Object.fromEntries(eeoVeteranStatusOptions.map((o) => [o.value, o.label]));
const disabilityLabels = Object.fromEntries(eeoDisabilityStatusOptions.map((o) => [o.value, o.label]));

const EeoCountList = ({
  counts,
  labels,
}: {
  counts: Record<string, number>;
  labels: Record<string, string>;
}) => (
  <ul className="space-y-1">
    {Object.entries(counts).map(([value, count]) => (
      <li key={value} className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{labels[value] ?? value}</span>
        <span className="ml-4 font-semibold tabular-nums text-foreground">{count}</span>
      </li>
    ))}
  </ul>
);

export const ApplicationsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: applications = [], isLoading } = useJobApplications();
  const { data: eeoSummary = [] } = useEeoSummary();
  const [expandedEeoJob, setExpandedEeoJob] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<CMSJobApplication | null>(null);
  const [reviewStatus, setReviewStatus] = useState<(typeof jobApplicationStatusOptions)[number]["value"]>(
    emptySelection.reviewStatus,
  );
  const [adminNotes, setAdminNotes] = useState(emptySelection.adminNotes);
  const [isDownloadingResume, setIsDownloadingResume] = useState(false);

  const groupedApplications = useMemo(() => applications, [applications]);

  const mutation = useMutation({
    mutationFn: ({ id, notes, status }: { id: string; notes: string; status: CMSJobApplication["reviewStatus"] }) =>
      updateJobApplication(id, {
        reviewStatus: status,
        adminNotes: notes,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: jobApplicationsQueryKey() });
      setSelectedApplication((current) =>
        current
          ? {
              ...current,
              reviewStatus,
              adminNotes,
            }
          : current,
      );
      toast({ title: "Application updated" });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Unable to update application",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const openApplication = (application: CMSJobApplication) => {
    setSelectedApplication(application);
    setReviewStatus(application.reviewStatus);
    setAdminNotes(application.adminNotes ?? "");
  };

  const closeDialog = (open: boolean) => {
    if (!open) {
      setSelectedApplication(null);
      setReviewStatus(emptySelection.reviewStatus);
      setAdminNotes(emptySelection.adminNotes);
    }
  };

  const handleResumeDownload = async () => {
    if (!selectedApplication) return;

    try {
      setIsDownloadingResume(true);
      const blob = await downloadApplicationResume(selectedApplication.resumeBucket, selectedApplication.resumePath);
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = selectedApplication.resumeFileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to download resume",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloadingResume(false);
    }
  };

  const handleSave = async () => {
    if (!selectedApplication?.id) return;
    await mutation.mutateAsync({
      id: selectedApplication.id,
      notes: adminNotes,
      status: reviewStatus,
    });
  };

  return (
    <Card className="border-muted/50 p-6 shadow-card">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Applications</h2>
        <p className="text-sm text-muted-foreground">
          Review submitted job applications, download resumes, and move candidates through the initial hiring workflow.
        </p>
      </div>
      <Separator className="my-6" />
      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" /> Loading applications…
        </div>
      ) : groupedApplications.length === 0 ? (
        <div className="rounded-lg border border-dashed border-muted/70 bg-muted/20 p-10 text-center text-muted-foreground">
          No applications have been submitted yet.
        </div>
      ) : (
        <div className="space-y-4">
          {groupedApplications.map((application) => (
            <div
              key={application.id ?? `${application.jobSlug}-${application.email}`}
              className="flex flex-col gap-4 rounded-xl border border-muted/60 bg-white/80 p-5 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold">{application.fullName}</h3>
                  <Badge variant={statusVariantMap[application.reviewStatus]}>{application.reviewStatus.replace("_", " ")}</Badge>
                  <Badge variant={notificationVariantMap[application.notificationStatus]}>
                    {jobApplicationNotificationStatusLabels[application.notificationStatus]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {application.jobTitle} · Submitted{" "}
                  {application.createdAt ? format(new Date(application.createdAt), "MMM d, yyyy") : "recently"}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4" aria-hidden="true" /> {application.email}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Phone className="h-4 w-4" aria-hidden="true" /> {application.phone}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => openApplication(application)}>
                  <PencilLine className="mr-2 h-4 w-4" /> Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={Boolean(selectedApplication)} onOpenChange={closeDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedApplication.fullName}</DialogTitle>
                <DialogDescription>
                  Reviewing the application for {selectedApplication.jobTitle}. Update status, read answers, and download
                  the resume from this panel.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-8 py-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Contact</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>{selectedApplication.email}</p>
                      <p>{selectedApplication.phone}</p>
                      <p>{selectedApplication.address}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Applicant summary</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Desired pay: {selectedApplication.desiredPay}</p>
                      <p>Work authorization: {selectedApplication.workAuthorization}</p>
                      <p>Available start: {selectedApplication.availableStartDate}</p>
                      <p>Education: {selectedApplication.highestEducation}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Why this role</p>
                  <p className="rounded-xl border border-muted/50 bg-muted/10 p-4 text-sm text-muted-foreground">
                    {selectedApplication.whyInterested}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Workflow flags</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Background screening: {selectedApplication.backgroundCheckConsent ? "Yes" : "No"}</p>
                      <p>Future role interest: {selectedApplication.futureRoleInterest ? "Yes" : "No"}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Email delivery</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Status: {jobApplicationNotificationStatusLabels[selectedApplication.notificationStatus]}</p>
                      <p>
                        Internal notification:{" "}
                        {selectedApplication.internalNotificationSentAt
                          ? format(new Date(selectedApplication.internalNotificationSentAt), "MMM d, yyyy h:mm a")
                          : "Not sent yet"}
                      </p>
                      <p>
                        Applicant confirmation:{" "}
                        {selectedApplication.applicantConfirmationSentAt
                          ? format(new Date(selectedApplication.applicantConfirmationSentAt), "MMM d, yyyy h:mm a")
                          : "Not sent yet"}
                      </p>
                      {selectedApplication.notificationError && (
                        <p className="text-destructive">Last error: {selectedApplication.notificationError}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Resume</p>
                    <Button variant="outline" onClick={handleResumeDownload} disabled={isDownloadingResume}>
                      {isDownloadingResume ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Downloading…
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" /> Download {selectedApplication.resumeFileName}
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Professional references</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedApplication.professionalReferences.length > 0 ? (
                      selectedApplication.professionalReferences.map((reference, index) => (
                        <div key={`${reference.email}-${index}`} className="rounded-xl border border-muted/50 bg-muted/10 p-4">
                          <p className="font-semibold text-foreground">{reference.name || "Unnamed reference"}</p>
                          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <p>{reference.company || "No company provided"}</p>
                            <p>{reference.phone || "No phone provided"}</p>
                            <p>{reference.email || "No email provided"}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No references were provided.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Screening answers</p>
                  {selectedApplication.screeningAnswers.length > 0 ? (
                    <div className="space-y-3">
                      {selectedApplication.screeningAnswers.map((answer) => (
                        <div key={answer.questionKey} className="rounded-xl border border-muted/50 bg-muted/10 p-4">
                          <p className="font-semibold text-foreground">{answer.questionLabel}</p>
                          <p className="mt-2 text-sm text-muted-foreground">{answer.answer}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">This applicant did not answer any role-specific screening questions.</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={reviewStatus} onValueChange={(value) => setReviewStatus(value as CMSJobApplication["reviewStatus"])}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobApplicationStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-notes">Admin notes</Label>
                    <Textarea
                      id="admin-notes"
                      rows={5}
                      value={adminNotes}
                      onChange={(event) => setAdminNotes(event.target.value)}
                      placeholder="Add interview notes, follow-up context, or decision rationale."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => closeDialog(false)}>
                    Close
                  </Button>
                  <Button onClick={handleSave} disabled={mutation.isPending}>
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Saving…
                      </>
                    ) : (
                      "Save review"
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {eeoSummary.length > 0 && (
        <>
          <Separator className="my-6" />
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">EEO Summary</h2>
              <p className="text-sm text-muted-foreground">
                De-identified Equal Opportunity aggregate counts per job posting. Individual responses are never
                attributed to a specific applicant.
              </p>
            </div>
            <div className="space-y-3">
              {eeoSummary.map((summary: JobEeoSummary) => {
                const isExpanded = expandedEeoJob === summary.jobId;
                return (
                  <div key={summary.jobId} className="rounded-xl border border-muted/60 bg-white/80">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      onClick={() => setExpandedEeoJob(isExpanded ? null : summary.jobId)}
                      aria-expanded={isExpanded}
                    >
                      <div>
                        <p className="font-semibold text-foreground">{summary.jobTitle}</p>
                        <p className="text-sm text-muted-foreground">{summary.totalResponses} EEO response{summary.totalResponses !== 1 ? "s" : ""}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="grid gap-6 border-t border-muted/50 px-5 py-5 md:grid-cols-2">
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Race / Ethnicity</p>
                          <EeoCountList counts={summary.raceEthnicityCounts} labels={raceLabels} />
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Gender</p>
                          <EeoCountList counts={summary.genderCounts} labels={genderLabels} />
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Veteran Status</p>
                          <EeoCountList counts={summary.veteranStatusCounts} labels={veteranLabels} />
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Disability Status</p>
                          <EeoCountList counts={summary.disabilityStatusCounts} labels={disabilityLabels} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </Card>
  );
};
