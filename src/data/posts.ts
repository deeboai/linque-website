import digitalTransformationImg from "@/assets/blog-digital-transformation.svg";
import cultureImg from "@/assets/blog-culture.svg";
import strategyImg from "@/assets/blog-strategy.svg";
import developmentImg from "@/assets/blog-development.svg";
import complianceImg from "@/assets/blog-compliance.svg";

export interface BlogPostSection {
  heading?: string;
  body: string[];
  bullets?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  excerpt: string;
  description: string;
  publishedAt: string;
  readTimeMinutes: number;
  heroImage: string;
  content: BlogPostSection[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "future-of-hr-digital-transformation",
    title: "The Future of HR: Embracing Digital Transformation",
    category: "Technology",
    tags: ["Digital HR", "Automation", "People Analytics"],
    excerpt:
      "Digital-first experiences and connected data ecosystems are redefining how HR teams deliver value. Here is how to modernize without losing the human element.",
    description:
      "Digital-first HR programs unlock elevated employee experiences, analytics-driven decisions, and resilient operations. Learn the pillars for transforming your HR tech stack.",
    publishedAt: "2024-03-15T08:00:00.000Z",
    readTimeMinutes: 7,
    heroImage: digitalTransformationImg,
    content: [
      {
        body: [
          "HR teams are moving beyond point solutions to orchestrate connected digital ecosystems. From onboarding flows to AI-assisted workforce planning, the future of HR is defined by how seamlessly experiences are delivered.",
          "Successful transformation is not about more technology. It is about intentionally modernizing the employee journey while protecting the humanity that sits at the core of great workplaces.",
        ],
      },
      {
        heading: "Anchor on Value Moments First",
        body: [
          "Prioritize redesigning moments that directly affect employee trust and productivity. Offer guided onboarding checklists, mobile-friendly knowledge bases, and frictionless talent mobility tools before layering in advanced automation.",
        ],
        bullets: [
          "Audit the employee lifecycle to uncover top friction points.",
          "Co-create service blueprints with HR, IT, and employee stakeholders.",
          "Treat technology as an enabler of decisions, not a replacement for them.",
        ],
      },
      {
        heading: "Build a Unified Data Story",
        body: [
          "Integrated systems accelerate decision-making and scenario planning. Invest in an analytics layer that gives leaders a single view of workforce health, compliance posture, and talent pipelines.",
        ],
      },
      {
        heading: "Activate Change with Enablement",
        body: [
          "Transformation succeeds when teams understand the why. Pair system rollouts with role-based enablement, feedback loops, and executive storytelling that celebrates quick wins.",
        ],
      },
    ],
  },
  {
    slug: "culture-in-hybrid-teams",
    title: "Building a Strong Company Culture in Hybrid Teams",
    category: "Culture",
    tags: ["Hybrid Work", "Belonging", "Leadership"],
    excerpt:
      "Distributed workplaces demand intentional rituals and communication rhythms. Explore how to nurture connection, clarity, and inclusion even when teams are apart.",
    description:
      "Culture no longer lives inside a single office. Learn the rituals, leadership behaviors, and enablement programs that help hybrid teams feel connected and inspired.",
    publishedAt: "2024-03-10T08:00:00.000Z",
    readTimeMinutes: 6,
    heroImage: cultureImg,
    content: [
      {
        body: [
          "Culture is the expression of how work happens—behaviors, decisions, and rituals. In hybrid models, leaders must design deliberately for connection, clarity, and inclusion.",
        ],
      },
      {
        heading: "Design Shared Rituals",
        body: [
          "Intentional recurring touchpoints foster belonging. Rotate facilitation across teams, create asynchronous spaces for brainstorming, and keep celebrations visible to everyone.",
        ],
      },
      {
        heading: "Equip Managers",
        body: [
          "Managers are the primary translators of culture. Invest in coaching and playbooks that help them run inclusive meetings, offer developmental feedback, and champion wellbeing.",
        ],
      },
      {
        heading: "Make Recognition Effortless",
        body: [
          "Recognition reinforces the values you want to scale. Blend peer-to-peer shoutouts, leadership spotlights, and embedded rewards that align with your mission.",
        ],
      },
    ],
  },
  {
    slug: "strategic-workforce-planning-2024",
    title: "Strategic Workforce Planning: A Guide for 2024",
    category: "Strategy",
    tags: ["Workforce Planning", "Scenario Modeling", "People Analytics"],
    excerpt:
      "Winning organizations treat workforce planning as a continuous, data-informed discipline. Here is how to map skills, align demand, and stay agile in 2024.",
    description:
      "Strategic workforce planning blends demand forecasting with actionable insights about skills, location strategies, and talent readiness. Build a model that adapts to market signal.",
    publishedAt: "2024-03-05T08:00:00.000Z",
    readTimeMinutes: 8,
    heroImage: strategyImg,
    content: [
      {
        body: [
          "The planning horizon continues to compress, pushing HR and Finance to collaborate in new ways. Leaders need visibility across skills, succession, and scenario-based headcount modeling.",
        ],
      },
      {
        heading: "Bring Cross-Functional Leaders to the Table",
        body: [
          "Design planning cadences that include HR, Finance, and Business leaders. Align on macro assumptions, internal supply, and investment guardrails so decisions move faster.",
        ],
      },
      {
        heading: "Create a Skills Inventory",
        body: [
          "Layer internal talent data with market insights to understand capability strengths and gaps. Use the inventory to inform build/buy/borrow decisions and reskilling priorities.",
        ],
      },
      {
        heading: "Scenario-Test the Roadmap",
        body: [
          "Run headcount and cost models for optimistic, baseline, and constrained conditions. Scenario thinking helps leaders respond quickly without sacrificing employee experience.",
        ],
      },
    ],
  },
  {
    slug: "roi-of-employee-development-programs",
    title: "The ROI of Employee Development Programs",
    category: "Learning & Development",
    tags: ["L&D", "Career Growth", "Enablement"],
    excerpt:
      "Development is more than courses. A thoughtful capability strategy strengthens engagement, productivity, and retention. Measure impact the same way you would any investment.",
    description:
      "High-performing organizations connect development to business outcomes. Build L&D roadmaps that drive performance, retention, and innovation with clear measurement strategies.",
    publishedAt: "2024-02-28T08:00:00.000Z",
    readTimeMinutes: 5,
    heroImage: developmentImg,
    content: [
      {
        body: [
          "Employee development is one of the strongest predictors of retention. Yet many programs fail to connect learning experiences to role expectations or measurable outcomes.",
        ],
      },
      {
        heading: "Start with Capability Gaps",
        body: [
          "Identify the competencies that unlock business goals. Build pathways tailored to roles and critical moments, blending learning modalities to suit different styles.",
        ],
      },
      {
        heading: "Measure What Matters",
        body: [
          "Track engagement, completion, and performance deltas alongside employee sentiment. Partner with Finance to validate productivity and retention gains.",
        ],
      },
      {
        heading: "Scale Coaching & Feedback",
        body: [
          "Development sticks when it is reinforced by feedback and coaching. Equip managers with toolkits to embed learning into 1:1s, team meetings, and peer learning circles.",
        ],
      },
    ],
  },
  {
    slug: "navigating-hr-compliance-2024",
    title: "Navigating HR Compliance: What You Need to Know",
    category: "Compliance",
    tags: ["Compliance", "Risk Management", "Policies"],
    excerpt:
      "Compliance requirements are evolving faster than ever. Discover how to future-proof your policies, training, and auditing practices for peace of mind.",
    description:
      "Stay ahead of emerging regulations by embedding compliance readiness into policy design, training, and audits. Protect your teams without slowing innovation.",
    publishedAt: "2024-02-20T08:00:00.000Z",
    readTimeMinutes: 6,
    heroImage: complianceImg,
    content: [
      {
        body: [
          "Companies expanding across states or countries face a patchwork of legislation. Proactive compliance programs reduce risk while enabling agile ways of working.",
        ],
      },
      {
        heading: "Map Requirements Quarterly",
        body: [
          "Establish a cadence for monitoring employment law updates, data privacy changes, and wage guidelines. Document owners for each policy area to maintain accountability.",
        ],
      },
      {
        heading: "Close the Training Loop",
        body: [
          "Compliance enablement should be role-based and scenario-driven. Blend microlearning, simulations, and attestations so knowledge becomes habit.",
        ],
      },
      {
        heading: "Audit for Confidence",
        body: [
          "Use internal audits to validate documentation, security protocols, and record-keeping before regulators do. Turn findings into action plans with clear deadlines.",
        ],
      },
    ],
  },
  {
    slug: "human-centered-performance-management",
    title: "Human-Centered Performance Management in Modern Workplaces",
    category: "Performance",
    tags: ["Performance", "Employee Experience", "Leadership"],
    excerpt:
      "Replace annual reviews with a culture of continuous coaching. Learn how to shape performance programs that are fair, future-focused, and motivating.",
    description:
      "Continuous performance management relies on coaching, clarity, and data. Redesign programs to boost transparency while empowering employees to grow.",
    publishedAt: "2024-02-15T08:00:00.000Z",
    readTimeMinutes: 5,
    heroImage: strategyImg,
    content: [
      {
        body: [
          "Modern performance enablement blends goal transparency, in-the-moment feedback, and frequent development conversations. Employees expect clarity, fairness, and agency.",
        ],
      },
      {
        heading: "Make Feedback Ongoing",
        body: [
          "Normalize lightweight check-ins and feedback rituals with prompts that make it easy for managers to coach. Capture insights in shared tools for visibility.",
        ],
      },
      {
        heading: "Calibrate Fairly",
        body: [
          "Use calibration sessions and data reviews to reduce bias. Provide managers with decision frameworks anchored in competencies and documented examples.",
        ],
      },
      {
        heading: "Link Goals to Growth",
        body: [
          "Employees stay engaged when they see how their work ladders into organizational priorities. Pair goal reviews with ongoing development planning.",
        ],
      },
    ],
  },
  {
    slug: "people-analytics-foundations",
    title: "People Analytics Foundations for Scaling Organizations",
    category: "Analytics",
    tags: ["People Analytics", "Data", "Transformation"],
    excerpt:
      "Data fluency is now a core HR capability. Discover the foundational metrics, governance practices, and tools needed to build a trusted analytics program.",
    description:
      "Standing up people analytics requires the right data infrastructure, guardrails, and storytelling. Learn the building blocks for scaling responsibly.",
    publishedAt: "2024-02-05T08:00:00.000Z",
    readTimeMinutes: 7,
    heroImage: digitalTransformationImg,
    content: [
      {
        body: [
          "People analytics programs thrive when anchored in business questions. Start with stakeholder listening to determine what decisions leaders need to make faster.",
        ],
      },
      {
        heading: "Invest in Data Governance",
        body: [
          "Clear ownership, data dictionaries, and privacy standards build trust. Document how data flows across systems and who can access sensitive information.",
        ],
      },
      {
        heading: "Tell Stories with Insight",
        body: [
          "Dashboards should pair metrics with narratives. Teach HRBPs to translate insights into recommended actions that leaders can apply immediately.",
        ],
      },
    ],
  },
  {
    slug: "elevating-employer-brand",
    title: "Elevating Employer Brand with Talent Insights",
    category: "Talent",
    tags: ["Employer Brand", "Talent Acquisition", "Experience"],
    excerpt:
      "Employer brand is not just marketing—it is the promise you deliver from first touch through onboarding. Use talent insights to shape magnetic candidate experiences.",
    description:
      "High-performing brands align talent marketing with real employee experiences. Learn how to embed insights, employee stories, and feedback loops into your strategy.",
    publishedAt: "2024-01-25T08:00:00.000Z",
    readTimeMinutes: 6,
    heroImage: cultureImg,
    content: [
      {
        body: [
          "Your employer value proposition should reflect authentic experiences. Gather feedback from new hires, alumni, and candidates to understand what makes your culture compelling.",
        ],
      },
      {
        heading: "Connect Brand to Systems",
        body: [
          "Ensure the promises made in talent marketing show up in onboarding, enablement, and recognition programs. Consistency is the foundation of trust.",
        ],
      },
      {
        heading: "Activate Employee Voices",
        body: [
          "Create storytelling programs, ambassador networks, and social toolkits that empower employees to share impact stories in their own words.",
        ],
      },
    ],
  },
];

export const getPostBySlug = (slug: string) => blogPosts.find((post) => post.slug === slug);
