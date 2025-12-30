import { Component, EffectRef, OnDestroy, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Recipe } from '../../model/recipe';
import { FavoritesService } from '../../services/favorites.service';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-saved-recipes',
  templateUrl: './saved-recipes.component.html',
  styleUrls: ['./saved-recipes.component.scss'],
})
export class SavedRecipesComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  savedRecipes: Recipe[] = [];

  loading: boolean = false;
  load_error: boolean = false;
  error_text: string | undefined;

  private destroy$ = new Subject<void>();
  private savedEffect: EffectRef;

  constructor(
    public favorites: FavoritesService,
    private recipeService: RecipeService,
    private router: Router
  ) {
    this.savedEffect = effect(() => {
      // Recompute whenever saved IDs change
      this.favorites.savedIds();
      this.computeSaved();
    });
  }

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.savedEffect.destroy();
  }

  load(): void {
    this.loading = true;
    this.load_error = false;
    this.error_text = undefined;

    this.recipeService
      .getAllRecipes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (recipes) => {
          this.recipes = recipes;
          this.computeSaved();
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.load_error = true;
          this.error_text = err?.message || 'Failed to load recipes';
        },
      });
  }

  computeSaved(): void {
    const saved = new Set(this.favorites.savedIds());
    this.savedRecipes = this.recipes.filter((r) => saved.has(r.id));
  }

  goToRecipes(): void {
    this.router.navigate(['/recipes']);
  }
}


