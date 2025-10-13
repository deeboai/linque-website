export interface JobPosting {
  slug: string;
  title: string;
  location: string;
  employmentType: "Full-time" | "Part-time" | "Contract";
  department: string;
  remoteType: "Remote" | "Hybrid" | "Onsite";
  summary: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  salaryRange?: string;
  applyEmail?: string;
  applyUrl?: string;
  postedAt: string;
}

export const jobPostings: JobPosting[] = [
  {
    slug: "senior-hr-business-partner",
    title: "Senior HR Business Partner",
    location: "Chicago, IL",
    employmentType: "Full-time",
    department: "Consulting",
    remoteType: "Hybrid",
    summary:
      "Shape people strategies for high-growth clients by delivering thoughtful advisory and operational excellence across the employee lifecycle.",
    description:
      "Linque Resourcing is searching for a Senior HR Business Partner to lead strategic engagements with growth-stage and enterprise clients. You will design and execute programs across workforce planning, employee experience, and change management while guiding HR leaders through pivotal moments.",
    responsibilities: [
      "Lead discovery, strategy design, and roadmap development for client engagements.",
      "Partner with executive stakeholders to translate business goals into people initiatives.",
      "Oversee HR program activation spanning talent, performance, and employee relations.",
      "Coach HR teams on change enablement, communications, and measurement best practices.",
      "Surface insights through analytics, dashboards, and executive-ready narratives.",
    ],
    qualifications: [
      "8+ years in HR business partnering or strategic people consulting.",
      "Demonstrated experience guiding transformations or complex change initiatives.",
      "Strong facilitation, executive presence, and stakeholder management skills.",
      "Confidence working across HR disciplines including talent, operations, and compliance.",
      "PHR/SPHR, SHRM-SCP, or similar certification preferred.",
    ],
    salaryRange: "$135,000 - $155,000 base + bonus",
    applyEmail: "careers@linqueresourcing.com",
    postedAt: "2024-02-26T08:00:00.000Z",
  },
  {
    slug: "talent-acquisition-lead",
    title: "Talent Acquisition Lead",
    location: "Remote - USA",
    employmentType: "Full-time",
    department: "Talent",
    remoteType: "Remote",
    summary:
      "Design recruiting strategies, lead searches across critical roles, and coach hiring teams to deliver best-in-class candidate experiences.",
    description:
      "As a Talent Acquisition Lead you will manage senior and niche searches while consulting with clients on candidate experience, employer brand, and recruitment operations.",
    responsibilities: [
      "Partner with hiring leaders to define search strategies, scorecards, and interview plans.",
      "Source, engage, and assess candidates with a focus on equity and inclusion.",
      "Deliver talent market insights and dashboards that inform decision-making.",
      "Coach interview teams on structured assessment and feedback loops.",
      "Support employer brand storytelling and recruitment marketing initiatives.",
    ],
    qualifications: [
      "6+ years of full-cycle recruiting experience within high-growth environments.",
      "Comfort across executive, technical, and corporate function searches.",
      "Proficiency with modern ATS/CRM tools and sourcing platforms.",
      "Strong storytelling and stakeholder coaching capabilities.",
    ],
    salaryRange: "$110,000 - $130,000 base + incentives",
    applyEmail: "talent@linqueresourcing.com",
    postedAt: "2024-02-20T08:00:00.000Z",
  },
  {
    slug: "learning-experience-designer",
    title: "Learning Experience Designer",
    location: "Atlanta, GA",
    employmentType: "Contract",
    department: "Learning & Development",
    remoteType: "Hybrid",
    summary:
      "Craft blended learning journeys, curricula, and enablement toolkits that help employees build capabilities and thrive.",
    description:
      "Join the Linque Learning team to develop workshop content, microlearning assets, and measurement plans for enterprise learning programs.",
    responsibilities: [
      "Collaborate with subject matter experts to translate business needs into learning outcomes.",
      "Design learner-centered experiences across virtual, in-person, and asynchronous modalities.",
      "Build enablement resources, guides, and communications that reinforce adoption.",
      "Measure effectiveness using feedback loops, surveys, and performance data.",
    ],
    qualifications: [
      "5+ years of instructional design or learning experience design.",
      "Portfolio showcasing learning assets across modalities.",
      "Expertise with authoring tools and learning technologies (Storyline, Rise, etc.).",
      "Comfort facilitating working sessions with stakeholders and learners.",
    ],
    salaryRange: "$75 - $90 / hour",
    applyEmail: "learning@linqueresourcing.com",
    postedAt: "2024-02-12T08:00:00.000Z",
  },
  {
    slug: "people-operations-specialist",
    title: "People Operations Specialist",
    location: "New York, NY",
    employmentType: "Full-time",
    department: "Operations",
    remoteType: "Hybrid",
    summary:
      "Deliver high-touch HR support by managing onboarding, data integrity, and policy operations for our client portfolio.",
    description:
      "This role keeps people operations running smoothly by coordinating onboarding, managing employee data, and solving day-to-day HR requests.",
    responsibilities: [
      "Manage onboarding workflows, background checks, and documentation.",
      "Maintain HRIS data accuracy, reporting, and compliance records.",
      "Serve as the first point of contact for employee questions and case routing.",
      "Support policy updates, audits, and knowledge base documentation.",
    ],
    qualifications: [
      "3+ years in HR operations, shared services, or people coordination.",
      "Working knowledge of HR systems and data integrity best practices.",
      "Detail orientation with a passion for excellent employee support.",
      "Ability to juggle multiple priorities in a fast-paced environment.",
    ],
    applyEmail: "operations@linqueresourcing.com",
    postedAt: "2024-01-30T08:00:00.000Z",
  },
];

export const getJobBySlug = (slug: string) => jobPostings.find((job) => job.slug === slug);
