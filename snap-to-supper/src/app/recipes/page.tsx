'use client';

import { useEffect, useState } from 'react';
import { loadIngredients } from '@/lib/storage';

type RecipeCard = {
  id: string;
  title: string;
  time: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  link?: string;
  tags?: string[];
  matchScore?: number;
};

export default function RecipesPage() {
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<RecipeCard[]>([]);

  useEffect(() => {
    const list = loadIngredients();
    setIngredients(list);

    const fetchRecipes = async () => {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: list }),
      });
      const data = await res.json();
      setRecipes(data.results || []);
      setLoading(false);
    };

    fetchRecipes();
  }, []);

  return (
    <main className="min-h-dvh bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Recipes</h1>
          <p className="text-gray-600">
            Based on: {ingredients.length ? ingredients.join(', ') : 'no ingredients'}
          </p>
        </header>

        {loading ? (
          <p className="text-gray-600">Finding ideas…</p>
        ) : recipes.length === 0 ? (
          <p className="text-gray-600">No matches yet. Try adding a few common items.</p>
        ) : (
          <ul className="grid gap-4">
            {recipes.map(r => (
              <li key={r.id} className="p-5 bg-white border rounded-2xl shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold">{r.title}</h2>
                  <div className="text-sm text-gray-600">
                    {r.time} min • {r.servings} serving{r.servings > 1 ? 's' : ''}
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Match score: {r.matchScore ?? 0}
                </div>
                <div className="mt-3">
                  <h3 className="font-medium">Ingredients</h3>
                  <p className="text-sm text-gray-700">{r.ingredients.join(', ')}</p>
                </div>
                <div className="mt-3">
                  <h3 className="font-medium">Steps</h3>
                  <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                    {r.steps.map((s, i) => <li key={i}>{s}</li>)}
                  </ol>
                </div>
                {r.link && (
                  <a className="inline-block mt-3 text-sm underline" href={r.link} target="_blank">
                    View original
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
