import { Component, OnInit, signal } from '@angular/core';
import { Recipe } from '../../model/recipe';
import { Location } from '@angular/common';
import { RecipeService } from '../../services/recipe.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent implements OnInit {

  recipe = signal<Recipe>(new Recipe('', '', '', -1, -1, [], [], '', []));
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

      this.recipe = this.recipeService.getRecipeById(recipe_id, this.recipe);
        if(!this.recipe()){
        this.load_error = true;
        }else{
          console.log(this.recipe())
        }


    });
  }

  goBack() {
    this.location.back();
  }

  displayRecipe() {
    console.log(this.recipe);
  }
}
