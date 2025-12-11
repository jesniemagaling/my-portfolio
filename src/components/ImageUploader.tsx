'use client';
import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { clientStorage } from '@/lib/firebase';

type Props = {
  folder?: string;
  onUploaded: (url: string) => void;
};

export default function ImageUploader({
  folder = 'uploads',
  onUploaded,
}: Props) {
  const [progress, setProgress] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileName = `${folder}/${Date.now()}-${file.name.replace(
      /\s+/g,
      '-'
    )}`;
    const storageRef = ref(clientStorage, fileName);
    setUploading(true);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const pct = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(pct);
      },
      (error) => {
        console.error(error);
        setUploading(false);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setUploading(false);
        setProgress(null);
        onUploaded(url);
      }
    );
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFile} />
      {uploading && <div>Uploading... {progress}%</div>}
    </div>
  );
}
