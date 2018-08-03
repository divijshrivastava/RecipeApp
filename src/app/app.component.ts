import { Component } from '@angular/core';
import { Recipe } from './model/recipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

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
