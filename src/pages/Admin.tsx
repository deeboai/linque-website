import { useEffect, useMemo, useState } from "react";
import { type Session } from "@supabase/supabase-js";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import {
  upsertPost,
  deletePost,
  upsertJob,
  deleteJob,
  type CMSPost,
  type CMSJob,
  type PublishStatus,
  type CMSPostSection,
} from "@/lib/content";
import { usePosts, useJobs, postsQueryKey, jobsQueryKey } from "@/hooks/useContent";
import AnimatedSection from "@/components/AnimatedSection";
import { CustomAuth } from "@/components/CustomAuth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Pencil, Trash, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Seo from "@/components/Seo";
import { buildCanonicalUrl } from "@/lib/seo";

type PostFormValues = {
  id?: string;
  title: string;
  slug: string;
  category: string;
  tags: string;
  excerpt: string;
  description: string;
  heroImage: string;
  readTimeMinutes: number;
  status: PublishStatus;
  publishedAt: string;
  sections: Array<{
    heading: string;
    body: string;
    bullets: string;
  }>;
};

type JobFormValues = {
  id?: string;
  title: string;
  slug: string;
  location: string;
  employmentType: string;
  department: string;
  remoteType: string;
  summary: string;
  description: string;
  responsibilities: string;
  qualifications: string;
  salaryRange: string;
  applyEmail: string;
  applyUrl: string;
  status: PublishStatus;
  postedAt: string;
};

const defaultPostSection = { heading: "", body: "", bullets: "" };

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const toDateInputValue = (isoString: string | null | undefined) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  return localISOTime;
};

const toIsoIfValue = (value: string) => {
  if (!value) return null;
  return new Date(value).toISOString();
};

const formatTags = (tags: string[]) => tags.join(", ");

const parseTags = (value: string) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

const sectionsFromPost = (content: CMSPostSection[] = []) =>
  content.length
    ? content.map((section) => ({
        heading: section.heading ?? "",
        body: (section.body ?? []).join("\n"),
        bullets: (section.bullets ?? []).join("\n"),
      }))
    : [defaultPostSection];

const mapPostToFormValues = (post?: CMSPost): PostFormValues => ({
  id: post?.id,
  title: post?.title ?? "",
  slug: post?.slug ?? "",
  category: post?.category ?? "",
  tags: formatTags(post?.tags ?? []),
  excerpt: post?.excerpt ?? "",
  description: post?.description ?? "",
  heroImage: post?.heroImage ?? "",
  readTimeMinutes: post?.readTimeMinutes ?? 5,
  status: post?.status ?? "draft",
  publishedAt: toDateInputValue(post?.publishedAt),
  sections: sectionsFromPost(post?.content),
});

const mapJobToFormValues = (job?: CMSJob): JobFormValues => ({
  id: job?.id,
  title: job?.title ?? "",
  slug: job?.slug ?? "",
  location: job?.location ?? "",
  employmentType: job?.employmentType ?? "",
  department: job?.department ?? "",
  remoteType: job?.remoteType ?? "",
  summary: job?.summary ?? "",
  description: job?.description ?? "",
  responsibilities: (job?.responsibilities ?? []).join("\n"),
  qualifications: (job?.qualifications ?? []).join("\n"),
  salaryRange: job?.salaryRange ?? "",
  applyEmail: job?.applyEmail ?? "",
  applyUrl: job?.applyUrl ?? "",
  status: job?.status ?? "draft",
  postedAt: toDateInputValue(job?.postedAt),
});

const Admin = () => {
  const canonicalUrl = useMemo(() => buildCanonicalUrl("/admin"), []);
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    
    // Get initial session
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Session check error:', error);
        setSession(null);
      } else {
        console.log('Initial session:', data.session ? 'Found' : 'None');
        setSession(data.session);
      }
      setAuthChecked(true);
    });
    
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state change:', event, newSession ? 'Session exists' : 'No session');
      setSession(newSession);
      setAuthChecked(true);
    });
    
    return () => listener?.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    if (!supabase) return;
    try {
      console.log('Starting sign out process...');
      
      // Force sign out with global scope to invalidate all sessions
      await supabase.auth.signOut({ scope: 'global' });
      
      // Manually clear all Supabase data from localStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('supabase')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Also clear sessionStorage
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.includes('supabase')) {
          sessionStorage.removeItem(key);
        }
      }
      
      // Manually clear session state
      setSession(null);
      setAuthChecked(true);
      
      console.log('Sign out complete, storage cleared');
      toast({ title: "Signed out successfully" });
      
      // Force page reload with cache bypass for Arc/Chrome browsers
      setTimeout(() => {
        // Try cache-busting reload first
        window.location.href = window.location.href + '?_t=' + Date.now();
      }, 100);
    } catch (error) {
      console.error('Sign out error:', error);
      toast({ title: "Error signing out", variant: "destructive" });
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="container mx-auto px-4 py-24">
        <Seo
          title="Admin | Linque Resourcing"
          description="Configure Supabase to enable the Linque Resourcing content manager."
          canonicalUrl={canonicalUrl}
          noIndex
        />
        <AnimatedSection animation="fade-in-up" className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-3xl font-bold">Content Manager Unavailable</h1>
          <p className="text-muted-foreground">
            Supabase credentials are not configured. Add <code>VITE_SUPABASE_URL</code> and{" "}
            <code>VITE_SUPABASE_ANON_KEY</code> to your environment variables to enable the admin experience.
          </p>
          <Button variant="outline" asChild>
            <a href="https://supabase.com/docs" target="_blank" rel="noreferrer noopener">
              View Supabase Docs
            </a>
          </Button>
        </AnimatedSection>
      </div>
    );
  }

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" /> Checking session…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-24">
        <Seo
          title="Admin Login | Linque Resourcing"
          description="Authenticate to manage posts and job listings."
          canonicalUrl={canonicalUrl}
          noIndex
        />
        <CustomAuth />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Seo
        title="Admin | Linque Resourcing"
        description="Manage blog posts and job listings for Linque Resourcing."
        canonicalUrl={canonicalUrl}
        noIndex
      />
      <AnimatedSection animation="fade-in-up" className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold">Content Manager</h1>
          <p className="text-muted-foreground mt-2">
            Add, update, and publish blog posts or job listings. Changes sync instantly with the public site.
          </p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </AnimatedSection>
      <Tabs defaultValue="posts">
        <TabsList className="mb-6">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <PostsManager />
        </TabsContent>
        <TabsContent value="jobs">
          <JobsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PostsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: posts = [], isLoading } = usePosts({ includeDrafts: true });
  const [editingPost, setEditingPost] = useState<CMSPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: upsertPost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postsQueryKey({ includeDrafts: true }) });
      toast({ title: "Post saved" });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error(error);
      toast({ title: "Unable to save post", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postsQueryKey({ includeDrafts: true }) });
      toast({ title: "Post deleted" });
    },
    onError: (error) => {
      console.error(error);
      toast({ title: "Unable to delete post", variant: "destructive" });
    },
  });

  const handleEdit = (post?: CMSPost) => {
    setEditingPost(post ?? null);
    setIsDialogOpen(true);
  };

  const handleDelete = (post: CMSPost) => {
    if (!post.id) {
      toast({ title: "Missing post identifier", variant: "destructive" });
      return;
    }
    if (window.confirm(`Delete "${post.title}"? This action cannot be undone.`)) {
      deleteMutation.mutate(post.id);
    }
  };

  return (
    <Card className="border-muted/50 p-6 shadow-card">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Blog posts</h2>
          <p className="text-sm text-muted-foreground">
            Draft, schedule, and publish posts. Remote content overrides the fallback static content bundled with the app.
          </p>
        </div>
        <Button onClick={() => handleEdit()} className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" /> New post
        </Button>
      </div>
      <Separator className="my-6" />
      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" /> Loading posts…
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-muted/70 bg-muted/20 p-10 text-center text-muted-foreground">
          No posts yet. Click “New post” to create one.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id ?? post.slug}
              className="flex flex-col gap-4 rounded-xl border border-muted/60 bg-white/80 p-5 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <Badge variant={post.status === "published" ? "default" : "secondary"}>{post.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  /linque-learn/{post.slug} ·{" "}
                  {post.publishedAt ? `Published ${new Date(post.publishedAt).toLocaleDateString()}` : "Not scheduled"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleEdit(post)}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(post)} disabled={deleteMutation.isPending}>
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <PostDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        post={editingPost ?? undefined}
        onSubmit={(values) => mutation.mutate(values)}
        submitting={mutation.isPending}
      />
    </Card>
  );
};

const JobsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: jobs = [], isLoading } = useJobs({ includeDrafts: true });
  const [editingJob, setEditingJob] = useState<CMSJob | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: upsertJob,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: jobsQueryKey({ includeDrafts: true }) });
      toast({ title: "Job saved" });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error(error);
      toast({ title: "Unable to save job", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: jobsQueryKey({ includeDrafts: true }) });
      toast({ title: "Job deleted" });
    },
    onError: (error) => {
      console.error(error);
      toast({ title: "Unable to delete job", variant: "destructive" });
    },
  });

  const handleEdit = (job?: CMSJob) => {
    setEditingJob(job ?? null);
    setIsDialogOpen(true);
  };

  const handleDelete = (job: CMSJob) => {
    if (!job.id) {
      toast({ title: "Missing job identifier", variant: "destructive" });
      return;
    }
    if (window.confirm(`Delete "${job.title}"? This action cannot be undone.`)) {
      deleteMutation.mutate(job.id);
    }
  };

  return (
    <Card className="border-muted/50 p-6 shadow-card">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Job listings</h2>
          <p className="text-sm text-muted-foreground">
            Manage open roles and keep your careers page in sync. Published positions appear immediately.
          </p>
        </div>
        <Button onClick={() => handleEdit()} className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" /> New job
        </Button>
      </div>
      <Separator className="my-6" />
      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" /> Loading job listings…
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-muted/70 bg-muted/20 p-10 text-center text-muted-foreground">
          No roles published yet. Click “New job” to create one.
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id ?? job.slug}
              className="flex flex-col gap-4 rounded-xl border border-muted/60 bg-white/80 p-5 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <Badge variant={job.status === "published" ? "default" : "secondary"}>{job.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {job.location} · {job.employmentType} · /jobs/{job.slug}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleEdit(job)}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(job)} disabled={deleteMutation.isPending}>
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <JobDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        job={editingJob ?? undefined}
        onSubmit={(values) => mutation.mutate(values)}
        submitting={mutation.isPending}
      />
    </Card>
  );
};

interface PostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: CMSPost;
  submitting: boolean;
  onSubmit: (values: Parameters<typeof upsertPost>[0]) => void;
}

const PostDialog = ({ open, onOpenChange, post, submitting, onSubmit }: PostDialogProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const { control, register, handleSubmit, watch, setValue } = useForm<PostFormValues>({
    defaultValues: mapPostToFormValues(post),
    values: mapPostToFormValues(post),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  const formValues = watch();

  useEffect(() => {
    if (!post) {
      setValue("sections", [defaultPostSection]);
    }
  }, [post, setValue]);

  const handleGenerateSlug = () => {
    const slug = slugify(watch("title"));
    setValue("slug", slug);
  };

  const submit = (values: PostFormValues) => {
    const payload = {
      id: values.id,
      title: values.title,
      slug: values.slug || slugify(values.title),
      category: values.category || "General",
      tags: parseTags(values.tags),
      excerpt: values.excerpt,
      description: values.description,
      heroImage: values.heroImage,
      readTimeMinutes: Number(values.readTimeMinutes) || 5,
      status: values.status,
      publishedAt: toIsoIfValue(values.publishedAt),
      content: values.sections.map((section) => ({
        heading: section.heading || undefined,
        body: section.body
          ? section.body.split("\n").map((paragraph) => paragraph.trim()).filter(Boolean)
          : [],
        bullets: section.bullets
          ? section.bullets.split("\n").map((bullet) => bullet.trim()).filter(Boolean)
          : undefined,
      })),
    };
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{post ? "Edit post" : "Create post"}</DialogTitle>
              <DialogDescription>
                Published posts appear automatically on the Linque Learn page. Drafts remain private until published.
              </DialogDescription>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowPreview(!showPreview)}
              className="shrink-0"
            >
              {showPreview ? "Edit" : "Preview"}
            </Button>
          </div>
        </DialogHeader>
        
        {showPreview ? (
          <div className="py-4 space-y-4">
            <div className="border rounded-lg p-6 bg-white">
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{formValues.title || "Untitled Post"}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  {formValues.category && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{formValues.category}</span>}
                  <span>Status: {formValues.status || 'draft'}</span>
                  {formValues.readTimeMinutes && <span>{formValues.readTimeMinutes} min read</span>}
                </div>
                {formValues.excerpt && (
                  <p className="text-lg text-gray-700 italic border-l-4 border-blue-500 pl-4 mb-6">
                    {formValues.excerpt}
                  </p>
                )}
              </div>
              
              <div className="prose max-w-none">
                {formValues.sections && formValues.sections.length > 0 ? (
                  formValues.sections.map((section, index) => (
                    <div key={index} className="mb-6">
                      {section.heading && <h2 className="text-xl font-semibold mb-3">{section.heading}</h2>}
                      {section.body && (
                        <div className="whitespace-pre-wrap text-gray-700">{section.body}</div>
                      )}
                      {section.bullets && (
                        <ul className="list-disc list-inside mt-2">
                          {section.bullets.split('\n').filter(bullet => bullet.trim()).map((bullet, idx) => (
                            <li key={idx} className="text-gray-700">{bullet.trim()}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No content sections added yet.</p>
                )}
              </div>
              
              {formValues.tags && (
                <div className="mt-6 pt-4 border-t">
                  <div className="flex flex-wrap gap-2">
                    {formValues.tags.split(',').map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit(submit)} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Saving…
                  </>
                ) : (
                  "Save post"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(submit)} className="space-y-6 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title", { required: true })} placeholder="Post title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <p className="text-sm text-gray-600">URL-friendly version of the title (e.g., "my-blog-post"). Click "Auto" to generate from title.</p>
              <div className="flex gap-2">
                <Input id="slug" {...register("slug", { required: true })} placeholder="auto-generated" />
                <Button type="button" variant="outline" onClick={handleGenerateSlug}>
                  Auto
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" {...register("category")} placeholder="Category label" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" {...register("tags")} placeholder="tag one, tag two" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => setValue("status", value as "draft" | "scheduled" | "published")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft - Save without publishing</SelectItem>
                  <SelectItem value="scheduled">Scheduled - Publish at specified date</SelectItem>
                  <SelectItem value="published">Published - Make live on website now</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="publishedAt">Publish date & time</Label>
              <p className="text-sm text-gray-600">Set when this post should be published. Leave empty to publish immediately when status is "Published".</p>
              <Input id="publishedAt" type="datetime-local" {...register("publishedAt")} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="heroImage">Hero image URL</Label>
              <Input id="heroImage" {...register("heroImage")} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="readTimeMinutes">Read time (minutes)</Label>
              <Input id="readTimeMinutes" type="number" min={1} {...register("readTimeMinutes", { valueAsNumber: true })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <p className="text-sm text-gray-600">A short summary of your post (2-3 sentences). This appears on the blog listing page and in social media previews.</p>
            <Textarea id="excerpt" rows={2} {...register("excerpt")} placeholder="Write a compelling summary of your post..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">SEO description</Label>
            <p className="text-sm text-gray-600">Meta description for search engines (150-160 characters). This appears in Google search results under your page title.</p>
            <Textarea id="description" rows={2} {...register("description")} placeholder="Describe your post for search engines..." />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Content sections</Label>
              <Button
                type="button"
                variant="outline"
                onClick={() => append(defaultPostSection)}
                className="h-8 px-3 text-sm"
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Add section
              </Button>
            </div>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="rounded-xl border border-muted/60 bg-muted/10 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Section {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-8 px-2 text-sm text-destructive hover:text-destructive"
                        onClick={() => remove(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`sections.${index}.heading`}>Heading</Label>
                    <Input id={`sections.${index}.heading`} {...register(`sections.${index}.heading` as const)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`sections.${index}.body`}>Body (paragraphs, one per line)</Label>
                    <Textarea id={`sections.${index}.body`} rows={3} {...register(`sections.${index}.body` as const)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`sections.${index}.bullets`}>Bullets (optional, one per line)</Label>
                    <Textarea
                      id={`sections.${index}.bullets`}
                      rows={2}
                      {...register(`sections.${index}.bullets` as const)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Saving…
                </>
              ) : (
                "Save post"
              )}
            </Button>
          </div>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface JobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: CMSJob;
  submitting: boolean;
  onSubmit: (values: Parameters<typeof upsertJob>[0]) => void;
}

const JobDialog = ({ open, onOpenChange, job, submitting, onSubmit }: JobDialogProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const { register, handleSubmit, watch, setValue } = useForm<JobFormValues>({
    defaultValues: mapJobToFormValues(job),
    values: mapJobToFormValues(job),
  });

  const formValues = watch();

  const submit = (values: JobFormValues) => {
    const payload = {
      id: values.id,
      title: values.title,
      slug: values.slug || slugify(values.title),
      location: values.location,
      employmentType: values.employmentType,
      department: values.department,
      remoteType: values.remoteType,
      summary: values.summary,
      description: values.description,
      responsibilities: values.responsibilities
        ? values.responsibilities.split("\n").map((item) => item.trim()).filter(Boolean)
        : [],
      qualifications: values.qualifications
        ? values.qualifications.split("\n").map((item) => item.trim()).filter(Boolean)
        : [],
      salaryRange: values.salaryRange || null,
      applyEmail: values.applyEmail || null,
      applyUrl: values.applyUrl || null,
      status: values.status,
      postedAt: toIsoIfValue(values.postedAt),
    };
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{job ? "Edit job" : "Create job"}</DialogTitle>
              <DialogDescription>
                Published jobs appear instantly on the careers page. Drafts remain private until published.
              </DialogDescription>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowPreview(!showPreview)}
              className="shrink-0"
            >
              {showPreview ? "Edit" : "Preview"}
            </Button>
          </div>
        </DialogHeader>
        
        {showPreview ? (
          <div className="py-4 space-y-4">
            <div className="border rounded-lg p-6 bg-white">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{formValues.title || "Untitled Job"}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">{formValues.department || "General"}</span>
                  <span>{formValues.location}</span>
                  <span>{formValues.employmentType}</span>
                  <span>{formValues.remoteType}</span>
                  <span>Status: {formValues.status || 'draft'}</span>
                </div>
                {formValues.salaryRange && (
                  <p className="text-lg font-semibold text-gray-900 mb-4">
                    💰 {formValues.salaryRange}
                  </p>
                )}
              </div>
              
              <div className="space-y-6">
                {formValues.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                    <div className="whitespace-pre-wrap text-gray-700">{formValues.description}</div>
                  </div>
                )}
                
                {formValues.responsibilities && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {formValues.responsibilities.split('\n').filter(resp => resp.trim()).map((resp, index) => (
                        <li key={index} className="text-gray-700">{resp.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {formValues.qualifications && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Qualifications</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {formValues.qualifications.split('\n').filter(qual => qual.trim()).map((qual, index) => (
                        <li key={index} className="text-gray-700">{qual.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-2">How to Apply</h3>
                  {formValues.applyEmail && (
                    <p className="mb-2">
                      <strong>Email:</strong> <a href={`mailto:${formValues.applyEmail}`} className="text-blue-600 hover:underline">{formValues.applyEmail}</a>
                    </p>
                  )}
                  {formValues.applyUrl && (
                    <p>
                      <strong>Application URL:</strong> <a href={formValues.applyUrl} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{formValues.applyUrl}</a>
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit(submit)} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Saving…
                  </>
                ) : (
                  "Save job"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(submit)} className="space-y-6 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="job-title">Title</Label>
              <Input id="job-title" {...register("title", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-slug">Slug</Label>
              <Input id="job-slug" {...register("slug")} placeholder="auto-generated" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="job-location">Location</Label>
              <Input id="job-location" {...register("location")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-employmentType">Employment type</Label>
              <Input id="job-employmentType" {...register("employmentType")} placeholder="Full-time" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-remoteType">Work style</Label>
              <Input id="job-remoteType" {...register("remoteType")} placeholder="Remote / Hybrid / Onsite" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="job-department">Department</Label>
              <Input id="job-department" {...register("department")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-salary">Salary range</Label>
              <Input id="job-salary" {...register("salaryRange")} placeholder="$120k - $140k" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="job-status">Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => setValue("status", value as "draft" | "scheduled" | "published")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft - Save without publishing</SelectItem>
                  <SelectItem value="scheduled">Scheduled - Publish at specified date</SelectItem>
                  <SelectItem value="published">Published - Make live on website now</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-postedAt">Publish date & time</Label>
              <p className="text-sm text-gray-600">Set when this job should be published. Leave empty to publish immediately when status is "Published".</p>
              <Input id="job-postedAt" type="datetime-local" {...register("postedAt")} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="job-apply-email">Apply email</Label>
              <Input id="job-apply-email" type="email" {...register("applyEmail")} placeholder="careers@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-apply-url">Apply URL</Label>
              <Input id="job-apply-url" {...register("applyUrl")} placeholder="https://cal.com/..." />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-summary">Summary</Label>
            <Textarea id="job-summary" rows={2} {...register("summary")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-description">Description</Label>
            <Textarea id="job-description" rows={3} {...register("description")} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="job-responsibilities">Responsibilities (one per line)</Label>
              <Textarea id="job-responsibilities" rows={4} {...register("responsibilities")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-qualifications">Qualifications (one per line)</Label>
              <Textarea id="job-qualifications" rows={4} {...register("qualifications")} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Saving…
                </>
              ) : (
                "Save job"
              )}
            </Button>
          </div>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Admin;
