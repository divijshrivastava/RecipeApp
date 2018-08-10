import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../model/recipe';
import { ActivatedRoute, ParamMap } from '../../../../node_modules/@angular/router';
import { Location } from '../../../../node_modules/@angular/common';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {

  recipe: Recipe;

  constructor(private route: ActivatedRoute,
    private location: Location,
    private recipeService: RecipeService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const recipe_id = parseInt(params.get('recipe_id'), 10);

      this.recipeService.getRecipeById(recipe_id).then((xrecipe) => {
        this.recipe = xrecipe;
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
