import { NextRequest } from "next/server";
import { SAMPLE_RECIPES } from "@/data/recipes-sample";
import { generateRecipesFromIngredients } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const userIngredients: string[] = Array.isArray(body?.ingredients)
    ? body.ingredients
    : [];

  const localResults = SAMPLE_RECIPES.map((r) => {
    const match = r.ingredients.filter((i) =>
      userIngredients.map((s) => s.toLowerCase()).includes(i.toLowerCase())
    ).length;

    return {
      ...r,
      matchScore: match,
      source: "local" as const,
    };
  }).sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));

  let aiResults: any[] = [];
  try {
    const generated = await generateRecipesFromIngredients(userIngredients);

    aiResults = generated.map((r) => {
      const match = r.ingredients.filter((i) =>
        userIngredients.map((s) => s.toLowerCase()).includes(i.toLowerCase())
      ).length;

      return {
        id: r.id,
        title: r.title,
        time: r.time,
        servings: r.servings,
        ingredients: r.ingredients,
        steps: r.steps,
        tags: r.tags,
        matchScore: match,
        source: "ai" as const,
      };
    });
  } catch (err) {
    console.error("AI generation failed:", err);
    aiResults = [];
  }

  const results = [...localResults, ...aiResults];

  return Response.json({
    ingredients: userIngredients,
    results,
  });
}
