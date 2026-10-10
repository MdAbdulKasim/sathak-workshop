import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
export const STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET || "products";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env"
    );
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

export function getPublicUrl(path: string): string {
  const { data } = getSupabase().storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function ensureProductsBucket() {
  const supabase = getSupabase();
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  const existing = buckets?.find((b) => b.name === STORAGE_BUCKET);

  if (!existing) {
    const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
      public: true,
      fileSizeLimit: "10MB",
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    });
    if (error) throw error;
  } else if (!existing.public) {
    const { error } = await supabase.storage.updateBucket(STORAGE_BUCKET, {
      public: true,
      fileSizeLimit: "10MB",
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    });
    if (error) throw error;
  }
}

export async function uploadProductImage(input: {
  path: string;
  body: Buffer;
  contentType?: string;
  upsert?: boolean;
}): Promise<string> {
  await ensureProductsBucket();

  const { error } = await getSupabase()
    .storage
    .from(STORAGE_BUCKET)
    .upload(input.path, input.body, {
      contentType: input.contentType || "image/jpeg",
      upsert: input.upsert ?? true,
      cacheControl: "3600",
    });

  if (error) throw error;
  return getPublicUrl(input.path);
}
