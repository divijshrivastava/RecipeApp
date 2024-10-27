import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Recipe } from '../model/recipe';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppwriteService } from './appwrite.service';
import { environment } from '../../environments/environment';

const RECIPE_SERVER = ``;

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  recipes: Recipe[] = [];
  constructor(
    private http: HttpClient,
    private appWriteService: AppwriteService
  ) {}

  getAllRecipes(): Recipe[] {
    let recipes: Recipe[] = [];
    this.appWriteService.databases
      .listDocuments(
        environment.appwriteDatabaseId, //environment.appwriteDatabaseId,
        environment.appwriteRecipeCollectionId
      )
      .then((resp) => {
        console.log(resp.documents);

        resp.documents.forEach((document) =>
          recipes.push(Recipe.recipeFromDocument(document))
        );
      });

    return recipes;
  }

  getRecipeById(recipe_id: string, recipe:WritableSignal<Recipe>): WritableSignal<Recipe> {
    this.appWriteService.databases
      .getDocument('1', '1', recipe_id)
      .then((document) => {
        recipe.set(Recipe.recipeFromDocument(document));
        console.log(recipe());
      });

    return recipe;
  }

  addRecipe(recipe: Recipe, files: any): Promise<Recipe> {
    return this.http
      .put<Recipe>(RECIPE_SERVER + './v1/recipes.json', recipe)
      .toPromise()
      .then((response) => {
        let default_recipe = Recipe.inputRecipe();
        const final_recipe: Recipe = response || default_recipe;
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

        return this.http
          .post(
            RECIPE_SERVER + `/v1/recipes/${final_recipe.id}/images`,
            formData
          )
          .toPromise()
          .then((image_response) => final_recipe)
          .catch(this.handleError);
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('Error occurred talking to server: ' + error);
    return Promise.reject(error.message || error);
  }
}
