import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../model/recipe';
import { JsonPipe } from '../../../../node_modules/@angular/common';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent {

  recipes: Recipe[];
  recipe_in_progress: Recipe;
  dark_background: Boolean;
  current_styles: any = { 'font-size': '150%' };
  small_font: Boolean;

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

  constructor() {

    this.recipe_in_progress = Recipe.inputRecipe();
    this.dark_background = false;
    this.small_font = false;
    this.recipes = [
      (new Recipe('Dosa',
        'South Indian Roti: It\'s very delicious', 3, 50,
        null, null, null)),
      new Recipe('Pav Bhaji', 'Punjabi Dish: It\'s very very tasty', 3, 40,
        null, null, null),
      (new Recipe('Kaju Kari', 'Consists of cashewnuts and gravy', 4, 30,
        null, null, null))
    ]
      ;
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


}
