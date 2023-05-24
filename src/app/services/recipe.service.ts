import { Injectable } from '@angular/core';
import { Recipe } from '../model/recipe';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const RECIPE_SERVER = ``;

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  recipes: Recipe[];
  constructor(private http: HttpClient) {

  }

  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(RECIPE_SERVER + '/assets/recipes.json');
  }

  getRecipeById(recipe_id: number): Promise<Recipe> {
    return this.http.get<Recipe>(RECIPE_SERVER + `/assets/${recipe_id}.json`).toPromise()
      .catch(this.handleError);
  }

  addRecipe(recipe: Recipe, files: {}): Promise<Recipe> {
    return this.http.put<Recipe>(RECIPE_SERVER + '/v1/recipes.json', recipe).toPromise()
      .then((response) => {
        const final_recipe: Recipe = response;
        const formData: FormData = new FormData();

        if (files['cover_photo']) {
          const file: File = files['cover_photo'];
          formData.append('cover_photo', file, file.name);
        }

        if (files['instruction_photo']) {
          for (let i = 0; i < files['instruction_photo'].length; i++) {
            if (files['instruction_photo'][i]) {
              const file: File = files['instruction_photo'][i];
              formData.append('preparation_photos_' + i, file, file.name);
            }
          }
        }

        return this.http.post(RECIPE_SERVER + `/v1/recipes/${final_recipe.id}/images`, formData)
          .toPromise()
          .then(image_response => final_recipe)
          .catch(this.handleError);

      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('Error occurred talking to server: ' + error);
    return Promise.reject(error.message || error);
  }
}
