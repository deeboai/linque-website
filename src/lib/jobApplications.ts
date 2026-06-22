export type JobApplicationStatus = "new" | "in_review" | "shortlisted" | "rejected" | "hired";
export type JobApplicationNotificationStatus = "pending" | "sent" | "partial" | "failed";
export type JobApplicationEeoRaceEthnicity =
  | "white_not_hispanic_or_latino"
  | "black_or_african_american_not_hispanic_or_latino"
  | "asian_not_hispanic_or_latino"
  | "american_indian_or_alaskan_native_not_hispanic_or_latino"
  | "native_hawaiian_or_other_pacific_islander_not_hispanic_or_latino"
  | "two_or_more_races_or_ethnicities_not_hispanic_or_latino"
  | "hispanic_or_latino"
  | "prefer_not_to_answer";
export type JobApplicationEeoGender = "male" | "female" | "prefer_not_to_answer";
export type JobApplicationEeoVeteranStatus =
  | "protected_veteran"
  | "not_a_protected_veteran"
  | "choose_not_to_self_identify";
export type JobApplicationEeoDisabilityStatus =
  | "has_or_had_a_disability"
  | "does_not_have_a_disability"
  | "does_not_want_to_answer";

export type ScreeningQuestionKey =
  | "years_experience"
  | "commute_daily"
  | "willing_to_travel"
  | "required_credential"
  | "remote_workspace"
  | "skill_proficiency"
  | "drug_screening"
  | "flexible_schedule"
  | "open_to_relocation";

export type ScreeningAnswerType = "short_text" | "yes_no" | "scale_1_5";

export interface JobApplicationPlaceholders {
  experienceArea: string;
  commuteLocation: string;
  requiredDegreeOrCertificate: string;
  requiredSkill: string;
  relocationLocation: string;
}

export interface JobApplicationSettings {
  applicationsEnabled: boolean;
  screeningQuestionKeys: ScreeningQuestionKey[];
  placeholders: JobApplicationPlaceholders;
}

export interface JobApplicationReference {
  name: string;
  company: string;
  phone: string;
  email: string;
}

export interface JobApplicationAnswer {
  questionKey: ScreeningQuestionKey;
  questionLabel: string;
  answerType: ScreeningAnswerType;
  answer: string;
}

export interface JobApplicationEeoInput {
  applicationId: string;
  raceEthnicity: JobApplicationEeoRaceEthnicity;
  gender: JobApplicationEeoGender;
  veteranStatus: JobApplicationEeoVeteranStatus;
  disabilityStatus: JobApplicationEeoDisabilityStatus;
}

export interface JobApplicationEeoSubmissionInput {
  applicationId: string;
  jobId: string;
  raceEthnicity: JobApplicationEeoRaceEthnicity;
  gender: JobApplicationEeoGender;
  veteranStatus: JobApplicationEeoVeteranStatus;
  disabilityStatus: JobApplicationEeoDisabilityStatus;
}

export interface ScreeningQuestionDefinition {
  key: ScreeningQuestionKey;
  title: string;
  answerType: ScreeningAnswerType;
  description: string;
  getQuestion: (placeholders: JobApplicationPlaceholders) => string;
}

// These defaults keep the job editor predictable and avoid undefined checks throughout the UI.
export const defaultJobApplicationSettings: JobApplicationSettings = {
  applicationsEnabled: false,
  screeningQuestionKeys: [],
  placeholders: {
    experienceArea: "",
    commuteLocation: "",
    requiredDegreeOrCertificate: "",
    requiredSkill: "",
    relocationLocation: "",
  },
};

export const screeningQuestionDefinitions: ScreeningQuestionDefinition[] = [
  {
    key: "years_experience",
    title: "Years of experience",
    answerType: "short_text",
    description: "Role-specific experience area configured per job posting.",
    getQuestion: (placeholders) =>
      `How many years of experience do you have in ${placeholders.experienceArea || "this area"}?`,
  },
  {
    key: "commute_daily",
    title: "Daily commute",
    answerType: "yes_no",
    description: "Uses the configured commute location for the specific role.",
    getQuestion: (placeholders) =>
      `Are you able to commute to ${placeholders.commuteLocation || "the required location"} daily for this role when required?`,
  },
  {
    key: "willing_to_travel",
    title: "Travel requirement",
    answerType: "yes_no",
    description: "Confirms whether the candidate is willing to travel when the role requires it.",
    getQuestion: () => "Are you willing to travel as required for this position?",
  },
  {
    key: "required_credential",
    title: "Required credential",
    answerType: "yes_no",
    description: "Uses the configured degree or certificate requirement for the role.",
    getQuestion: (placeholders) =>
      `Do you have the required ${placeholders.requiredDegreeOrCertificate || "degree or certificate"}?`,
  },
  {
    key: "remote_workspace",
    title: "Remote workspace readiness",
    answerType: "yes_no",
    description: "Confirms the candidate can support remote or hybrid work expectations.",
    getQuestion: () =>
      "This is a remote or hybrid role. Do you have access to high-speed internet and a quiet, secluded space to work in?",
  },
  {
    key: "skill_proficiency",
    title: "Skill proficiency",
    answerType: "scale_1_5",
    description: "Uses the configured required skill and captures a 1-5 proficiency rating.",
    getQuestion: (placeholders) =>
      `How proficient are you in ${placeholders.requiredSkill || "the required skill"}?`,
  },
  {
    key: "drug_screening",
    title: "Drug screening",
    answerType: "yes_no",
    description: "Confirms whether the candidate is willing to undergo a drug screening.",
    getQuestion: () => "Are you willing to undergo a drug screening?",
  },
  {
    key: "flexible_schedule",
    title: "Flexible schedule",
    answerType: "yes_no",
    description: "Checks whether the candidate can support evening, weekend, or holiday schedules.",
    getQuestion: () =>
      "Can you work a flexible schedule, including evenings, weekends, and holidays if required?",
  },
  {
    key: "open_to_relocation",
    title: "Relocation",
    answerType: "yes_no",
    description: "Uses the configured relocation location for the role.",
    getQuestion: (placeholders) =>
      `Are you open to relocation to ${placeholders.relocationLocation || "the required location"}?`,
  },
];

export const screeningQuestionDefinitionMap = Object.fromEntries(
  screeningQuestionDefinitions.map((definition) => [definition.key, definition]),
) as Record<ScreeningQuestionKey, ScreeningQuestionDefinition>;

export const educationOptions = [
  "High school diploma or equivalent",
  "Associate degree",
  "Bachelor's degree",
  "Master's degree",
  "Doctorate",
  "Professional certification",
  "Other",
];

export const jobApplicationStatusOptions: Array<{ value: JobApplicationStatus; label: string }> = [
  { value: "new", label: "New" },
  { value: "in_review", label: "In review" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
  { value: "hired", label: "Hired" },
];

export const jobApplicationNotificationStatusLabels: Record<JobApplicationNotificationStatus, string> = {
  pending: "Emails pending",
  sent: "Emails sent",
  partial: "Emails partial",
  failed: "Emails failed",
};
export const eeoRaceEthnicityOptions: Array<{ value: JobApplicationEeoRaceEthnicity; label: string }> = [
  { value: "white_not_hispanic_or_latino", label: "White (not Hispanic or Latino)" },
  { value: "black_or_african_american_not_hispanic_or_latino", label: "Black or African-American (not Hispanic or Latino)" },
  { value: "asian_not_hispanic_or_latino", label: "Asian (not Hispanic or Latino)" },
  {
    value: "american_indian_or_alaskan_native_not_hispanic_or_latino",
    label: "American Indian or Alaskan Native (not Hispanic or Latino)",
  },
  {
    value: "native_hawaiian_or_other_pacific_islander_not_hispanic_or_latino",
    label: "Native Hawaiian or other Pacific Islander (not Hispanic or Latino)",
  },
  {
    value: "two_or_more_races_or_ethnicities_not_hispanic_or_latino",
    label: "Two or more races/ethnicities (not Hispanic or Latino)",
  },
  { value: "hispanic_or_latino", label: "Hispanic or Latino" },
  { value: "prefer_not_to_answer", label: "I don't wish to answer" },
];
export const eeoGenderOptions: Array<{ value: JobApplicationEeoGender; label: string }> = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "prefer_not_to_answer", label: "I don't wish to answer" },
];
export const eeoVeteranStatusOptions: Array<{ value: JobApplicationEeoVeteranStatus; label: string }> = [
  { value: "protected_veteran", label: "I identify as one or more classifications of protected veteran listed above" },
  { value: "not_a_protected_veteran", label: "I am not a protected veteran" },
  { value: "choose_not_to_self_identify", label: "I choose not to self-identify my protected veteran status" },
];
export const eeoDisabilityStatusOptions: Array<{ value: JobApplicationEeoDisabilityStatus; label: string }> = [
  { value: "has_or_had_a_disability", label: "Yes, I have a disability, or have had one in the past" },
  { value: "does_not_have_a_disability", label: "No, I do not have a disability and have not had one in the past" },
  { value: "does_not_want_to_answer", label: "I do not want to answer" },
];
export const equalOpportunityEmployerStatement =
  "We're an equal opportunity employer.";

export const normalizeJobApplicationSettings = (value: unknown): JobApplicationSettings => {
  const raw = typeof value === "object" && value ? (value as Partial<JobApplicationSettings>) : {};
  const rawPlaceholders =
    typeof raw.placeholders === "object" && raw.placeholders ? raw.placeholders : defaultJobApplicationSettings.placeholders;

  return {
    applicationsEnabled: Boolean(raw.applicationsEnabled),
    screeningQuestionKeys: Array.isArray(raw.screeningQuestionKeys)
      ? raw.screeningQuestionKeys.filter((key): key is ScreeningQuestionKey => key in screeningQuestionDefinitionMap)
      : [],
    placeholders: {
      experienceArea: String((rawPlaceholders as Partial<JobApplicationPlaceholders>).experienceArea ?? ""),
      commuteLocation: String((rawPlaceholders as Partial<JobApplicationPlaceholders>).commuteLocation ?? ""),
      requiredDegreeOrCertificate: String(
        (rawPlaceholders as Partial<JobApplicationPlaceholders>).requiredDegreeOrCertificate ?? "",
      ),
      requiredSkill: String((rawPlaceholders as Partial<JobApplicationPlaceholders>).requiredSkill ?? ""),
      relocationLocation: String((rawPlaceholders as Partial<JobApplicationPlaceholders>).relocationLocation ?? ""),
    },
  };
};

export const buildScreeningQuestions = (settings: JobApplicationSettings) =>
  settings.screeningQuestionKeys.map((key) => {
    const definition = screeningQuestionDefinitionMap[key];
    return {
      ...definition,
      question: definition.getQuestion(settings.placeholders),
    };
  });
