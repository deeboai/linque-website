import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { blogPosts, type BlogPost } from "@/data/posts";
import { jobPostings, type JobPosting } from "@/data/jobs";

export type PublishStatus = "draft" | "published" | "scheduled";

export interface CMSPostSection {
  heading?: string;
  body: string[];
  bullets?: string[];
}

export interface CMSPost {
  id?: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  excerpt: string;
  description: string;
  heroImage: string;
  readTimeMinutes: number;
  content: CMSPostSection[];
  status: PublishStatus;
  publishedAt: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CMSJob {
  id?: string;
  title: string;
  slug: string;
  location: string;
  employmentType: string;
  department: string;
  remoteType: string;
  summary: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  salaryRange?: string | null;
  applyEmail?: string | null;
  applyUrl?: string | null;
  status: PublishStatus;
  postedAt: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface FetchOptions {
  includeDrafts?: boolean;
}

const mapBlogPost = (post: BlogPost): CMSPost => ({
  id: post.slug,
  title: post.title,
  slug: post.slug,
  category: post.category,
  tags: post.tags,
  excerpt: post.excerpt,
  description: post.description,
  heroImage: post.heroImage,
  readTimeMinutes: post.readTimeMinutes,
  content: post.content,
  status: "published",
  publishedAt: post.publishedAt,
});

const mapJobPosting = (job: JobPosting): CMSJob => ({
  id: job.slug,
  title: job.title,
  slug: job.slug,
  location: job.location,
  employmentType: job.employmentType,
  department: job.department,
  remoteType: job.remoteType,
  summary: job.summary,
  description: job.description,
  responsibilities: job.responsibilities,
  qualifications: job.qualifications,
  salaryRange: job.salaryRange ?? null,
  applyEmail: job.applyEmail ?? null,
  applyUrl: job.applyUrl ?? null,
  status: "published",
  postedAt: job.postedAt,
});

const fallbackPosts = blogPosts.map(mapBlogPost);
const fallbackJobs = jobPostings.map(mapJobPosting);

type SupabasePostRow = {
  id?: string;
  title: string;
  slug: string;
  category?: string | null;
  tags?: string[] | null;
  excerpt?: string | null;
  description?: string | null;
  hero_image?: string | null;
  read_time_minutes?: number | null;
  content?: CMSPostSection[] | null;
  status?: PublishStatus | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type SupabaseJobRow = {
  id?: string;
  title: string;
  slug: string;
  location?: string | null;
  employment_type?: string | null;
  department?: string | null;
  remote_type?: string | null;
  summary?: string | null;
  description?: string | null;
  responsibilities?: string[] | null;
  qualifications?: string[] | null;
  salary_range?: string | null;
  apply_email?: string | null;
  apply_url?: string | null;
  status?: PublishStatus | null;
  posted_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const adaptPostFromSupabase = (record: SupabasePostRow): CMSPost => ({
  id: record.id ?? undefined,
  title: record.title,
  slug: record.slug,
  category: record.category ?? "General",
  tags: record.tags ?? [],
  excerpt: record.excerpt ?? record.description ?? "",
  description: record.description ?? "",
  heroImage: record.hero_image ?? "",
  readTimeMinutes: record.read_time_minutes ?? 5,
  content: (record.content as CMSPostSection[]) ?? [],
  status: (record.status as PublishStatus) ?? "draft",
  publishedAt: record.published_at ?? null,
  createdAt: record.created_at ?? null,
  updatedAt: record.updated_at ?? null,
});

const adaptJobFromSupabase = (record: SupabaseJobRow): CMSJob => ({
  id: record.id ?? undefined,
  title: record.title,
  slug: record.slug,
  location: record.location ?? "",
  employmentType: record.employment_type ?? "",
  department: record.department ?? "",
  remoteType: record.remote_type ?? "Onsite",
  summary: record.summary ?? "",
  description: record.description ?? "",
  responsibilities: record.responsibilities ?? [],
  qualifications: record.qualifications ?? [],
  salaryRange: record.salary_range ?? null,
  applyEmail: record.apply_email ?? null,
  applyUrl: record.apply_url ?? null,
  status: (record.status as PublishStatus) ?? "draft",
  postedAt: record.posted_at ?? null,
  createdAt: record.created_at ?? null,
  updatedAt: record.updated_at ?? null,
});

export const fetchPosts = async (options: FetchOptions = {}): Promise<CMSPost[]> => {
  if (!supabase) {
    return options.includeDrafts ? fallbackPosts : fallbackPosts.filter((post) => post.status === "published");
  }
  const query = supabase
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false })
    .order("updated_at", { ascending: false, nullsFirst: true });

  const { data, error } = await query;
  if (error) {
    console.error("[fetchPosts]", error);
    return options.includeDrafts ? fallbackPosts : fallbackPosts.filter((post) => post.status === "published");
  }

  const posts = (data ?? []).map(adaptPostFromSupabase);
  return options.includeDrafts ? posts : posts.filter((post) => post.status === "published");
};

export const fetchPostBySlug = async (slug: string, options: FetchOptions = {}): Promise<CMSPost | undefined> => {
  if (!supabase) {
    const fallback = fallbackPosts.find((post) => post.slug === slug);
    return fallback && (options.includeDrafts || fallback.status === "published") ? fallback : undefined;
  }
  const query = supabase.from("posts").select("*").eq("slug", slug).maybeSingle();
  const { data, error } = await query;
  if (error) {
    console.error("[fetchPostBySlug]", error);
    return fallbackPosts.find((post) => post.slug === slug);
  }
  if (!data) return undefined;
  const post = adaptPostFromSupabase(data);
  if (!options.includeDrafts && post.status !== "published") {
    return undefined;
  }
  return post;
};

export const fetchJobs = async (options: FetchOptions = {}): Promise<CMSJob[]> => {
  if (!supabase) {
    return options.includeDrafts ? fallbackJobs : fallbackJobs.filter((job) => job.status === "published");
  }
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("posted_at", { ascending: false })
    .order("updated_at", { ascending: false, nullsFirst: true });

  if (error) {
    console.error("[fetchJobs]", error);
    return options.includeDrafts ? fallbackJobs : fallbackJobs.filter((job) => job.status === "published");
  }

  const jobs = (data ?? []).map(adaptJobFromSupabase);
  return options.includeDrafts ? jobs : jobs.filter((job) => job.status === "published");
};

export const fetchJobBySlug = async (slug: string, options: FetchOptions = {}): Promise<CMSJob | undefined> => {
  if (!supabase) {
    const fallback = fallbackJobs.find((job) => job.slug === slug);
    return fallback && (options.includeDrafts || fallback.status === "published") ? fallback : undefined;
  }
  const { data, error } = await supabase.from("jobs").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    console.error("[fetchJobBySlug]", error);
    return fallbackJobs.find((job) => job.slug === slug);
  }
  if (!data) return undefined;
  const job = adaptJobFromSupabase(data);
  if (!options.includeDrafts && job.status !== "published") {
    return undefined;
  }
  return job;
};

export type CMSPostInput = Omit<CMSPost, "createdAt" | "updatedAt">;
export type CMSJobInput = Omit<CMSJob, "createdAt" | "updatedAt">;

const ensureSupabase = () => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable CMS operations.",
    );
  }
};

export const upsertPost = async (input: CMSPostInput) => {
  ensureSupabase();
  const payload = {
    id: input.id ?? undefined,
    title: input.title,
    slug: input.slug,
    category: input.category,
    tags: input.tags,
    excerpt: input.excerpt,
    description: input.description,
    hero_image: input.heroImage,
    read_time_minutes: input.readTimeMinutes,
    content: input.content,
    status: input.status,
    published_at: input.publishedAt,
  };
  const { error } = await supabase!.from("posts").upsert(payload, { onConflict: "slug" });
  if (error) throw error;
};

export const deletePost = async (id: string) => {
  ensureSupabase();
  const { error } = await supabase!.from("posts").delete().eq("id", id);
  if (error) throw error;
};

export const upsertJob = async (input: CMSJobInput) => {
  ensureSupabase();
  const payload = {
    id: input.id ?? undefined,
    title: input.title,
    slug: input.slug,
    location: input.location,
    employment_type: input.employmentType,
    department: input.department,
    remote_type: input.remoteType,
    summary: input.summary,
    description: input.description,
    responsibilities: input.responsibilities,
    qualifications: input.qualifications,
    salary_range: input.salaryRange,
    apply_email: input.applyEmail,
    apply_url: input.applyUrl,
    status: input.status,
    posted_at: input.postedAt,
  };
  const { error } = await supabase!.from("jobs").upsert(payload, { onConflict: "slug" });
  if (error) throw error;
};

export const deleteJob = async (id: string) => {
  ensureSupabase();
  const { error } = await supabase!.from("jobs").delete().eq("id", id);
  if (error) throw error;
};

export const contentSource = {
  isRemote: isSupabaseConfigured,
  fallbackPosts,
  fallbackJobs,
};
