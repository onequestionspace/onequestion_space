"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface AvatarUploadProps {
  currentAvatar?: string;
  displayName?: string;
  onSuccess?: (dataUrl: string) => void;
}

export function AvatarUpload({ currentAvatar, displayName, onSuccess }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const fileRef = useRef<HTMLInputElement>(null);
  const updateProfile = useMutation(api.profiles.update);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Strip the data URL prefix
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Send to API route for validation
      const res = await fetch("/api/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64, mimeType: file.type }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }

      // Save to Convex profile
      await updateProfile({ avatar: data.dataUrl });

      setPreview(data.dataUrl);
      onSuccess?.(data.dataUrl);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const initials = displayName
    ? displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative w-24 h-24 rounded-full cursor-pointer group"
        onClick={() => fileRef.current?.click()}
      >
        {preview ? (
          <img
            src={preview}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-white/20"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold border-2 border-white/20">
            {initials}
          </div>
        )}
        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-medium">
            {uploading ? "Uploading..." : "Change"}
          </span>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
        disabled={uploading}
      />

      {error && (
        <p className="text-red-400 text-xs text-center max-w-[200px]">{error}</p>
      )}

      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="text-xs text-white/50 hover:text-white/80 transition-colors disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload photo"}
      </button>
    </div>
  );
}
