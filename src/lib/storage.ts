import { supabase } from "@/lib/supabaseClient";

const storageBucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET ?? "blog-images";
const applicationResumeBucket = import.meta.env.VITE_SUPABASE_APPLICATION_STORAGE_BUCKET ?? "job-applications";

const sanitizeSegment = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "post";

const getFileExtension = (file: File) => {
  const parts = file.name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "jpg";
};

export const isHeroImageUploadEnabled = Boolean(supabase && storageBucket);
export const isApplicationResumeUploadEnabled = Boolean(supabase && applicationResumeBucket);

export const uploadPostHeroImage = async (file: File, options?: { slug?: string }) => {
  if (!supabase) {
    throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }

  if (!storageBucket) {
    throw new Error(
      "Supabase storage bucket is not configured. Provide VITE_SUPABASE_STORAGE_BUCKET or create a 'blog-images' bucket.",
    );
  }

  const fileExtension = getFileExtension(file);
  const timestamp = Date.now();
  const baseName = file.name.replace(/\.[^/.]+$/, "") || "uploaded-image";
  const safeName = sanitizeSegment(baseName);
  const folder = options?.slug ? sanitizeSegment(options.slug) : "post";
  const objectPath = `posts/${folder}/${timestamp}-${safeName}.${fileExtension}`;

  const { error: uploadError } = await supabase.storage.from(storageBucket).upload(objectPath, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (uploadError) {
    if (uploadError.message.toLowerCase().includes("bucket not found")) {
      throw new Error(
        `Supabase storage bucket "${storageBucket}" does not exist. Create it in Storage > Buckets or set VITE_SUPABASE_STORAGE_BUCKET to an existing bucket.`,
      );
    }
    throw uploadError;
  }

  const { data } = supabase.storage.from(storageBucket).getPublicUrl(objectPath);
  if (!data?.publicUrl) {
    throw new Error("Unable to retrieve public URL for uploaded hero image.");
  }

  return data.publicUrl;
};

export const uploadApplicationResume = async (
  file: File,
  options: { jobSlug: string; applicantName: string },
) => {
  if (!supabase) {
    throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }

  if (!applicationResumeBucket) {
    throw new Error(
      "Application resume storage is not configured. Provide VITE_SUPABASE_APPLICATION_STORAGE_BUCKET or create a 'job-applications' bucket.",
    );
  }

  const fileExtension = getFileExtension(file);
  const timestamp = Date.now();
  const safeApplicantName = sanitizeSegment(options.applicantName || "candidate");
  const safeJobSlug = sanitizeSegment(options.jobSlug || "job");

  // Resumes are stored under a stable prefix so storage policies can target this workflow precisely.
  const objectPath = `applications/${safeJobSlug}/${timestamp}-${safeApplicantName}.${fileExtension}`;

  const { error: uploadError } = await supabase.storage.from(applicationResumeBucket).upload(objectPath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (uploadError) {
    if (uploadError.message.toLowerCase().includes("bucket not found")) {
      throw new Error(
        `Supabase storage bucket "${applicationResumeBucket}" does not exist. Create it in Storage > Buckets or set VITE_SUPABASE_APPLICATION_STORAGE_BUCKET to an existing bucket.`,
      );
    }
    throw uploadError;
  }

  return {
    bucket: applicationResumeBucket,
    path: objectPath,
    fileName: file.name,
    contentType: file.type || "application/octet-stream",
  };
};

export const downloadApplicationResume = async (bucket: string, path: string) => {
  if (!supabase) {
    throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }

  const { data, error } = await supabase.storage.from(bucket).download(path);
  if (error) {
    throw error;
  }

  return data;
};
