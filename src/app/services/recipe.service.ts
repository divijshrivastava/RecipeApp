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

  // First upload the recipe
  // second, upload the images
  // cover_photo
  // preparation_photo

  addRecipe(recipe: Recipe, files: {}): Promise<Recipe> {

    return this.http.put(RECIPE_SERVER + '/v1/recipes.json', recipe).toPromise()
      .then((response) => {
        const final_recipe: Recipe = response.json().data as Recipe;
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

        return this.http.post(RECIPE_SERVER + `/v1/recipes/${final_recipe.id}/images`,
          formData).toPromise().then(image_response => final_recipe)
          .catch(this.handleError);

      }).catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('Error occured talking to server: ' + error);
    return Promise.reject(error.message || error);
  }
}
