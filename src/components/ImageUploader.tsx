"use client";

import { useState } from "react";

export default function ImageUploader({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Upload failed");
      onUploaded(json.url as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = ""; // allow re-selecting same file
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input type="file" accept="image/*" onChange={handleChange} disabled={isUploading} />
      {isUploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
