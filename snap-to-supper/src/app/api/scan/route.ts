import { NextRequest } from "next/server";

export const runtime = "nodejs";

const CLARIFAI_API_KEY = process.env.CLARIFAI_API_KEY;
if (!CLARIFAI_API_KEY) {
  throw new Error("Missing CLARIFAI_API_KEY in environment");
}

const CLARIFAI_USER_ID = "clarifai";
const CLARIFAI_APP_ID = "main";
const CLARIFAI_MODEL_ID = "food-item-v1-recognition";

async function callClarifaiFoodModel(imageBase64: string) {
  const url = `https://api.clarifai.com/v2/models/${CLARIFAI_MODEL_ID}/outputs`;

  const body = {
    user_app_id: {
      user_id: CLARIFAI_USER_ID,
      app_id: CLARIFAI_APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            base64: imageBase64,
          },
        },
      },
    ],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Key ${CLARIFAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Clarifai error:", res.status, text);
    throw new Error(`Clarifai API error: ${res.status}`);
  }

  const json = await res.json();
  const concepts = json?.outputs?.[0]?.data?.concepts ?? [];
  return concepts as { name: string; value: number }[];
}

const BANNED = new Set([
  "food",
  "meal",
  "cuisine",
  "dish",
  "ingredient",
  "produce",
  "vegetable",
  "fruit",
  "meat",
  "protein",
  "grocery",
  "lunch",
  "dinner",
  "breakfast",
  "plate",
  "bowl",
  "table",
  "cutlery",
  "fork",
  "knife",
  "spoon",
]);

const CANONICAL: Record<string, string> = {
  // meats
  steak: "beef",
  "beef steak": "beef",
  "ground beef": "beef",
  ham: "pork",
  bacon: "pork",
  "pork chop": "pork",
  "chicken breast": "chicken",
  "chicken wing": "chicken",
  drumstick: "chicken",
  // carbs
  spaghetti: "pasta",
  noodle: "noodles",
  noodles: "noodles",
  ramen: "ramen noodles",
  baguette: "bread",
  // veg/fruit examples
  tomato: "tomato",
  tomatoes: "tomato",
  onion: "onion",
  garlic: "garlic",
  spinach: "spinach",
  broccoli: "broccoli",
  "bell pepper": "bell pepper",
};

function normalizeIngredient(rawName: string): string | null {
  const simple = rawName.toLowerCase().trim();
  if (!simple || BANNED.has(simple)) return null;

  if (CANONICAL[simple]) return CANONICAL[simple];

  const singular = simple.endsWith("s") ? simple.slice(0, -1) : simple;
  if (CANONICAL[singular]) return CANONICAL[singular];

  if (!BANNED.has(singular)) return singular;
  return null;
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return Response.json(
        { error: "No image file uploaded." },
        { status: 400 }
      );
    }

    // file -> base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    // Call Clarifai
    const concepts = await callClarifaiFoodModel(base64);

    const seen = new Set<string>();
    const ingredients: string[] = [];

    for (const c of concepts) {
      const score = c.value ?? 0;
      if (score < 0.6) continue; // tweak this threshold after you see results

      const norm = normalizeIngredient(c.name);
      if (!norm) continue;

      if (!seen.has(norm)) {
        seen.add(norm);
        ingredients.push(norm);
      }
    }

    return Response.json({
      ingredients,
      rawConcepts: concepts, // leave this in while debugging
    });
  } catch (err: any) {
    console.error("Clarifai scan route error:", err);
    return Response.json(
      { error: "Clarifai scan failed on the server." },
      { status: 500 }
    );
  }
}
