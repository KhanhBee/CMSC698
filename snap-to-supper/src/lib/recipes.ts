import { toSlug } from "@/lib/slug";
import { SAMPLE_RECIPES } from "@/data/recipes-sample";

export type Recipe = {
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

const RECIPES: Recipe[] = SAMPLE_RECIPES.map(r => ({
  id: r.id,
  title: r.title,
  ingredients: r.ingredients,
  steps: r.steps,
  timeMinutes: r.time,
  servings: r.servings,
}));

export function allRecipes() {
  return RECIPES.map((r) => ({
    ...r,
    slug: toSlug(r.title),
  }));
}

export function getRecipeBySlug(slug: string): (Recipe & { slug: string }) | null {
  const recipes = allRecipes();
  const found = recipes.find((r) => r.slug === slug);
  return found ?? null;
}

export function withDemoNutrition(recipe: Recipe) {
  if (
    recipe.caloriesPerServing != null &&
    recipe.proteinPerServing != null &&
    recipe.carbsPerServing != null &&
    recipe.fatPerServing != null
  ) {
    return recipe;
  }

  const servings = recipe.servings ?? 2;
  const baseCalories = recipe.caloriesPerServing ?? 520; // placeholder demo

  const pKcal = baseCalories * 0.2;
  const cKcal = baseCalories * 0.5;
  const fKcal = baseCalories * 0.3;

  return {
    ...recipe,
    caloriesPerServing: baseCalories,
    proteinPerServing: Math.round(pKcal / 4),
    carbsPerServing: Math.round(cKcal / 4),
    fatPerServing: Math.round(fKcal / 9),
    servings,
  };
}
