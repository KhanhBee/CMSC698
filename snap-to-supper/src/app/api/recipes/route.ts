import { NextRequest } from 'next/server';
import { SAMPLE_RECIPES } from '@/data/recipes-sample';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const userIngredients: string[] = Array.isArray(body?.ingredients) ? body.ingredients : [];

  // ChatGPT generated code
  const scored = SAMPLE_RECIPES
    .map(r => {
      const match = r.ingredients.filter(i =>
        userIngredients.map(s => s.toLowerCase()).includes(i.toLowerCase())
      ).length;
      return { recipe: r, score: match };
    })
    .sort((a, b) => b.score - a.score);

  return Response.json({
    ingredients: userIngredients,
    results: scored.map(s => ({
      ...s.recipe,
      matchScore: s.score,
    })),
  });
}
