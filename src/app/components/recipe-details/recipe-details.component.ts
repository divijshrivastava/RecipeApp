import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Recipe } from '../../model/recipe';
import { Location } from '@angular/common';
import { RecipeService } from '../../services/recipe.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

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
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private recipeService: RecipeService,
    private router: Router
  ) {}

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

    this.recipeService.getRecipeById(recipeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (recipe) => {
          this.recipe.set(recipe);
          this.loading = false;
          this.load_error = false;
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

  deleteRecipe(): void {
    const recipe = this.recipe();
    if (!recipe || !recipe.id) return;

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
}
