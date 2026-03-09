"use client";

import { useRef, useState } from "react";
import { useImageUpload } from "@/hooks/use-image-upload";
import { Button } from "@workspace/ui/components/button";
import { IconLoader2, IconPhoto, IconUpload } from "@tabler/icons-react";

export function ImageUpload({
  currentUrl,
  storagePath,
  onUploaded,
}: {
  currentUrl?: string | null;
  storagePath: string;
  onUploaded: (url: string) => void;
}) {
  const { upload, uploading } = useImageUpload();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const url = await upload(file, storagePath);
    URL.revokeObjectURL(objectUrl);

    if (url) {
      setPreview(url);
      onUploaded(url);
    } else {
      setPreview(currentUrl ?? null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className="relative flex items-center justify-center rounded-md border border-dashed bg-muted/30 overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors"
        style={{ width: 120, height: 120 }}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Game cover"
            className="size-full object-cover"
          />
        ) : (
          <IconPhoto className="size-8 text-muted-foreground/50" />
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <IconLoader2 className="size-5 animate-spin" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleChange}
        disabled={uploading}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-[120px]"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <IconLoader2 className="size-3.5 animate-spin" />
        ) : (
          <IconUpload className="size-3.5" />
        )}
        {preview ? "Change" : "Upload"}
      </Button>
    </div>
  );
}
