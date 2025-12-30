import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Recipe } from '../../model/recipe';
import { Location } from '@angular/common';
import { RecipeService } from '../../services/recipe.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';
import { RatingsService, RatingSummary } from '../../services/ratings.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent implements OnInit, OnDestroy {
  recipe = signal<Recipe | null>(null);
  load_error: Boolean = false;
  error_text: string | undefined;
  loading: Boolean = false;
  ratingSummary: RatingSummary = { avg: 0, count: 0 };
  myRating: number | null = null;
  ratingError: string | null = null;
  ratingsConfigured: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private recipeService: RecipeService,
    private router: Router,
    public favorites: FavoritesService,
    public auth: AuthService,
    private ratings: RatingsService
  ) {
    this.ratingsConfigured = this.ratings.isConfigured();
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: ParamMap) => {
        const recipe_id = params.get('recipe_id');
        if (recipe_id) {
          this.loadRecipe(recipe_id);
        } else {
          this.load_error = true;
          this.error_text = 'Invalid recipe ID';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRecipe(recipeId: string): void {
    this.loading = true;
    this.load_error = false;
    this.error_text = undefined;
    this.ratingError = null;

    this.recipeService.getRecipeById(recipeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (recipe) => {
          this.recipe.set(recipe);
          this.loading = false;
          this.load_error = false;

          // Community info (best-effort)
          this.ratings.getSummary(recipeId).pipe(takeUntil(this.destroy$)).subscribe((s) => {
            this.ratingSummary = s;
          });
          this.ratings.getMyRating(recipeId).pipe(takeUntil(this.destroy$)).subscribe((r) => {
            this.myRating = r;
          });
        },
        error: (error) => {
          this.load_error = true;
          this.error_text = error.message || 'Failed to load recipe';
          this.loading = false;
        }
      });
  }

  goBack() {
    this.location.back();
  }

  canDelete(): boolean {
    const user = this.auth.user();
    const recipe = this.recipe();
    if (!user || !recipe?.id) return false;

    // Super admins can delete any recipe.
    if (this.auth.isAdmin()) return true;

    // Prefer explicit author id if present.
    if (recipe.author_id) return recipe.author_id === user.$id;

    // Fall back to Appwrite document permissions if available.
    const perms = recipe.permissions || [];
    const expected = `delete(\"user:${user.$id}\")`;
    const expectedAlt = `delete("user:${user.$id}")`;
    return perms.includes(expected) || perms.includes(expectedAlt);
  }

  deleteRecipe(): void {
    const recipe = this.recipe();
    if (!recipe || !recipe.id) return;
    if (!this.canDelete()) return;

    if (confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
      this.recipeService.deleteRecipe(recipe.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['/recipes']);
          },
          error: (error) => {
            alert('Failed to delete recipe: ' + (error.message || 'Unknown error'));
          }
        });
    }
  }

  setRating(value: number): void {
    const recipe = this.recipe();
    if (!recipe?.id) return;

    this.ratingError = null;

    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    this.ratings
      .setMyRating(recipe.id, value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.myRating = value;
          this.ratings.getSummary(recipe.id).pipe(takeUntil(this.destroy$)).subscribe((s) => {
            this.ratingSummary = s;
          });
        },
        error: (err) => {
          this.ratingError =
            err?.message ||
            'Could not save rating. Make sure ratings collection is configured in Appwrite.';
        },
      });
  }
}
