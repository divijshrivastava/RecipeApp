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
  disabled_add_recipe_button: boolean;

  constructor(private recipeService: RecipeService, private router: Router) {
    this.recipe_in_progress = new Recipe(1, '', '', 1, 1, null, null, null, null);
    this.disabled_add_recipe_button = true;
  }

  ngOnInit() {
  }

  addRecipeClicked() {
    console.log('Add recipe clicked');
    this.recipeService.addRecipe(this.recipe_in_progress).then((recipe) =>
      this.router.navigate(['recipes', recipe.id]));
  }

  validateForm(event): void {

    this.disabled_add_recipe_button = true;
    console.log(this.recipe_in_progress.title);
    const feeds = parseInt('' + this.recipe_in_progress.feeds_this_many, 10);
    const prepTime = parseInt('' + this.recipe_in_progress.preparation_time, 10);

    if (!this.recipe_in_progress.title ||
      this.recipe_in_progress.title.length < 1) {
      return;
    }
    if (!this.recipe_in_progress.description ||
      this.recipe_in_progress.description.length < 1) {
      return;
    }
    if (!this.recipe_in_progress.preparation_time
      || this.recipe_in_progress.preparation_time < 1) {
      return;
    }

    if (!this.recipe_in_progress.feeds_this_many
      || this.recipe_in_progress.feeds_this_many < 1) {
      return;
    }

    if (isNaN(feeds) || feeds < 1 || feeds > 1000) {
      return;
    }
    if (isNaN(prepTime) || prepTime < 1) {
      return;
    }

    if (this.recipe_in_progress.ingredients &&
      this.recipe_in_progress.ingredients.length > 0) {
      for (const ingr of this.recipe_in_progress.ingredients) {
        if ( !ingr.measure || ingr.measure.length < 1 || parseInt(ingr.measure, 10) < 1) {
          console.log('Returning due to ingredient measure');
          return;
        }

        if (!ingr.ingredient || ingr.ingredient.length < 1) {
          console.log('Returning due to ingredient length');
          return;
        }
      }
    }

    if (this.recipe_in_progress.instructions &&
      this.recipe_in_progress.instructions.length > 0) {
      for (const inst of this.recipe_in_progress.instructions) {
        if ( !inst.instruction || inst.instruction.length < 1 ) {
          console.log('Returning due to instruction length');
          return;
        }
      }
    }




    this.disabled_add_recipe_button = false;


    //    console.log(JSON.stringify(event.target.value, null, 2));
  }

  addNewIngredient() {
    if (!this.recipe_in_progress.ingredients) {
      this.recipe_in_progress.ingredients = [{ ingredient: null, measure: null }];
    } else {
      this.recipe_in_progress.ingredients.push({ ingredient: null, measure: null });
      console.log(this.recipe_in_progress.ingredients.length);
    }

  }

  removeIngredient(ingredient_index: number): void {
    this.recipe_in_progress.ingredients.splice(ingredient_index, 1);
    console.log(this.recipe_in_progress.ingredients.length);
  }
  removeInstruction(instruction_index: number): void {
    this.recipe_in_progress.instructions.splice(instruction_index, 1);
    console.log('Instruction length' + this.recipe_in_progress.instructions.length);
  }


  addNewInstructions() {
    if (!this.recipe_in_progress.instructions) {
      this.recipe_in_progress.instructions = [{ instruction: null, photo: null }];
    } else {
      this.recipe_in_progress.instructions.push({ instruction: null, photo: null });
    }

  }

}
