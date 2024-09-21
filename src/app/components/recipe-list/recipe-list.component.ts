import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../model/recipe';
import { Router } from '../../../../node_modules/@angular/router';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
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

  constructor(private router: Router, private recipeService: RecipeService,
  ) {
    this.recipe_in_progress = Recipe.inputRecipe();
    this.dark_background = false;
    this.small_font = false;
    this.recipe_loaded = false;
    this.load_error = false;
  }

  ngOnInit(): void {
    this.recipeService.getAllRecipes().subscribe((recipes) => {
      this.recipes = recipes;
      this.recipe_loaded = true;
    }, (err)=>{
      this.load_error = true;
      const body = JSON.parse(err._body);
      this.error_text = body.message; 
    });
    
    /*.catch((err) => {
      this.load_error = true;
      const body = JSON.parse(err._body);
      this.error_text = body.message;

    });*/
  }

  public toggleFont() {

    if (this.current_styles['font-size'] === '150%') {
      this.current_styles['font-size'] = '175%';
    } else {
      this.current_styles['font-size'] = '150%';
    }
    console.log(this.small_font);
    this.small_font = !this.small_font;
  }

  public toggleBackground() {
    this.dark_background = !this.dark_background;
  }
  public userSelectedRecipe(recipe_id: number) {
    console.log('inside recipe-list: ' + recipe_id);
    this.router.navigateByUrl('recipes/' + recipe_id);
  }

  public addNewRecipe(): void {
    this.router.navigateByUrl('newRecipe');
  }

}
