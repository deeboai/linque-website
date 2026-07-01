import { useMemo, useState, type ChangeEvent } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Loader2, MinusCircle, PlusCircle, UploadCloud } from "lucide-react";

import {
  createJobApplication,
  deleteJobApplicationEeoDraft,
  submitJobApplicationEeo,
  type CMSJob,
  type CMSJobApplicationInput,
} from "@/lib/content";
import {
  buildScreeningQuestions,
  eeoDisabilityStatusOptions,
  eeoGenderOptions,
  eeoRaceEthnicityOptions,
  eeoVeteranStatusOptions,
  educationOptions,
  defaultJobApplicationSettings,
  equalOpportunityEmployerStatement,
  type ScreeningQuestionKey,
} from "@/lib/jobApplications";
import { isApplicationResumeUploadEnabled, uploadApplicationResume } from "@/lib/storage";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type JobApplicationFormValues = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  desiredPay: string;
  workAuthorization: string;
  availableStartDate: string;
  highestEducation: string;
  whyInterested: string;
  backgroundCheckConsent: string;
  futureRoleInterest: boolean;
  eeo: {
    raceEthnicity: (typeof eeoRaceEthnicityOptions)[number]["value"];
    gender: (typeof eeoGenderOptions)[number]["value"];
    veteranStatus: (typeof eeoVeteranStatusOptions)[number]["value"];
    disabilityStatus: (typeof eeoDisabilityStatusOptions)[number]["value"];
  };
  professionalReferences: Array<{
    name: string;
    company: string;
    phone: string;
    email: string;
  }>;
  screeningAnswers: Partial<Record<ScreeningQuestionKey, string>>;
};

const resumeAllowedExtensions = [".pdf", ".doc", ".docx"];
const resumeAllowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const resumeMaxSizeBytes = 5 * 1024 * 1024;
const defaultReference = { name: "", company: "", phone: "", email: "" };
const eeoIntroText =
  "You are requested (not required) to complete the personal data below. This information will only be used for government reporting purposes and not as selection criteria for our hiring process.";

const defaultValues: JobApplicationFormValues = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  desiredPay: "",
  workAuthorization: "",
  availableStartDate: "",
  highestEducation: "",
  whyInterested: "",
  backgroundCheckConsent: "",
  futureRoleInterest: false,
  // EEO answers default to opt-out values so applicants are never forced to disclose protected information.
  eeo: {
    raceEthnicity: "prefer_not_to_answer",
    gender: "prefer_not_to_answer",
    veteranStatus: "choose_not_to_self_identify",
    disabilityStatus: "does_not_want_to_answer",
  },
  professionalReferences: [defaultReference],
  screeningAnswers: {},
};

const isResumeFileAllowed = (file: File) => {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  return resumeAllowedMimeTypes.includes(file.type) || resumeAllowedExtensions.includes(extension);
};

// Shared client-side type checks so invalid emails/phones are caught before we touch storage or the database.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validateEmail = (value: string) => emailPattern.test(value.trim()) || "Enter a valid email address.";
const validatePhone = (value: string) =>
  value.replace(/\D/g, "").length >= 10 || "Enter a valid phone number with at least 10 digits.";

// Small red helper rendered beneath a field. The data-field-error hook lets us scroll to the first error on submit.
const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p data-field-error className="mt-1 text-sm font-medium text-red-600">
      {message}
    </p>
  ) : null;

interface JobApplicationFormProps {
  job: CMSJob;
}

export const JobApplicationForm = ({ job }: JobApplicationFormProps) => {
  const { toast } = useToast();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<JobApplicationFormValues>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "professionalReferences",
  });

  const applicationSettings = useMemo(
    () => ({
      applicationsEnabled: job.applicationsEnabled,
      screeningQuestionKeys: job.screeningQuestionKeys,
      requiredScreeningQuestionKeys: job.requiredScreeningQuestionKeys ?? [],
      placeholders: job.applicationPlaceholders ?? defaultJobApplicationSettings.placeholders,
    }),
    [job],
  );

  const screeningQuestions = useMemo(() => buildScreeningQuestions(applicationSettings), [applicationSettings]);

  const handleResumeSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isResumeFileAllowed(file)) {
      toast({
        title: "Unsupported file type",
        description: "Please upload a PDF, DOC, or DOCX resume.",
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    if (file.size > resumeMaxSizeBytes) {
      toast({
        title: "Resume is too large",
        description: "Please upload a file smaller than 5 MB.",
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    setResumeFile(file);
  };

  const onSubmit = async (values: JobApplicationFormValues) => {
    if (!job.id) {
      toast({
        title: "Applications are unavailable",
        description: "This role is not fully configured for internal applications yet.",
        variant: "destructive",
      });
      return;
    }

    if (!isApplicationResumeUploadEnabled) {
      toast({
        title: "Resume uploads are unavailable",
        description: "Supabase resume storage is not configured yet.",
        variant: "destructive",
      });
      return;
    }

    if (!resumeFile) {
      toast({
        title: "Resume required",
        description: "Please attach your resume before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload the resume first so the application record only persists once file storage succeeds.
      const uploadedResume = await uploadApplicationResume(resumeFile, {
        jobSlug: job.slug,
        applicantName: values.fullName,
      });

      const screeningAnswers = screeningQuestions
        .map((question) => ({
          questionKey: question.key,
          questionLabel: question.question,
          answerType: question.answerType,
          answer: values.screeningAnswers[question.key]?.trim() ?? "",
        }))
        .filter((answer) => answer.answer.length > 0);

      // A shared client-generated application id lets the separate EEO and application endpoints validate each other.
      const applicationId = crypto.randomUUID();

      const payload: CMSJobApplicationInput = {
        id: applicationId,
        jobId: job.id,
        jobSlug: job.slug,
        jobTitle: job.title,
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        address: values.address.trim(),
        desiredPay: values.desiredPay.trim(),
        workAuthorization: values.workAuthorization,
        availableStartDate: values.availableStartDate,
        highestEducation: values.highestEducation,
        whyInterested: values.whyInterested.trim(),
        backgroundCheckConsent: values.backgroundCheckConsent === "yes",
        futureRoleInterest: values.futureRoleInterest,
        professionalReferences: values.professionalReferences
          .map((reference) => ({
            name: reference.name.trim(),
            company: reference.company.trim(),
            phone: reference.phone.trim(),
            email: reference.email.trim(),
          }))
          .filter((reference) => reference.name || reference.company || reference.phone || reference.email),
        screeningAnswers,
        resumeBucket: uploadedResume.bucket,
        resumePath: uploadedResume.path,
        resumeFileName: uploadedResume.fileName,
        resumeContentType: uploadedResume.contentType,
      };

      await submitJobApplicationEeo({
        applicationId,
        jobId: job.id,
        raceEthnicity: values.eeo.raceEthnicity,
        gender: values.eeo.gender,
        veteranStatus: values.eeo.veteranStatus,
        disabilityStatus: values.eeo.disabilityStatus,
      });

      try {
        await createJobApplication(payload);
      } catch (applicationError) {
        // If the main application write fails after the EEO draft is saved, remove the EEO draft so retries stay clean.
        await deleteJobApplicationEeoDraft({ applicationId, jobId: job.id }).catch((cleanupError) => {
          console.error(cleanupError);
        });
        throw applicationError;
      }

      // Reset the public form after a successful submission so repeat applications start cleanly.
      reset(defaultValues);
      setResumeFile(null);
      setWasSubmitted(true);
      toast({
        title: "Application submitted",
        description: "Your application has been submitted",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to submit application",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fires when react-hook-form validation fails: pop a notification and scroll the applicant back to the first error.
  const onInvalid = () => {
    toast({
      title: "Please review your application",
      description:
        "Some required fields are missing or contain invalid information. We've highlighted them in red below.",
      variant: "destructive",
    });

    // Wait for the error messages to render, then bring the first one into view.
    window.setTimeout(() => {
      const firstError = document.querySelector<HTMLElement>("[data-field-error]");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  if (!job.applicationsEnabled) {
    return null;
  }

  // The Select components below are controlled via watch/setValue, so we register them here (without spreading the
  // returned props) purely to attach react-hook-form validation rules. Required screening questions register the same way.
  register("workAuthorization", { required: "Select your work authorization status." });
  register("highestEducation", { required: "Select your highest education level." });
  register("backgroundCheckConsent", { required: "Select a background screening option." });
  screeningQuestions.forEach((question) => {
    register(`screeningAnswers.${question.key}`, {
      required: question.required ? "This question is required." : false,
    });
  });

  return (
    <Card id="apply" className="border border-muted/60 bg-white/95 p-8 shadow-card space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Apply for this role</h2>
        <p className="text-sm text-muted-foreground">
          Submit your application here. Required fields are marked with an asterisk
        </p>
      </div>

      {wasSubmitted && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Your application was submitted successfully. If you&apos;d like to apply for another role, you can fill out the
          form again.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8" noValidate>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="application-full-name">
              Full name<span className="ml-1 text-red-600">*</span>
            </Label>
            <Input
              id="application-full-name"
              aria-invalid={Boolean(errors.fullName)}
              {...register("fullName", { required: "Full name is required." })}
            />
            <FieldError message={errors.fullName?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="application-email">
              Email address<span className="ml-1 text-red-600">*</span>
            </Label>
            <Input
              id="application-email"
              type="email"
              aria-invalid={Boolean(errors.email)}
              {...register("email", { required: "Email address is required.", validate: validateEmail })}
            />
            <FieldError message={errors.email?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="application-phone">
              Phone number<span className="ml-1 text-red-600">*</span>
            </Label>
            <Input
              id="application-phone"
              type="tel"
              aria-invalid={Boolean(errors.phone)}
              {...register("phone", { required: "Phone number is required.", validate: validatePhone })}
            />
            <FieldError message={errors.phone?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="application-desired-pay">
              Desired pay<span className="ml-1 text-red-600">*</span>
            </Label>
            <Input
              id="application-desired-pay"
              aria-invalid={Boolean(errors.desiredPay)}
              {...register("desiredPay", { required: "Desired pay is required." })}
            />
            <FieldError message={errors.desiredPay?.message} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="application-address">
            Address<span className="ml-1 text-red-600">*</span>
          </Label>
          <Textarea
            id="application-address"
            rows={2}
            aria-invalid={Boolean(errors.address)}
            {...register("address", { required: "Address is required." })}
          />
          <FieldError message={errors.address?.message} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>
              Work authorization<span className="ml-1 text-red-600">*</span>
            </Label>
            <Select
              value={watch("workAuthorization")}
              onValueChange={(value) => setValue("workAuthorization", value, { shouldValidate: true })}
            >
              <SelectTrigger aria-invalid={Boolean(errors.workAuthorization)}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes, I am authorized to work in the United States</SelectItem>
                <SelectItem value="no">No, I am not currently authorized to work in the United States</SelectItem>
              </SelectContent>
            </Select>
            <FieldError message={errors.workAuthorization?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="application-start-date">
              Available start date<span className="ml-1 text-red-600">*</span>
            </Label>
            <Input
              id="application-start-date"
              type="date"
              aria-invalid={Boolean(errors.availableStartDate)}
              {...register("availableStartDate", { required: "Available start date is required." })}
            />
            <FieldError message={errors.availableStartDate?.message} />
          </div>
          <div className="space-y-2">
            <Label>
              Highest education obtained<span className="ml-1 text-red-600">*</span>
            </Label>
            <Select
              value={watch("highestEducation")}
              onValueChange={(value) => setValue("highestEducation", value, { shouldValidate: true })}
            >
              <SelectTrigger aria-invalid={Boolean(errors.highestEducation)}>
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                {educationOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.highestEducation?.message} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="application-interest">
            Why are you interested in this role?<span className="ml-1 text-red-600">*</span>
          </Label>
          <Textarea
            id="application-interest"
            rows={4}
            aria-invalid={Boolean(errors.whyInterested)}
            {...register("whyInterested", { required: "Please tell us why you're interested in this role." })}
          />
          <FieldError message={errors.whyInterested?.message} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>
              Background screening<span className="ml-1 text-red-600">*</span>
            </Label>
            <Select
              value={watch("backgroundCheckConsent")}
              onValueChange={(value) => setValue("backgroundCheckConsent", value, { shouldValidate: true })}
            >
              <SelectTrigger aria-invalid={Boolean(errors.backgroundCheckConsent)}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes, I am willing to undergo a background screening</SelectItem>
                <SelectItem value="no">No, I am not willing to undergo a background screening</SelectItem>
              </SelectContent>
            </Select>
            <FieldError message={errors.backgroundCheckConsent?.message} />
          </div>
          <div className="space-y-3 rounded-xl border border-muted/50 bg-muted/10 px-4 py-3">
            <div className="flex items-start gap-3">
              <Checkbox
                id="future-role-interest"
                checked={watch("futureRoleInterest")}
                onCheckedChange={(checked) => setValue("futureRoleInterest", Boolean(checked))}
              />
              <div className="space-y-1">
                <Label htmlFor="future-role-interest">Consider me for future roles</Label>
                <p className="text-xs text-muted-foreground">
                  Linque can retain your resume and profile for future opportunities that match your background.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Professional references</h3>
              <p className="text-sm text-muted-foreground">Add up to three references with name, company, phone, and email.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={fields.length >= 3}
              onClick={() => append(defaultReference)}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add reference
            </Button>
          </div>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="rounded-xl border border-muted/60 bg-muted/10 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">Reference {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                      <MinusCircle className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`reference-name-${index}`}>Name</Label>
                    <Input id={`reference-name-${index}`} {...register(`professionalReferences.${index}.name`)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`reference-company-${index}`}>Company</Label>
                    <Input id={`reference-company-${index}`} {...register(`professionalReferences.${index}.company`)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`reference-phone-${index}`}>Phone</Label>
                    <Input id={`reference-phone-${index}`} {...register(`professionalReferences.${index}.phone`)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`reference-email-${index}`}>Email</Label>
                    <Input
                      id={`reference-email-${index}`}
                      type="email"
                      aria-invalid={Boolean(errors.professionalReferences?.[index]?.email)}
                      {...register(`professionalReferences.${index}.email`, {
                        validate: (value) => !value || emailPattern.test(value.trim()) || "Enter a valid email address.",
                      })}
                    />
                    <FieldError message={errors.professionalReferences?.[index]?.email?.message} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {screeningQuestions.length > 0 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Role-specific questions</h3>
              <p className="text-sm text-muted-foreground">
                These questions were selected for this role from Linque&apos;s approved screening question bank.
              </p>
            </div>
            <div className="space-y-4">
              {screeningQuestions.map((question) => {
                const questionError = errors.screeningAnswers?.[question.key]?.message;
                return (
                  <div key={question.key} className="rounded-xl border border-muted/60 bg-muted/10 p-4 space-y-2">
                    <Label className="text-sm font-semibold text-foreground">
                      {question.question}
                      {question.required && <span className="ml-1 text-red-600">*</span>}
                    </Label>
                    {question.answerType === "short_text" ? (
                      <Input
                        aria-invalid={Boolean(questionError)}
                        {...register(`screeningAnswers.${question.key}`, {
                          required: question.required ? "This question is required." : false,
                        })}
                      />
                    ) : (
                      <Select
                        value={watch(`screeningAnswers.${question.key}`)}
                        onValueChange={(value) =>
                          setValue(`screeningAnswers.${question.key}`, value, { shouldValidate: true })
                        }
                      >
                        <SelectTrigger aria-invalid={Boolean(questionError)}>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {question.answerType === "scale_1_5" ? (
                            ["1", "2", "3", "4", "5"].map((value) => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))
                          ) : (
                            <>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                    <FieldError message={questionError} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-3 rounded-xl border border-dashed border-muted/60 bg-muted/10 p-4">
          <div className="flex items-start gap-3">
            <UploadCloud className="mt-1 h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">
                Resume upload<span className="ml-1 text-red-600">*</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload one resume in PDF, DOC, or DOCX format. Files must be smaller than 5 MB.
              </p>
            </div>
          </div>
          <Input
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleResumeSelection}
          />
          <p className="text-xs text-muted-foreground">
            {resumeFile ? `Selected file: ${resumeFile.name}` : "No resume selected yet."}
          </p>
        </div>

        <div className="space-y-6 rounded-xl border border-muted/60 bg-muted/5 p-5">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Equal Opportunity Employer</h3>
            <p className="text-sm text-muted-foreground">{equalOpportunityEmployerStatement}</p>
            <p className="text-sm text-muted-foreground">{eeoIntroText}</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-foreground">Race</Label>
            <RadioGroup
              value={watch("eeo.raceEthnicity")}
              onValueChange={(value) => setValue("eeo.raceEthnicity", value as JobApplicationFormValues["eeo"]["raceEthnicity"])}
              className="grid gap-3 md:grid-cols-2"
            >
              {eeoRaceEthnicityOptions.map((option, index) => (
                <div key={option.value} className="flex items-center gap-3 rounded-lg border border-muted/50 bg-white/70 p-3">
                  <RadioGroupItem value={option.value} id={`eeo-race-${option.value}`} />
                  <Label htmlFor={`eeo-race-${option.value}`} className="cursor-pointer text-sm text-foreground">
                    {eeoRaceEthnicityOptions[index].label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-foreground">Gender</Label>
            <RadioGroup
              value={watch("eeo.gender")}
              onValueChange={(value) => setValue("eeo.gender", value as JobApplicationFormValues["eeo"]["gender"])}
              className="grid gap-3 md:grid-cols-3"
            >
              {eeoGenderOptions.map((option, index) => (
                <div key={option.value} className="flex items-center gap-3 rounded-lg border border-muted/50 bg-white/70 p-3">
                  <RadioGroupItem value={option.value} id={`eeo-gender-${option.value}`} />
                  <Label htmlFor={`eeo-gender-${option.value}`} className="cursor-pointer text-sm text-foreground">
                    {eeoGenderOptions[index].label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-foreground">Veteran Status</Label>
            <RadioGroup
              value={watch("eeo.veteranStatus")}
              onValueChange={(value) => setValue("eeo.veteranStatus", value as JobApplicationFormValues["eeo"]["veteranStatus"])}
              className="grid gap-3"
            >
              {eeoVeteranStatusOptions.map((option, index) => (
                <div key={option.value} className="flex items-center gap-3 rounded-lg border border-muted/50 bg-white/70 p-3">
                  <RadioGroupItem value={option.value} id={`eeo-veteran-${option.value}`} />
                  <Label htmlFor={`eeo-veteran-${option.value}`} className="cursor-pointer text-sm text-foreground">
                    {eeoVeteranStatusOptions[index].label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-foreground">Disability Status</Label>
            <RadioGroup
              value={watch("eeo.disabilityStatus")}
              onValueChange={(value) =>
                setValue("eeo.disabilityStatus", value as JobApplicationFormValues["eeo"]["disabilityStatus"])
              }
              className="grid gap-3"
            >
              {eeoDisabilityStatusOptions.map((option, index) => (
                <div key={option.value} className="flex items-center gap-3 rounded-lg border border-muted/50 bg-white/70 p-3">
                  <RadioGroupItem value={option.value} id={`eeo-disability-${option.value}`} />
                  <Label htmlFor={`eeo-disability-${option.value}`} className="cursor-pointer text-sm text-foreground">
                    {eeoDisabilityStatusOptions[index].label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Submitting…
              </>
            ) : (
              "Submit application"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};
