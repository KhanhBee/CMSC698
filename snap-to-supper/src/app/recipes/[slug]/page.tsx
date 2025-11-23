import { notFound } from "next/navigation";
import { allRecipes, getRecipeBySlug } from "@/lib/recipes";
import RecipeDetailsClient, { FallbackRecipe } from "./RecipeDetailsClient";

type Params = { slug: string };

export async function generateStaticParams() {
  return allRecipes().map((r) => ({ slug: r.slug }));
}


export default function RecipeDetailsPage({ params }: { params: Params }) {
  const baseRecipe = getRecipeBySlug(params.slug);

  const fallbackRecipe: FallbackRecipe | null = baseRecipe
    ? {
        id: baseRecipe.id,
        title: baseRecipe.title,
        description: baseRecipe.description,
        ingredients: baseRecipe.ingredients,
        steps: baseRecipe.steps,
        imageUrl: baseRecipe.imageUrl,
        timeMinutes: baseRecipe.timeMinutes,
        servings: baseRecipe.servings,
        caloriesPerServing: baseRecipe.caloriesPerServing,
        proteinPerServing: baseRecipe.proteinPerServing,
        carbsPerServing: baseRecipe.carbsPerServing,
        fatPerServing: baseRecipe.fatPerServing,
      }
    : null;

  return (
    <RecipeDetailsClient
      slug={params.slug}
      fallbackRecipe={fallbackRecipe}
    />
  );
}
