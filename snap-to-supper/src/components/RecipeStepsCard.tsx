"use client";

export default function RecipeStepsCard({ steps }: { steps: string[] }) {
  return (
    <div className="rounded-2xl border p-5 shadow-sm bg-white/60 dark:bg-zinc-900/50 backdrop-blur">
      <h3 className="text-lg font-semibold mb-3">Steps</h3>
      <ol className="list-decimal pl-6 space-y-3">
        {steps.map((step, i) => (
          <li key={i} className="leading-relaxed">{step}</li>
        ))}
      </ol>
    </div>
  );
}
