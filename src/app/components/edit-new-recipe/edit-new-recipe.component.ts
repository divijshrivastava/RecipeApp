import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../model/recipe';
import { RecipeService } from '../../services/recipe.service';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-edit-new-recipe',
  templateUrl: './edit-new-recipe.component.html',
  styleUrls: ['./edit-new-recipe.component.css']
})
export class EditNewRecipeComponent implements OnInit {

  recipe_in_progress: Recipe;
  constructor(private recipeService: RecipeService, private router: Router) {
    this.recipe_in_progress = new Recipe(1, '', '', 1, 1, null, null, null, null);
  }

  ngOnInit() {
  }

  addRecipeClicked() {
    console.log('Add recipe clicked');
    this.recipeService.addRecipe(this.recipe_in_progress).then((recipe) =>
      this.router.navigate(['recipes', recipe.id]));
  }

  addNewIngredient() {
    if (!this.recipe_in_progress.ingredients) {
      this.recipe_in_progress.ingredients = [{ ingredient: null, measure: null }];
    } else {
      this.recipe_in_progress.ingredients.push({ ingredient: null, measure: null });
    }
  }

  removeIngredient(ingredient_index: number): void {
    this.recipe_in_progress.ingredients.splice(ingredient_index, 1);
  }

  addNewInstructions() {
    if (!this.recipe_in_progress.instructions) {
      this.recipe_in_progress.instructions = [{ instruction: null, photo: null }];
    } else {
      this.recipe_in_progress.instructions.push({ instruction: null, photo: null });
    }
  }

}
