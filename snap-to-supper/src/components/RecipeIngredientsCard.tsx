"use client";

export default function RecipeIngredientsCard({ ingredients }: { ingredients: string[] }) {
  return (
    <div className="rounded-2xl border p-5 shadow-sm bg-white/60 dark:bg-zinc-900/50 backdrop-blur">
      <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
      <ul className="list-disc pl-6 space-y-1">
        {ingredients.map((it, idx) => (
          <li key={idx} className="leading-relaxed">{it}</li>
        ))}
      </ul>
    </div>
  );
}
