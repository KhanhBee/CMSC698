'use client';

const KEY = 'snap.ingredients';

export function saveIngredients(list: string[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function loadIngredients(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
