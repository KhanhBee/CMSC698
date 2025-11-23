// src/lib/ai.ts

export type GeneratedRecipe = {
  id: string;
  title: string;
  time: number;        // minutes
  servings: number;
  ingredients: string[];
  steps: string[];
  tags?: string[];
};

function buildSystemPrompt() { // AI generated prompt
  return `
You are Snap-to-Supper, a cooking assistant.
You ONLY reply with valid JSON. No extra text.

Task:
Given a user's ingredient list, invent 3 realistic recipes they can cook using
mostly those ingredients + basic pantry items (salt, oil, pepper, soy sauce, etc.).

Return ONLY a JSON array, like this EXACT shape:

[
  {
    "id": "ai-1",
    "title": "Tomato Egg Stir-Fry Bowl",
    "time": 10,
    "servings": 1,
    "ingredients": ["eggs", "tomato", "oil", "salt", "pepper", "rice (optional)"],
    "steps": [
      "Beat eggs with salt and pepper.",
      "Sauté chopped tomato in oil until soft.",
      "Add eggs and scramble until just set.",
      "Serve over warm rice or eat as-is."
    ],
    "tags": ["quick","1-pan"]
  },
  { ... },
  { ... }
]

Rules:
- "time" must be a number (minutes).
- "servings" must be a number.
- "ingredients" and "steps" must be arrays of strings.
- Keep steps short and clear.
- Do not include any explanation outside the JSON.
`;
}

function buildUserPrompt(pantryList: string[]) {
  return `
My ingredients are: ${JSON.stringify(pantryList)}

Return ONLY the JSON array (no prose).
`;
}

export async function generateRecipesFromIngredients(
  pantryList: string[]
): Promise<GeneratedRecipe[]> {

  const apiKey = process.env.OPENAI_API_KEY;
  const modelName = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  if (!apiKey) {
    console.error("AI ENV MISSING. Set OPENAI_API_KEY (and optionally OPENAI_MODEL).");
    return [];
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelName,
      temperature: 0.7,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: buildUserPrompt(pantryList) },
      ],
    }),
  });

  if (!res.ok) {
    console.error("OpenAI server error:", res.status, await res.text());
    return [];
  }

  const data = await res.json();

  const rawText: string =
    data?.choices?.[0]?.message?.content ?? "[]";

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    console.error("AI returned non-JSON:", rawText);
    parsed = [];
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  const cleaned: GeneratedRecipe[] = parsed
    .filter((r: any) =>
      r &&
      typeof r.id === "string" &&
      typeof r.title === "string" &&
      Array.isArray(r.ingredients) &&
      Array.isArray(r.steps)
    )
    .map((r: any) => ({
      id: r.id,
      title: r.title,
      time: typeof r.time === "number" ? r.time : 15,
      servings: typeof r.servings === "number" ? r.servings : 1,
      ingredients: r.ingredients.map(String),
      steps: r.steps.map(String),
      tags: Array.isArray(r.tags) ? r.tags.map(String) : [],
    }));

  return cleaned;
}
