'use client';

import Image from "next/image";
import NutritionSummaryCard from "@/components/NutritionSummaryCard";
import RecipeIngredientsCard from "@/components/RecipeIngredientsCard";
import RecipeStepsCard from "@/components/RecipeStepsCard";
import {
  loadRecipeResults,
  addFavoriteRecipe,
  removeFavoriteRecipe,
  isRecipeFavorite,
} from "@/lib/storage";
import { toSlug } from "@/lib/slug";
import { useMemo, useState, useEffect } from "react";
import { withDemoNutrition } from "@/lib/recipes";

export type FallbackRecipe = {
  id?: string | number;
  title: string;
  description?: string;
  ingredients: string[];
  steps: string[];
  imageUrl?: string;
  timeMinutes?: number;
  servings?: number;
  caloriesPerServing?: number;
  proteinPerServing?: number;
  carbsPerServing?: number;
  fatPerServing?: number;
};

function normalizeForDetail(raw: any) {
  if (!raw) return null;

  const timeMinutes =
    raw.timeMinutes ??
    raw.time ??
    null;

  return {
    ...raw,
    timeMinutes,
  };
}

export default function RecipeDetailsClient({
  slug,
  fallbackRecipe,
}: {
  slug: string;
  fallbackRecipe: FallbackRecipe | null;
}) {
  const recipeData = useMemo(() => {
    const cachedList = loadRecipeResults();
    const fromCache = cachedList.find((r: any) => toSlug(r.title) === slug);

    if (fromCache) {
      const norm = normalizeForDetail(fromCache);
      if (!norm) return null;
      return withDemoNutrition({
        id: norm.id,
        title: norm.title,
        description: norm.description,
        ingredients: norm.ingredients,
        steps: norm.steps,
        imageUrl: norm.imageUrl,
        timeMinutes: norm.timeMinutes,
        servings: norm.servings,
        caloriesPerServing: norm.caloriesPerServing,
        proteinPerServing: norm.proteinPerServing,
        carbsPerServing: norm.carbsPerServing,
        fatPerServing: norm.fatPerServing,
      });
    }

    if (fallbackRecipe) {
      const norm = normalizeForDetail(fallbackRecipe);
      if (!norm) return null;
      return withDemoNutrition(norm);
    }

    return null;
  }, [slug, fallbackRecipe]);

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!recipeData) {
      setIsFavorite(false);
      return;
    }
    setIsFavorite(isRecipeFavorite(slug));
  }, [slug, recipeData]);

  if (!recipeData) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 bg-gray-50 min-h-dvh">
        <p className="text-center text-gray-600">
          Sorry, we couldn't load that recipe.
        </p>
      </main>
    );
  }

  const recipe: any = recipeData;
  const servings = recipe.servings ?? 1;

  function handleToggleFavorite() {
    if (!recipe) return;
    if (isFavorite) {
      removeFavoriteRecipe(slug);
      setIsFavorite(false);
    } else {
      addFavoriteRecipe(slug, recipe);
      setIsFavorite(true);
    }
  }

  return (
    <main className="w-full space-y-6 bg-gray-50">
      <header className="flex items-start gap-4">
        {recipe.imageUrl ? (
          <div className="relative h-28 w-28 overflow-hidden rounded-2xl border bg-white">
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold">{recipe.title}</h1>

          {recipe.description ? (
            <p className="mt-1 text-sm text-gray-600">{recipe.description}</p>
          ) : (
            <p className="mt-1 text-sm text-gray-600 opacity-70">
              A tasty dish generated from your pantry picks.
            </p>
          )}

          <div className="mt-2 text-sm text-gray-700 flex flex-wrap gap-x-4 gap-y-1">
            <span>⏱ {recipe.timeMinutes ?? "?"} min</span>
            <span>
              🍽 {servings} serving{servings > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </header>

      <NutritionSummaryCard
        caloriesPerServing={recipe.caloriesPerServing ?? 0}
        proteinPerServing={recipe.proteinPerServing ?? 0}
        carbsPerServing={recipe.carbsPerServing ?? 0}
        fatPerServing={recipe.fatPerServing ?? 0}
        servings={servings}
      />

      <div className="space-y-4">
        <RecipeIngredientsCard ingredients={recipe.ingredients ?? []} />
        <RecipeStepsCard steps={recipe.steps ?? []} />

        <div className="pt-2">
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`w-full rounded-2xl border px-4 py-2 text-sm font-medium transition
              ${
                isFavorite
                  ? "bg-amber-100 border-amber-400 text-amber-900"
                  : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50"
              }`}
          >
            {isFavorite ? "★ Saved to favorites" : "☆ Save to favorites"}
          </button>
        </div>
      </div>
    </main>
  );
}
