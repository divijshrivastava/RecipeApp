import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../model/recipe';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent {

  recipes: Recipe[];
  constructor() {
    this.recipes = [
      (new Recipe('Dosa',
        'South Indian Roti: It\'s very delicious',
        null, null, null)),
      new Recipe('Pav Bhaji', 'Punjabi Dish: It\'s very very tasty',
        null, null, null),
      (new Recipe('Kaju Kari', 'Consists of cashewnuts and gravy', null, null, null))
    ]
      ;
  }


}
