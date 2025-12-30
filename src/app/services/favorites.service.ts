import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'recipeApp.savedRecipeIds';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  // Keep it simple for MVP: local saved IDs (later can be synced to Appwrite).
  savedIds = signal<string[]>([]);

  constructor() {
    this.savedIds.set(this.readFromStorage());
  }

  isSaved(recipeId: string | undefined | null): boolean {
    if (!recipeId) return false;
    return this.savedIds().includes(recipeId);
  }

  toggle(recipeId: string): void {
    const current = this.savedIds();
    const next = current.includes(recipeId)
      ? current.filter((id) => id !== recipeId)
      : [recipeId, ...current];

    this.savedIds.set(next);
    this.writeToStorage(next);
  }

  clear(): void {
    this.savedIds.set([]);
    this.writeToStorage([]);
  }

  private readFromStorage(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
    } catch {
      return [];
    }
  }

  private writeToStorage(ids: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // no-op
    }
  }
}


