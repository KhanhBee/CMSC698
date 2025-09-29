'use client';
import { useState } from 'react';
import IngredientPhotoUploader from '@/components/IngredientPhotoUploader';

export default function Home() {
  const [file, setFile] = useState<File|null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);

  function handleMockScan() {
    if (!file) return;
    setIngredients(['tomato','onion','eggs']); // placeholder
  }
  function handleAdd() {
    const name = prompt('Add an ingredient:');
    if (name?.trim()) setIngredients(prev => [...prev, name.trim()]);
  }
  function handleRemove(i: number) {
    setIngredients(prev => prev.filter((_, idx) => idx !== i));
  }

  return (
    <main className="min-h-dvh bg-gray-50">
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <header className="pt-6">
          <h1 className="text-2xl font-bold">Snap-to-Supper</h1>
          <p className="text-gray-600">Photo → ingredient list → recipes → nutrition</p>
        </header>

        <IngredientPhotoUploader onImageSelected={setFile} />

        <section className="w-full max-w-xl mx-auto p-6 border rounded-2xl shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-3">Ingredients (editable)</h2>
          <div className="flex gap-3 mb-4">
            <button onClick={handleMockScan} disabled={!file} className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50">
              Scan ingredients (mock)
            </button>
            <button onClick={handleAdd} className="px-4 py-2 rounded-xl border">Add manually</button>
          </div>

          {ingredients.length === 0 ? (
            <p className="text-sm text-gray-600">No ingredients yet.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {ingredients.map((item, i) => (
                <li key={`${item}-${i}`} className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
                  <span className="text-sm">{item}</span>
                  <button onClick={() => handleRemove(i)} className="text-xs text-gray-500 hover:text-red-600" aria-label={`Remove ${item}`}>✕</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
