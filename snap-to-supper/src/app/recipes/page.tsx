'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  loadIngredients,
  saveRecipeResults,
  loadFavoriteRecipes,
} from '@/lib/storage';
import { toSlug } from '@/lib/slug';
import { RecipeCard } from '@/types/RecipeCard';
import Modal from '@/components/Modal';
import RecipeDetailsClient from './[slug]/RecipeDetailsClient';

export default function RecipesPage() {
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<RecipeCard[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeCard | null>(null);

  const searchParams = useSearchParams();
  const viewMode = searchParams.get('view');
  const isFavoritesMode = viewMode === 'favorites';

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      if (isFavoritesMode) {
        const favs = loadFavoriteRecipes();
        setRecipes(favs);
        setIngredients([]);
        setLoading(false);
        return;
      }

      const list = loadIngredients();
      setIngredients(list);

      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: list }),
      });
      const data = await res.json();

      const results: RecipeCard[] = data.results || [];
      saveRecipeResults(results);
      setRecipes(results);
      setLoading(false);
    }

    fetchData();
  }, [isFavoritesMode]);

  return (
    <main className="min-h-dvh bg-gray-50 p-6 relative">
      <div className="max-w-3xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold">
            {isFavoritesMode ? 'Saved recipes' : 'Recipes'}
          </h1>
          <p className="text-gray-600">
            {isFavoritesMode
              ? 'Your saved recipes from earlier scans.'
              : `Based on: ${
                  ingredients.length ? ingredients.join(', ') : 'no ingredients'
                }`}
          </p>
        </header>

        {loading ? (
          <p className="text-gray-600">
            {isFavoritesMode ? 'Loading favorites…' : 'Finding ideas…'}
          </p>
        ) : recipes.length === 0 ? (
          <p className="text-gray-600">
            {isFavoritesMode
              ? 'No favorites yet. Open any recipe and tap “Save to favorites”.'
              : 'No matches yet. Try adding a few common items.'}
          </p>
        ) : (
          <ul className="grid gap-4">
            {recipes.map((r) => (
              <li key={r.id}>
                {}
                <button
                  onClick={() => setSelectedRecipe(r)}
                  className="w-full text-left block p-5 bg-white border rounded-2xl shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold">{r.title}</h2>
                      <div className="mt-1 text-[10px] uppercase tracking-wide text-gray-400">
                        {r.source === 'ai' ? 'AI idea' : 'From library'}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      {r.time} min • {r.servings} serving
                      {r.servings > 1 ? 's' : ''}
                    </div>
                  </div>

                  {typeof r.matchScore !== 'undefined' && (
                    <div className="mt-2 text-sm text-gray-600">
                      Match score: {r.matchScore ?? 0}
                    </div>
                  )}

                  <div className="mt-3">
                    <h3 className="font-medium">Key ingredients</h3>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {r.ingredients.join(', ')}
                    </p>
                  </div>

                  <p className="mt-3 text-xs text-emerald-600 underline">
                    View nutrition & full steps →
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal open={!!selectedRecipe} onClose={() => setSelectedRecipe(null)}>
        {selectedRecipe && (
          <RecipeDetailsClient
            slug={toSlug(selectedRecipe.title)}
            fallbackRecipe={{
              id: selectedRecipe.id,
              title: selectedRecipe.title,
              ingredients: selectedRecipe.ingredients,
              steps: selectedRecipe.steps,
              timeMinutes: selectedRecipe.time,
              servings: selectedRecipe.servings,
            }}
          />
        )}
      </Modal>
    </main>
  );
}
