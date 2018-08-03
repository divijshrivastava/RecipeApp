import { Component } from '@angular/core';
import { Recipe } from './model/recipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  recipe: Recipe;
  constructor() {
   this.recipe = new Recipe('Dosa', 'South Indian Roti: It\'s very delicious', null, null, null);
  }

}
