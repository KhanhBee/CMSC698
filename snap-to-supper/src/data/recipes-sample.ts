//ChatGPT generated these placeholder recipes. I will eventually link real recipes through web scraping or LLM.

export type RecipeCard = {
  id: string;
  title: string;
  time: number;           // minutes
  servings: number;
  ingredients: string[];  // simplified names
  steps: string[];
  link?: string;          // original source if any
  tags?: string[];
};

export const SAMPLE_RECIPES: RecipeCard[] = [
  {
    id: '1',
    title: 'Simple Tomato Omelet',
    time: 12,
    servings: 1,
    ingredients: ['eggs', 'tomato', 'salt', 'pepper', 'oil'],
    steps: ['Beat eggs', 'Sauté chopped tomato', 'Add eggs', 'Season and serve'],
    tags: ['quick', 'breakfast'],
  },
  {
    id: '2',
    title: 'Onion & Tomato Pasta',
    time: 25,
    servings: 2,
    ingredients: ['pasta', 'tomato', 'onion', 'garlic', 'olive oil', 'salt'],
    steps: ['Boil pasta', 'Sauté onion & garlic', 'Add tomato', 'Toss with pasta'],
    tags: ['vegetarian'],
  },
  {
    id: '3',
    title: 'Egg Fried Rice',
    time: 15,
    servings: 2,
    ingredients: ['rice', 'eggs', 'onion', 'soy sauce', 'oil'],
    steps: ['Scramble eggs', 'Sauté onion', 'Add rice', 'Season and stir-fry'],
    tags: ['quick'],
  },
];
