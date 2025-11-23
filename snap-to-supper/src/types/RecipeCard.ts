export type RecipeCard = {
  id: string;
  title: string;
  time: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  link?: string;
  tags?: string[];
  matchScore?: number;
  source?: "local" | "ai";
};
