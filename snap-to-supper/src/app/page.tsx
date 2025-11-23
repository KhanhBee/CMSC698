'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import IngredientPhotoUploader from '@/components/IngredientPhotoUploader';
import { saveIngredients } from '@/lib/storage';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const router = useRouter();

  async function handleScanWithVision() {
    if (!file) return;
    setScanError(null);
    setScanning(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/scan', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Scan failed');
      }

      const data = await res.json();
      const scanned: string[] = Array.isArray(data.ingredients)
        ? data.ingredients
        : [];

      if (scanned.length === 0) {
        setScanError('No clear ingredients detected. Try a clearer photo or add manually.');
      }

      setIngredients(prev => {
        const existing = new Set(prev);
        for (const item of scanned) {
          if (!existing.has(item)) existing.add(item);
        }
        return Array.from(existing);
      });
    } catch (err: any) {
      console.error(err);
      setScanError(err.message || 'Something went wrong while scanning.');
    } finally {
      setScanning(false);
    }
  }

  function handleAdd() {
    const name = prompt('Add an ingredient:');
    if (name?.trim()) setIngredients(prev => [...prev, name.trim()]);
  }

  function handleRemove(i: number) {
    setIngredients(prev => prev.filter((_, idx) => idx !== i));
  }

  function handleContinue() {
    saveIngredients(ingredients);
    router.push('/recipes');
  }

  function handleViewFavorites() {
    router.push('/recipes?view=favorites');
  }

  return (
    <main className="min-h-dvh bg-gray-50">
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <header className="pt-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Snap-to-Supper</h1>
            <p className="text-gray-600">
              Photo → ingredient list → recipes → nutrition
            </p>
          </div>

          {}
          <button
            type="button"
            onClick={handleViewFavorites}
            className="text-sm px-3 py-1.5 rounded-full border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
          >
            ★ Favorites
          </button>
        </header>

        <IngredientPhotoUploader onImageSelected={setFile} />

        <section className="w-full max-w-xl mx-auto p-6 border rounded-2xl shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-3">Ingredients (editable)</h2>
          <div className="flex flex-wrap gap-3 mb-3">
            <button
              onClick={handleScanWithVision}
              disabled={!file || scanning}
              className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50"
            >
              {scanning ? 'Scanning…' : 'Scan ingredients'}
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 rounded-xl border"
            >
              Add manually
            </button>
            <button
              onClick={handleContinue}
              disabled={ingredients.length === 0}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50"
            >
              Continue → Recipes
            </button>
          </div>

          {scanError && (
            <p className="text-sm text-red-600 mb-2">{scanError}</p>
          )}

          {ingredients.length === 0 ? (
            <p className="text-sm text-gray-600">
              No ingredients yet. Take a photo or add manually.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {ingredients.map((item, i) => (
                <li
                  key={`${item}-${i}`}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100"
                >
                  <span className="text-sm">{item}</span>
                  <button
                    onClick={() => handleRemove(i)}
                    className="text-xs text-gray-500 hover:text-red-600"
                    aria-label={`Remove ${item}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
