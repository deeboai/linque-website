import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  contentSource,
  fetchJobBySlug,
  fetchJobs,
  fetchPostBySlug,
  fetchPosts,
  type CMSJob,
  type CMSPost,
  type FetchOptions,
} from "@/lib/content";

const basePostsKey = "posts";
const baseJobsKey = "jobs";

export const postsQueryKey = (options?: FetchOptions) => [basePostsKey, options?.includeDrafts ?? false];
export const jobsQueryKey = (options?: FetchOptions) => [baseJobsKey, options?.includeDrafts ?? false];

export const usePosts = (options?: FetchOptions) => {
  const includeDrafts = options?.includeDrafts ?? false;
  return useQuery({
    queryKey: postsQueryKey({ includeDrafts }),
    queryFn: () => fetchPosts({ includeDrafts }),
    staleTime: 60 * 1000,
    initialData: includeDrafts ? undefined : contentSource.fallbackPosts,
  });
};

export const usePost = (slug: string | undefined, options?: FetchOptions) => {
  const includeDrafts = options?.includeDrafts ?? false;
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["post", slug, includeDrafts],
    queryFn: () => fetchPostBySlug(slug!, { includeDrafts }),
    enabled: Boolean(slug),
    initialData: () => {
      if (!slug) return undefined;
      if (!includeDrafts) {
        const fallback = contentSource.fallbackPosts.find((post) => post.slug === slug);
        if (fallback) return fallback;
      }
      const existing = queryClient
        .getQueryData<CMSPost[]>(postsQueryKey({ includeDrafts }))
        ?.find((post) => post.slug === slug);
      return existing;
    },
  });
};

export const useJobs = (options?: FetchOptions) => {
  const includeDrafts = options?.includeDrafts ?? false;
  return useQuery({
    queryKey: jobsQueryKey({ includeDrafts }),
    queryFn: () => fetchJobs({ includeDrafts }),
    staleTime: 60 * 1000,
    initialData: includeDrafts ? undefined : contentSource.fallbackJobs,
  });
};

export const useJob = (slug: string | undefined, options?: FetchOptions) => {
  const includeDrafts = options?.includeDrafts ?? false;
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["job", slug, includeDrafts],
    queryFn: () => fetchJobBySlug(slug!, { includeDrafts }),
    enabled: Boolean(slug),
    initialData: () => {
      if (!slug) return undefined;
      if (!includeDrafts) {
        const fallback = contentSource.fallbackJobs.find((job) => job.slug === slug);
        if (fallback) return fallback;
      }
      const existing = queryClient
        .getQueryData<CMSJob[]>(jobsQueryKey({ includeDrafts }))
        ?.find((job) => job.slug === slug);
      return existing;
    },
  });
};
