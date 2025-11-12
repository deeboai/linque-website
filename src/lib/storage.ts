import { supabase } from "@/lib/supabaseClient";

const storageBucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET ?? "blog-images";

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
