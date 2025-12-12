"use client";

import React, { useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/server/firebase";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";

type Props = {
  value?: string | null;
  onChange: (url: string | null) => void;
  accept?: string;
  label?: string;
  folder?: string;
};

export default function FirebaseUpload({
  value,
  onChange,
  accept = "image/*,model/gltf-binary,model/gltf+json,.glb,.gltf",
  label = "Upload",
  folder = "uploads",
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const triggerFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (file: File | null) => {
    if (!file) return;

    const ext = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const storageRef = ref(storage, fileName);
    setUploading(true);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snap) => {
        const pct = (snap.bytesTransferred / snap.totalBytes) * 100;
        setProgress(Math.round(pct));
      },
      (error) => {
        console.error(error);
        setUploading(false);
        setProgress(null);
      },
      async () => {
        const url = await getDownloadURL(storageRef);
        onChange(url);
        setUploading(false);
        setProgress(null);
      }
    );
  };

  return (
    <div className="space-y-2">
      {/* Hidden input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFileSelected(e.target.files?.[0] ?? null)}
      />

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <Button type="button" className="gap-2" disabled={uploading} onClick={triggerFileDialog}>
          <Upload className="w-4 h-4" />
          {label}
        </Button>

        {value && (
          <Button variant="destructive" type="button" onClick={() => onChange(null)} className="gap-2">
            <Trash2 className="w-4 h-4" />
            Remove
          </Button>
        )}

        {uploading && (
          <div className="text-sm text-slate-600">{progress}%</div>
        )}
      </div>

      {value && (
        <div className="mt-2">
          {value.endsWith(".glb") || value.endsWith(".gltf") ? (
            <p className="text-sm text-indigo-600 truncate">{value}</p>
          ) : (
            <img src={value} alt="preview" className="w-48 h-32 object-cover rounded" />
          )}
        </div>
      )}
    </div>
  );
}
