'use client';

import type { RecipeCard } from "@/types/RecipeCard";

const KEY_ING = 'snap.ingredients';
const KEY_RECIPES = 'snap.recipes';
const KEY_FAVORITES = 'snap.favorites';

type StoredFavorite = RecipeCard & { slug: string };

export function saveIngredients(list: string[]) {
  localStorage.setItem(KEY_ING, JSON.stringify(list));
}

export function loadIngredients(): string[] {
  try {
    const raw = localStorage.getItem(KEY_ING);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRecipeResults(recipes: any[]) {
  try {
    localStorage.setItem(KEY_RECIPES, JSON.stringify(recipes));
  } catch {
  }
}

export function loadRecipeResults(): any[] {
  try {
    const raw = localStorage.getItem(KEY_RECIPES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function readFavorites(): StoredFavorite[] {
  try {
    const raw = localStorage.getItem(KEY_FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeFavorites(list: StoredFavorite[]) {
  try {
    localStorage.setItem(KEY_FAVORITES, JSON.stringify(list));
  } catch {
  }
}

export function loadFavoriteRecipes(): StoredFavorite[] {
  return readFavorites();
}

export function isRecipeFavorite(slug: string): boolean {
  const list = readFavorites();
  return list.some((item) => item.slug === slug);
}

export function addFavoriteRecipe(slug: string, recipeData: any) {
  if (!recipeData) return;

  const list = readFavorites();

  const base: RecipeCard = {
    id: String(recipeData.id ?? slug),
    title: recipeData.title ?? "",
    time:
      recipeData.time ??
      recipeData.timeMinutes ??
      0,
    servings: recipeData.servings ?? 1,
    ingredients: recipeData.ingredients ?? [],
    steps: recipeData.steps ?? [],
    matchScore: recipeData.matchScore,
    tags: recipeData.tags,
    source: recipeData.source,
  };

  const existingIndex = list.findIndex((item) => item.slug === slug);
  const updated: StoredFavorite = { slug, ...base };

  if (existingIndex >= 0) {
    list[existingIndex] = updated;
  } else {
    list.push(updated);
  }

  writeFavorites(list);
}

export function removeFavoriteRecipe(slug: string) {
  const list = readFavorites();
  const next = list.filter((item) => item.slug !== slug);
  writeFavorites(next);
}
