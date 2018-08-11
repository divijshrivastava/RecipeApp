import { Injectable } from '@angular/core';
import { Recipe } from '../model/recipe';
import { Http } from '@angular/http';

const RECIPE_SERVER = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  recipes: Recipe[];
  constructor(private http: Http) {

  }

  getAllrecipes(): Promise<Recipe[]> {
    return this.http.get(RECIPE_SERVER + '/v1/recipes.json')
      .toPromise().then(response => response.json().data as Recipe[]);
    /*new Promise((resolve, reject) => {
    setTimeout(() => resolve(this.recipes), 100);
  });*/
  }

  getRecipeById(recipe_id: number): Promise<Recipe> {
    return this.http.get(RECIPE_SERVER + `/v1/recipes/${recipe_id}.json`).toPromise()
      .then(response => response.json().data as Recipe).catch(this.handleError);
  }

  addRecipe(recipe: Recipe): Promise<Recipe> {

    return this.http.put(RECIPE_SERVER + '/v1/recipes.json', recipe).toPromise()
      .then(response => response.json().data as Recipe).catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('Error occured talking to server: ' + error);
    return Promise.reject(error.message || error);
  }
}
