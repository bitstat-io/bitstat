import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const BUCKET = "bitstat";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(async (file: File, path: string) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Use PNG, JPG, WebP, or SVG.");
      return null;
    }

    if (file.size > MAX_SIZE) {
      toast.error("File too large. Maximum size is 5MB.");
      return null;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "png";
      const filePath = `${path}.${ext}`;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, { upsert: true });

      if (error) {
        toast.error(error.message);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to upload image"
      );
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading };
}
