import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../model/recipe';
import { Router } from '../../../../node_modules/@angular/router';

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

  constructor(private router: Router) {

    this.recipe_in_progress = Recipe.inputRecipe();
    this.dark_background = false;
    this.small_font = false;
    this.recipes = [Recipe.recipeFromJson({
      'id': 1,
      'title': 'Idli',
      'description': 'South Indian Roti: It\'s very delicious',
      'feeds_this_many': 3,
      'preparation_time': 50,
      'ingredients': [{
        'ingredient': 'parboiled rice',
        'measure': '3/4 cup'
      },
      {
        'ingredient': 'regular rice',
        'measure': '3/4 cup'
      }
      ],
      'instructions': [{
        'instruction': 'Cut all the vegetables',
        'photo': null
      },
      {
        'instruction': 'Boil the rice',
        'photo': null
      }
      ],
      'cover_photo': null,
      'keywords': ['South Indian', 'Rice Dish']
    }),

    Recipe.recipeFromJson({
      'id': 2,
      'title': 'Pav Bhaji',
      'description': 'South Indian Roti: It\'s very delicious',
      'feeds_this_many': 3,
      'preparation_time': 50,
      'ingredients': [

        {
          'ingredient': 'Potatoes',
          'measure': '2 medium'
        },
        {
          'ingredient': 'Green Peas',
          'measure': '1/2 cup'
        }

      ],
      'instructions': [{
        'instruction': 'Cut all the vegetables',
        'photo': null
      }],
      'cover_photo': null,
      'keywords': null

    }),

    Recipe.recipeFromJson({
      'id': 3,
      'title': 'Kaju Kari',
      'description': 'South Indian Roti: It\'s very delicious',
      'feeds_this_many': 3,
      'preparation_time': 50,
      'ingredients': [{
        'ingredient': 'Potatoes',
        'measure': '2 medium'
      },
      {
        'ingredient': 'Green Peas',
        'measure': '1/2 cup'
      }
      ],
      'instructions': [{
        'instruction': 'Cut all the vegetables',
        'photo': null
      }],
      'cover_photo': null,
      'keywords': null
    })
    ];
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
    console.log(recipe_id);
    this.router.navigateByUrl('recipes/' + recipe_id);

  }

  public addNewRecipe(): void {
    this.router.navigateByUrl('newRecipe');
  }

}
