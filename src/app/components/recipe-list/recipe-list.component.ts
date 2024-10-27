import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../model/recipe';
import { RecipeService } from '../../services/recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  recipe_in_progress: Recipe;
  dark_background: Boolean;
  recipe_loaded: Boolean;
  current_styles: any = { 'font-size': '150%' };
  small_font: boolean;
  load_error: boolean;
  error_text: string | undefined;

  public addRecipeClicked() {
    console.log('addRecipeClicked');
    this.recipes.unshift(this.recipe_in_progress);
    this.recipe_in_progress = Recipe.inputRecipe();
  }

  public removeRecipe() {
    this.recipes.pop();
  }

  public zoomClicked(recipe: Recipe) {
    console.log('ZoomIn clicked');
    console.log(JSON.stringify(recipe, null, 2));
  }

  constructor(private router: Router, private recipeService: RecipeService) {
    this.recipe_in_progress = Recipe.inputRecipe();
    this.dark_background = false;
    this.small_font = false;
    this.recipe_loaded = false;
    this.load_error = false;
  }

  ngOnInit(): void {
    this.recipes = this.recipeService.getAllRecipes();
    if (this.recipes) {
      this.load_error = false;
      this.recipe_loaded = true;
    }
  }

  public toggleFont() {
    if (this.current_styles['font-size'] === '150%') {
      this.current_styles['font-size'] = '175%';
    } else {
      this.current_styles['font-size'] = '150%';
    }
    this.small_font = !this.small_font;
  }

  public toggleBackground() {
    this.dark_background = !this.dark_background;
  }
  public userSelectedRecipe(recipe_id: string) {
    console.log('inside recipe-list: ' + recipe_id);
    this.router.navigate(['recipes/' + recipe_id]);
  }

  public addNewRecipe(): void {
    this.router.navigateByUrl('newRecipe');
  }
}
