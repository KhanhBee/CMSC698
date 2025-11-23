"use client";

type Props = {
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
  servings?: number;
};

export default function NutritionSummaryCard(props: Props) {
  const {
    caloriesPerServing,
    proteinPerServing,
    carbsPerServing,
    fatPerServing,
    servings = 2,
  } = props;

  return (
    <div className="rounded-2xl border p-5 shadow-sm bg-white/60 dark:bg-zinc-900/50 backdrop-blur">
      <h2 className="text-xl font-semibold mb-3">Nutrition (per serving)</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border p-4 text-center">
          <div className="text-sm opacity-70">Calories</div>
          <div className="text-2xl font-bold">{caloriesPerServing}</div>
        </div>
        <div className="rounded-xl border p-4 text-center">
          <div className="text-sm opacity-70">Protein</div>
          <div className="text-2xl font-bold">{proteinPerServing}g</div>
        </div>
        <div className="rounded-xl border p-4 text-center">
          <div className="text-sm opacity-70">Carbs</div>
          <div className="text-2xl font-bold">{carbsPerServing}g</div>
        </div>
        <div className="rounded-xl border p-4 text-center">
          <div className="text-sm opacity-70">Fat</div>
          <div className="text-2xl font-bold">{fatPerServing}g</div>
        </div>
      </div>
      <div className="mt-3 text-sm opacity-70">
        Servings: <span className="font-medium">{servings}</span>
      </div>
    </div>
  );
}
