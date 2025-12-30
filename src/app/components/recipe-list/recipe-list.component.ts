import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../../model/recipe';
import { RecipeService } from '../../services/recipe.service';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  dark_background: Boolean = false;
  recipe_loaded: Boolean = false;
  load_error: boolean = false;
  error_text: string | undefined;
  searchQuery: string = '';
  selectedCategory: string = 'All';
  categories: string[] = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage', 'Uncategorized'];
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private router: Router,
    private recipeService: RecipeService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRecipes();
    
    // Setup search debouncing
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((query) => {
        this.searchQuery = query;
        this.filterRecipes();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRecipes(): void {
    this.recipe_loaded = false;
    this.load_error = false;
    
    this.recipeService.getAllRecipes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (recipes) => {
          this.recipes = recipes;
          this.filteredRecipes = recipes;
          this.recipe_loaded = true;
          this.load_error = false;
          
          // Extract unique categories from recipes
          const uniqueCategories = new Set<string>();
          recipes.forEach(r => {
            if (r.category) uniqueCategories.add(r.category);
          });
          this.categories = ['All', ...Array.from(uniqueCategories).sort()];
        },
        error: (error) => {
          this.load_error = true;
          this.error_text = error.message || 'Failed to load recipes';
          this.recipe_loaded = true;
        }
      });
  }

  get isBrowsingHub(): boolean {
    return !this.searchQuery.trim() && this.selectedCategory === 'All';
  }

  get topCategories(): string[] {
    return this.categories.filter((c) => c !== 'All').slice(0, 10);
  }

  get latestRecipes(): Recipe[] {
    const copy = [...this.filteredRecipes];
    copy.sort((a: any, b: any) => {
      const ad = a.created_at ? Date.parse(a.created_at) : 0;
      const bd = b.created_at ? Date.parse(b.created_at) : 0;
      return bd - ad;
    });
    return copy.slice(0, 8);
  }

  get quickEasyRecipes(): Recipe[] {
    const copy = [...this.filteredRecipes];
    const filtered = copy.filter((r) => {
      const isEasy = (r.difficulty || 'Medium') === 'Easy';
      const isQuick = (r.preparation_time || 0) <= 30;
      return isEasy || isQuick;
    });
    return filtered.slice(0, 8);
  }

  clearAll(): void {
    this.searchQuery = '';
    this.selectedCategory = 'All';
    this.filterRecipes();
  }

  onSearchChange(query: string): void {
    this.searchSubject.next(query);
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.filterRecipes();
  }

  filterRecipes(): void {
    let filtered = [...this.recipes];

    // Filter by category
    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(r => r.category === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query) ||
          recipe.keywords?.some(k => k.toLowerCase().includes(query)) ||
          recipe.ingredients.some(i => i.name.toLowerCase().includes(query))
      );
    }

    this.filteredRecipes = filtered;
  }

  public userSelectedRecipe(recipe_id: string): void {
    this.router.navigate(['recipes', recipe_id]);
  }

  public addNewRecipe(): void {
    this.router.navigateByUrl('newRecipe');
  }
}
