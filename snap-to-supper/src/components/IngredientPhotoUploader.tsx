'use client';
import { useRef, useState, ChangeEvent } from 'react';

export default function IngredientPhotoUploader({ onImageSelected }: { onImageSelected:(f:File)=>void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string|null>(null);
  const [fileName, setFileName] = useState("");

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    onImageSelected(file);
  }

  return (
    <div className="w-full max-w-xl mx-auto p-6 border rounded-2xl shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-3">Add ingredients (photo)</h2>
      <p className="text-sm text-gray-600 mb-4">Choose or take a photo of your ingredients.</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => inputRef.current?.click()} className="px-4 py-2 rounded-xl bg-black text-white">
          Choose photo
        </button>
        {fileName && <span className="text-sm text-gray-700 truncate">{fileName}</span>}
      </div>

      {previewUrl ? (
        <img src={previewUrl} alt="Selected ingredients" className="rounded-xl border max-h-80 object-contain" />
      ) : (
        <div className="h-40 rounded-xl border border-dashed grid place-items-center text-gray-500">
          No image selected
        </div>
      )}
    </div>
  );
}
