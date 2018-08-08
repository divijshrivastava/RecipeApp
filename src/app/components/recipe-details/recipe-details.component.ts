import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../model/recipe';
import { ActivatedRoute, ParamMap } from '../../../../node_modules/@angular/router';
import { Location } from '../../../../node_modules/@angular/common';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {

  recipe: Recipe;
  recipes: Recipe[];

  constructor(private route: ActivatedRoute, private location: Location) {
    this.recipes = [
      Recipe.recipeFromJson({
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

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {

      this.recipe = this.findRecipeById(parseInt(params.get('recipe_id'), 10));

    });
  }

  findRecipeById(recipe_id: number): Recipe {

    for (const recip of this.recipes) {
      if (recip.id === recipe_id) {
        return recip;
      }
    }
    return null;
  }

  goBack() {
    this.location.back();
  }

}
