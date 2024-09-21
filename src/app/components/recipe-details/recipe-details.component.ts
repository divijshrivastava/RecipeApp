import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../model/recipe';
import { ActivatedRoute, ParamMap } from '../../../../node_modules/@angular/router';
import { Location } from '../../../../node_modules/@angular/common';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent implements OnInit {

  recipe: Recipe | undefined;
  load_error: Boolean;
  error_text: string | undefined;

  constructor(private route: ActivatedRoute,
    private location: Location,
    private recipeService: RecipeService) {

      this.load_error = false;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let recipe_id : any =  params.get('recipe_id');
      recipe_id = parseInt(recipe_id, 10);

      this.recipeService.getRecipeById(recipe_id).then((xrecipe) => {
        this.recipe = xrecipe;
      }).catch((error) => {
        this.load_error = true;
        const body = JSON.parse(error._body);
        this.error_text = body.message;

      });

    });
  }

  goBack() {
    this.location.back();
  }

  displayRecipe() {
    console.log(this.recipe);
  }
}
